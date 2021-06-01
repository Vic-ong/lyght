<template>
  <page-container :title="$t('Order-Checkout-Title')" :isLoading="isLoading" :isError="isError">
    <template #side-header>
      <back-button @click="returnHandler">{{ $t('Button-Cancel') }}</back-button>
    </template>
    <template #rendered>
      <checkout-process v-if="hasAccess" :key="$route.fullPath" :data="data" class="mt-5"></checkout-process>
      <checkout-no-access v-else></checkout-no-access>
    </template>
  </page-container>
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapGetters, mapState } from 'vuex';
import { BackButton } from '@/components/Button';
import { PageContainer } from '@/ui/shared/Layout';
import CheckoutProcess from './components/CheckoutProcess.vue';
import CheckoutNoAccess from './components/CheckoutNoAccess.vue';

export default {
  name: 'CheckoutView',
  components: {
    BackButton,
    PageContainer,
    CheckoutProcess,
    CheckoutNoAccess,
  },
  created() {
    this.initialize();
  },
  data() {
    return {
      renderers: ['project', 'userBankAccounts'],
    };
  },
  computed: {
    ...mapState('users', ['userBankAccounts']),
    ...mapGetters('users', ['user']),
    ...mapGetters('projects', ['project']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
    data() {
      return {
        user: {
          ...this.user.data,
          bankAccounts: this.userBankAccounts.data.items,
        },
        project: this.project.data,
      };
    },
    hasAccess() {
      const identityVerified = get(this.user, 'data.setup.identityVerification') === 'approved';
      const hasBankAccount = (get(this.userBankAccounts, 'data.items') || []).length > 0;
      return identityVerified && hasBankAccount;
    },
  },
  methods: {
    ...mapActions('users', ['getBankAccountsByUser']),
    ...mapActions('projects', ['getProject']),

    initialize() {
      const { project: projectId } = this.$route.query;

      if (!this.project.data || this.project.data._id !== projectId) {
        this.getProject(projectId);
      }

      if (!this.userBankAccounts.data || this.userBankAccounts.data.userId !== this.user.data._id) {
        this.getBankAccountsByUser(this.user.data._id);
      }
    },
    returnHandler() {
      this.$router.replace({
        name: 'projects/active/:id',
        params: { id: this.$route.query.project },
        query: {
          projectGroup: this.$route.query.projectGroup,
        },
      });
    },
  },
};
</script>
