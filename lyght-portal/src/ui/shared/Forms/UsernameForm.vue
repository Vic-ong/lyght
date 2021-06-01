<template>
  <div>
    <div v-if="hint === undefined || hint === true" class="text-hint pl-2 py-3 black--text">
      {{ $t('NewUser-Username') }}
    </div>
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
  props: ['input', 'loading', 'hint'],
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
          key: 'displayName',
          component: 'v-text-field',
          cols: '6',
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
