<template>
  <div>
    <div class="text-subheading primary--text ml-2 mt-3 mb-5">General</div>
    <dynamic-input :input="input" :fields="fields" :disabled="closedExpense"></dynamic-input>

    <div class="text-subheading primary--text ml-2 mt-3 mb-2">Expense Allocations</div>
    <v-row>
      <v-col v-for="item in input.expenses" v-bind:key="item.key" cols="12">
        <v-card class="px-5 py-3 rounded-xl d-flex justify-space-between align-center">
          <div @click="setEditAction(item)" :class="!closedExpense && 'cursor-pointer'">
            <div class="text-subheading">{{ currencyDisplay(item.value) }} ({{ distributionTypeDisplay(item) }})</div>
            <div class="text-hint bg-grey--text">{{ accountList.find((c) => c.value === item.account).text }}</div>
          </div>

          <v-hover v-if="!closedExpense" v-slot="{ hover }">
            <v-btn @click="setDeleteAction(item)" icon class="mx-2">
              <v-icon :class="{ 'on-hover': hover }" :color="hover ? 'error' : 'bg-light'"> mdi-delete </v-icon>
            </v-btn>
          </v-hover>
        </v-card>
      </v-col>

      <v-col v-if="!closedExpense">
        <action-panel v-if="showSetDefault || accountListFiltered.length > 0" class="pa-5 rounded-xl bg-light">
          <div v-if="showSetDefault || project.expenseAllocations.length !== data.expenses.length">
            <btn-main @click="$emit('set-default')" color="primary">Reset default</btn-main>
          </div>
          <div v-if="accountListFiltered.length > 0">
            <btn-main @click="setAddAction" color="primary">New item</btn-main>
          </div>
        </action-panel>
      </v-col>
    </v-row>

    <general-dialog
      v-model="dialogProps.show"
      :text="dialogProps.text"
      :status="dialogProps.status"
      @close="clearData"
      max-width="500"
    >
      <template #header>{{ dialogTitle }}</template>

      <template #body>
        <v-form
          v-if="dialogTitle && !dialogTitle.includes('Delete')"
          ref="form"
          v-model="valid"
          class="text-left"
          lazy-validation
        >
          <div v-if="accountListFiltered.length === 0" class="text-body error--text text-center">
            All expense accounts are applied.
          </div>
          <v-row v-else dense>
            <v-col cols="12">
              <v-autocomplete
                v-model="dialogInput.account"
                :items="accountListFiltered"
                :rules="[requiredRule]"
                :disabled="loading || closedExpense"
                label="Code"
                validate-on-blur
                filled
                rounded
                dense
                required
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="dialogInput.value"
                :rules="[requiredRule, moneyRule]"
                :disabled="loading || closedExpense"
                label="Value"
                type="number"
                validate-on-blur
                filled
                rounded
                dense
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <div v-else class="text-body text-center">Action: <b>Delete an expense record</b></div>
      </template>

      <template #actions>
        <btn-main
          v-if="accountListFiltered.length > 0"
          @click="dialogProps.action"
          :loading="dialogLoading"
          color="primary"
        >
          Submit
        </btn-main>
      </template>
    </general-dialog>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import { mapActions } from 'vuex';
import accounts from '@/constants/finance/accounts';
import currencyList from '@/constants/finance/currencyList.json';
import dialog from '@/mixins/dialog';
import v from '@/utils/validations';
import { round } from '@/utils';
import { formatDisplayVal, formatCurrency } from '@/utils/formats';
import DynamicInput from '@/components/FormInput/DynamicInput.vue';

