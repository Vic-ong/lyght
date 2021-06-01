<template>
  <page-container :navs="navs" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <edit-project-group :key="$route.params.id" :data="projectGroupDetailed.data"></edit-project-group>
    </template>
  </page-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';
import EditProjectGroup from './components/ProjectGroup/EditProjectGroup.vue';

export default {
  name: 'ProjectGroupView',
  components: {
    PageContainer,
    EditProjectGroup,
  },
  data() {
    return {
      navs: ['projects', 'projects/groups/:id'],
      renderers: ['projectGroupDetailed', 'entities'],
    };
  },
  created() {
    this.initialize();
  },
  watch: {
    $route() {
      this.initialize();
    },
  },
  computed: {
    ...mapGetters('entities', ['entities']),
    ...mapGetters('projectGroups', ['projectGroupDetailed']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
  },
  methods: {
    ...mapActions('entities', ['getEntities']),
    ...mapActions('projectGroups', [
      'getProjectGroup',
      'getProjectGroupDetails',
      'getInsuranceByProjectGroup',
      'getManufacturersByProjectGroup',
      'getExpenseAllocationsByProjectGroup',
      'getPerformanceByProjectGroup',
      'getBankAccountsByProjectGroup',
    ]),

    initialize() {
      const { id } = this.$route.params;
      if (!this.projectGroupDetailed.data || this.projectGroupDetailed.data._id !== id) {
        this.getProjectGroup(id);
        this.getProjectGroupDetails(id);
        this.getInsuranceByProjectGroup(id);
        this.getManufacturersByProjectGroup(id);
        this.getExpenseAllocationsByProjectGroup(id);
        this.getPerformanceByProjectGroup(id);
        this.getBankAccountsByProjectGroup(id);
      }
      if (!this.entities.data) {
        this.getEntities();
      }
    },
    returnHandler() {
      this.$router.push({ name: 'projects' });
    },
  },
};
</script>
