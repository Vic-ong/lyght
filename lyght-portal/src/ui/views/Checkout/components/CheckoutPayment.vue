<template>
  <v-form ref="form" v-model="valid" @submit.prevent lazy-validation>
    <div class="text-body">{{ $t('Order-Checkout-SelectPayment') }}</div>

    <v-row>
      <v-col cols="12" sm="6">
        <v-select
          v-model="input.bankAccountId"
          :items="items"
          :rules="rules"
          validate-on-blur
          outlined
          required
        ></v-select>
      </v-col>
    </v-row>

    <div class="text-hint black--text">
      <div class="mb-2">{{ $t('Order-Checkout-PaymentNote') }}</div>
      <div class="ml-2">
        <div class="py-1">1. {{ $t('Order-Checkout-PaymentNote1') }}</div>
        <div class="py-1">2. {{ $t('Order-Checkout-PaymentNote2') }}</div>
      </div>
    </div>

    <div class="text-hint mt-3">{{ inquiryContact }}</div>

    <v-card-actions class="justify-space-between mt-10">
      <back-button @click="$emit('set-step', 1)"></back-button>

      <lyght-button @click="submitHandler">
        {{ $t('Button-Continue') }}
      </lyght-button>
    </v-card-actions>
  </v-form>
</template>

<script>
import BackButton from '@/components/Button/BackButton.vue';
import bankList from '@/constants/banks/TW.json';
import form from '@/utils/validation/form';

export default {
  components: {
    BackButton,
  },
  props: {
    input: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      valid: true,
    };
  },
  computed: {
    rules() {
      return [form.required(this.t)];
    },
    items() {
      return this.data.bankAccounts.map((item) => ({
        text: `${this.getBankName(item)} (***${this.getAccountNumber(item)})`,
        value: item._id,
      }));
    },
    inquiryContact() {
      return this.$t('Info-ContactUsInquiry', {
        contact: process.env.VUE_APP_SUPPORT_EMAIL,
      });
    },
  },
  methods: {
    t(v, params) {
      return this.$t(v, params);
    },
    getBankName(data) {
      return bankList.find((item) => data.bankCode === item.code).name;
    },
    getAccountNumber(data) {
      return data.accountNumber.substring(data.accountNumber.length - 4, data.accountNumber.length);
    },
    validate() {
      this.valid = this.$refs.form.validate();
    },
    submitHandler() {
      this.validate();
      if (this.valid) {
        this.$emit('set-step', 3);
      }
    },
  },
};
</script>
