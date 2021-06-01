<template>
  <page-container :navs="navs" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <transaction-form :data="transaction.data" :list="list"></transaction-form>
    </template>
  </page-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';
import TransactionForm from './components/EditTransactionForm.vue';

export default {
  name: 'EditTransaction',
  components: {
    PageContainer,
    TransactionForm,
  },
  data() {
    return {
      navs: ['finance', 'finance/transactions', 'finance/transactions/:id'],
      renderers: ['transaction', 'users', 'projects', 'projectGroups'],
    };
  },
  created() {
    this.initialize();
  },
  watch: {
    $route() {
      this.initialize();
    },
  },
  computed: {
    ...mapGetters('transactions', ['transaction']),
    ...mapGetters('users', ['users']),
    ...mapGetters('projects', ['projects']),
    ...mapGetters('projectGroups', ['projectGroups']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
    list() {
      return {
        users: this.users.data,
        projectGroups: this.projectGroups.data,
        projects: this.projects.data,
      };
    },
  },
  methods: {
    ...mapActions('transactions', ['getTransaction']),
    ...mapActions('users', ['getUsers']),
    ...mapActions('projects', ['getProjects']),
    ...mapActions('projectGroups', ['getProjectGroups']),

    initialize() {
      const { id } = this.$route.params;
      if (!this.transaction.data || this.transaction.data._id !== id) {
        this.getTransaction(id);
      }
      if (!this.users.data) this.getUsers();
      if (!this.projectGroups.data) this.getProjectGroups();
      if (!this.projects.data) this.getProjects();
    },
  },
};
</script>
