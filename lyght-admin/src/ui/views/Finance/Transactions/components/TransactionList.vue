<template>
  <v-card class="rounded-xl pa-7">
    <div class="d-flex flex-wrap align-center">
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="mdi-magnify" dense filled rounded hide-details></v-text-field>
    </div>
    <v-data-table
      :headers="headers"
      :items="items"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :items-per-page="10"
      :search="search"
      class="table-cursor-pointer"
      @click:row="onRowClick"
      must-sort
    ></v-data-table>
  </v-card>
</template>

<script>
import get from 'lodash/get';
import accounts from '@/constants/finance/accounts';
import { formatCurrency } from '@/utils/formats';
import { formatTimestamp } from '@/utils/date';

export default {
  name: 'TransactionList',
  props: {
    data: { type: Array, default: () => [] },
    list: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      search: '',
      sortBy: 'updated',
      sortDesc: true,
    };
  },
  computed: {
    headers() {
      return [
        { text: 'Amount', value: 'amount' },
        { text: 'Account', value: 'accountDisplay' },
        { text: 'Debit/Credit', value: 'debitCredit' },
        { text: 'Project', value: 'project' },
        { text: 'Created On', value: 'created' },
        { text: 'Last Updated', value: 'updated' },
      ];
    },
    items() {
      return this.data.map((d) => ({
        ...d,
        amount: formatCurrency(d.amount).display,
        accountDisplay: this.getAccount(d.account),
        debitCredit: d.debit ? 'Debit' : 'Credit',
        project: this.getProject(d),
        created: this.getCreated(d),
        updated: this.getUpdated(d),
      }));
    },
  },
  methods: {
    getAccount(id) {
      if (!id) return null;
      return accounts.find((item) => item.value === id).text;
    },
    getProject(data) {
      const projectGroup = get(
        this.list.projectGroups.find((item) => item._id === data.projectGroupId),
        'nameTrans.en',
      );

      const project = get(
        this.list.projects.find((item) => item._id === data.projectId),
        'nameTrans.en',
      );

      return `${projectGroup}${project ? ` / ${project}` : ''}`;
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
