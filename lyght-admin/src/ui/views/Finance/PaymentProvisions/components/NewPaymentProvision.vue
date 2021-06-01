<template>
  <div>
    <btn-main @click="setCreateAction" color="primary">
      New Payment
      <v-icon class="ml-2">mdi-plus-circle</v-icon>
    </btn-main>

    <general-dialog
      v-model="dialogProps.show"
      :text="dialogProps.text"
      :status="dialogProps.status"
      @close="clearData"
      max-width="700"
    >
      <template #header>New Payment Provision</template>

      <template #body>
        <v-form ref="form" v-model="valid" class="text-left" lazy-validation>
          <new-payment-provision-form :input="input" :list="list" :loading="loading"></new-payment-provision-form>
        </v-form>
      </template>

      <template #actions>
        <btn-main @click="submitHandler" :loading="loading" color="primary">Submit</btn-main>
      </template>
    </general-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import dialog from '@/mixins/dialog';
import dayjs from '@/services/dayjs';
import NewPaymentProvisionForm from './Forms/NewPaymentProvisionForm.vue';

export default {
  components: {
    NewPaymentProvisionForm,
  },
  props: {
    list: { type: Object, required: true },
  },
  mixins: [dialog],
  data() {
    return {
      valid: true,
      loading: false,
      router: {
        id: null,
        projectId: null,
      },
      input: {
        date: new Date(new Date().getTime()).toISOString().substr(0, 7),
        paymentDate: null,
        projectId: null,
        projectGroupId: null,
        expenseId: null,
        currency: 'TWD',
        revenue: null,
        outstanding: null,
        valueAddedTax: null,
        panelsTotal: 0,
        payoutDate: null,
        approvedBy: [],
        remarks: null,
        status: 'open',
      },
    };
  },
  methods: {
    ...mapActions('paymentProvisions', ['createPaymentProvision', 'createDistribution']),

    setCreateAction() {
      const lastPaymentDate = dayjs().add(3, 'month').endOf('month');

      if (lastPaymentDate.get('day') === 0) {
        this.input.paymentDate = lastPaymentDate.subtract(2, 'day').format('YYYY-MM-DD');
      } else if (lastPaymentDate.get('day') === 6) {
        this.input.paymentDate = lastPaymentDate.subtract(1, 'day').format('YYYY-MM-DD');
      } else {
        this.input.paymentDate = lastPaymentDate.format('YYYY-MM-DD');
      }

      this.setAction({
        name: null,
        handler: this.submitHandler,
      });
    },
    clearData() {
      this.input = {
        date: new Date(new Date().getTime()).toISOString().substr(0, 7),
        paymentDate: null,
        projectId: null,
        projectGroupId: null,
        expenseId: null,
        currency: 'TWD',
        revenue: null,
        outstanding: null,
        valueAddedTax: null,
        panelsTotal: 0,
        payoutDate: null,
        approvedBy: [],
        remarks: null,
        status: 'open',
      };
      this.clearDialog();

      if (this.router.id) {
        this.$router.push({
          name: 'finance/payment-provisions/:id',
          params: { id: this.router.id },
          query: {
            project: this.router.projectId,
            projectGroup: this.router.projectGroupId,
          },
        });
      }
    },
    validate() {
      this.valid = this.$refs.form.validate();
    },
    async submitHandler() {
      this.validate();
      if (this.valid) {
        try {
          this.loading = true;

          const res = await this.createPaymentProvision(this.input);

          this.router = {
            id: res.id,
            projectId: this.input.projectId,
            projectGroupId: this.input.projectGroupId,
          };

          this.loading = false;
          this.setActionSuccess(res.message);
        } catch (err) {
          this.loading = false;
          this.setActionError(err);
        }
      }
    },
  },
};
</script>
