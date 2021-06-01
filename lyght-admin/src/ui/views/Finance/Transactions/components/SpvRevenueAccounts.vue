<template>
  <v-card class="rounded-xl pa-7">
    <div class="mb-5">
      <div class="text-subtitle">{{ balance.display }}</div>
      <div class="text-body">Current balance</div>
    </div>
    <v-data-table
      :headers="headers"
      :items="items"
      :options="options"
      class="table-cursor-pointer"
      @click:row="onRowClick"
    ></v-data-table>
  </v-card>
</template>

<script>
import get from 'lodash/get';
import accounts from '@/constants/finance/accounts';
import { formatCurrency } from '@/utils/formats';
import { formatTimestamp } from '@/utils/date';

export default {
  name: 'SpvRevenueAccounts',
  props: {
    data: { type: Array, default: () => [] },
    projects: { type: Array, default: () => [] },
  },
  data() {
    return {
      options: {
        itemsPerPage: 5,
        sortBy: ['created'],
        sortDesc: [true],
        mustSort: true,
      },
    };
  },
  computed: {
    headers() {
      return [
        { text: 'Amount', value: 'amount' },
        { text: 'Account', value: 'accountDisplay' },
        { text: 'Created On', value: 'created' },
      ];
    },
    filteredData() {
      return this.data.filter((d) => ['1001', '2000'].includes(d.account));
    },
    items() {
      return this.filteredData.map((d) => ({
        ...d,
        amount: this.formatCurrencySigned(d),
        accountDisplay: this.getAccount(d.account),
        project: this.getProject(d.projectId),
        created: this.getCreated(d),
        updated: this.getUpdated(d),
      }));
    },
    balance() {
      const value = this.filteredData.reduce(
        (acc, curr) => (curr.debit ? acc + curr.amount.value : acc - curr.amount.value),
        0,
      );
      return formatCurrency({ value, currency: 'TWD' });
    },
  },
  methods: {
    formatCurrencySigned(data) {
      const { amount, debit } = data;
      const formattedValue = formatCurrency(amount).display;
      return `${debit ? '+ ' : '- '}${formattedValue}`;
    },
    getAccount(id) {
      if (!id) return null;
      return accounts.find((item) => item.value === id).text;
    },
    getProject(id) {
      if (!id) return null;
      return get(
        this.projects.find((item) => item._id === id),
        'nameTrans.en',
      );
    },
    getCreated(data) {
      const createdAt = get(data, 'createdAt');
      return formatTimestamp(createdAt);
    },
    getUpdated(data) {
      const updatedAt = get(data, 'updatedAt');
      return formatTimestamp(updatedAt);
    },
    onRowClick(data) {
      this.$emit('item-select', data);
    },
  },
};
</script>

<style lang="scss" scoped>
.table-cursor-pointer {
  ::v-deep tbody tr :hover {
    cursor: pointer;
  }
}
</style>
