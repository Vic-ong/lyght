<template>
  <div>
    <template>
      <v-menu
        ref="datepickerMenu"
        v-model="datepickerMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        nudge-top="20"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="input[inputKey]"
            :label="label"
            :loading="loading"
            :disabled="disabled"
            v-on="on"
            v-bind="attrs"
            validate-on-blur
            dense
            filled
            rounded
            readonly
          ></v-text-field>
        </template>
        <v-date-picker
          ref="picker"
          :type="type"
          v-model="input[inputKey]"
          :max="max"
          :min="min"
          @change="saveDate"
        ></v-date-picker>
      </v-menu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'DatePickerLegacy',
  props: {
    inputKey: { type: String, required: true },
    input: { type: Object, required: true },
    label: { type: String },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    type: { type: String },
    min: { type: String, default: null },
    max: { type: String, default: null },
  },
  data() {
    return {
      datepickerMenu: false,
    };
  },
  methods: {
    saveDate(date) {
      this.$refs.datepickerMenu.save(date);
      this.$emit('change', date);
    },
  },
};
</script>
