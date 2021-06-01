<template>
  <v-row class="text-body black--text">
    <v-col cols="12" sm="6">
      <div>{{ $t('Field-SolarPanel') }} ({{ data.name }})</div>
    </v-col>

    <v-col cols="12" sm="3">
      <div class="text-right">{{ $t('Field-Quantity') }}: {{ inputQuantity }}</div>
    </v-col>

    <v-col cols="12" sm="3">
      <div class="text-right">{{ subTotal.display }}</div>
    </v-col>
  </v-row>
</template>

<script>
import { formatCurrency } from '@/utils/formats';

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    inputQuantity() {
      return Number(this.data.quantity);
    },
    subTotal() {
      const value = this.data.unitCost.value * this.inputQuantity;
      return formatCurrency({ value, currency: this.data.unitCost.currency });
    },
  },
};
</script>
