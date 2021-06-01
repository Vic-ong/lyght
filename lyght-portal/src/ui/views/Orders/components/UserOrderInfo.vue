<template>
  <div>
    <div v-if="!print" class="py-5 px-10">
      <v-row>
        <template v-for="item in referenceInfo">
          <v-col v-bind:key="item.name" cols="6" class="text-body black--text text-left">
            {{ item.name }}
          </v-col>
          <v-col v-bind:key="item.value" cols="6" class="text-subheading black--text text-right">
            {{ item.value }}
          </v-col>
        </template>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <template v-for="item in orderInfo">
          <v-col v-bind:key="item.name" cols="6" class="text-body black--text text-left">
            {{ item.name }}
          </v-col>
          <v-col v-bind:key="item.value" cols="6" class="text-subheading black--text text-right">
            {{ item.value }}
          </v-col>
        </template>
      </v-row>
    </div>

    <div v-else>
      <v-row>
        <template v-for="item in printInfo">
          <v-col v-bind:key="item.name" cols="4">
            {{ item.name }}
          </v-col>
          <v-col v-bind:key="item.value" cols="8" style="font-weight: bold">
            {{ item.value }}
          </v-col>
        </template>
      </v-row>
    </div>
  </div>
</template>

<script>
import { timeToSimpleDateTime } from '@/utils/date';
import { formatCurrency } from '@/utils/formats';

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    print: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      statusTextKey: {
        waitlist: 'Field-Order-Waitlist',
        unfulfilled: 'Field-Order-Unfulfilled',
        contractSigned: 'Field-Order-ContractSigned',
        paid: 'Field-Order-Paid',
        cancelled: 'Field-Order-Cancelled',
      },
    };
  },
  computed: {
    referenceInfo() {
      return [
        {
          name: this.$t('Field-Order-OrderNumber'),
          value: this.data.orderNumber,
        },
        {
          name: this.$t('Field-Status'),
          value: this.statusName,
        },
        {
          name: this.$t('Field-LastUpdated'),
          value: timeToSimpleDateTime(this.data.updatedAt),
        },
      ];
    },
    orderInfo() {
      return [
        {
          name: this.$t('Field-Quantity'),
          value: this.data.quantity,
        },
        {
          name: this.$t('Field-UnitCost'),
          value: this.unitCost.display,
        },
        {
          name: this.$t('Field-AmountTotal'),
          value: this.total.display,
        },
        {
          name: this.$t('Field-Project'),
          value: this.data.project.name,
        },
      ];
    },
    printInfo() {
      return [
        {
          name: this.$t('Field-Order-OrderNumber'),
          value: this.data.orderNumber,
        },
        {
          name: this.$t('Field-Quantity'),
          value: this.data.quantity,
        },
        {
          name: this.$t('Field-UnitCost'),
          value: this.unitCost.display,
        },
        {
          name: this.$t('Field-AmountTotal'),
          value: this.total.display,
        },
        {
          name: this.$t('Field-Project'),
          value: this.data.project.name,
        },
        {
          name: this.$t('Field-Status'),
          value: this.statusName,
        },
        {
          name: this.$t('Field-LastUpdated'),
          value: timeToSimpleDateTime(this.data.updatedAt),
        },
      ];
    },
    unitCost() {
      const val = this.data.unitCost;
      return formatCurrency(val);
    },
    total() {
      const val = this.data.total;
      return formatCurrency(val);
    },
    statusName() {
      return this.$t(this.statusTextKey[this.data.status]);
    },
  },
};
</script>
