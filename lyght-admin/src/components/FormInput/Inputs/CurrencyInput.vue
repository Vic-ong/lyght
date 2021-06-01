<template>
  <div>
    <div v-if="data">
      <v-row dense>
        <v-col cols="6">
          <v-text-field
            v-model="data.value"
            v-bind="$attrs"
            :rules="currencyValueRules"
            :prefix="prefix"
            type="number"
            validate-on-blur
            dense
            filled
            rounded
            required
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-autocomplete
            v-model="data.currency"
            label="Currency"
            :rules="currencyRules"
            :items="currencyList"
            :loading="loading"
            :disabled="disabled"
            :readonly="readonly"
            :hide-details="hideDetails === true"
            validate-on-blur
            dense
            filled
            rounded
            required
          ></v-autocomplete>
        </v-col>
      </v-row>
    </div>

    <!-- when value is null -->
    <v-text-field
      v-else
      v-model="data"
      v-bind="$attrs"
      type="number"
      validate-on-blur
      dense
      filled
      rounded
      required
    ></v-text-field>
  </div>
</template>

<script>
import v from '@/utils/validations';
import currencyList from '@/constants/finance/currencyList.json';
import { formatCurrency } from '@/utils/formats';

export default {
  name: 'CurrencyInput',
  props: {
    data: { type: Object },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    hideDetails: { type: Boolean, default: false },
    rules: { type: Array, default: () => [] },
  },
  computed: {
    currencyRules() {
      return [v.required()];
    },
    currencyValueRules() {
      return [...this.rules, v.money()];
    },
    prefix() {
      return formatCurrency(this.data).symbol;
    },
    currencyList() {
      return currencyList.map((item) => ({
        text: item.name,
        value: item.code,
      }));
    },
  },
};
</script>
