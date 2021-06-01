<template>
  <div>
    <dynamic-form-input :input="input" :fields="fields" :disabled="loading"></dynamic-form-input>
  </div>
</template>

<script>
import form from '@/utils/validation/form';
import { DynamicFormInput } from '@/components/FormInput';

export default {
  components: {
    DynamicFormInput,
  },
  props: ['input', 'loading'],
  computed: {
    fields() {
      return [
        {
          key: 'firstName',
          component: 'v-text-field',
          cols: '12',
          labelKey: 'Field-FirstName',
          rules: [form.required(this.t)],
          readonly: true,
        },
        {
          key: 'lastName',
          component: 'v-text-field',
          cols: '12',
          labelKey: 'Field-LastName',
          rules: [form.required(this.t)],
          readonly: true,
        },
        {
          key: 'displayName',
          component: 'v-text-field',
          cols: '12',
          labelKey: 'Field-DisplayName',
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
