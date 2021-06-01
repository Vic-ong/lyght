<template>
  <v-timeline align-top dense>
    <v-timeline-item v-for="(item, i) in items" v-bind:key="item.status" :color="i === 0 ? 'primary' : 'grey'" small>
      <v-row justify="space-between" dense>
        <v-col cols="6">
          <div class="text-subheading black--text">{{ item.statusDisplay }}</div>
        </v-col>
        <v-col cols="6">
          <div class="text-body grey--text">{{ item.dateDisplay }}</div>
        </v-col>
      </v-row>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import { formatTimestamp, timestampToDate } from '@/utils/date';

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      statusDesc: {
        waitlist: 'On waitlist',
        unfulfilled: 'Order placed',
        contractSigned: 'Contract signed',
        paid: 'Order fulfilled',
        cancelled: 'Order cancelled',
      },
    };
  },
  computed: {
    items() {
      const list = [];
      ['waitlist', 'unfulfilled', 'contractSigned', 'paid', 'cancelled'].forEach((statusKey) => {
        const date = this.data.order.statusDates[statusKey];
        if (date) {
          list.push({
            status: statusKey,
            statusDisplay: this.statusDesc[statusKey],
            date: timestampToDate(date),
            dateDisplay: formatTimestamp(date),
          });
        }
      });

      return list.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
  },
};
</script>
