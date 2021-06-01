<template>
  <page-container :title="$t('Route-MyOrders-Title')" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <user-order-list v-if="userOrders.data && userOrders.data.length > 0" :data="userOrders.data"></user-order-list>

      <div v-else>
        <v-card class="d-flex justify-center align-center text-center background" min-height="300" flat>
          <v-card class="transparent" flat>
            <v-card-text>
              <div class="text-body black--text py-3">{{ $t('Order-NoRecord') }}</div>
              <div class="text-subheading black--text">{{ $t('UserAsset-StartParticipating') }}</div>
            </v-card-text>
            <v-card-actions class="justify-center">
              <lyght-button @click="$router.push({ name: 'projects' })">{{ $t('Button-ViewProjects') }}</lyght-button>
            </v-card-actions>
          </v-card>
        </v-card>
      </div>
    </template>
  </page-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { PageContainer } from '@/ui/shared/Layout';
import UserOrderList from './components/UserOrderList.vue';

export default {
  name: 'OrdersView',
  components: {
    PageContainer,
    UserOrderList,
  },
  created() {
    if (!this.userOrders.data) this.getOrdersByUser(this.user.data._id);
  },
  data() {
    return {
      renderers: ['userOrders'],
    };
  },
  computed: {
    ...mapGetters('users', ['user']),
    ...mapGetters('orders', ['userOrders']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
  },
  methods: {
    ...mapActions('orders', ['getOrdersByUser']),
  },
};
</script>
