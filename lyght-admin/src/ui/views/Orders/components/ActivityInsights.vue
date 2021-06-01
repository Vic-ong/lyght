<template>
  <v-row dense>
    <v-col v-for="item in items" v-bind:key="item.name" cols="12" sm="6">
      <card-panel @click="setExpand(item)">
        <div class="d-flex align-baseline">
          <div class="text-emphasis">{{ item.displayVal }}</div>
          <div v-if="item.comparison" class="text-subtitle ml-3" :class="[getComparedColor(item.comparison)]">
            ({{ item.comparison.display }})
          </div>
        </div>
        <div class="text-body">{{ item.name }}</div>
      </card-panel>
    </v-col>
    <v-col cols="12">
      <v-expand-transition>
        <v-card v-show="expand" height="160" class="rounded-xl">
          <div class="pa-5">
            <div v-for="item in expandData.details" v-bind:key="item" class="text-body px-3 py-1">
              {{ item }}
            </div>
          </div>
        </v-card>
      </v-expand-transition>
    </v-col>
  </v-row>
</template>

<script>
import get from 'lodash/get';
import { formatDisplayVal } from '@/utils/formats';
import { unixToDate, dateDiff } from '@/utils/date';

export default {
  name: 'ActivityInsights',
  props: {
    data: { type: Array, default: () => [] },
  },
  data() {
    return {
      expand: false,
      expandData: {},
    };
  },
  computed: {
    moneyFormat() {
      return { format: '0,0', suffix: 'NTD' };
    },
    moneyFormatSigned() {
      return { format: '0,0', suffix: 'NTD' };
    },
    items() {
      return [this.totalGMV(30), this.totalGMV(90)];
    },
  },
  methods: {
    setExpand(data) {
      if (data.details) {
        if (this.expandData.key === data.name) {
          this.expandData = {};
          this.expand = false;
        } else {
          this.expandData = this.getDetails(data);
          this.expand = true;
        }
      }
    },
    getStatus(data) {
      return get(data, 'status');
    },
    getComparedColor(data) {
      const { value, current, comparison } = data;

      if (Math.abs(current - comparison) <= 10000) return 'bg-grey--text';
      if (value > 0.1) return 'success--text';
      if (value < -0.1) return 'error--text';
      return 'bg-grey--text';
    },
    getDetails(data) {
      if (!data) return [];

      const { name, diff, comparison, period } = data;
      const unfulfilledGMV = this.gmvLastNDaysByStatus(period.value, 'unfulfilled');
      const unpaidGMV = this.gmvLastNDaysByStatus(period.value, 'contract_signed');
      const paidGMV = this.gmvLastNDaysByStatus(period.value, 'paid');

      return {
        key: name,
        details: [
          `Unfulfilled orders: ${formatDisplayVal(unfulfilledGMV, this.moneyFormat)}`,
          `Signed & unpaid orders: ${formatDisplayVal(unpaidGMV, this.moneyFormat)}`,
          `Paid orders: ${formatDisplayVal(paidGMV, this.moneyFormat)}`,
          `${comparison.display} (${formatDisplayVal(diff, this.moneyFormatSigned)}) growth between these 2 periods.`,
        ],
      };
    },
    gmvLastNDaysByStatus(days, status, lagged = false) {
      const filteredData = this.data.filter((d) => {
        if (d.status !== status) return false;
        const date1 = unixToDate(get(d, 'createdAt.seconds'));
        const date2 = new Date();
        const diff = dateDiff(date1, date2);
        if (lagged) {
          return diff > days && diff <= days * 2;
        }
        return diff <= days;
      });

      return filteredData.reduce((acc, curr) => {
        const sum = acc + curr.total.value || 0;
        return sum;
      }, 0);
    },
    gmvLastNDays(days, lagged = false) {
      const filteredData = this.data.filter((d) => {
        if (d.status === 'cancelled') return false;
        const date1 = unixToDate(get(d, 'createdAt.seconds'));
        const date2 = new Date();
        const diff = dateDiff(date1, date2);
        if (lagged) {
          return diff > days && diff <= days * 2;
        }
        return diff <= days;
      });

      // TODO: account for currency differences
      return filteredData.reduce((acc, curr) => {
        const sum = acc + curr.total.value || 0;
        return sum;
      }, 0);
    },
    comparedCreated(current, compared) {
      let v = null;
      if (compared > 0) v = (current - compared) / compared;

      return {
        value: v,
        display: v ? formatDisplayVal(v, { format: '+0%' }) : '-%',
      };
    },
    totalGMV(days) {
      const current = this.gmvLastNDays(days);
      const compared = this.gmvLastNDays(days, true);
      const comparison = this.comparedCreated(current, compared);

      return {
        name: `GMV in the last ${days} days`,
        displayVal: formatDisplayVal(current, this.moneyFormat),
        value: current,
        diff: current - compared,
        compared,
        comparison,
        period: {
          value: days,
          unit: 'days',
        },
        details: true,
      };
    },
  },
};
</script>
