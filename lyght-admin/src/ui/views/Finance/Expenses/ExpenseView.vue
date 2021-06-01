<template>
  <page-container :navs="navs" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <edit-expense :data="expense.data" :project="projectGroupExpenseInfo.data" :list="list"></edit-expense>
    </template>
  </page-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';
import EditExpense from './components/EditExpense.vue';

export default {
  name: 'ExpenseView',
  components: {
    PageContainer,
    EditExpense,
  },
  data() {
    return {
      navs: ['finance', 'finance/expenses', 'finance/expenses/:id'],
      renderers: ['expense', 'projectGroupExpenseInfo', 'projectGroups'],
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
    ...mapGetters('expenses', ['expense']),
    ...mapGetters('projectGroups', ['projectGroups', 'projectGroupExpenseInfo']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
    list() {
      return {
        projectGroups: this.projectGroups.data,
      };
    },
  },
  methods: {
    ...mapActions('expenses', ['getExpense']),
    ...mapActions('projectGroups', [
      'getProjectGroups',
      'getProjectGroup',
      'getExpenseAllocationsByProjectGroup',
      'getBankAccountsByProjectGroup',
    ]),

    initialize() {
      const { id } = this.$route.params;
      const { projectGroup: projectGroupId } = this.$route.query;

      if (!this.expense.data || this.expense.data._id !== id) {
        this.getExpense(id);
      }
      if (!this.projectGroupExpenseInfo.data || this.projectGroupExpenseInfo.data._id !== projectGroupId) {
        this.getProjectGroup(projectGroupId);
        this.getExpenseAllocationsByProjectGroup(projectGroupId);
        this.getBankAccountsByProjectGroup(projectGroupId);
      }
      if (!this.projectGroups.data) this.getProjectGroups();
    },
  },
};
</script>
