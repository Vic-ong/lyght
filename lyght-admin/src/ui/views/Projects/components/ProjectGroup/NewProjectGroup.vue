<template>
  <div>
    <btn-main @click="setCreateAction" color="primary">
      New Group
      <v-icon class="ml-2">mdi-plus-circle</v-icon>
    </btn-main>

    <general-dialog
      v-model="dialogProps.show"
      :text="dialogProps.text"
      :status="dialogProps.status"
      @close="clearData"
      max-width="700"
    >
      <template #header>New Project Group</template>

      <template #body>
        <v-form ref="form" v-model="valid" class="text-left" lazy-validation>
          <new-project-group-form :input="input" :loading="loading"></new-project-group-form>
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
import NewProjectGroupForm from './Forms/NewProjectGroupForm.vue';

export default {
  components: {
    NewProjectGroupForm,
  },
  mixins: [dialog],
  data() {
    return {
      valid: true,
      loading: false,
      newId: null,
      input: {
        entityId: null,
        publicIdentifier: null,
        nameTrans: {
          en: null,
          zhHant: null,
        },
        panelsTotal: null,
        capacity: null,
        ppaSerialNumber: null,
        ppaContractStartDate: null,
        ppaContractEndDate: null,
        address: {
          address1: null,
          address2: null,
          district: null,
          city: null,
          state: 'Taiwan',
          country: 'Taiwan',
          postalCode: null,
        },
        status: 'incomplete',
        electricityPurchaser: 'taiwan_power',
        classification: null,
        grade: null,
      },
    };
  },
  methods: {
    ...mapActions('projectGroups', ['createProjectGroup']),

    setCreateAction() {
      this.setAction({
        name: null,
        handler: this.submitHandler,
      });
    },
    clearData() {
      this.input = {
        entityId: null,
        publicIdentifier: null,
        nameTrans: {
          en: null,
          zhHant: null,
        },
        panelsTotal: null,
        capacity: null,
        ppaSerialNumber: null,
        ppaContractStartDate: null,
        ppaContractEndDate: null,
        address: {
          address1: null,
          address2: null,
          district: null,
          city: null,
          state: 'Taiwan',
          country: 'Taiwan',
          postalCode: null,
        },
        status: 'incomplete',
        electricityPurchaser: 'taiwan_power',
        classification: null,
        grade: null,
      };
      this.clearDialog();

      if (this.newId) {
        this.$router.push({
          name: 'projects/groups/:id',
          params: { id: this.newId },
          query: { tab: 0 },
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

          const res = await this.createProjectGroup(this.input);

          this.newId = res.id;
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
