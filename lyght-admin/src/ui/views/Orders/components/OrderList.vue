<template>
  <v-card class="rounded-xl pa-7">
    <div class="d-flex flex-wrap align-center">
      <div class="d-flex flex-wrap">
        <v-btn
          v-for="(filter, index) in filters"
          v-bind:key="filter.value"
          @click="toggleFilter(index)"
          :color="filter.active ? 'primary' : 'bg-light'"
          style="letter-spacing: unset !important"
          class="ma-1"
          rounded
          depressed
          small
        >
          {{ filter.name }}
        </v-btn>
      </div>
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
import { formatTimestamp } from '@/utils/date';

export default {
  name: 'OrderList',
  props: {
    data: { type: Array, default: () => [] },
  },
  data() {
    return {
      search: '',
      sortBy: 'updated',
      sortDesc: true,
      filters: [
        { value: 'unfulfilled', name: 'Unfulfilled', active: false },
        { value: 'contract_signed', name: 'Contract signed (not paid)', active: false },
        { value: 'paid', name: 'Paid', active: false },
        { value: 'waitlist', name: 'Waitlist', active: false },
      ],
    };
  },
  computed: {
    headers() {
      return [
        { text: 'Order #', value: 'orderNumber' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Status', value: 'status' },
        { text: 'Last Updated', value: 'updated' },
        { text: 'User', value: 'userName' },
        { text: 'Project', value: 'projectName' },
      ];
    },
    items() {
      const filters = this.filters.filter((item) => item.active).map((item) => item.value);
      return this.data
        .filter((d) => {
          if (filters.length > 0) return filters.includes(d.status);
          return d;
        })
        .map((d) => ({
          ...d,
          updated: this.getUpdated(d),
        }));
    },
  },
  methods: {
    getUpdated(data) {
      const updatedAt = get(data, 'updatedAt');
      return formatTimestamp(updatedAt);
    },
    toggleFilter(index) {
      this.filters[index].active = !this.filters[index].active;
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
