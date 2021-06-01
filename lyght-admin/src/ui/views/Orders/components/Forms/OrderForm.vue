<template>
  <div>
    <div class="text-subheading primary--text ml-2 mt-3 mb-5">Order</div>
    <dynamic-input :input="input" :fields="fields" :disabled="loading || disabled"></dynamic-input>

    <div v-if="!disabled" class="ml-2">
      <div class="text-subheading primary--text mt-3">
        {{ $vuetify.breakpoint.xs ? 'Changes (Current & After)' : 'Detailed changes' }}
      </div>

      <v-row v-if="$vuetify.breakpoint.smAndUp" class="mt-1" dense>
        <v-col cols="5"></v-col>
        <v-col cols="3">
          <div class="text-body" style="text-decoration: underline">Current</div>
        </v-col>
        <v-col cols="4">
          <div class="text-body" style="text-decoration: underline">After</div>
        </v-col>
      </v-row>

      <v-row v-for="item in comparisons" v-bind:key="item.title" dense>
        <v-col cols="12" sm="5">
          <div class="text-body">{{ item.title }}</div>
        </v-col>
        <v-col cols="6" sm="3">
          <div class="text-subheading">{{ item.current }}</div>
        </v-col>
        <v-col cols="6" sm="4">
          <div class="text-subheading primary--text">{{ item.result }}</div>
        </v-col>
      </v-row>

      <v-row class="mt-3" dense>
        <v-col cols="12" sm="8">
          <div class="text-body">Total amount</div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="text-subtitle primary--text">{{ totalAmount }}</div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
import v from '@/utils/validations';
import { formatCurrency } from '@/utils/formats';
import currencyList from '@/constants/finance/currencyList.json';
import DynamicInput from '@/components/FormInput/DynamicInput.vue';

export default {
  name: 'OrderForm',
  components: {
    DynamicInput,
  },
  props: {
    data: { type: Object, required: true },
    panelQuantitiesResult: { type: Object, required: true },
    input: { type: Object, required: true },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      statusList: [
        { text: 'Waitlist', value: 'waitlist' },
        { text: 'Unfulfilled', value: 'unfulfilled' },
        { text: 'Contract Signed', value: 'contract_signed' },
        { text: 'Fulfilled', value: 'paid' },
      ],
    };
  },
  computed: {
    fields() {
      return [
        {
          key: 'quantity',
          component: 'v-text-field',
          cols: '6',
          props: {
            label: 'Quantity',
            type: 'number',
            rules: [v.required(), v.number(), this.quantityRules],
          },
        },
        {
          key: 'status',
          component: 'v-select',
          cols: '6',
          props: {
            label: 'Status',
            items: this.statusList,
            rules: [v.required()],
          },
        },
        {
          key: 'unitCost.value',
          component: 'v-text-field',
          cols: '6',
          props: {
            label: 'Unit Cost',
            readonly: true,
          },
        },
        {
          key: 'unitCost.currency',
          component: 'v-autocomplete',
          cols: '6',
          props: {
            label: 'Currency',
            items: this.currencyList,
            readonly: true,
          },
        },
      ];
    },
    currencyList() {
      return currencyList.map((d) => ({
        value: d.code,
        text: `${d.name} (${d.symbol})`,
      }));
    },
    order() {
      return this.data.order;
    },
    project() {
      return this.data.project;
    },
    comparisons() {
      return [
        {
          title: 'No. of reserved panels',
          current: this.panelReservedQuantity,
          result: this.panelQuantitiesResult.reserved,
        },
        {
          title: 'No. sold panels',
          current: this.panelSoldQuantity,
          result: this.panelQuantitiesResult.sold,
        },
        {
          title: 'Available panels (Incl. reserved)',
          current: this.panelsAvailableIncludeReserved,
          result: this.panelsAvailableIncludeReservedResult,
        },
        {
          title: 'Available panels',
          current: this.panelsAvailable,
          result: this.panelsAvailableResult,
        },
      ];
    },
    panelReservedQuantity() {
      const { panelsReserved } = this.project;
      if (this.order.status === 'waitlist') return panelsReserved;
      return panelsReserved - this.order.quantity;
    },
    panelSoldQuantity() {
      return this.project.panelsSold;
    },
    panelsAvailable() {
      const { panelsTotal, panelsSold } = this.project;
      return panelsTotal - panelsSold;
    },
    panelsAvailableResult() {
      const { total, sold } = this.panelQuantitiesResult;
      return total - sold;
    },
    panelsAvailableIncludeReserved() {
      const { panelsTotal, panelsSold, panelsReserved } = this.project;
      if (this.order.status === 'waitlist') {
        return panelsTotal - panelsSold - panelsReserved;
      }
      return panelsTotal - panelsSold - panelsReserved + this.order.quantity;
    },
    panelsAvailableIncludeReservedResult() {
      const { total, reserved, sold } = this.panelQuantitiesResult;
      return total - reserved - sold;
    },
    totalAmount() {
      const currency = formatCurrency({
        value: this.project.unitCost.value * Number(this.input.quantity),
        currency: this.project.unitCost.currency,
      });
      return currency.display;
    },
  },
  methods: {
    quantityRules(val) {
      const { panelsTotal, panelsSold } = get(this.data, 'project');
      const max = panelsTotal - panelsSold;
      return (val && Number(val) <= max) || `Max quantity is ${max}`;
    },
  },
};
</script>
