<template>
  <v-card class="pos-relative mt-15 rounded-lg">
    <div class="text-center pa-5">
      <div @click="routeToProjectGroup" class="text-subtitle cursor-pointer">{{ projectName }}</div>

      <div class="mt-5 px-3">
        <v-row dense>
          <v-col v-for="item in project.expenseAllocations" v-bind:key="item._id" cols="12" md="6" lg="12">
            <div class="text-left d-flex align-center justify-space-between px-3">
              <div class="text-subheading">{{ expenseName(item.account) }}</div>
              <div class="text-body bg-grey--text">{{ expenseValue(item.amount) }}</div>
            </div>
          </v-col>
        </v-row>
      </div>

      <div class="mt-7">
        <div class="text-subtitle">{{ currencyDisplay(input.outstanding) }}</div>
        <div class="text-hint bg-grey--text">Outstanding amount</div>
      </div>
    </div>

    <slot></slot>

    <div class="divider-line my-5 mx-5"></div>

    <div class="pb-5">
      <record-timestamps :data="data"></record-timestamps>
    </div>
  </v-card>
</template>

<script>
import get from 'lodash/get';
import accounts from '@/constants/finance/accounts';
import { formatDisplayVal, formatCurrency } from '@/utils/formats';

export default {
  name: 'ExpenseProfile.SidePanel',
  props: {
    input: { type: Object, required: true },
    data: { type: Object, required: true },
    project: { type: Object, required: true },
  },
  computed: {
    projectName() {
      return get(this.project, 'nameTrans.en');
    },
    allocations() {
      const data = get(this.project, 'expenseAllocations');
      if (!data) return [];
      const list = [
        {
          key: 'assetManagement',
          name: 'Asset management',
        },
        {
          key: 'trust',
          name: 'Trust',
        },
        {
          key: 'insurance',
          name: 'Insurance',
        },
        {
          key: 'rental',
          name: 'Rental',
        },
        {
          key: 'opsMaintenance',
          name: 'Ops & maintenance',
        },
      ];
      return list.map((item) => {
        const { type, value } = data[item.key];
        const format = type === 'percentage' ? { format: '0.0%' } : { format: '0,0' };

        return {
          ...item,
          value: formatDisplayVal(value, format),
        };
      });
    },
  },
  methods: {
    formatCurrency(value) {
      return formatCurrency({ value, currency: get(this.input, 'cash.currency') });
    },
    currencyDisplay(value) {
      return value ? this.formatCurrency(value).display : '-';
    },
    expenseName(id) {
      const acc = accounts.find((item) => item.value === id);
      return acc ? acc.text : 'Invalid Account';
    },
    expenseValue(amount = {}) {
      const { type, value } = amount;
      const format = type === 'percentage' ? { format: '0.[00]%' } : { format: '0,0.[00]' };

      return formatDisplayVal(value, format);
    },
    routeToProjectGroup() {
      this.$router.push({
        name: 'projects/groups/:id',
        params: {
          id: this.project._id,
        },
      });
    },
  },
};
</script>
