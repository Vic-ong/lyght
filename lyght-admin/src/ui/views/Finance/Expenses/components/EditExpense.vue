<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-row>
      <!-- Main view -->
      <v-col :order="$vuetify.breakpoint.lgAndUp ? 1 : 2" cols="12" lg="8">
        <v-card :height="tabHeight" class="transparent" flat>
          <v-tabs v-model="tab" class="tabs-container" grow show-arrows>
            <v-tabs-slider color="primary"></v-tabs-slider>
            <v-tab v-for="item in tabs" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>
        </v-card>

        <v-card :height="formHeight" class="rounded-lg overflow-y-auto pa-5">
          <transition name="transition-fade" mode="out-in">
            <div v-if="tab === 0" key="general">
              <expense-form
                @set-default="setDefaultAction"
                :input="input"
                :data="data"
                :project="project"
                :list="list"
                :loading="loading"
              ></expense-form>
            </div>

            <div v-if="tab === 1" key="approval">
              <approval-form :input="input" :data="data" :project="project"></approval-form>
            </div>
          </transition>
        </v-card>
      </v-col>

      <!-- Summary -->
      <v-col :order="$vuetify.breakpoint.lgAndUp ? 2 : 1" cols="12" lg="4">
        <side-panel :input="input" :data="data" :project="project">
          <action-panel>
            <div v-for="item in actionButtons" v-bind:key="item.name">
              <btn-main
                @click="item.handler ? item.handler() : setAction(item.action)"
                :color="item.color"
                :disabled="item.disabled"
              >
                {{ item.name }}
              </btn-main>
            </div>
          </action-panel>
        </side-panel>
      </v-col>
    </v-row>

    <action-dialog
      v-model="dialogProps.show"
      :data="dialogProps"
      :loading="loading"
      @submit="dialogProps.action"
      @close="clearDialog"
    >
      Action: <b>{{ dialogProps.text }}</b>
    </action-dialog>
  </v-form>
</template>

<script>
import get from 'lodash/get';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import { mapActions } from 'vuex';
import dialog from '@/mixins/dialog';
import { round } from '@/utils';
import { appHeaderProps, pageContainerProps } from '@/ui/shared/Layouts/props';
import SidePanel from './Forms/SidePanel.vue';
import ExpenseForm from './Forms/ExpenseForm.vue';
import ApprovalForm from './Forms/ApprovalForm.vue';

export default {
  name: 'EditExpense',
  components: {
    SidePanel,
    ExpenseForm,
    ApprovalForm,
  },
  props: {
    data: { type: Object, required: true },
    project: { type: Object, required: true },
    list: { type: Object, required: true },
  },
  mixins: [dialog],
  data() {
    return {
      valid: true,
      loading: false,
      initialized: false,
      inputChanged: false,
      input: {
        date: null,
        projectGroupId: null,
        currency: null,
        revenue: null,
        outstanding: null,
        valueAddedTax: null,
        expenses: [],
        approvedBy: [],
        remarks: null,
        status: null,
      },
      tab: null,
      tabs: ['Expenses', 'Approvals'],
    };
  },
  mounted() {
    this.initialize();
  },
  watch: {
    data: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
    input: {
      handler() {
        if (this.initialized && !this.inputChanged) {
          this.inputChanged = true;
        }
        this.calcOutstanding();
      },
      deep: true,
    },
  },
  computed: {
    layoutHeight() {
      const appHeader = appHeaderProps(this.$vuetify.breakpoint);
      const pageContainer = pageContainerProps(this.$vuetify.breakpoint);
      return appHeader.height + pageContainer.header.height;
    },
    tabHeight() {
      return 60;
    },
    formHeight() {
      return `calc(100vh - ${this.tabHeight + 15}px - ${this.layoutHeight}px)`;
    },
    closedExpense() {
      return this.data.status === 'closed';
    },
    actionButtons() {
      return [
        {
          name: 'Save',
          color: 'primary',
          disabled: this.closedExpense,
          handler: this.setUpdateAction,
        },
        {
          name: 'Reset',
          disabled: !this.inputChanged || this.closedExpense,
          color: 'secondary',
          handler: this.initialize,
        },
      ];
    },
  },
  methods: {
    ...mapActions('expenses', ['updateExpense']),

    initialize() {
      const d = cloneDeep(this.data);

      Object.keys(this.input).forEach((field) => {
        const data = get(d, field);
        if (this.hasValue(data)) set(this.input, field, data);
      });

      this.$nextTick(() => {
        this.initialized = true;
        this.inputChanged = false;
      });
    },
    calcOutstanding() {
      const allocations = get(this.project, 'expenseAllocations');

      if (allocations) {
        let sum = 0;
        const { revenue } = this.input;

        this.input.expenses.forEach(({ value }) => {
          sum += value;
        });

        this.input.outstanding = revenue - sum;
      }
    },
    hasValue(v) {
      return !!v || v === 0 || v === false;
    },
    validate() {
      this.valid = this.$refs.form.validate();
    },
    setDefaultAction() {
      this.setAction({
        name: 'Set default expense data',
        handler: this.setDefaultAllocations,
      });
    },
    setUpdateAction() {
      this.validate();
      if (this.valid) {
        this.setAction({
          name: 'Update expense data',
          handler: this.updateExpenseData,
        });
      }
    },
    async updateExpenseData() {
      try {
        this.loading = true;

        const params = {
          id: this.$route.params.id,
          ...this.input,
        };
        const res = await this.updateExpense(params);

        this.setActionSuccess(res.message);
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
    },
    setDefaultAllocations() {
      const { expenseAllocations } = this.project;
      if (expenseAllocations.length > 0) {
        expenseAllocations.forEach(({ amount, account }) => {
          const recordIndex = this.data.expenses.findIndex((item) => item.account === account);
          const { revenue } = this.input;
          const { type, value } = amount;
          const expenseItem = {
            account,
            value: type === 'percentage' ? round(value * revenue, 2) : round(value, 2),
          };

          if (recordIndex > -1) {
            this.input.expenses[recordIndex] = expenseItem;
          } else {
            this.input.expenses.push(expenseItem);
          }
        });
        this.updateExpenseData();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs-container ::v-deep {
  .v-tabs-bar {
    background-color: transparent !important;
  }
}
</style>
