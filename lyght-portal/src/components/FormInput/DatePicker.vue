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
            readonly
            outlined
          ></v-text-field>
        </template>
        <v-date-picker ref="picker" v-model="datepickerInput" :max="max" :min="min" @change="saveDate"></v-date-picker>
      </v-menu>
    </template>
  </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
  name: 'DatePicker',
  props: {
    inputKey: { type: String, required: true },
    input: { type: Object, required: true },
    label: { type: String },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    min: { type: String, default: null },
    max: { type: String, default: null },
  },
  watch: {
    datepickerMenu(val) {
      val &&
        setTimeout(() => {
          this.$refs.picker.activePicker = 'YEAR';
        });
    },
  },
  mounted() {
    this.datepickerInput = this.input[this.inputKey]
      ? this.input[this.inputKey]
      : dayjs().subtract(30, 'year').format('YYYY-MM-DD');
  },
  data() {
    return {
      datepickerMenu: false,
      datepickerInput: null,
    };
  },
  methods: {
    saveDate(date) {
      this.input[this.inputKey] = date;
      this.$refs.datepickerMenu.save(date);
    },
  },
};
</script>
