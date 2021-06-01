<template>
  <page-container :title="$t('Route-Order-Title')" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <user-order-details :data="data"></user-order-details>
    </template>
  </page-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { PageContainer } from '@/ui/shared/Layout';
import UserOrderDetails from './components/UserOrderDetails.vue';

export default {
  name: 'OrderView',
  components: {
    PageContainer,
    UserOrderDetails,
  },
  created() {
    this.initialize();
  },
  data() {
    return {
      renderers: ['order', 'project'],
    };
  },
  computed: {
    ...mapState('orders', ['order']),
    ...mapGetters('projects', ['project']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
    data() {
      return {
        ...this.order.data,
        project: this.project.data,
      };
    },
  },
  methods: {
    ...mapActions('orders', ['getOrder']),
    ...mapActions('projects', ['getProject']),

    initialize() {
      const { id } = this.$route.params;
      const { project: projectId } = this.$route.query;

      if (!this.order.data || this.order.data._id !== id) {
        this.getOrder(id);
      }

      if (!this.project.data || this.project.data._id !== projectId) {
        this.getProject(projectId);
      }
    },
  },
};
</script>
