<template>
  <div>
    <div class="text-subheading-medium black--text mb-2">{{ $t('Order-Checkout-ConfirmOrder') }}</div>
    <div class="text-hint mb-10">{{ $t('Order-Checkout-ConfirmOrderDesc') }}</div>

    <v-card class="background pa-5" flat>
      <order-item v-for="item in data.cart" v-bind:key="item._id" :data="item"></order-item>

      <v-divider class="my-5"></v-divider>

      <div class="text-right">
        <div class="text-body black--text mb-1">{{ $t('Field-TotalCost') }}</div>
        <div class="text-subheading-medium black--text">{{ grandTotal.display }}</div>
      </div>
    </v-card>

    <v-card-actions class="justify-space-between mt-10">
      <back-button @click="$emit('set-step', 2)"></back-button>

      <lyght-button @click="submitHandler">
        {{ $t('Button-Submit') }}
      </lyght-button>
    </v-card-actions>

    <v-dialog v-model="dialog" max-width="400" persistent>
      <v-card class="pa-7">
        <div v-if="loading" class="pa-5">
          <div class="text-center text-subheading-medium black--text mb-5">{{ $t('Order-Checkout-Processing') }}</div>
          <v-progress-linear indeterminate color="secondary"></v-progress-linear>
        </div>

        <div v-else-if="statusText">
          <div class="text-center text-subheading-medium black--text mb-5">{{ $t('Status-InternalError') }}</div>
          <status-info class="text-center" :color="statusColor">{{ statusText }}</status-info>
        </div>

        <div v-else>
          <div class="text-subheading-medium">{{ $t('Order-Checkout-OrderCompleted') }}</div>
          <div class="text-body black--text mt-5">{{ $t('Order-Checkout-OrderCompletedDesc') }}</div>

          <v-card-actions class="mt-5 justify-center">
            <lyght-button @click="routeToExit">
              {{ $t('Button-Complete') }}
            </lyght-button>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import get from 'lodash/get';
import { mapActions } from 'vuex';
import status from '@/mixins/status';
import { formatCurrency } from '@/utils/formats';
import BackButton from '@/components/Button/BackButton.vue';
import OrderItem from './OrderItem.vue';

export default {
  components: {
    BackButton,
    OrderItem,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  mixins: [status],
  data() {
    return {
      dialog: false,
      loading: false,
    };
  },
  computed: {
    grandTotal() {
      const value = this.data.cart.map((item) => {
        const { unitCost, quantity } = item;
        return unitCost.value * quantity;
      });
      // TODO: choose a base currency or follows unitCost currency by default ?
      const { currency } = get(this.items, '[0].unitCost') || {};

      return formatCurrency({ value, currency });
    },
  },
  methods: {
    ...mapActions('orders', ['createOrder']),

    async submitHandler() {
      this.clearStatus();
      try {
        this.loading = true;
        this.dialog = true;

        // TODO: process multiple orders
        const [item] = this.data.cart;
        const params = {
          order: {
            item: 'Solar Panel',
            quantity: Number(item.quantity),
            bankAccountId: this.data.input.bankAccountId,
            status: item.inventory === 0 ? 'waitlist' : 'unfulfilled',
          },
          userId: this.data.user._id,
          projectId: this.data.project._id,
          projectGroupId: this.data.project.projectGroupId,
        };
        await this.createOrder(params);

        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.setStatusError(err);
      }
    },
    routeToExit() {
      this.$router.replace({ name: 'projects' });
    },
  },
};
</script>
