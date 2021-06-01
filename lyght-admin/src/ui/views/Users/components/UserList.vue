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
  name: 'UserList',
  props: {
    data: { type: Array, default: () => [] },
  },
  data() {
    return {
      search: '',
      sortBy: 'updated',
      sortDesc: true,
      filters: [
        { name: 'Approved', value: 'approved', active: false },
        { name: 'Pending', value: 'pending', active: false },
        { name: 'Disapproved', value: 'disapproved', active: false },
        { name: 'Not Set-up', value: undefined, active: false },
      ],
    };
  },
  computed: {
    headers() {
      return [
        { text: 'Email', value: 'email' },
        { text: 'Phone Number', value: 'phoneNumber' },
        { text: 'Legal Name', value: 'name' },
        { text: 'Display Name', value: 'displayName' },
        { text: 'ID Verification', value: 'setup.identityVerification' },
        { text: 'Last Updated', value: 'updated' },
      ];
    },
    items() {
      const filters = this.filters.filter((item) => item.active).map((item) => item.value);
      return this.data
        .filter((d) => {
          if (filters.length > 0) return filters.includes(get(d, 'setup.identityVerification'));
          return d;
        })
        .map((d) => ({
          ...d,
          name: this.getName(d),
          updated: this.getUpdated(d),
        }));
    },
  },
  methods: {
    getName(data) {
      const { firstName, lastName } = data;
      if (!firstName && !lastName) return '[New User]';
      return `${firstName || ''} ${lastName || ''}`;
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
