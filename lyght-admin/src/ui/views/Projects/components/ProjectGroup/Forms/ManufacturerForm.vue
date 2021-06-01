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
                <div class="text-body mb-3">No manufacturer record found.</div>
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
        </v-form>
        <status-info v-if="statusText" :color="statusColor">{{ statusText }}</status-info>
      </template>

      <template #actions>
        <btn-main @click="createRecordHandler" color="bg-dark" :loading="loading" dark>Add</btn-main>
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
import partList from '@/constants/projects/partList.json';
import manufacturerList from '@/constants/projects/manufacturerList.json';
import DynamicInput from '@/components/FormInput/DynamicInput.vue';

export default {
  components: {
    DynamicInput,
  },
  props: {
    data: { type: Array, required: true },
  },
  mixins: [status, dialog],
  data() {
    return {
      options: {
        itemsPerPage: 5,
        sortBy: ['partName'],
        mustSort: true,
      },
      valid: true,
      loading: false,
      dialog: {
        show: false,
        text: null,
        status: null,
      },
      itemSelected: null,
      input: {
        part: null,
        company: null,
      },
    };
  },
  computed: {
    projectGroupId() {
      return this.$route.params.id;
    },
    fields() {
      return [
        {
          key: 'part',
          component: 'v-select',
          cols: '12',
          props: {
            label: 'Part',
            items: getTranslationList(partList),
            rules: [v.required()],
          },
        },
        {
          key: 'company',
          component: 'v-select',
          cols: '12',
          props: {
            label: 'Company',
            items: this.input.part ? getTranslationList(manufacturerList[this.input.part]) : [],
            rules: [v.required()],
          },
          show: !!this.input.part,
        },
      ].filter((item) => item.show !== false);
    },
    headers() {
      return [
        { text: 'Parts', value: 'partName' },
        { text: 'Company', value: 'companyName' },
        { text: 'Actions', value: 'action', align: 'end', sortable: false },
      ];
    },
    items() {
      return this.data.map((d) => ({
        ...d,
        partName: this.partName(d.part),
        companyName: this.manufacturerName(d),
      }));
    },
    storagePath() {
      return `project_groups/${this.projectGroupId}`;
    },
  },
  methods: {
    ...mapActions('projectGroups', ['createManufacturer', 'deleteManufacturer']),

    validate() {
      this.valid = this.$refs.form.validate();

      const duplicated = this.data.some((item) => item.part === this.input.part && item.company === this.input.company);
      if (duplicated) {
        this.valid = false;
        this.setStatusError('This manufacturer already exist.');
      }
    },
    partName(val) {
      const obj = getTranslationList(partList).find((item) => item.value === val);
      return obj ? obj.text : undefined;
    },
    manufacturerName(val) {
      const obj = getTranslationList(manufacturerList[val.part]).find((item) => item.value === val.company);
      return obj ? obj.text : undefined;
    },
    setDeleteAction(item) {
      this.itemSelected = item;
      this.setAction({
        name: `Remove ${item.partName} manufacturer`,
        handler: this.deleteRecordHandler,
      });
    },
    resetForm() {
      this.clearStatus();
      this.input = {
        part: null,
        company: null,
      };
      this.itemSelected = null;
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
    async createRecordHandler() {
      this.clearStatus();
      this.validate();
      if (this.valid) {
        try {
          this.loading = true;

          const res = await this.createManufacturer({
            projectGroupId: this.projectGroupId,
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
    async deleteRecordHandler() {
      try {
        this.loading = true;

        await this.deleteManufacturer({
          id: this.itemSelected._id,
          projectGroupId: this.projectGroupId,
        });

        this.loading = false;
        this.setActionSuccess('Removed an manufacturer record.');
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
    },
  },
};
</script>
