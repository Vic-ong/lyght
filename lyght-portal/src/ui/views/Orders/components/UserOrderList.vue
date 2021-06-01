<template>
  <div class="mt-5">
    <v-card class="elevation-3">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('Search')"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :search="search"
        @click:row="onRowClick"
        class="table-cursor-pointer"
      >
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { formatCurrency } from '@/utils/formats';
import { timeToSimpleDateTime } from '@/utils/date';

export default {
  name: 'OrderList',
  props: {
    data: { type: Array },
  },
  data() {
    return {
      loading: false,
      sortBy: 'created',
      sortDesc: true,
      search: '',
      dialog: false,
      valid: true,
      input: {},
      statusList: [
        { text: 'Waitlist', value: 'waitlist' },
        { text: 'Unfulfilled', value: 'unfulfilled' },
        { text: 'Contract Signed', value: 'contract_signed' },
        { text: 'Paid', value: 'paid' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      statusTextKey: {
        waitlist: 'Field-Order-Waitlist',
        unfulfilled: 'Field-Order-Unfulfilled',
        contract_signed: 'Field-Order-ContractSigned',
        paid: 'Field-Order-Paid',
        cancelled: 'Field-Order-Cancelled',
      },
    };
  },
  computed: {
    isXs() {
      return this.$vuetify.breakpoint.xs;
    },
    isMdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
    headers() {
      return [
        { text: this.$t('Field-Order-OrderNumber'), value: 'orderNumber', sortable: false },
        { text: this.$t('Field-Quantity'), value: 'quantity', sortable: false },
        { text: this.$t('Field-AmountTotal'), value: 'total', sortable: false },
        { text: this.$t('Field-Status'), value: 'status' },
        { text: this.$t('Field-Order-OrderDate'), value: 'created' },
      ];
    },
    items() {
      return this.data.map((d) => ({
        ...d,
        status: this.$t(this.statusTextKey[d.status]),
        total: formatCurrency(d.total).display,
        created: timeToSimpleDateTime(d.createdAt),
      }));
    },
  },
  methods: {
    onRowClick(data) {
      this.$router.push({
        name: 'orders/:id',
        params: { id: data._id },
        query: {
          project: data.projectId,
        },
      });
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
