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
      :options="options"
      :search="search"
      class="table-cursor-pointer"
      @click:row="onRowClick"
    ></v-data-table>
  </v-card>
</template>

<script>
import get from 'lodash/get';
import { formatTimestamp } from '@/utils/date';

export default {
  name: 'PaymentProvisionList',
  props: {
    data: { type: Array, default: () => [] },
    projectList: { type: Array, default: () => [] },
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
      filters: [
        { value: 'open', name: 'open', active: false },
        { value: 'closed', name: 'closed', active: false },
        { value: 'removed', name: 'removed', active: false },
      ],
    };
  },
  computed: {
    headers() {
      return [
        { text: 'Date', value: 'date' },
        { text: 'Project', value: 'project' },
        { text: 'Revenue', value: 'revenue' },
        { text: 'Outstanding', value: 'outstanding' },
        { text: 'Status', value: 'status' },
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
          project: this.getProject(d),
          updated: this.getUpdated(d),
        }));
    },
  },
  methods: {
    getProject(data) {
      return data.projectId
        ? get(
            this.projectList.find((item) => item._id === data.projectId),
            'nameTrans.en',
          )
        : '-';
    },
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
