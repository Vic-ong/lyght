<template>
  <print-page-layout>
    <h3 class="print-title">
      {{ $t('Order-OrderDetails-OrderInformation') }}
    </h3>
    <div class="print-section">
      <user-order-info :data="data" :print="true"></user-order-info>
    </div>

    <h3 class="print-title">
      {{ $t('Order-OrderDetails-Timeline') }}
    </h3>
    <div class="print-section">
      <order-activities-timeline :data="data" :print="true"></order-activities-timeline>
    </div>
  </print-page-layout>
</template>

<script>
import PrintPageLayout from '@/components/Print/PrintPageLayout.vue';
import UserOrderInfo from './UserOrderInfo.vue';
import OrderActivitiesTimeline from './OrderActivitiesTimeline.vue';

export default {
  components: {
    PrintPageLayout,
    UserOrderInfo,
    OrderActivitiesTimeline,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>
