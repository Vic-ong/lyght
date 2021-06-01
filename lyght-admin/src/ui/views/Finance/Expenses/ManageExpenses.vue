<template>
  <page-container :navs="navs" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex filters-container">
              <v-autocomplete
                v-model="filters.projectGroupId"
                :items="projectGroupList"
                label="Project Group"
                validate-on-blur
                dense
                filled
                rounded
                hide-details
              ></v-autocomplete>
            </div>

            <new-expense :list="list"></new-expense>
          </div>
        </v-col>

        <v-col cols="12">
          <expense-list :data="data" :projectGroups="projectGroups.data" @item-select="routeToEdit"></expense-list>
        </v-col>
      </v-row>
    </template>
  </page-container>
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapGetters } from 'vuex';
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';
import NewExpense from './components/NewExpense.vue';
import ExpenseList from './components/ExpenseList.vue';

export default {
  name: 'ManageExpenses',
  components: {
    PageContainer,
    NewExpense,
    ExpenseList,
  },
  data() {
    return {
      navs: ['finance', 'finance/expenses'],
      renderers: ['expenses', 'projectGroups'],
      filters: {
        projectGroupId: 'all',
      },
    };
  },
  created() {
    this.initialize();
  },
  computed: {
    ...mapGetters('expenses', ['expenses']),
    ...mapGetters('projectGroups', ['projectGroups']),

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
    projectGroupList() {
      if (!this.projectGroups.data || this.projectGroups.data.length === 0) return [];
      const list = this.projectGroups.data.map((item) => ({
        text: item.nameTrans.en,
        value: item._id,
      }));
      list.unshift({ text: 'All', value: 'all' });
      return list;
    },
    data() {
      if (!this.expenses.data || this.expenses.data.length === 0) return [];

      return this.expenses.data.filter((item) => {
        let filter = true;

        Object.keys(this.filters).forEach((key) => {
          const f = this.filters[key];
          if (f !== 'all') filter = get(item, key) === f;
        });

        return filter;
      });
    },
  },
  methods: {
    ...mapActions('expenses', ['getExpenses']),
    ...mapActions('projectGroups', ['getProjectGroups']),

    initialize() {
      if (!this.expenses.data) this.getExpenses();
      if (!this.getProjectGroups.data) this.getProjectGroups();
    },
    routeToEdit(data) {
      this.$router.push({
        name: 'finance/expenses/:id',
        params: {
          id: data._id,
        },
        query: {
          projectGroup: data.projectGroupId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.filters-container {
  & > div {
    margin-right: 12px;
  }
}
</style>
