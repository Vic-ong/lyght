<template>
  <v-row dense>
    <v-col v-for="item in items" v-bind:key="item.name" cols="6" sm="3">
      <card-panel @click="setExpand(item)">
        <div class="d-flex align-baseline">
          <div class="text-emphasis">{{ item.value }}</div>
          <div v-if="item.comparison" class="text-subtitle ml-3" :class="[getComparedColor(item.comparison)]">
            ({{ item.comparison.display }})
          </div>
        </div>
        <div class="text-body">{{ item.name }}</div>
      </card-panel>
    </v-col>
    <v-col cols="12">
      <v-expand-transition>
        <v-card v-show="expand" height="130" class="rounded-xl">
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
    items() {
      return [
        this.createdLastNDaysSummarry(30),
        this.createdLastNDaysSummarry(90),
        {
          name: 'Pending ID verification',
          value: this.data.filter((d) => this.getIdStatus(d) === 'pending').length,
        },
        {
          name: 'Users not verified',
          value: this.data.filter((d) => !this.getIdStatus(d) || this.getIdStatus(d) === 'disapproved').length,
        },
      ];
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
    getIdStatus(data) {
      return get(data, 'setup.identityVerification');
    },
    getComparedColor(data) {
      const { value, current, comparison } = data;

      if (Math.abs(current - comparison) <= 10) return 'bg-grey--text';
      if (value > 0.1) return 'success--text';
      if (value < -0.1) return 'error--text';
      return 'bg-grey--text';
    },
    getDetails(data) {
      if (!data) return [];

      const { name, value, diff, compared, comparison, period } = data;
      return {
        key: name,
        details: [
          `${value} new users in the last ${period.value} ${period.unit}.`,
          `${compared} new users in the previous ${period.value} ${period.unit}.`,
          `${comparison.display} (${formatDisplayVal(diff, { format: '+0' })} users) growth between these 2 periods.`,
        ],
      };
    },
    createdLastNDays(days, lagged = false) {
      return this.data.filter((d) => {
        const date1 = unixToDate(get(d, 'createdAt.seconds'));
        const date2 = new Date();
        const diff = dateDiff(date1, date2);
        if (lagged) {
          return diff > days && diff <= days * 2;
        }
        return diff <= days;
      }).length;
    },
    comparedCreated(current, compared) {
      let v = null;
      if (compared > 0) v = (current - compared) / compared;

      return {
        value: v,
        display: v ? formatDisplayVal(v, { format: '+0%' }) : '-%',
      };
    },
    createdLastNDaysSummarry(days) {
      const current = this.createdLastNDays(days);
      const compared = this.createdLastNDays(days, true);
      const comparison = this.comparedCreated(current, compared);

      return {
        name: `New users in the last ${days} days`,
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
