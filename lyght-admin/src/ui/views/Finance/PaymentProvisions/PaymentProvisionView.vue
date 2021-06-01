<template>
  <page-container :navs="navs" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <edit-payment-provision-form
        :data="paymentProvision.data"
        :project="project.data"
        :projectGroup="projectGroupPaymentInfo.data"
        :userAssets="userAssets.data"
      ></edit-payment-provision-form>
    </template>
  </page-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';
import EditPaymentProvisionForm from './components/EditPaymentProvisionForm.vue';

export default {
  name: 'PaymentProvisionView',
  components: {
    PageContainer,
    EditPaymentProvisionForm,
  },
  data() {
    return {
      navs: ['finance', 'finance/payment-provisions', 'finance/payment-provisions/:id'],
      renderers: ['paymentProvision', 'project', 'projectGroupPaymentInfo', 'userAssets'],
    };
  },
  created() {
    this.initialize();
  },
  watch: {
    $route(curr, prev) {
      if (curr.path !== prev.path) {
        this.initialize();
      }
    },
  },
  computed: {
    ...mapGetters('paymentProvisions', ['paymentProvision']),
    ...mapGetters('projectGroups', ['projectGroupPaymentInfo']),
    ...mapGetters('userAssets', ['userAssets']),
    ...mapState('projects', ['project']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
  },
  methods: {
    ...mapActions('paymentProvisions', ['getPaymentProvision', 'getPaymentDistributions']),
    ...mapActions('projectGroups', ['getBankAccountsByProjectGroup']),
    ...mapActions('projects', ['getProject']),
    ...mapActions('userAssets', ['getUserAssetsByProject']),

    initialize() {
      const { id } = this.$route.params;
      const { project: projectId, projectGroup: projectGroupId } = this.$route.query;

      if (!this.paymentProvision.data || this.paymentProvision.data._id !== id) {
        this.getPaymentProvision(id);
        this.getPaymentDistributions(id);
        this.getBankAccountsByProjectGroup(projectGroupId);
      }
      if (!this.project.data || this.project.data._id !== projectId) {
        this.getProject(projectId);
      }
      this.getUserAssetsByProject(projectId);
    },
  },
};
</script>
