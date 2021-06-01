<template>
  <page-container :title="title" :description="description" :isLoading="isLoading" :isError="isError">
    <template #side-header>
      <back-button @click="returnHandler"></back-button>
    </template>

    <template #rendered>
      <project-participation-view :key="$route.fullPath" :data="data"></project-participation-view>
    </template>
  </page-container>
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapGetters, mapState } from 'vuex';
import { formatShortAddress } from '@/utils/formats';
import { BackButton } from '@/components/Button';
import { PageContainer } from '@/ui/shared/Layout';
import ProjectParticipationView from './components/ProjectParticipationView.vue';

export default {
  name: 'NewProjectView',
  components: {
    BackButton,
    PageContainer,
    ProjectParticipationView,
  },
  created() {
    this.initialize();
  },
  data() {
    return {
      renderers: ['project', 'projectGroup', 'performance'],
    };
  },
  computed: {
    ...mapGetters('users', ['user']),
    ...mapState('projectGroups', ['performance']),
    ...mapGetters('projectGroups', ['projectGroup']),
    ...mapGetters('projects', ['project']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
    title() {
      return get(this.project, 'data.name') || '';
    },
    description() {
      const desc = get(this.projectGroup, 'address');
      return formatShortAddress(desc, this.$i18n.locale);
    },
    data() {
      return {
        ...this.project.data,
        projectGroup: {
          ...this.projectGroup.data,
          performance: get(this.performance, 'data.items'),
        },
      };
    },
  },
  methods: {
    ...mapActions('projectGroups', ['getProjectGroup', 'getPerformanceByProjectGroup']),
    ...mapActions('projects', ['getProject']),

    initialize() {
      const { id } = this.$route.params;
      const { projectGroup: projectGroupId } = this.$route.query;

      if (!this.project.data || this.project.data._id !== id) {
        this.getProject(id);
      }
      if (!this.projectGroup.data || this.projectGroup.data._id !== projectGroupId) {
        this.getProjectGroup(projectGroupId);
      }
      if (!this.performance.data || this.performance.data.projectGroupId !== projectGroupId) {
        this.getPerformanceByProjectGroup(projectGroupId);
      }
    },
    returnHandler() {
      this.$router.push({ name: 'projects' });
    },
  },
};
</script>
