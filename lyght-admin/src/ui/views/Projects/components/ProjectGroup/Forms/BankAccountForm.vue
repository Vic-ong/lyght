<template>
  <div>
    <dynamic-input :input="input" :fields="fields" :disabled="loading"></dynamic-input>
  </div>
</template>

<script>
import bankList from '@/constants/banks/TW.json';
import v from '@/utils/validations';
import DynamicInput from '@/components/FormInput/DynamicInput.vue';

export default {
  name: 'ProjectGroupForm',
  components: {
    DynamicInput,
  },
  props: {
    input: { type: Object, required: true },
    loading: { type: Boolean, default: false },
  },
  computed: {
    fields() {
      return [
        {
          key: 'bankCode',
          component: 'v-autocomplete',
          cols: '12',
          props: {
            label: 'Bank',
            items: this.bankList,
            rules: [v.required()],
          },
        },
        {
          key: 'accountName',
          component: 'v-text-field',
          cols: '6',
          props: {
            label: 'Account Name',
            rules: [v.required(), v.maxLength({ len: 30 })],
          },
        },
        {
          key: 'accountNumber',
          component: 'v-text-field',
          cols: '6',
          props: {
            label: 'Account Number',
            rules: [v.required(), v.maxLength({ len: 15 })],
          },
        },
      ];
    },

    bankList() {
      return bankList.map((item) => ({
        text: item.name,
        value: item.code,
      }));
    },
  },
};
</script>
