<template>
  <page-container :navs="navs" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <edit-order :data="data"></edit-order>
    </template>
  </page-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';
import EditOrder from './components/EditOrder.vue';

export default {
  name: 'OrderView',
  components: {
    PageContainer,
    EditOrder,
  },
  data() {
    return {
      navs: ['orders', 'orders/:id'],
      renderers: ['userData', 'order', 'availablePanels', 'panelsByOrder', 'project', 'projectGroup'],
    };
  },
  created() {
    this.initialize();
  },
  watch: {
    $route(curr, prev) {
      if (curr.path !== prev.path) {
        this.initialize();
      }
    },
  },
  computed: {
    ...mapState('users', ['userData']),
    ...mapState('projects', ['project', 'availablePanels', 'panelsByOrder']),
    ...mapState('orders', ['order']),
    ...mapGetters('projectGroups', ['projectGroup']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
    data() {
      return {
        user: this.userData.data,
        order: this.order.data,
        panels: this.panelsByOrder.data.items,
        availablePanels: this.availablePanels.data.items,
        project: {
          ...this.project.data,
          details: this.projectGroup.data,
        },
      };
    },
  },
  methods: {
    ...mapActions('users', ['getUserData']),
    ...mapActions('orders', ['getOrder']),
    ...mapActions('projectGroups', ['getProjectGroup', 'getProjectGroupDetails']),
    ...mapActions('projects', ['getProject', 'getAvailablePanelsByProject', 'getPanelsByOrder']),

    initialize() {
      const { id } = this.$route.params;
      const { project: projectId, projectGroup: projectGroupId, user: userId } = this.$route.query;

      if (!this.userData.data || this.userData.data._id !== userId) {
        this.getUserData(userId);
      }

      if (!this.order.data || this.order.data._id !== id) {
        this.getOrder(id);
      }

      if (!this.project.data || this.project.data._id !== id) {
        this.getProject(projectId);
      }

      if (!this.projectGroup.data || this.projectGroup.data._id !== projectGroupId) {
        this.getProjectGroup(projectGroupId);
        this.getProjectGroupDetails(projectGroupId);
      }

      if (!this.availablePanels.data || this.availablePanels.data.projectId !== projectId) {
        this.getAvailablePanelsByProject({ projectId });
      }

      if (!this.panelsByOrder.data || this.panelsByOrder.data.orderId !== id) {
        this.getPanelsByOrder({ orderId: id, projectId });
      }
    },
    returnHandler() {
      this.$router.push({ name: 'orders' });
    },
  },
};
</script>
