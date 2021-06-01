<template>
  <div>
    <v-card flat class="pb-7">
      <v-card class="rounded-btn pa-3">
        <div v-if="items.length > 0" class="d-flex flex-wrap align-center">
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="mdi-magnify" dense filled rounded hide-details></v-text-field>
        </div>

        <v-data-table :headers="headers" :items="items" :options="options" :search="search">
          <template #no-data>
            <v-card class="pa-5 d-flex align-center justify-center" flat>
              <div class="text-center">
                <div class="text-body mb-3">No records found.</div>
                <btn-main @click="setCreateAction" color="primary">
                  Add Records
                  <v-icon class="ml-2">mdi-plus-circle</v-icon>
                </btn-main>
              </div>
            </v-card>
          </template>
        </v-data-table>
      </v-card>
    </v-card>

    <action-panel v-if="items.length > 0">
      <div>
        <btn-main @click="setCreateAction" color="primary"> Update Records </btn-main>
      </div>
      <div>
        <btn-main @click="exportCSV" color="primary">
          Export CSV
          <v-icon class="ml-2">mdi-download</v-icon>
        </btn-main>
      </div>
    </action-panel>

    <general-dialog
      v-model="dialogProps.show"
      :text="dialogProps.text"
      :status="dialogProps.status"
      :loading="loading"
      @close="clearData"
      max-width="600"
    >
      <template #header>Add/Update Records</template>

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
import dayjs from 'dayjs';
import get from 'lodash/get';
import { mapActions } from 'vuex';
import status from '@/mixins/status';
import dialog from '@/mixins/dialog';
import { asyncForEach } from '@/utils';
import { toCamel } from '@/utils/formats';
import FileInput from '@/components/FormInput/FileInput.vue';

export default {
  components: {
    FileInput,
  },
  props: {
    data: { type: Object, required: true },
  },
  mixins: [status, dialog],
  data() {
    return {
      options: {
        itemsPerPage: 7,
        sortBy: ['_id'],
        mustSort: true,
      },
      loading: false,
      valid: true,
      search: '',
      input: [],
      counter: {
        current: 0,
        total: 0,
      },
      sampleHeader: [{ text: 'suffix_id', value: 'suffix_id', sortable: false }],
      sampleItems: [{ suffix_id: 'A-00001' }, { suffix_id: 'A-00002' }, { suffix_id: 'A-00003' }],
    };
  },
  computed: {
    projectId() {
      return this.$route.params.id;
    },
    headers() {
      return [
        { text: 'Panel', value: '_id' },
        { text: 'Asset Owner', value: 'userName' },
        { text: 'Order Ref.', value: 'orderId' },
      ];
    },
    items() {
      return this.data.panels;
    },
    storagePath() {
      return `projects/${this.projectId}`;
    },
  },
  methods: {
    ...mapActions('projects', ['createAndUpdatePanel']),

    exportCSV() {
      let csv;
      const titlePrefix = 'panel_ids';
      const fields = ['_id', 'suffix_id', 'order_id', 'user_id'];

      csv = fields.join(',');
      csv += '\n';

      this.items.forEach((item) => {
        fields.forEach((field, index) => {
          csv += item[toCamel(field)] || '';
          if (index !== fields.length - 1) csv += ',';
        });
        csv += '\n';
      });

      const anchor = document.createElement('a');
      anchor.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
      anchor.target = '_blank';
      anchor.download = `${titlePrefix}_${dayjs().format('YYYY_MM_DD_HH_mm_ss')}.csv`;
      anchor.click();
    },
    setCreateAction() {
      this.setAction({ handler: this.createRecordsHandler });
    },
    clearInput() {
      this.input = [];
      this.counter = {
        current: 0,
        total: 0,
      };
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
    fileInputHandler(e) {
      const [file] = e.target.files;
      this.$papa.parse(file, {
        header: true,
        fastMode: true,
        skipEmptyLines: true,
        complete: (res) => {
          this.clearInput();
          if (res.data.some((d) => !d.suffix_id)) {
            this.setStatusError('Formatting error: Missing "suffix_id" field.');
          } else {
            try {
              this.counter.total = res.data.length;
              res.data.forEach((d) => {
                this.input.push({
                  id: `${this.data.details.publicIdentifier}-${d.suffix_id}`,
                  projectId: this.data._id,
                  projectGroupId: this.data.projectGroupId,
                  suffixId: d.suffix_id,
                  orderId: d.order_id || null,
                  userId: d.user_id || null,
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
            await this.createAndUpdatePanel(item);
            this.counter.current += 1;
          });

          this.loading = false;
          this.setActionSuccess('Updated panel records.');
        } catch (err) {
          this.loading = false;
          this.setActionError(err);
        }
      }
    },
  },
};
</script>
