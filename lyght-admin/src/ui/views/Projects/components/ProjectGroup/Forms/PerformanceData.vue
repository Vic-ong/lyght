<template>
  <div>
    <v-card flat class="pb-7">
      <v-card class="pa-2" flat>
        <div v-if="hasData && !loading">
          <action-panel class="py-0">
            <v-spacer></v-spacer>
            <div>
              <btn-main @click="dialog = true" color="primary">
                Raw Data
                <v-icon class="ml-2">mdi-magnify-plus-outline</v-icon>
              </btn-main>
            </div>
            <div><btn-main @click="setUpdateAction" color="primary"> Update Records </btn-main></div>
          </action-panel>

          <div class="text-subheading py-3">Energy Generated (Last 2 years)</div>
          <energy-chart :data="data"></energy-chart>

          <div class="text-subheading py-3">Revenue Generated (Last 2 years)</div>
          <revenue-chart :data="data"></revenue-chart>
        </div>
        <v-card v-else class="pa-5 d-flex align-center justify-center bg-light" flat>
          <div class="text-center">
            <div class="text-body mb-3">No records found.</div>
            <btn-main @click="setUpdateAction" color="primary">
              Add Records
              <v-icon class="ml-2">mdi-plus-circle</v-icon>
            </btn-main>
          </div>
        </v-card>
      </v-card>
    </v-card>

    <v-dialog v-model="dialog" max-width="500">
      <v-card class="pa-5">
        <v-data-table :headers="sampleHeader" :items="data" dense></v-data-table>
      </v-card>
    </v-dialog>

    <general-dialog
      v-model="dialogProps.show"
      :text="dialogProps.text"
      :status="dialogProps.status"
      @close="clearData"
      max-width="600"
    >
      <template #header>Create/Update Records</template>

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
import FileInput from '@/components/FormInput/FileInput.vue';
import EnergyChart from '../Charts/EnergyChart.vue';
import RevenueChart from '../Charts/RevenueChart.vue';

export default {
  components: {
    FileInput,
    EnergyChart,
    RevenueChart,
  },
  props: {
    data: { type: Array, required: true },
  },
  mixins: [status, dialog],
  data() {
    return {
      dialog: false,
      loading: false,
      valid: true,
      search: '',
      input: [],
      counter: {
        current: 0,
        total: 0,
      },
      sampleHeader: [
        { text: 'date', value: 'date', sortable: false },
        { text: 'energy', value: 'energy', sortable: false },
        { text: 'revenue', value: 'revenue', sortable: false },
      ],
      sampleItems: [
        { date: '2021-01-01', energy: 400, revenue: 50000 },
        { date: '2021-02-01', energy: 450, revenue: 55000 },
        { date: '2021-03-01', energy: 500, revenue: 60000 },
      ],
    };
  },
  computed: {
    projectGroupId() {
      return this.$route.params.id;
    },
    hasData() {
      return this.data && this.data.length > 0;
    },
  },
  methods: {
    ...mapActions('projectGroups', ['setPerformance']),

    setUpdateAction() {
      this.setAction({ handler: this.updateRecordsHandler });
    },
    clearInput() {
      this.input = [];
      this.counter = {
        current: 0,
        total: 0,
      };
      this.clearStatus();
    },
    clearData() {
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
    fileInputHandler(e) {
      const [file] = e.target.files;
      this.$papa.parse(file, {
        header: true,
        fastMode: true,
        skipEmptyLines: true,
        complete: (res) => {
          this.clearInput();
          if (res.data.some((d) => !d.date || !d.energy || !d.revenue)) {
            this.setStatusError('Formatting error: Missing "date", "energy", or "revenue" field.');
          } else {
            try {
              this.counter.total = res.data.length;
              res.data.forEach((d) => {
                this.input.push({
                  id: d.date,
                  projectGroupId: this.projectGroupId,
                  date: d.date,
                  energy: d.energy,
                  revenue: d.revenue,
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
    async updateRecordsHandler() {
      this.validate();
      if (this.valid) {
        try {
          this.loading = true;

          await asyncForEach(this.input, async (item) => {
            await this.setPerformance(item);
            this.counter.current += 1;
          });

          this.loading = false;
          this.setActionSuccess('Updated performance records.');
        } catch (err) {
          this.loading = false;
          this.setActionError(err);
        }
      }
    },
  },
};
</script>
