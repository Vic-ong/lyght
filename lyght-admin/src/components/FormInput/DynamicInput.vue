<template>
  <div>
    <v-row dense>
      <v-col
        v-for="{ key, component, props = {}, listeners = {}, cols } = {} in fields"
        v-bind:key="key"
        cols="12"
        :md="cols || '12'"
      >
        <v-divider v-if="component === 'divider'" class="mt-1 mb-6"></v-divider>

        <div v-else-if="component === 'datepicker'">
          <date-picker
            v-bind="props"
            :inputKey="key"
            :input="input"
            @change="(v) => (listeners.change ? listeners.change(v) : noop)"
            :loading="loading"
            :disabled="disabled"
          ></date-picker>
        </div>

        <component
          v-else-if="isTextField(component)"
          :is="component"
          v-bind="props"
          v-bind:value="get(input, key)"
          @input.native="setTextValue($event, { key, props, listeners })"
          :loading="loading"
          :disabled="disabled"
          validate-on-blur
          dense
          filled
          rounded
          required
        ></component>

        <component
          v-else-if="isSelectField(component)"
          :is="component"
          v-bind="props"
          v-bind:value="get(input, key)"
          @change="setSelectValue($event, { key, props, listeners })"
          :loading="loading"
          :disabled="disabled"
          validate-on-blur
          dense
          filled
          rounded
          required
        ></component>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import get from 'lodash/get';
import set from 'lodash/set';
import noop from 'lodash/noop';
import DatePicker from './Inputs/DatePicker.vue';
import CurrencyInput from './Inputs/CurrencyInput.vue';

export default {
  name: 'DynamicFormInput',
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
  },
  methods: {
    noop,
    get,

    isTextField(component) {
      return ['v-text-field', 'v-textarea'].includes(component);
    },
    isSelectField(component) {
      return ['v-select', 'v-autocomplete'].includes(component);
    },

    setTextValue($event, { key, props, listeners }) {
      const { type } = props;
      const { change } = listeners;

      let v = $event.target.value;

      if (type) {
        switch (type) {
          case 'number':
            v = Number(v);
            break;
          default:
            break;
        }
      }

      set(this.input, key, v);
      if (change) change(v);
    },
    setSelectValue(v, { key, listeners }) {
      const { change } = listeners;

      set(this.input, key, v);
      if (change) change(v);
    },
  },
};
</script>
