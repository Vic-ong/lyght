<template>
  <page-container :navs="navs" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <edit-project :key="$route.params.id" :data="data"></edit-project>
    </template>
  </page-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';
import EditProject from './components/Project/EditProject.vue';

export default {
  name: 'ProjectView',
  components: {
    PageContainer,
    EditProject,
  },
  data() {
    return {
      navs: ['projects', 'projects/:id'],
      renderers: ['project', 'projectGroup', 'projectGroups'],
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
    ...mapGetters('projects', ['project']),
    ...mapGetters('projectGroups', ['projectGroups', 'projectGroup']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
    data() {
      return {
        ...this.project.data,
        ...(this.projectGroup.data && {
          details: this.projectGroup.data,
        }),
      };
    },
  },
  methods: {
    ...mapActions('projects', ['getProject', 'getPanelsByProject', 'getYieldRatesByProject']),
    ...mapActions('projectGroups', ['getProjectGroups', 'getProjectGroup', 'getProjectGroupDetails']),

    initialize() {
      const { id } = this.$route.params;
      const { projectGroup: projectGroupId } = this.$route.query;

      if (!this.project.data || this.project.data._id !== id) {
        this.getProject(id);
        this.getPanelsByProject(id);
        this.getYieldRatesByProject(id);
      }
      if (!this.projectGroup.data || this.projectGroup.data._id !== projectGroupId) {
        this.getProjectGroup(projectGroupId);
        this.getProjectGroupDetails(projectGroupId);
      }
      if (!this.projectGroups.data) {
        this.getProjectGroups();
      }
    },
    returnHandler() {
      this.$router.push({ name: 'projects' });
    },
  },
};
</script>