export default {
  name: 'ExpenseForm',
  components: {
    DynamicInput,
  },
  props: {
    data: { type: Object, required: true },
    input: { type: Object, required: true },
    project: { type: Object, required: true },
    list: { type: Object, required: true },
    loading: { type: Boolean, default: false },
  },
  mixins: [dialog],
  data() {
    return {
      valid: true,
      error: null,
      dialogTitle: null,
      dialogLoading: false,
      dialogInput: {
        account: null,
        value: null,
      },
      requiredRule: v.required(),
      moneyRule: v.money(),
    };
  },
  computed: {
    closedExpense() {
      return this.data.status === 'closed';
    },
    fields() {
      return [
        {
          key: 'date',
          component: 'datepicker',
          cols: '6',
          props: {
            type: 'month',
            label: 'Expense date',
            readonly: true,
          },
        },
        {
          key: 'status',
          component: 'v-select',
          cols: '6',
          props: {
            label: 'Status',
            items: [
              { text: 'Open', value: 'open' },
              { text: 'Closed', value: 'closed' },
            ],
            readonly: true,
          },
        },
        {
          key: 'projectGroupId',
          component: 'v-select',
          cols: '12',
          props: {
            label: 'Project Group',
            items: this.projectGroupList,
            readonly: true,
          },
        },
        {
          key: 'currency',
          component: 'v-select',
          cols: '12',
          props: {
            label: 'Currency',
            items: this.currencyList,
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
        },
        {
          key: 'remarks',
          component: 'v-textarea',
          props: {
            cols: '12',
            label: 'Remarks (if any)',
            rules: [v.maxLength({ len: 200 })],
            counter: 200,
          },
        },
      ];
    },
    showSetDefault() {
      return this.data.expenses.some((item) => this.distributionTypeDisplay(item) === 'custom');
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
    accountList() {
      return accounts;
    },
    accountListFiltered() {
      return accounts.filter((account) => {
        if (account.value.substring(0, 2) !== '11') return false;
        if (account.value === this.dialogInput.account) return true;
        return !this.input.expenses.map((x) => x.account).includes(account.value);
      });
    },
  },
  methods: {
    ...mapActions('expenses', ['updateExpense']),

    formatCurrency(value) {
      return formatCurrency({ value, currency: get(this.input, 'revenue.currency') });
    },
    currencyDisplay(value) {
      return value ? this.formatCurrency(value).display : '-';
    },
    distributionTypeDisplay(item) {
      const record = this.project.expenseAllocations.find((x) => x.account === item.account);
      if (record) {
        const { amount } = record;
        const { revenue } = this.input;
        if (amount.type === 'percentage' && round(revenue * amount.value, 2) === item.value)
          return `${formatDisplayVal(amount.value, { format: '0.0%' })} of revenue`;
        if (amount.type === 'fixed' && round(amount.value, 2) === item.value)
          return `${this.currencyDisplay(item.value)} fixed`;
      }
      return 'custom';
    },

    setAddAction() {
      this.dialogTitle = 'New expense allocation';
      this.dialogInput = {
        account: null,
        value: null,
      };
      this.setAction({
        name: null,
        handler: this.addExpenseAllocation,
      });
    },
    setEditAction(item) {
      if (!this.closedExpense) {
        this.dialogTitle = 'Edit expense allocation';
        this.dialogInput = cloneDeep(item);
        this.setAction({
          name: null,
          handler: this.updateExpenseAllocation,
        });
      }
    },
    setDeleteAction(item) {
      this.dialogTitle = 'Delete expense allocation';
      this.dialogInput = cloneDeep(item);
      this.setAction({
        name: null,
        handler: this.removeExpenseAllocation,
      });
    },
    clearData() {
      this.error = null;
      this.dialogInput = {
        account: null,
        value: null,
      };
      this.dialogAction = null;
      this.clearDialog();
    },
    validate() {
      this.valid = this.$refs.form.validate();
    },
    async addExpenseAllocation() {
      this.validate();
      if (this.valid) {
        const params = [...this.data.expenses, this.dialogInput];
        this.updateExpenseData(params);
      }
    },
    async updateExpenseAllocation() {
      this.validate();
      if (this.valid) {
        const params = [
          ...this.data.expenses.filter(({ account }) => account !== this.dialogInput.account),
          this.dialogInput,
        ];
        this.updateExpenseData(params);
      }
    },
    async removeExpenseAllocation() {
      const params = this.data.expenses.filter(({ account }) => account !== this.dialogInput.account);
      this.updateExpenseData(params);
    },
    async updateExpenseData(params) {
      try {
        this.dialogLoading = true;

        await this.updateExpense({
          id: this.$route.params.id,
          expenses: params,
        });

        this.dialogLoading = false;
        this.setActionSuccess('Updated expense allocation.');
      } catch (err) {
        this.dialogLoading = false;
        this.setActionError(err);
      }
    },
  },
};
</script>
