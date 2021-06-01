<template>
  <div>
    <btn-main @click="setCreateAction" color="primary">
      New Transaction
      <v-icon class="ml-2">mdi-plus-circle</v-icon>
    </btn-main>

    <general-dialog
      v-model="dialogProps.show"
      :text="dialogProps.text"
      :status="dialogProps.status"
      @close="clearData"
      max-width="700"
    >
      <template #header>New Transaction</template>

      <template #body>
        <v-form ref="form" v-model="valid" class="text-left" lazy-validation>
          <general-data :input="input" :list="list" :loading="loading"></general-data>
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
import GeneralData from './Forms/GeneralData.vue';

export default {
  components: {
    GeneralData,
  },
  props: {
    list: { type: Object, required: true },
  },
  mixins: [dialog],
  data() {
    return {
      valid: true,
      loading: false,
      newId: null,
      input: {
        amount: {
          currency: 'TWD',
          value: 0,
        },
        account: null,
        remarks: null,
        projectId: null,
        entityId: null,
        userId: null,
        invoiceReferenceId: null,
        paymentProvisionId: null,
        payer: {
          accountName: null,
          accountNumber: null,
          bankCode: null,
        },
        recipient: {
          accountName: null,
          accountNumber: null,
          bankCode: null,
        },
      },
    };
  },
  methods: {
    ...mapActions('transactions', ['createTransaction']),

    setCreateAction() {
      this.setAction({
        name: null,
        handler: this.submitHandler,
      });
    },
    clearData() {
      this.input = {
        amount: {
          currency: 'TWD',
          value: 0,
        },
        account: null,
        remarks: null,
        invoiceReferenceId: null,
        paymentProvisionId: null,
        payer: {
          acccount: {
            accountName: null,
            accountNumber: null,
            bankCode: null,
          },
        },
        recipient: {
          acccount: {
            accountName: null,
            accountNumber: null,
            bankCode: null,
          },
        },
      };
      this.clearDialog();

      if (this.newId) {
        this.$router.push({
          name: 'finance/transactions/:id',
          params: { id: this.newId },
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

          const res = await this.createTransaction(this.input);

          this.newId = res.id;
          this.loading = false;
          this.setActionSuccess('Created a new transaction.');
        } catch (err) {
          this.loading = false;
          this.setActionError(err);
        }
      }
    },
  },
};
</script>
