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
import { formatDisplayVal } from '@/utils/formats';

export default {
  name: 'ProjectList',
  props: {
    data: { type: Array, default: () => [] },
  },
  data() {
    return {
      search: '',
      sortBy: 'updated',
      sortDesc: true,
      filters: [
        { value: 'new', name: 'New', active: false },
        { value: 'active', name: 'Active', active: false },
        { value: 'incomplete', name: 'Incomplete', active: false },
      ],
    };
  },
  computed: {
    headers() {
      return [
        { text: 'Name', value: 'nameTrans.en' },
        { text: 'Status', value: 'status' },
        { text: 'Est. IRR', value: 'estimatedIrr' },
        { text: 'Est. Annual Yield Rate', value: 'yieldRateAvg' },
        { text: 'Panels', value: 'panelsTotal' },
        { text: 'Last Updated', value: 'updated' },
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
          estimatedIrr: formatDisplayVal(d.estimatedIrr, { format: '0.00%' }),
          yieldRateAvg: formatDisplayVal(d.yieldRateAvg, { format: '0.00%' }),
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
