<template>
  <div>
    <v-row no-gutters>
      <v-col
        v-for="{
          component,
          type,
          key,
          cols,
          label,
          labelKey,
          min,
          max,
          placeholder,
          placeholderKey,
          prefix,
          suffix,
          items,
          renderItems,
          onChange,
          rules,
          readonly,
        } in fields"
        v-bind:key="key"
        cols="12"
        :md="cols"
        class="px-2"
      >
        <div v-if="component === 'v-select'">
          <v-autocomplete
            v-model="input[key]"
            :label="labelKey ? $t(labelKey) : label"
            :rules="rules"
            :items="renderItems ? renderItems(computedItems[key]) : items"
            :loading="loading"
            :disabled="disabled"
            :readonly="readonlyAll || readonly"
            @change="(v) => (onChange ? onChange(v) : noop())"
            validate-on-blur
            outlined
            required
          ></v-autocomplete>
        </div>
        <div v-else-if="component === 'v-textarea'">
          <v-textarea
            v-model="input[key]"
            :label="labelKey ? $t(labelKey) : label"
            :rules="rules"
            :loading="loading"
            :disabled="disabled"
            :readonly="readonlyAll || readonly"
            validate-on-blur
            outlined
            required
          ></v-textarea>
        </div>
        <div v-else-if="component === 'v-radio'">
          <div class="text-body black--text">{{ labelKey ? $t(labelKey) : label }}</div>
          <v-radio-group v-model="input[key]" mandatory row>
            <v-radio
              v-for="item in items"
              v-bind:key="item.value"
              :label="item.labelKey ? $t(item.labelKey) : item.label"
              :value="item.value"
            ></v-radio>
          </v-radio-group>
        </div>
        <div v-else-if="component === 'datepicker'">
          <DatePicker
            :inputKey="key"
            :input="input"
            :label="labelKey ? $t(labelKey) : label"
            :min="min"
            :max="max"
            :loading="loading"
            :disabled="readonlyAll || disabled"
          ></DatePicker>
        </div>
        <div v-else>
          <v-text-field
            v-model="input[key]"
            :type="type"
            :label="labelKey ? $t(labelKey) : label"
            :placeholder="placeholderKey ? $t(placeholderKey) : placeholder"
            :prefix="prefix"
            :suffix="suffix"
            :rules="rules"
            :loading="loading"
            :disabled="disabled"
            :readonly="readonlyAll || readonly"
            validate-on-blur
            outlined
            required
          ></v-text-field>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import noop from 'lodash/noop';
import DatePicker from './DatePicker.vue';

export default {
  name: 'DynamicFormInput',
  components: {
    DatePicker,
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
    computedItems: {
      type: Object,
      default: null,
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
  computed: {
    isXs() {
      return this.$vuetify.breakpoint.xs;
    },
  },
  methods: {
    noop,
  },
};
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
}
</style>
