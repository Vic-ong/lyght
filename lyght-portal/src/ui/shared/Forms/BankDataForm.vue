<template>
  <div>
    <dynamic-form-input :input="input" :fields="fields" :disabled="loading"></dynamic-form-input>
  </div>
</template>

<script>
import form from '@/utils/validation/form';
import twBankList from '@/constants/banks/TW.json';
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
          component: 'v-select',
          cols: '7',
          key: 'bankName',
          labelKey: 'Field-BankName',
          items: twBankList.map(({ name }) => name),
          onChange: (v) => {
            this.input.bankCode = twBankList.find(({ name }) => name === v).code;
          },
          rules: [form.required(this.t)],
        },
        {
          component: 'v-select',
          cols: '5',
          key: 'bankCode',
          labelKey: 'Field-BankCode',
          items: twBankList.map(({ code }) => code),
          onChange: (v) => {
            this.input.bankName = twBankList.find(({ code }) => code === v).name;
          },
          rules: [form.required(this.t), form.number(this.t)],
        },
        {
          component: 'v-text-field',
          cols: '7',
          key: 'bankBranchName',
          labelKey: 'Field-BankBranchName',
          rules: [form.required(this.t)],
        },
        {
          component: 'v-text-field',
          cols: '5',
          key: 'accountNumber',
          labelKey: 'Field-BankAccountNumber',
          rules: [form.required(this.t), form.number(this.t)],
        },
        {
          component: 'v-text-field',
          cols: '12',
          key: 'accountName',
          labelKey: 'Field-BankAccountName',
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
