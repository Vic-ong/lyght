<template>
  <page-container :title="title" :description="description" :isLoading="isLoading" :isError="isError">
    <template #side-header>
      <back-button @click="returnHandler"></back-button>
    </template>
    <template #rendered>
      <project-participation-view
        :key="$route.fullPath"
        :data="data"
        :hasFullAccess="hasFullAccess"
      ></project-participation-view>
    </template>
  </page-container>
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapGetters, mapState } from 'vuex';
import { formatShortAddress } from '@/utils/formats';
import { BackButton } from '@/components/Button';
import { PageContainer } from '@/ui/shared/Layout';
import ProjectParticipationView from './components/ProjectParticipationView.vue';

export default {
  name: 'ActiveProjectView',
  components: {
    BackButton,
    PageContainer,
    ProjectParticipationView,
  },
  created() {
    this.initialize();
  },
  data() {
    return {
      renderers: [
        'userBankAccounts',
        'projectGroup',
        'projectGroupDetails',
        'project',
        'projectYieldRates',
        'performance',
      ],
    };
  },
  computed: {
    ...mapGetters('users', ['user', 'userBankAccounts']),
    ...mapState('projectGroups', ['projectGroupDetails', 'performance', 'insurances', 'manufacturers']),
    ...mapGetters('projectGroups', ['projectGroup']),
    ...mapState('projects', ['projectYieldRates']),
    ...mapGetters('projects', ['project']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
    title() {
      return get(this.projectDetails, 'data.name') || '';
    },
    description() {
      const desc = get(this.projectDetails, 'data.projectGroup.address');
      return formatShortAddress(desc, this.$i18n.locale);
    },
    hasFullAccess() {
      const identityVerified = get(this.user, 'data.setup.identityVerification') === 'approved';
      const hasBankAccount = (get(this.userBankAccounts, 'data.items') || []).length > 0;
      return identityVerified && hasBankAccount;
    },
    data() {
      return {
        ...this.project.data,
        yieldRates: this.projectYieldRates.data.items,
        projectGroup: {
          ...this.projectGroup.data,
          ...this.projectGroupDetails.data,
          performance: get(this.performance, 'data.items'),
          insurances: get(this.insurances, 'data.items'),
          manufacturers: get(this.manufacturers, 'data.items'),
        },
      };
    },
  },
  methods: {
    ...mapActions('users', ['getBankAccountsByUser']),
    ...mapActions('projectGroups', [
      'getProjectGroup',
      'getProjectGroupDetails',
      'getInsuranceByProjectGroup',
      'getManufacturersByProjectGroup',
      'getPerformanceByProjectGroup',
    ]),
    ...mapActions('projects', ['getProject', 'getYieldRatesByProject']),

    initialize() {
      const { id } = this.$route.params;
      const { projectGroup: projectGroupId } = this.$route.query;

      if (!this.project.data || this.project.data._id !== id) {
        this.getProject(id);
      }
      if (!this.projectYieldRates.data || this.projectYieldRates.data.projectId !== id) {
        this.getYieldRatesByProject(id);
      }
      if (!this.projectGroup.data || this.projectGroup.data._id !== projectGroupId) {
        this.getProjectGroup(projectGroupId);
      }
      if (!this.projectGroupDetails.data || this.projectGroupDetails.data._id !== projectGroupId) {
        this.getProjectGroupDetails(projectGroupId);
      }
      if (!this.performance.data || this.performance.data.projectGroupId !== projectGroupId) {
        this.getPerformanceByProjectGroup(projectGroupId);
      }

      if (!this.userBankAccounts.data || this.userBankAccounts.data.userId !== this.user.data._id) {
        this.getBankAccountsByUser(this.user.data._id);
      }

      // verified users
      if (this.user.data.setup.identityVerification === 'approved') {
        if (!this.insurances.data || this.insurances.data.projectGroupId !== projectGroupId) {
          this.getInsuranceByProjectGroup(projectGroupId);
        }
        if (!this.manufacturers.data || this.manufacturers.data.projectGroupId !== projectGroupId) {
          this.getManufacturersByProjectGroup(projectGroupId);
        }
      }
    },
    returnHandler() {
      this.$router.push({ name: 'projects' });
    },
  },
};
</script>
