<template>
  <div>
    <dynamic-form-input
      :input="input"
      :fields="fields"
      :disabled="loading"
      :readonlyAll="readonlyAll"
    ></dynamic-form-input>
  </div>
</template>

<script>
import form from '@/utils/validation/form';
import nationalityList from '@/constants/nationalityList.json';
import { DynamicFormInput } from '@/components/FormInput';

export default {
  components: {
    DynamicFormInput,
  },
  props: {
    input: {
      type: Object,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    display: {
      type: Boolean,
      default: false,
    },
    readonlyAll: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    fields() {
      return [
        {
          key: 'firstName',
          component: 'v-text-field',
          cols: '6',
          labelKey: 'Field-FirstName',
          rules: [form.required(this.t)],
        },
        {
          key: 'lastName',
          component: 'v-text-field',
          cols: '6',
          labelKey: 'Field-LastName',
          rules: [form.required(this.t)],
        },
        {
          key: 'dob',
          component: 'datepicker',
          cols: '6',
          labelKey: 'Field-DateOfBirth',
          max: new Date(new Date().getTime() - 20 * 365 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
          min: new Date(new Date().getTime() - 100 * 365 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
          rules: [form.required(this.t)],
        },
        {
          key: 'usCitizenship',
          component: 'v-radio',
          cols: 12,
          labelKey: this.display === true ? 'Field-USCitizenshipDisplay' : 'Field-USCitizenship',
          items: [
            { labelKey: 'Field-Yes', value: true },
            { labelKey: 'Field-No', value: false },
          ],
          rules: [form.required(this.t)],
        },
        {
          key: 'idNumber',
          component: 'v-text-field',
          cols: 6,
          labelKey: 'Field-IDNumber',
          rules: [form.required(this.t)],
        },
        {
          key: 'nationality',
          component: 'v-select',
          cols: 6,
          labelKey: 'Field-Nationality',
          items: nationalityList,
          rules: [form.required(this.t)],
        },
      ];
    },
  },
  methods: {
    t(v, params) {
      return this.$t(v, params);
    },
  },
};
</script>
