<template>
  <v-card class="pa-5">
    <v-row>
      <v-col cols="12" :sm="dense ? '12' : '6'">
        <div class="d-inline-flex align-center">
          <div :class="$vuetify.breakpoint.xs || dense ? 'text-subheading-medium' : 'text-title'">
            {{ $t('Project-Purchasing') }}
          </div>
          <div class="mx-2" style="width: 80px">
            <v-text-field
              v-model="input"
              type="number"
              @change="$emit('change', input)"
              dense
              flat
              hide-details
              reverse
            ></v-text-field>
          </div>
          <div :class="$vuetify.breakpoint.xs || dense ? 'text-subheading-medium' : 'text-title'">
            {{ $t('Project-Panels') }}
          </div>
        </div>
        <v-slider
          v-model="input"
          :max="maxInput"
          :min="1"
          @change="$emit('change', input)"
          class="slider mt-15"
          color="primary"
          track-color="grey"
          thumb-color="primary"
          thumb-label="always"
          hide-details
        ></v-slider>
        <div class="mt-7">
          <flex-row v-for="field in fields" v-bind:key="field.key" class="mt-3">
            <template #label>{{ field.renderText ? field.renderText(field) : $t(field.textKey) }}</template>
            <template #value>
              <div class="text-subheading black--text">
                <AnimatedNumber
                  :value="renderValue(data, field).value"
                  :formatValue="renderValue(data, field).format"
                  :duration="200"
                ></AnimatedNumber>
              </div>
            </template>
          </flex-row>
        </div>
      </v-col>
      <v-col
        v-if="data.status === 'active' && data.yieldRates && data.yieldRates.length > 0"
        cols="12"
        sm="5"
        class="ml-auto"
      >
        <v-card class="rounded-xl foreground" flat>
          <v-card flat class="py-5 px-8 transparent">
            <div class="text-subheading black--text mb-3">{{ estimatedReturnTitle }}</div>
            <flex-row v-for="(item, i) in data.yieldRates" v-bind:key="item.year">
              <template #label>{{ $t('Project-ProjectionYear', { n: i + 1 }) }}</template>
              <template #value>
                <div class="text-subheading primary--text">
                  <AnimatedNumber
                    :value="estimatedYearReturn(item.rate).value"
                    :formatValue="estimatedYearReturn(item.rate).format"
                    :duration="200"
                  ></AnimatedNumber>
                </div>
              </template>
            </flex-row>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import get from 'lodash/get';
import AnimatedNumber from 'animated-number-vue';
import { formatDisplayVal, formatCurrency } from '@/utils/formats';
import { FlexRow } from '@/components/Grid';
import { getProjectDuration } from './utils';

export default {
  name: 'RoiCalculator',
  components: {
    FlexRow,
    AnimatedNumber,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    calculatorInput: { type: Number },
    dense: { type: Boolean, default: false },
  },
  mounted() {
    this.input = this.calculatorInput;
  },
  data() {
    return {
      input: 0,
      fields: [
        {
          key: 'panelCost',
          textKey: 'Field-CostPerPanel',
          getValue: this.panelCost,
        },
        {
          key: 'capitalInvestment',
          textKey: 'Field-CapitalInvestment',
          getValue: this.capitalInvestment,
        },
        {
          key: 'estimatedNYearsReturn',
          renderText: () =>
            this.$t('Field-EstimatedROI', { period: `${this.projectDuration()}-${this.$t('Datetime-Year-Display')}` }),
          getValue: this.estimatedNYearsReturn,
        },
        {
          key: 'estimatedYieldRate',
          textKey: 'Field-EstimatedYieldRate',
          getValue: this.estimatedYieldRate,
        },
        {
          key: 'estimatedCarbonReduction',
          textKey: 'Field-EstimatedCarbonReduction',
          getValue: this.estimatedCarbonReduction,
        },
      ],
      // temp hard-coded value
      carbonPerKg: 3284,
    };
  },
  computed: {
    percentageFormat() {
      return { format: '0.00%' };
    },
    weightFormat() {
      return { format: '0,0', suffix: 'KG' };
    },
    maxInput() {
      return this.data.panelsTotal - this.data.panelsSold;
    },
    avgYieldRate() {
      return this.data.yieldRateAvg;
    },
    estimatedReturnTitle() {
      return this.$t('Project-Calculator-EstimatedReturn', { currency: 'NTD' });
    },
  },
  methods: {
    panelCost() {
      const { unitCost } = this.data;
      return {
        value: unitCost.value,
        format: () => formatCurrency(unitCost).display,
      };
    },
    capitalInvestment() {
      const { unitCost } = this.data;
      const val = unitCost.value * this.calculatorInput;
      return {
        value: val,
        format: (value) => formatCurrency({ value, currency: unitCost.currency }).display,
      };
    },
    estimatedNYearsReturn() {
      const { unitCost } = this.data;
      const val = unitCost.value * this.calculatorInput * this.avgYieldRate * this.projectDuration();
      return {
        value: val,
        format: (value) => formatCurrency({ value, currency: unitCost.currency }).display,
      };
    },
    estimatedYieldRate() {
      const val = this.avgYieldRate;
      return {
        value: val,
        format: (v) => formatDisplayVal(v, this.percentageFormat),
      };
    },
    estimatedCarbonReduction() {
      const val = this.calculatorInput * this.carbonPerKg;
      return {
        value: val,
        format: (v) => formatDisplayVal(v, this.weightFormat),
      };
    },
    projectDuration() {
      const duration = getProjectDuration(this.data);
      return duration.value;
    },
    estimatedYearReturn(yieldRate) {
      const { unitCost } = this.data;
      const val = yieldRate * unitCost.value * this.calculatorInput;
      return {
        value: val,
        format: (value) => formatCurrency({ value, currency: unitCost.currency }).display,
      };
    },
    renderValue(data, field) {
      const { key, getValue, config = {} } = field;
      const value = get(data, key);

      return getValue
        ? getValue(value)
        : {
            value,
            format: (v) => formatDisplayVal(v, config),
          };
    },
  },
};
</script>

<style scoped>
.slider >>> .v-slider--horizontal .v-slider__track-container {
  height: 5px;
}
.slider >>> .v-slider__track-background {
  border-radius: 2.5px;
}
.slider >>> .v-slider__track-fill {
  border-radius: 2.5px;
}
</style>
