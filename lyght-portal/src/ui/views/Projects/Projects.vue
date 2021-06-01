<template>
  <page-container :title="$t('Route-Projects-Title')" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <div v-if="hasData(activeProjectList)">
        <div class="text-subheading mt-5">{{ $t('Projects-ActiveProjects-Title') }}</div>
        <project-list @item-click="routeToActiveProject" :data="activeProjectList.data"></project-list>
      </div>

      <div v-if="hasData(newProjectList)">
        <div class="text-subheading mt-5">{{ $t('Projects-NewProjects-Title') }}</div>
        <project-list @item-click="routeToNewProject" :data="newProjectList.data"></project-list>
      </div>
    </template>
  </page-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { PageContainer } from '@/ui/shared/Layout';
import ProjectList from './components/ProjectList.vue';

export default {
  name: 'Projects',
  components: {
    PageContainer,
    ProjectList,
  },
  created() {
    this.initialize();
  },
  data() {
    return {
      renderers: ['activeProjectList', 'newProjectList'],
    };
  },
  computed: {
    ...mapGetters('projects', ['activeProjectList', 'newProjectList']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
  },
  methods: {
    ...mapActions('projects', ['getActiveProjects', 'getNewProjects']),

    initialize() {
      if (!this.activeProjectList.data) this.getActiveProjects();
      if (!this.newProjectList.data) this.getNewProjects();
    },
    hasData(state) {
      return state.data && state.data.length > 0;
    },
    routeToActiveProject(item) {
      this.$router.push({
        name: 'projects/active/:id',
        params: { id: item._id },
        query: { projectGroup: item.projectGroupId },
      });
    },
    routeToNewProject(item) {
      this.$router.push({
        name: 'projects/new/:id',
        params: { id: item._id },
        query: { projectGroup: item.projectGroupId },
      });
    },
  },
};
</script>
