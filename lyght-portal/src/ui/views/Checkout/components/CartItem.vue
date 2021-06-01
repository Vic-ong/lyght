<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card flat class="d-flex">
        <v-card width="100" height="100">
          <v-img :src="data.thumbnail" aspect-ratio="1" contain></v-img>
        </v-card>

        <div class="pl-5 text-left">
          <div class="text-subheading-medium black--text mb-2">{{ $t('Field-SolarPanel') }}</div>
          <div class="text-body black--text">{{ data.name }}</div>
          <div class="text-body black--text">{{ unitCost.display }} / {{ $t('Project-Panel') }}</div>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" sm="3">
      <v-card flat max-width="120">
        <v-text-field
          v-model="data.quantity"
          :label="$t('Field-Quantity')"
          :rules="quantityRules"
          type="number"
          outlined
          required
        ></v-text-field>
      </v-card>
    </v-col>

    <v-col cols="12" sm="3">
      <v-card flat class="text-right">
        <div class="text-body black--text mb-1">{{ $t('Field-Subtotal') }}</div>
        <div class="text-subheading black--text">{{ subTotal.display }}</div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import form from '@/utils/validation/form';
import { formatCurrency } from '@/utils/formats';

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    quantityRules() {
      return [
        form.required(this.t),
        form.number(this.t),
        // quantity input must be less than inventory
        (v) =>
          (v && (Number(v) <= this.data.inventory || this.data.inventory === 0)) ||
          this.$t('Status-MaxPanels', { len: this.data.inventory }),
      ];
    },
    inputQuantity() {
      return Number(this.data.quantity);
    },
    unitCost() {
      const val = this.data.unitCost;
      return formatCurrency(val);
    },
    subTotal() {
      const value = this.data.unitCost.value * this.inputQuantity;
      return formatCurrency({ value, currency: this.data.unitCost.currency });
    },
  },
  methods: {
    t(v, params) {
      return this.$t(v, params);
    },
  },
};
</script>
