<template>
  <div class="text-right">
    <div class="text-body black--text mb-1">{{ $t('Field-TotalCost') }}</div>
    <div class="text-subheading-medium black--text">{{ grandTotal.display }}</div>
  </div>
</template>

<script>
import get from 'lodash/get';
import { formatCurrency } from '@/utils/formats';

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    grandTotal() {
      const value = this.items.map((item) => {
        const { unitCost, quantity } = item;
        return unitCost.value * quantity;
      });
      // TODO: choose a base currency ?
      const { currency } = get(this.items, '[0].unitCost') || {};

      return formatCurrency({ value, currency });
    },
  },
};
</script>
