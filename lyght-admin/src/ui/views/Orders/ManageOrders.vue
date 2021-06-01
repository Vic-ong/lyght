<template>
  <page-container :navs="navs" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <v-row>
        <v-col cols="12">
          <activity-insights :data="orders.data"></activity-insights>
        </v-col>
        <v-col cols="12">
          <order-list :data="orders.data" @item-select="routeToEditOrder"></order-list>
        </v-col>
      </v-row>
    </template>
  </page-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';
import ActivityInsights from './components/ActivityInsights.vue';
import OrderList from './components/OrderList.vue';

export default {
  name: 'ManageOrders',
  components: {
    PageContainer,
    ActivityInsights,
    OrderList,
  },
  data() {
    return {
      navs: ['orders'],
      renderers: ['orders'],
    };
  },
  created() {
    this.initialize();
  },
  computed: {
    ...mapState('orders', ['orders']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
  },
  methods: {
    ...mapActions('orders', ['getOrders']),

    initialize() {
      if (!this.orders.data) this.getOrders();
    },
    routeToEditOrder(data) {
      this.$router.push({
        name: 'orders/:id',
        params: {
          id: data._id,
        },
        query: {
          project: data.projectId,
          projectGroup: data.projectGroupId,
          user: data.userId,
        },
      });
    },
  },
};
</script>
