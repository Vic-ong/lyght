<template>
  <div>
    <dynamic-input :input="input" :fields="fields"></dynamic-input>
  </div>
</template>

<script>
import currencyList from '@/constants/finance/currencyList.json';
import v from '@/utils/validations';
import DynamicInput from '@/components/FormInput/DynamicInput.vue';

export default {
  name: 'NewExpenseForm',
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
          key: 'date',
          component: 'datepicker',
          cols: '6',
          props: {
            type: 'month',
            max: new Date(new Date().getTime() + 4 * 31 * 24 * 60 * 60 * 1000).toISOString().substr(0, 7),
            min: new Date(new Date().getTime()).toISOString().substr(0, 7),
            label: 'Expense date',
            rules: [v.required()],
          },
        },
        {
          key: 'currency',
          component: 'v-select',
          cols: '6',
          props: {
            label: 'Currency',
            items: this.currencyList,
            rules: [v.required()],
          },
        },
        {
          key: 'projectGroupId',
          component: 'v-select',
          cols: '12',
          props: {
            label: 'Project Group',
            items: this.projectGroupList,
            rules: [v.required()],
          },
        },
        {
          key: 'revenue',
          component: 'v-text-field',
          cols: '6',
          props: {
            type: 'number',
            label: 'Revenue',
            rules: [v.required(), v.money()],
          },
          show: !!this.input.projectGroupId,
        },
        {
          key: 'valueAddedTax',
          component: 'v-text-field',
          cols: '6',
          props: {
            type: 'number',
            label: 'Value-added tax (VAT)',
            rules: [v.required(), v.money()],
          },
          show: !!this.input.projectGroupId,
        },
      ].filter((item) => item.show !== false);
    },

    projectGroupList() {
      return this.list.projectGroups.map((item) => ({
        text: item.nameTrans.en,
        value: item._id,
      }));
    },
    currencyList() {
      return currencyList.map((item) => ({
        text: item.name,
        value: item.code,
      }));
    },
  },
};
</script>
