<template>
  <div>
    <v-card flat class="pb-7">
      <v-card class="pa-3" flat>
        <div v-if="hasData && !loading">
          <line-chart :datasets="datasets" :labels="labels" :options="options"></line-chart>
          <div class="d-flex align-center justify-center mt-7">
            <btn-main @click="setCreateAction" color="primary"> Update Records </btn-main>
          </div>
        </div>
        <v-card v-else class="pa-5 d-flex align-center justify-center bg-light" flat>
          <div class="text-center">
            <div class="text-body mb-3">No records found.</div>
            <btn-main @click="setCreateAction" color="primary">
              Add Records
              <v-icon class="ml-2">mdi-plus-circle</v-icon>
            </btn-main>
          </div>
        </v-card>
      </v-card>
    </v-card>

    <general-dialog
      v-model="dialogProps.show"
      :text="dialogProps.text"
      :status="dialogProps.status"
      @close="clearData"
      max-width="600"
    >
      <template #header>Create Records</template>

      <template #body>
        <div v-if="input.length === 0 || !loading">
          <v-row align="center">
            <v-col cols="12" sm="6">
              <file-input
                ref="inputRef"
                @click="resetInput"
                @on-select="fileInputHandler"
                :disabled="loading"
                :fileTypes="['.csv', 'text/csv']"
              ></file-input>
              <div v-if="counter.total > 0" class="text-center">{{ counter.total }} records found</div>
              <dir v-if="inputAvg" class="text-center">Avg. rate: {{ inputAvg }}</dir>
            </v-col>
            <v-col cols="12" sm="6">
              <div>
                <div class="text-hint mb-2">CSV Formatting</div>
                <div class="d-flex align-center justify-center">
                  <v-card>
                    <v-data-table :headers="sampleHeader" :items="sampleItems" hide-default-footer dense></v-data-table>
                  </v-card>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <div v-if="loading" class="pa-5">
          <div class="text-subheading">Uploading ({{ parseInt((counter.current / counter.total) * 100) }}%)</div>
          <v-progress-linear indeterminate rounded color="secondary" class="mt-7"></v-progress-linear>
        </div>

        <status-info v-if="statusText" :color="statusColor">{{ statusText }}</status-info>
      </template>

      <template #actions>
        <btn-main @click="dialogProps.action" color="bg-dark" :loading="loading" dark>Add</btn-main>
      </template>
    </general-dialog>
  </div>
</template>

<script>
import get from 'lodash/get';
import { mapActions } from 'vuex';
import status from '@/mixins/status';
import dialog from '@/mixins/dialog';
import { asyncForEach } from '@/utils';
import { formatDisplayVal } from '@/utils/formats';
import FileInput from '@/components/FormInput/FileInput.vue';
import LineChart from '@/components/Chart/LineChart.vue';

export default {
  components: {
    FileInput,
    LineChart,
  },
  props: {
    data: { type: Object, required: true },
  },
  mixins: [status, dialog],
  data() {
    return {
      options: {
        legend: {
          display: true,
        },
        tooltips: {
          callbacks: {
            label(tooltipItem) {
              const formattedValue = formatDisplayVal(tooltipItem.yLabel, { format: '0.00%' });
              return ` ${formattedValue}`;
            },
          },
        },
      },
      loading: false,
      valid: true,
      search: '',
      input: [],
      inputAvg: null,
      counter: {
        current: 0,
        total: 0,
      },
      sampleHeader: [
        { text: 'year', value: 'year', sortable: false },
        { text: 'rate', value: 'rate', sortable: false },
      ],
      sampleItems: [
        { year: '2021', rate: 0.109 },
        { year: '2022', rate: 0.103 },
        { year: '2023', rate: 0.098 },
      ],
    };
  },
  computed: {
    projectId() {
      return this.$route.params.id;
    },
    hasData() {
      return this.data.yieldRates && this.data.yieldRates.length > 0;
    },
    datasets() {
      if (!this.hasData) return undefined;
      return [
        {
          label: 'Yield Rates',
          data: this.data.yieldRates.map(({ rate }) => rate),
        },
        {
          label: 'Avg. Rate',
          data: this.data.yieldRates.map(() => this.data.yieldRateAvg),
          pointRadius: 0,
        },
      ];
    },
    labels() {
      if (!this.hasData) return undefined;
      return this.data.yieldRates.map(({ year }) => year);
    },
  },
  methods: {
    ...mapActions('projects', ['createYieldRate', 'updateProject']),

    setCreateAction() {
      this.setAction({ handler: this.createRecordsHandler });
    },
    clearInput() {
      this.input = [];
      this.counter = {
        current: 0,
        total: 0,
      };
      this.inputAvg = null;
    },
    clearData() {
      this.resetInput();
      this.clearInput();
      this.clearDialog();
    },
    validate() {
      this.valid = this.input && this.input.length > 0;
    },
    resetInput() {
      const ref = get(this.$refs, `inputRef.$refs.fileInput`);
      if (ref) ref.value = null;
    },
    calcAverageYield(d) {
      if (!d || d.length === 0) this.inputAvg = 0;
      // eslint-disable-next-line no-return-assign
      const sum = d.reduce((acc, curr) => acc + Number(curr.rate), 0);
      this.inputAvg = sum / d.length;
    },
    fileInputHandler(e) {
      const [file] = e.target.files;
      this.$papa.parse(file, {
        header: true,
        fastMode: true,
        skipEmptyLines: true,
        complete: (res) => {
          this.clearInput();
          if (res.data.some((d) => !d.year || !d.rate)) {
            this.setStatusError('Formatting error: Missing "year" or "rate" field.');
          } else {
            try {
              this.counter.total = res.data.length;
              this.calcAverageYield(res.data);
              res.data.forEach((d) => {
                this.input.push({
                  id: d.year,
                  projectId: this.projectId,
                  year: d.year,
                  rate: d.rate,
                });
              });
            } catch (err) {
              this.setStatusError(err);
              this.counter.total = 0;
            }
          }
        },
      });
    },
    async createRecordsHandler() {
      this.validate();
      if (this.valid) {
        try {
          this.loading = true;

          await asyncForEach(this.input, async (item) => {
            await this.createYieldRate(item);
            this.counter.current += 1;
          });

          await this.updateProject({
            id: this.projectId,
            yieldRateAvg: this.inputAvg,
          });

          this.loading = false;
          this.setActionSuccess('Added yield rate records.');
        } catch (err) {
          this.loading = false;
          this.setActionError(err);
        }
      }
    },
  },
};
</script>
