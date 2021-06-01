<template>
  <div>
    <v-card v-if="!print">
      <v-toolbar color="primary">
        <v-spacer></v-spacer>
        <div class="text-subheading-medium white--text">{{ $t('Order-OrderDetails-Timeline') }}</div>
        <v-spacer></v-spacer>
      </v-toolbar>

      <div class="px-5">
        <v-timeline align-top dense>
          <v-timeline-item
            v-for="(item, i) in items"
            v-bind:key="item.status"
            :color="i === 0 ? 'primary' : 'grey'"
            small
          >
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
      </div>
    </v-card>

    <div v-else>
      <div v-for="item in items" v-bind:key="item.status" style="padding: 8px 0">
        <h4>{{ item.statusDisplay }}</h4>
        <span>{{ item.dateDisplay }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { timeToSimpleDateTime, timestampToDate } from '@/utils/date';

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
      statusDescTextKey: {
        waitlist: 'Field-Order-WaitlistDesc',
        unfulfilled: 'Field-Order-UnfulfilledDesc',
        contractSigned: 'Field-Order-ContractSignedDesc',
        paid: 'Field-Order-PaidDesc',
        cancelled: 'Field-Order-CancelledDesc',
      },
    };
  },
  computed: {
    items() {
      const list = [];
      ['waitlist', 'unfulfilled', 'contractSigned', 'paid', 'cancelled'].forEach((statusKey) => {
        const date = this.data.statusDates[statusKey];
        if (date) {
          list.push({
            status: statusKey,
            statusDisplay: this.statusDesc(statusKey),
            date: timestampToDate(date),
            dateDisplay: timeToSimpleDateTime(date),
          });
        }
      });

      return list.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
  },
  methods: {
    statusDesc(data) {
      return this.$t(this.statusDescTextKey[data]);
    },
  },
};
</script>

<style></style>
