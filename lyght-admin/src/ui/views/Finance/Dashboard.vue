<template>
  <page-container :navs="navs">
    <template #rendered>
      <v-row>
        <v-col v-for="item in modules" v-bind:key="item.key" cols="12" sm="3">
          <card-panel @click="$router.push({ name: `finance/${item.key}` })">
            <v-card class="d-flex align-center justify-center rounded transparent" flat>
              <v-img :src="item.src" height="24" width="24" contain></v-img>
            </v-card>
            <div class="text-center text-subheading mt-3">{{ item.name }}</div>
          </card-panel>
        </v-col>
      </v-row>
    </template>
  </page-container>
</template>

<script>
import transactionsImg from '@/assets/finance/transactions.png';
import expensesImg from '@/assets/finance/expenses.png';
import paymentProvisionImg from '@/assets/finance/payments.png';
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';

export default {
  name: 'Dashboard',
  components: {
    PageContainer,
  },
  data() {
    return {
      navs: ['finance'],
      modules: [
        {
          key: 'transactions',
          name: 'Transactions',
          src: transactionsImg,
        },
        {
          key: 'expenses',
          name: 'Expenses',
          src: expensesImg,
        },
        {
          key: 'payment-provisions',
          name: 'Payment Provisions',
          src: paymentProvisionImg,
        },
      ],
    };
  },
};
</script>
