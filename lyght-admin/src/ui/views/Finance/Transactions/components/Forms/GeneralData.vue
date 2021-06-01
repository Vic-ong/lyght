<template>
  <div>
    <div class="text-subheading primary--text ml-2 mt-3 mb-5">Payer</div>
    <dynamic-input :input="input.payer" :fields="accountFields"></dynamic-input>

    <div class="text-subheading primary--text ml-2 mt-3 mb-5">Recipient</div>
    <dynamic-input :input="input.recipient" :fields="accountFields"></dynamic-input>

    <div class="text-subheading primary--text ml-2 mt-3 mb-5">General</div>
    <dynamic-input :input="input" :fields="[amountField]"></dynamic-input>
    <dynamic-input :input="input" :fields="fields"></dynamic-input>
  </div>
</template>

<script>
import v from '@/utils/validations';
import accounts from '@/constants/finance/accounts';
import banks from '@/constants/banks/TW.json';
import DynamicInput from '@/components/FormInput/DynamicInputLegacy.vue';

export default {
  name: 'GeneralData',
  components: {
    DynamicInput,
  },
  props: {
    input: { type: Object, required: true },
    list: { type: Object, required: true },
  },
  computed: {
    fields() {
      return [
        {
          key: 'account',
          component: 'v-select',
          cols: '6',
          label: 'Account',
          items: accounts,
          rules: [v.required()],
        },
        {
          key: 'invoiceReferenceId',
          component: 'v-text-field',
          cols: '6',
          label: 'Invoice reference number',
        },
        {
          key: 'projectGroupId',
          component: 'v-select',
          cols: '6',
          label: 'Project Group',
          items: this.projectGroupList,
        },
        {
          key: 'projectId',
          component: 'v-select',
          cols: '6',
          label: 'Project',
          items: this.projectList,
        },
        {
          key: 'userId',
          component: 'v-select',
          cols: '6',
          label: 'User',
          items: this.userList,
        },
        {
          key: 'paymentProvisionId',
          component: 'v-text-field',
          cols: '6',
          label: 'Payment Provision ID',
        },
        {
          key: 'expenseId',
          component: 'v-text-field',
          cols: '6',
          label: 'Expense ID',
        },
        {
          key: 'remarks',
          component: 'v-textarea',
          cols: '12',
          label: 'Remarks (if any)',
          rules: [v.maxLength({ len: 200 })],
          counter: 200,
        },
      ].filter((item) => item.show !== false);
    },
    accountFields() {
      return [
        {
          key: 'accountNumber',
          component: 'v-text-field',
          cols: '12',
          label: 'Account Number',
          rules: [v.required()],
        },
        {
          key: 'bankCode',
          component: 'v-select',
          cols: '6',
          label: 'Bank',
          items: this.bankList,
          rules: [v.required()],
        },
        {
          key: 'accountName',
          component: 'v-text-field',
          cols: '6',
          label: 'Account Name',
          rules: [v.required()],
        },
      ];
    },
    amountField() {
      return {
        key: 'amount',
        component: 'currency',
        cols: '12',
        label: 'Amount',
        rules: [v.required()],
      };
    },

    userList() {
      return this.list.users.map((item) => ({
        text: `${item.firstName} ${item.lastName}`,
        value: item._id,
      }));
    },
    projectGroupList() {
      return this.list.projectGroups.map((item) => ({
        text: item.nameTrans.en,
        value: item._id,
      }));
    },
    projectList() {
      return this.list.projects.map((item) => ({
        text: item.nameTrans.en,
        value: item._id,
      }));
    },
    bankList() {
      return banks.map((item) => ({
        text: item.name,
        value: item.code,
      }));
    },
  },
  methods: {
    setEntityId(projectId) {
      this.input.entityId = this.list.projects.find((item) => item._id === projectId).entityId;
    },
  },
};
</script>
