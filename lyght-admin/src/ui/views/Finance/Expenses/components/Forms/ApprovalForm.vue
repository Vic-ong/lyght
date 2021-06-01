<template>
  <div>
    <div v-if="hasApproved" class="py-2">
      <action-panel class="pa-5 rounded-xl bg-light">
        <div class="d-flex text-body">
          <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
          You've approved this expense.
        </div>
      </action-panel>
    </div>

    <div v-if="data.approvedBy.length > 0" class="pb-2">
      <div class="text-subheading primary--text ml-2 mt-3 mb-5">Approved by:</div>
      <v-row>
        <v-col v-for="item in data.approvedBy" v-bind:key="item._id" cols="12">
          <v-card class="px-5 py-3 rounded-xl d-flex align-center justify-space-between">
            <div>
              <div class="text-subheading">{{ item.name }}</div>
              <div class="text-hint bg-grey--text">{{ formatDate(item.date) }}</div>
            </div>

            <btn-main
              v-if="item._id === user.data._id && !closedExpense"
              color="error"
              @click="setRemoveApprovalAction"
              text
            >
              Disapprove
            </btn-main>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div v-if="!hasApproved && !hasRequiredApprovals && !closedExpense" class="py-2">
      <action-panel class="pa-5 rounded-xl bg-light">
        <div class="text-center">
          <div v-if="data.approvedBy.length === 0" class="text-body mb-3">No approval yet.</div>
          <btn-main @click="setAddApprovalAction" color="primary">Approve</btn-main>
        </div>
      </action-panel>
    </div>

    <action-panel v-if="!closedExpense" class="text-center pt-10">
      <div>
        <div>
          <btn-main @click="setSubmitAction" :disabled="!hasRequiredApprovals" color="primary">
            Submit Expenses
          </btn-main>
          <div v-if="!hasRequiredApprovals" class="text-hint primary--text mt-2">Require 3 approvals to submit</div>
        </div>

        <div class="mt-10">
          <div>// temporary</div>
          <btn-main @click="setSubmitAction" color="primary"> Submit Expenses </btn-main>
        </div>
      </div>
    </action-panel>

    <action-dialog
      v-model="dialogProps.show"
      :data="dialogProps"
      :loading="loading"
      @submit="dialogProps.action"
      @close="clearDialog"
    >
      Action: <b>{{ dialogProps.text }}</b>
      <div v-if="dialogProps.text === 'Submit expenses'" class="text-hint bg-grey--text mt-5">
        {{ actionDescription }}
      </div>
    </action-dialog>
  </div>
</template>

<script>
import get from 'lodash/get';
import { mapGetters, mapActions } from 'vuex';
import dialog from '@/mixins/dialog';
import { formatDate } from '@/utils/date';
import { asyncForEach } from '@/utils';

export default {
  props: {
    input: { type: Object, required: true },
    data: { type: Object, required: true },
    project: { type: Object, required: true },
  },
  mixins: [dialog],
  data() {
    return {
      valid: true,
      loading: false,
      approvalsRequired: 3,
      actionDescription:
        'This record will be locked to prevent future changes and a transaction record will be created for each expense.',
    };
  },
  computed: {
    ...mapGetters('users', ['user']),

    closedExpense() {
      return this.data.status === 'closed';
    },
    hasApproved() {
      return this.data.approvedBy.some(({ _id }) => _id === get(this.user, 'data._id'));
    },
    hasRequiredApprovals() {
      return this.data.approvedBy.length >= this.approvalsRequired;
    },
  },
  methods: {
    ...mapActions('expenses', ['updateExpense']),
    ...mapActions('transactions', ['createTransaction']),

    formatDate,
    setAddApprovalAction() {
      this.setAction({
        name: 'Add approval',
        handler: this.addApproval,
      });
    },
    setRemoveApprovalAction() {
      this.setAction({
        name: 'Cancel approval',
        handler: this.removeApproval,
      });
    },
    setSubmitAction() {
      this.setAction({
        name: 'Submit expenses',
        handler: this.submitExpenses,
      });
    },

    async addApproval() {
      try {
        this.loading = true;

        const d = new Date();
        const params = [
          ...this.data.approvedBy,
          {
            _id: get(this.user, 'data._id'),
            name: get(this.user, 'data.displayName'),
            date: d.toISOString(),
          },
        ];

        await this.updateExpense({
          id: this.$route.params.id,
          approvedBy: params,
        });

        this.loading = false;
        this.setActionSuccess('Added approval.');
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
    },
    async removeApproval() {
      try {
        this.loading = true;
        const params = this.data.approvedBy.filter(({ _id }) => _id !== get(this.user, 'data._id'));

        await this.updateExpense({
          id: this.$route.params.id,
          approvedBy: params,
        });

        this.loading = false;
        this.setActionSuccess('Cancelled approval.');
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
    },
    async submitExpenses() {
      try {
        this.loading = true;

        await this.updateExpense({
          id: this.$route.params.id,
          ...this.input,
          status: 'closed',
        });
        await this.createExpenseTransactions();

        this.loading = false;
        this.setActionSuccess('Submitted expenses.');
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
    },
    async createExpenseTransactions() {
      const { id } = this.$route.params;
      const { currency, projectId, projectGroupId } = this.input;

      const baseParams = {
        debit: true,
        projectId,
        projectGroupId,
        expenseId: id,
        status: 'open',
      };

      await asyncForEach(this.data.expenses, async (item) => {
        const params = {
          ...baseParams,
          amount: {
            currency,
            value: item.value,
          },
          account: item.account,
          payer: this.project.bankAccount.primary_account,
          recipient: this.project.bankAccount.cost_account,
        };
        await this.createTransaction(params);
      });

      // SPV VAT
      await this.createTransaction({
        ...baseParams,
        amount: {
          currency,
          value: this.input.valueAddedTax,
        },
        account: '2000',
        payer: this.project.bankAccount.primary_account,
        recipient: this.project.bankAccount.cost_account,
      });

      // SPV Cash
      await this.createTransaction({
        ...baseParams,
        amount: {
          currency,
          value: this.input.outstanding,
        },
        account: '1001',
        payer: this.project.bankAccount.primary_account,
        recipient: this.project.bankAccount.cost_account,
      });
    },
  },
};
</script>
