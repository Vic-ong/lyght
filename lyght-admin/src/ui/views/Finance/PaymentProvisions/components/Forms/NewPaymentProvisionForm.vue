<template>
  <div>
    <dynamic-input :input="input" :fields="fields"></dynamic-input>
  </div>
</template>

<script>
import dayjs from '@/services/dayjs';
import currencyList from '@/constants/finance/currencyList.json';
import { formatCurrency } from '@/utils/formats';
import v from '@/utils/validations';
import DynamicInput from '@/components/FormInput/DynamicInput.vue';

export default {
  name: 'NewPaymentProvisionForm',
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
            max: dayjs().add(3, 'month').format('YYYY-MM'),
            min: dayjs().format('YYYY-MM'),
            label: 'Expense date',
            rules: [v.required()],
          },
          listeners: {
            change: this.setPaymentDate,
          },
        },
        {
          key: 'paymentDate',
          component: 'datepicker',
          cols: '6',
          props: {
            max: dayjs(`${this.input.date}-15`).add(5, 'month').format('YYYY-MM-DD'),
            min: dayjs(`${this.input.date}-15`).add(3, 'month').format('YYYY-MM-DD'),
            label: 'Payment Date',
            rules: [v.required()],
          },
        },
        {
          key: 'projectId',
          component: 'v-select',
          cols: '6',
          props: {
            label: 'Project',
            items: this.projectList,
            rules: [v.required()],
          },
          listeners: {
            change: this.setProjectData,
          },
        },
        {
          key: 'projectGroupId',
          component: 'v-select',
          cols: '6',
          props: {
            label: 'Project Group',
            items: this.projectGroupList,
            readonly: true,
            rules: [v.required()],
          },
          show: !!this.input.projectId,
        },
        {
          key: 'divider-1',
          component: 'divider',
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
          key: 'expenseId',
          component: 'v-select',
          cols: '6',
          props: {
            label: 'Expense',
            items: this.expenseList,
            rules: [v.required()],
          },
          listeners: {
            change: this.setExpenseData,
          },
          show: !!this.input.projectId,
        },
        {
          key: 'revenue',
          component: 'v-text-field',
          cols: '6',
          props: {
            type: 'number',
            label: 'Revenue after expense deduction',
            readonly: true,
            rules: [v.required(), v.money()],
          },
          show: !!this.input.expenseId,
        },
        {
          key: 'valueAddedTax',
          component: 'v-text-field',
          cols: '6',
          props: {
            type: 'number',
            label: 'Value-added tax (VAT)',
            readonly: true,
            rules: [v.required(), v.money()],
          },
          show: !!this.input.expenseId,
        },
      ].filter((item) => item.show !== false);
    },

    expenseList() {
      return this.list.expenses
        .filter((expense) => expense.projectGroupId === this.input.projectGroupId)
        .map((item) => {
          const expenseAmount = formatCurrency({
            value: (item.revenue || 0) - (item.outstanding || 0),
            curreny: item.currency,
          });

          return {
            data: item,
            text: `${item.date} (${expenseAmount.display})`,
            value: item._id,
          };
        });
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
    currencyList() {
      return currencyList.map((item) => ({
        text: item.name,
        value: item.code,
      }));
    },
  },
  methods: {
    setProjectData(projectId) {
      const project = this.list.projects.find((item) => item._id === projectId);
      this.input.projectGroupId = project.projectGroupId;
      this.input.panelsTotal = project.panelsTotal;
    },
    setExpenseData(expenseId) {
      const { data } = this.expenseList.find((item) => item.value === expenseId);
      this.input.revenue = data.outstanding;
      this.input.valueAddedTax = data.valueAddedTax;
    },
    setPaymentDate() {
      const lastPaymentDate = dayjs(`${this.input.date}-28`).add(3, 'month').endOf('month');

      if (lastPaymentDate.get('day') === 0) {
        this.input.paymentDate = lastPaymentDate.subtract(2, 'day').format('YYYY-MM-DD');
      } else if (lastPaymentDate.get('day') === 6) {
        this.input.paymentDate = lastPaymentDate.subtract(1, 'day').format('YYYY-MM-DD');
      } else {
        this.input.paymentDate = lastPaymentDate.format('YYYY-MM-DD');
      }
    },
  },
};
</script>
