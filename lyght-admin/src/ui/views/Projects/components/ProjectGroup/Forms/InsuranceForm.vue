<template>
  <div>
    <v-card flat class="pb-7">
      <v-card class="rounded-btn pa-3">
        <div v-if="items.length > 0" class="d-flex flex-wrap align-center">
          <v-spacer></v-spacer>
          <btn-main @click="dialog.show = true" color="primary">
            Add Record
            <v-icon class="ml-2">mdi-plus-circle</v-icon>
          </btn-main>
        </div>

        <v-data-table :headers="headers" :items="items" :options="options">
          <template v-slot:[`item.file`]="{ item }">
            <v-hover v-slot="{ hover }">
              <a :href="item.file.url" target="_blank" style="text-decoration: none">
                <v-btn icon small class="mx-2">
                  <v-icon :class="{ 'on-hover': hover }" :color="hover ? 'primary' : 'bg-light'" small>
                    mdi-file
                  </v-icon>
                </v-btn>
              </a>
            </v-hover>
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <v-hover v-slot="{ hover }">
              <v-btn @click="setDeleteAction(item)" icon small class="mx-2">
                <v-icon :class="{ 'on-hover': hover }" :color="hover ? 'error' : 'bg-light'" small> mdi-delete </v-icon>
              </v-btn>
            </v-hover>
          </template>

          <template #no-data>
            <v-card class="pa-5 d-flex align-center justify-center" flat>
              <div class="text-center">
                <div class="text-body mb-3">No insurance record found.</div>
                <btn-main @click="dialog.show = true" color="primary">
                  Add Record
                  <v-icon class="ml-2">mdi-plus-circle</v-icon>
                </btn-main>
              </div>
            </v-card>
          </template>
        </v-data-table>
      </v-card>
    </v-card>

    <general-dialog
      v-model="dialog.show"
      :text="dialog.text"
      :status="dialog.status"
      @close="onCloseCreateDialog"
      max-width="500"
    >
      <template #header>Create New Record</template>

      <template #body>
        <v-form ref="form" v-model="valid" lazy-validation>
          <dynamic-input :input="input" :fields="fields" :disabled="loading"></dynamic-input>
          <file-uploader
            :input="input.file"
            :storagePath="storagePath"
            :fileTypes="['application/pdf']"
            :loading="loading"
            @select="(d) => (fileSelected = d)"
          ></file-uploader>
        </v-form>
        <status-info v-if="statusText" :color="statusColor">{{ statusText }}</status-info>
      </template>

      <template #actions>
        <btn-main @click="createInsuranceHandler" color="bg-dark" :loading="loading" dark>Add</btn-main>
      </template>
    </general-dialog>

    <action-dialog
      v-model="dialogProps.show"
      :data="dialogProps"
      :loading="loading"
      @submit="dialogProps.action"
      @close="onCloseDeleteDialog"
    >
      Action: <b>{{ dialogProps.text }}</b>
    </action-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { getTranslationList } from '@/utils';
import status from '@/mixins/status';
import dialog from '@/mixins/dialog';
import v from '@/utils/validations';
import insuranceProviderList from '@/constants/projects/insuranceProviderList.json';
import insuranceTypeList from '@/constants/projects/insuranceTypeList.json';
import DynamicInput from '@/components/FormInput/DynamicInput.vue';
import FileUploader from '@/components/FormInput/FileUploader.vue';

export default {
  components: {
    DynamicInput,
    FileUploader,
  },
  props: {
    data: { type: Array, required: true },
  },
  mixins: [status, dialog],
  data() {
    return {
      options: {
        itemsPerPage: 5,
        sortBy: ['typeDisplay'],
        mustSort: true,
      },
      valid: true,
      loading: false,
      dialog: {
        show: false,
        text: null,
        status: null,
      },
      updateParam: null,
      itemSelected: null,
      fileSelected: null,
      input: {
        provider: null,
        type: null,
      },
      fields: [
        {
          key: 'provider',
          component: 'v-select',
          cols: '12',
          props: {
            label: 'Insurance Provider',
            items: getTranslationList(insuranceProviderList),
            rules: [v.required()],
          },
        },
        {
          key: 'type',
          component: 'v-select',
          cols: '12',
          props: {
            label: 'Insurance Type',
            items: getTranslationList(insuranceTypeList),
            rules: [v.required()],
          },
        },
      ],
    };
  },
  computed: {
    projectGroupId() {
      return this.$route.params.id;
    },
    headers() {
      return [
        { text: 'Insurance', value: 'typeDisplay' },
        { text: 'Provider', value: 'providerDisplay' },
        { text: 'File', value: 'file', sortable: false },
        { text: 'Actions', value: 'action', align: 'end', sortable: false },
      ];
    },
    items() {
      return this.data.map((d) => ({
        ...d,
        typeDisplay: this.typeName(d.type),
        providerDisplay: this.providerName(d.provider),
      }));
    },
    storagePath() {
      return `project_groups/${this.projectGroupId}`;
    },
  },
  methods: {
    ...mapActions('projectGroups', ['createInsurance', 'deleteInsurance']),

    validate() {
      this.valid = this.$refs.form.validate();

      if (!this.fileSelected) {
        this.valid = false;
        this.setStatusError('Please attach the insurance document.');
      }

      const duplicated = this.data.some(
        (item) => item.provider === this.input.provider && item.type === this.input.type,
      );
      if (duplicated) {
        this.valid = false;
        this.setStatusError('This insurance already exist.');
      }
    },
    providerName(val) {
      const obj = getTranslationList(insuranceProviderList).find((item) => item.value === val);
      return obj ? obj.text : undefined;
    },
    typeName(val) {
      const obj = getTranslationList(insuranceTypeList).find((item) => item.value === val);
      return obj ? obj.text : undefined;
    },

    setUpdateAction(item) {
      this.itemSelected = item;
      this.setAction({
        name: `Update ${item.typeDisplay}`,
        handler: this.updateInsuranceHandler,
      });
    },
    setDeleteAction(item) {
      this.itemSelected = item;
      this.setAction({
        name: `Remove ${item.typeDisplay}`,
        handler: this.deleteInsuranceHandler,
      });
    },
    resetForm() {
      this.clearStatus();
      this.input = {
        provider: null,
        type: null,
      };
      this.itemSelected = null;
      this.fileSelected = null;
    },
    onCloseCreateDialog() {
      this.resetForm();
      this.dialog = {
        show: false,
        text: null,
        status: null,
      };
    },
    onCloseDeleteDialog() {
      this.updateParam = null;
      this.clearDialog();
    },
    async createInsuranceHandler() {
      this.clearStatus();
      this.validate();
      if (this.valid) {
        try {
          this.loading = true;

          const res = await this.createInsurance({
            projectGroupId: this.projectGroupId,
            fileUpload: {
              storagePath: this.storagePath,
              items: [this.fileSelected],
            },
            ...this.input,
          });

          this.loading = false;
          this.resetForm();
          this.dialog = {
            show: true,
            text: res.message,
            status: 'success',
          };
        } catch (err) {
          this.loading = false;
          this.resetForm();
          this.dialog = {
            show: true,
            text: err,
            status: 'error',
          };
        }
      }
    },
    async deleteInsuranceHandler() {
      try {
        this.loading = true;

        await this.deleteInsurance({
          id: this.itemSelected._id,
          projectGroupId: this.projectGroupId,
          fileDelete: {
            storagePath: this.storagePath,
            items: [this.itemSelected],
          },
        });

        this.loading = false;
        this.setActionSuccess('Removed an insurance record.');
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
    },
  },
};
</script>
