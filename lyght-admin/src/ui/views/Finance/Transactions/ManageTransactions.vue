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
              <v-autocomplete
                v-model="filters.account"
                :items="accountList"
                label="Account"
                validate-on-blur
                dense
                filled
                rounded
                hide-details
              ></v-autocomplete>
              <v-autocomplete
                v-model="dateRange"
                :items="dateRangeSelections"
                @change="getTransactionsData"
                label="Date range"
                validate-on-blur
                dense
                filled
                rounded
                hide-details
              ></v-autocomplete>
            </div>

            <new-transaction-form :list="list"></new-transaction-form>
          </div>
        </v-col>

        <v-col cols="6">
          <div class="text-subheading py-4">Lyght's Cash Pool</div>
          <lyght-revenue-accounts
            :data="data"
            :projects="projects.data"
            @item-select="routeToEditTransaction"
          ></lyght-revenue-accounts>
        </v-col>
        <v-col cols="6">
          <div class="text-subheading py-4">SPV's Cash Pool</div>
          <spv-revenue-accounts
            :data="data"
            :projects="projects.data"
            @item-select="routeToEditTransaction"
          ></spv-revenue-accounts>
        </v-col>

        <v-col cols="12">
          <transaction-list :data="data" :list="list" @item-select="routeToEditTransaction"></transaction-list>
        </v-col>
      </v-row>
    </template>
  </page-container>
</template>

<script>
import dayjs from '@/services/dayjs';
import get from 'lodash/get';
import { mapActions, mapGetters } from 'vuex';
import accounts from '@/constants/finance/accounts';
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';
import NewTransactionForm from './components/NewTransactionForm.vue';
import TransactionList from './components/TransactionList.vue';
import LyghtRevenueAccounts from './components/LyghtRevenueAccounts.vue';
import SpvRevenueAccounts from './components/SpvRevenueAccounts.vue';

export default {
  name: 'ManageTransactions',
  components: {
    PageContainer,
    NewTransactionForm,
    TransactionList,
    LyghtRevenueAccounts,
    SpvRevenueAccounts,
  },
  data() {
    return {
      navs: ['finance', 'finance/transactions'],
      renderers: ['transactions', 'users', 'entities', 'projectGroups'],
      filters: {
        projectGroupId: 'all',
        account: 'all',
      },
      dateRange: {
        current: {
          start: dayjs().subtract(13, 'day').startOf('day').toDate(),
          end: dayjs().endOf('day').toDate(),
        },
        compared: {
          start: dayjs().subtract(27, 'day').startOf('day').toDate(),
          end: dayjs().subtract(14, 'day').endOf('day').toDate(),
        },
      },
      dateRangeSelections: [
        {
          text: 'Last 14 days',
          value: {
            current: {
              start: dayjs().subtract(13, 'day').startOf('day').toDate(),
              end: dayjs().endOf('day').toDate(),
            },
            compared: {
              start: dayjs().subtract(27, 'day').startOf('day').toDate(),
              end: dayjs().subtract(14, 'day').endOf('day').toDate(),
            },
          },
        },
        {
          text: 'Year to date',
          value: {
            current: {
              start: dayjs().startOf('year').toDate(),
              end: dayjs().endOf('day').toDate(),
            },
            compared: {
              start: dayjs().subtract(1, 'year').startOf('year').toDate(),
              end: dayjs().subtract(1, 'year').endOf('year').toDate(),
            },
          },
        },
        {
          text: 'Last quarter',
          value: {
            current: {
              start: dayjs().subtract(1, 'quarter').startOf('quarter').toDate(),
              end: dayjs().subtract(1, 'quarter').endOf('quarter').toDate(),
            },
            compared: {
              start: dayjs().subtract(2, 'quarter').startOf('quarter').toDate(),
              end: dayjs().subtract(2, 'quarter').endOf('quarter').toDate(),
            },
          },
        },
        {
          text: 'Last year',
          value: {
            current: {
              start: dayjs().subtract(1, 'year').startOf('year').toDate(),
              end: dayjs().subtract(1, 'year').endOf('year').toDate(),
            },
            compared: {
              start: dayjs().subtract(2, 'year').startOf('year').toDate(),
              end: dayjs().subtract(2, 'year').endOf('year').toDate(),
            },
          },
        },
      ],
    };
  },
  created() {
    this.initialize();
  },
  computed: {
    ...mapGetters('transactions', ['transactions']),
    ...mapGetters('users', ['users']),
    ...mapGetters('entities', ['entities']),
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
        projects: this.projects.data,
        projectGroups: this.projectGroups.data,
        entities: this.entities.data,
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
    accountList() {
      return [{ text: 'All', value: 'all' }, ...accounts];
    },
    data() {
      if (!this.transactions.data || this.transactions.data.length === 0) return [];

      return this.transactions.data.filter((item) => {
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
    ...mapActions('transactions', ['getTransactions']),
    ...mapActions('users', ['getUsers']),
    ...mapActions('entities', ['getEntities']),
    ...mapActions('projects', ['getProjects']),
    ...mapActions('projectGroups', ['getProjectGroups']),

    initialize() {
      if (!this.transactions.data) this.getTransactions({ dateRange: this.dateRange });
      if (!this.users.data) this.getUsers();
      if (!this.projects.data) this.getProjects();
      if (!this.projectGroups.data) this.getProjectGroups();
      if (!this.entities.data) this.getEntities();
    },
    getTransactionsData() {
      this.getTransactions({ dateRange: this.dateRange });
    },
    routeToEditTransaction(data) {
      this.$router.push({
        name: 'finance/transactions/:id',
        params: {
          id: data._id,
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
