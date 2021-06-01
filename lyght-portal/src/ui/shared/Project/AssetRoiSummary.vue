<template>
  <v-row>
    <v-col v-for="item in items" v-bind:key="item.key" cols="6">
      <v-card height="145" class="pa-3">
        <v-icon color="primary">{{ item.icon }}</v-icon>
        <div class="info-card-container">
          <div class="text-body grey--text" style="text-align: right">{{ $t(item.textKey) }}</div>
          <div class="text-subheading">
            <div v-if="item.subValue" style="text-align: right">{{ item.subValue }}</div>
            <div style="text-align: right">{{ item.value }}</div>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { formatCurrency } from '@/utils/formats';

export default {
  name: 'AssetRoiSummary',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    projectDetails() {
      return this.data.project;
    },
    items() {
      return [
        {
          value: this.assetAmount,
          icon: 'mdi-cash-lock',
          textKey: 'Field-AmountParticipated',
        },
        {
          value: this.assetQuantity,
          icon: 'mdi-cash-marker',
          textKey: 'Field-PanelsPurchased',
        },
        {
          value: this.cumulativeReturn,
          icon: 'mdi-cash-multiple',
          textKey: 'Field-CumulativeReturn',
        },
        {
          value: this.upcomingReturn,
          subValue: this.upcomingReturnDate,
          icon: 'mdi-cash-plus',
          textKey: 'Field-EstimatedUpcomingReturn',
        },
      ];
    },
    assetQuantity() {
      return this.data.quantity;
    },
    assetAmount() {
      const value = this.data.quantity * this.projectDetails.unitCost.value;
      return formatCurrency({ value, currency: this.projectDetails.unitCost.currency }).display;
    },
    cumulativeReturn() {
      const val = this.data.revenueTotal;
      return formatCurrency(val).display;
    },
    upcomingReturn() {
      const val = {
        value: 0,
        currency: 'TWD',
      };
      return formatCurrency(val).display;
    },
    upcomingReturnDate() {
      return '-';
    },
  },
};
</script>

<style lang="scss" scoped>
.info-card-container {
  height: calc(100% - 24px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
