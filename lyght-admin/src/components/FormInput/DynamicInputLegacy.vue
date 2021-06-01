<template>
  <div>
    <v-row dense>
      <v-col
        v-for="{
          component,
          type,
          key,
          cols,
          label,
          min,
          max,
          placeholder,
          prefix,
          suffix,
          items,
          renderItems,
          onChange,
          rules,
          counter,
          readonly,
          hideDetails,
        } in fields"
        v-bind:key="key"
        cols="12"
        :md="cols"
      >
        <div v-if="component === 'v-select'">
          <v-autocomplete
            v-model="input[key]"
            :label="label"
            :rules="rules"
            :items="renderItems ? renderItems(computedItems[key]) : items"
            :loading="loading"
            :disabled="disabled"
            :readonly="readonlyAll || readonly"
            :hide-details="hideDetails === true"
            @change="(v) => (onChange ? onChange(v) : noop())"
            validate-on-blur
            dense
            filled
            rounded
            required
          ></v-autocomplete>
        </div>

        <div v-else-if="component === 'v-textarea'">
          <v-textarea
            v-model="input[key]"
            :label="label"
            :rules="rules"
            :loading="loading"
            :disabled="disabled"
            :readonly="readonlyAll || readonly"
            :hide-details="hideDetails === true"
            :counter="counter"
            validate-on-blur
            dense
            filled
            rounded
            required
          ></v-textarea>
        </div>

        <div v-else-if="component === 'v-radio'">
          <div class="text-body black--text">{{ label }}</div>
          <v-radio-group v-model="input[key]" mandatory row>
            <v-radio v-for="item in items" v-bind:key="item.value" :label="item.label" :value="item.value"></v-radio>
          </v-radio-group>
        </div>

        <div v-else-if="component === 'datepicker'">
          <date-picker
            :inputKey="key"
            :input="input"
            :label="label"
            :type="type"
            :min="min"
            :max="max"
            :loading="loading"
            :disabled="readonlyAll || disabled"
            @change="(v) => (onChange ? onChange(v) : noop())"
          ></date-picker>
        </div>

        <div v-else-if="component === 'currency'">
          <currency-input
            :data="input[key]"
            :label="label"
            :placeholder="placeholder"
            :rules="rules"
            :loading="loading"
            :disabled="disabled"
            :readonly="readonlyAll || readonly"
            :hide-details="hideDetails === true"
          ></currency-input>
        </div>

        <div v-else-if="component === 'v-text-field'">
          <v-text-field
            v-model="input[key]"
            :type="type"
            :label="label"
            :placeholder="placeholder"
            :prefix="prefix"
            :suffix="suffix"
            :rules="rules"
            :loading="loading"
            :disabled="disabled"
            :readonly="readonlyAll || readonly"
            :hide-details="hideDetails === true"
            @change="(v) => (onChange ? onChange(v) : noop())"
            validate-on-blur
            dense
            filled
            rounded
            required
          ></v-text-field>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import noop from 'lodash/noop';
import DatePicker from './Inputs/DatePickerLegacy.vue';
import CurrencyInput from './Inputs/CurrencyInput.vue';

export default {
  name: 'DynamicFormInputLegacy',
  components: {
    DatePicker,
    CurrencyInput,
  },
  props: {
    input: {
      type: Object,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonlyAll: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    noop,
  },
};
</script>
