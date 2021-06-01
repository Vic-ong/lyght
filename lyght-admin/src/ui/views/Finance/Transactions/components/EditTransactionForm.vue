<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-row>
      <!-- Main view -->
      <v-col :order="$vuetify.breakpoint.lgAndUp ? 1 : 2" cols="12" lg="8">
        <v-card class="rounded-lg pa-5 overflow-y-auto">
          <general-data :input="input" :data="data" :list="list"></general-data>
        </v-card>
      </v-col>

      <!-- Transaction summary -->
      <v-col :order="$vuetify.breakpoint.lgAndUp ? 2 : 1" cols="12" lg="4">
        <transaction-profile :data="data">
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
        </transaction-profile>
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
import { appHeaderProps, pageContainerProps } from '@/ui/shared/Layouts/props';
import TransactionProfile from './Forms/TransactionProfile.vue';
import GeneralData from './Forms/GeneralData.vue';

export default {
  name: 'EditTransactionForm',
  components: {
    GeneralData,
    TransactionProfile,
  },
  props: {
    data: { type: Object, required: true },
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
        amount: {
          currency: null,
          amount: null,
        },
        account: null,
        remarks: null,
        projectId: null,
        projectGroupId: null,
        userId: null,
        invoiceReferenceId: null,
        paymentProvisionId: null,
        expenseId: null,
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
  mounted() {
    this.initialize();
  },
  watch: {
    input: {
      handler() {
        if (this.initialized && !this.inputChanged) {
          this.inputChanged = true;
        }
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
    formHeight() {
      return `calc(100vh - 15px - ${this.layoutHeight}px)`;
    },
    actionButtons() {
      return [
        {
          name: 'Update',
          disabled: !this.inputChanged,
          color: 'primary',
          handler: this.setUpdateAction,
        },
        {
          name: 'Reset',
          disabled: !this.inputChanged,
          color: 'secondary',
          handler: this.initialize,
        },
      ];
    },
  },
  methods: {
    ...mapActions('transactions', ['updateTransaction']),

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
    hasValue(v) {
      return !!v || v === 0 || v === false;
    },
    validate() {
      this.valid = this.$refs.form.validate();
    },
    setUpdateAction() {
      this.validate();
      if (this.valid) {
        this.setAction({
          name: 'Update transaction data',
          handler: this.updateTransactionData,
        });
      }
    },
    async updateTransactionData() {
      try {
        this.loading = true;
        const params = this.input;

        const res = await this.updateTransaction({
          id: this.$route.params.id,
          ...params,
        });

        this.setActionSuccess(res.message);
        this.inputChanged = false;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
    },
  },
};
</script>
