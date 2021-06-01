<template>
  <div>
    <btn-main @click="setCreateAction" color="primary">
      New Project
      <v-icon class="ml-2">mdi-plus-circle</v-icon>
    </btn-main>

    <general-dialog
      v-model="dialogProps.show"
      :text="dialogProps.text"
      :status="dialogProps.status"
      @close="clearData"
      max-width="700"
    >
      <template #header>New Project</template>

      <template #body>
        <v-form ref="form" v-model="valid" class="text-left" lazy-validation>
          <new-project-form :input="input" :loading="loading"></new-project-form>
        </v-form>
      </template>

      <template #actions>
        <btn-main @click="submitHandler" :loading="loading" color="primary">Submit</btn-main>
      </template>
    </general-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import dialog from '@/mixins/dialog';
import NewProjectForm from './Forms/NewProjectForm.vue';

export default {
  components: {
    NewProjectForm,
  },
  mixins: [dialog],
  data() {
    return {
      valid: true,
      loading: false,
      newRecord: {
        projectId: null,
        projectGroupId: null,
      },
      input: {
        projectGroupId: null,
        nameTrans: {
          en: null,
          zhHant: null,
        },
        unitCost: {
          value: null,
          currency: 'TWD',
        },
        panelsTotal: null,
        estimatedIrr: null,
        panelsReserved: 0,
        panelsSold: 0,
        fundingStartDate: null,
        fundingEndDate: null,
        status: 'incomplete',
      },
    };
  },
  methods: {
    ...mapActions('projects', ['createProject']),

    setCreateAction() {
      this.setAction({
        name: null,
        handler: this.submitHandler,
      });
    },
    clearData() {
      this.input = {
        projectGroupId: null,
        nameTrans: {
          en: null,
          zhHant: null,
        },
        unitCost: {
          value: null,
          currency: 'TWD',
        },
        panelsTotal: null,
        estimatedIrr: null,
        panelsReserved: 0,
        panelsSold: 0,
        fundingStartDate: null,
        fundingEndDate: null,
        status: 'incomplete',
      };
      this.clearDialog();

      if (this.newRecord.projectId) {
        this.$router.push({
          name: 'projects/:id',
          params: { id: this.newRecord.projectId },
          query: {
            projectGroup: this.newRecord.projectGroupId,
          },
        });
      }
    },
    validate() {
      this.valid = this.$refs.form.validate();
    },
    async submitHandler() {
      this.validate();
      if (this.valid) {
        try {
          this.loading = true;

          const res = await this.createProject(this.input);

          this.newRecord = {
            projectId: res.id,
            projectGroupId: this.input.projectGroupId,
          };
          this.loading = false;
          this.setActionSuccess(res.message);
        } catch (err) {
          this.loading = false;
          this.setActionError(err);
        }
      }
    },
  },
};
</script>
