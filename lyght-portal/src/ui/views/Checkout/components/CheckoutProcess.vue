<template>
  <div>
    <v-card>
      <stepper-container>
        <stepper-item
          :active="checkoutStep === 1"
          :name="$t('Order-Checkout-ReviewCart')"
          :icon="'mdi-cart'"
        ></stepper-item>
        <v-divider></v-divider>
        <stepper-item
          :active="checkoutStep === 2"
          :name="$t('Order-Checkout-SelectPayment')"
          :icon="'mdi-bank'"
        ></stepper-item>
        <v-divider></v-divider>
        <stepper-item
          :active="checkoutStep === 3"
          :name="$t('Order-Checkout-SubmitOrder')"
          :icon="'mdi-checkbox-marked-circle'"
        ></stepper-item>
      </stepper-container>

      <div class="pa-7">
        <transition name="transition-slide-left" mode="out-in">
          <div v-if="checkoutStep === 1" key="review-cart">
            <cart-item-list :items="cartItems" @set-step="setStep"></cart-item-list>
          </div>

          <div v-if="checkoutStep === 2" key="select-payment">
            <checkout-payment :input="input" :data="user" @set-step="setStep"></checkout-payment>
          </div>

          <div v-if="checkoutStep === 3" key="submit-order">
            <order-submission :data="order" @set-step="setStep"></order-submission>
          </div>
        </transition>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import status from '@/mixins/status';
import StepperContainer from '@/components/Steppers/StepperContainer.vue';
import StepperItem from '@/components/Steppers/StepperItem.vue';
import CartItemList from './CartItemList.vue';
import CheckoutPayment from './CheckoutPayment.vue';
import OrderSubmission from './OrderSubmission.vue';

export default {
  name: 'CheckoutView',
  components: {
    StepperContainer,
    StepperItem,
    CartItemList,
    CheckoutPayment,
    OrderSubmission,
  },
  mixins: [status],
  props: {
    data: { type: Object, required: true },
  },
  mounted() {
    this.initialize();
  },
  data() {
    return {
      checkoutStep: 1,
      cartItems: [],
      input: {
        bankAccountId: null,
      },
    };
  },
  computed: {
    user() {
      return this.data.user;
    },
    project() {
      return this.data.project;
    },
    order() {
      return {
        ...this.data,
        input: this.input,
        cart: this.cartItems,
      };
    },
  },
  methods: {
    ...mapActions('orders', ['createOrder']),

    initialize() {
      this.cartItems = [
        {
          _id: this.project._id,
          name: this.project.name,
          thumbnail: this.project.imagePrimary.url,
          unitCost: this.project.unitCost,
          inventory: this.calcInventory(this.project),
          quantity: this.$route.query.quantity || 10,
        },
      ];
    },
    calcInventory(data) {
      return data.panelsTotal - data.panelsSold - data.panelsReserved;
    },
    setStep(step) {
      if (!step) {
        console.error('"step" value is required.');
      } else {
        this.checkoutStep = step;
      }
    },
  },
};
</script>
