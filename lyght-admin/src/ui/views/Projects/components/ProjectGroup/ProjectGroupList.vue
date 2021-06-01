<template>
  <v-card class="rounded-xl pa-7">
    <div class="d-flex flex-wrap align-center">
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="mdi-magnify" dense filled rounded hide-details></v-text-field>
    </div>
    <v-data-table
      :headers="headers"
      :items="items"
      :options="options"
      :search="search"
      class="table-cursor-pointer"
      @click:row="onRowClick"
    ></v-data-table>
  </v-card>
</template>

<script>
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
      options: {
        itemsPerPage: 10,
        sortBy: ['updated'],
        sortDesc: [true],
        mustSort: true,
      },
    };
  },
  computed: {
    headers() {
      return [
        { text: 'Name', value: 'nameTrans.en' },
        { text: 'Capacity', value: 'capacityDisplay' },
        { text: 'Panels', value: 'panelsTotal' },
        { text: 'PPA Start Date', value: 'ppaContractStartDate' },
        { text: 'PPA End Date', value: 'ppaContractEndDate' },
        { text: 'Last Updated', value: 'updated' },
      ];
    },
    items() {
      return this.data.map((d) => ({
        ...d,
        capacityDisplay: formatDisplayVal(d.capacity, { format: '0,0.[00]', suffix: 'kW' }),
        updated: formatTimestamp(d.updatedAt),
      }));
    },
  },
  methods: {
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
