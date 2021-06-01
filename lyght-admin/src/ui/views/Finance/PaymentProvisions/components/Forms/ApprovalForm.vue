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
            Provision payments
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
      <div v-if="dialogProps.text === 'Provision payments'" class="text-hint bg-grey--text mt-5">
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

export default {
  props: {
    data: { type: Object, required: true },
    projectGroup: { type: Object, required: true },
    userAssets: { type: Array, required: true },
  },
  mixins: [dialog],
  data() {
    return {
      valid: true,
      loading: false,
      approvalsRequired: 3,
      actionDescription:
        'This record will be locked to prevent future changes and a transaction record will be created for each payment.',
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
    ...mapActions('paymentProvisions', ['updatePaymentProvision', 'provisionPayments']),
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
        name: 'Provision payments',
        handler: this.provisionPaymentsHandler,
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

        await this.updatePaymentProvision({
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

        await this.updatePaymentProvision({
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
    async provisionPaymentsHandler() {
      try {
        this.loading = true;

        const { id } = this.$route.params;
        const { currency, projectId, projectGroupId } = this.data;

        const baseTransactionParams = {
          debit: false,
          projectId,
          projectGroupId,
          paymentProvisionId: id,
          status: 'open',
        };

        const reducer = (acc, curr) => {
          const userAsset = this.userAssets.find((asset) => asset._id === curr._id);

          if (!userAsset) {
            throw new Error(`Unable to find user asset ${curr._id}.`);
          }
          if (!userAsset.bankAccount) {
            throw new Error(`Missing bank account in user asset ${curr._id}.`);
          }

          // Rental payment
          // TODO: add upcoming revenue
          acc.userAssets.push({
            id: curr._id,
            revenueTotal: {
              currency,
              valueIncrement: curr.revenue,
            },
            revenueLatest: {
              currency,
              value: curr.revenue,
            },
          });

          acc.transactions.push({
            ...baseTransactionParams,
            userId: curr.userId,
            amount: {
              currency,
              value: curr.revenue,
            },
            account: '1001',
            payer: this.projectGroup.primary_account,
            recipient: userAsset.bankAccount,
          });

          // Service tax delegate
          if (Number(curr.tax) > 0) {
            acc.transactions.push({
              ...baseTransactionParams,
              userId: curr.userId,
              amount: {
                currency,
                value: curr.tax,
              },
              account: '2000',
              payer: this.projectGroup.cost_account,
              recipient: userAsset.bankAccount,
            });
          }

          return acc;
        };

        const params = this.data.distributions.reduce(reducer, {
          id,
          transactions: [],
          userAssets: [],
        });

        await this.provisionPayments(params);

        this.loading = false;
        this.setActionSuccess('Successfully provisioned the payments!');
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
    },
  },
};
</script>
