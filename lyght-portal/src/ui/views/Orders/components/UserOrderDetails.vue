<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card>
          <v-card>
            <v-img :src="data.project.imagePrimary.url" height="120" width="100%"></v-img>
            <order-actions-button @print-order="printOrder" :data="data"></order-actions-button>
          </v-card>

          <user-order-info :data="data" class="mt-5"></user-order-info>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <order-activities-timeline :data="data"></order-activities-timeline>
      </v-col>
    </v-row>

    <div style="display: none">
      <order-print-page id="order_printable_area" :data="data"></order-print-page>
    </div>
  </div>
</template>

<script>
import { printByElementId } from '@/components/Print/utils';
import OrderActionsButton from './OrderActionsButton.vue';
import UserOrderInfo from './UserOrderInfo.vue';
import OrderActivitiesTimeline from './OrderActivitiesTimeline.vue';
import OrderPrintPage from './OrderPrintPage.vue';

export default {
  components: {
    OrderActionsButton,
    UserOrderInfo,
    OrderActivitiesTimeline,
    OrderPrintPage,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    printOrder() {
      printByElementId({
        id: 'order_printable_area',
        content: {
          title: `Order_${this.data.orderNumber}`,
        },
      });
    },
  },
};
</script>
