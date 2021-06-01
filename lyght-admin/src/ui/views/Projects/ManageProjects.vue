<template>
  <page-container :navs="navs" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <v-row>
        <v-col cols="4">
          <v-autocomplete
            v-model="filters.entityId"
            :items="entityList"
            label="Entity"
            validate-on-blur
            dense
            filled
            rounded
            hide-details
          ></v-autocomplete>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between py-4">
            <div class="text-subtitle pt-3">Project Groups</div>
            <new-project-group></new-project-group>
          </div>
          <project-group-list :data="projectGroupsFiltered" @item-select="routeToEditProjectGroup"></project-group-list>
        </v-col>

        <v-col cols="12">
          <div class="d-flex align-center justify-space-between py-4">
            <div class="text-subtitle pt-3">Projects</div>
            <new-project></new-project>
          </div>
          <project-list :data="projects.data" @item-select="routeToEditProject"></project-list>
        </v-col>
      </v-row>
    </template>
  </page-container>
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapGetters } from 'vuex';
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';
import NewProjectGroup from './components/ProjectGroup/NewProjectGroup.vue';
import ProjectGroupList from './components/ProjectGroup/ProjectGroupList.vue';
import NewProject from './components/Project/NewProject.vue';
import ProjectList from './components/Project/ProjectList.vue';

export default {
  name: 'ManageProjects',
  components: {
    PageContainer,
    NewProjectGroup,
    ProjectGroupList,
    NewProject,
    ProjectList,
  },
  created() {
    this.initialize();
  },
  data() {
    return {
      navs: ['projects'],
      renderers: ['entities', 'projectGroups', 'projects'],
      filters: {
        entityId: 'all',
      },
    };
  },
  computed: {
    ...mapGetters('entities', ['entities']),
    ...mapGetters('projects', ['projects']),
    ...mapGetters('projectGroups', ['projectGroups']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
    projectGroupsFiltered() {
      if (!this.projectGroups.data || this.projectGroups.data.length === 0) return [];

      return this.projectGroups.data.filter((item) => {
        let filter = true;

        Object.keys(this.filters).forEach((key) => {
          const f = this.filters[key];
          if (f !== 'all') filter = get(item, key) === f;
        });

        return filter;
      });
    },

    entityList() {
      if (!this.entities.data || this.entities.data.length === 0) return [];
      const list = this.entities.data.map((item) => ({
        text: item.name,
        value: item._id,
      }));
      list.unshift({ text: 'All', value: 'all' });
      return list;
    },
  },
  methods: {
    ...mapActions('entities', ['getEntities']),
    ...mapActions('projects', ['getProjects']),
    ...mapActions('projectGroups', ['getProjectGroups']),

    initialize() {
      if (!this.entities.data) this.getEntities();
      if (!this.projectGroups.data) this.getProjectGroups();
      if (!this.projects.data) this.getProjects();
    },
    routeToEditProjectGroup(data) {
      this.$router.push({
        name: 'projects/groups/:id',
        params: {
          id: data._id,
        },
      });
    },
    routeToEditProject(data) {
      this.$router.push({
        name: 'projects/:id',
        params: {
          id: data._id,
        },
        query: {
          projectGroup: data.projectGroupId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.filters-container {
  & > div {
    margin-right: 12px;
  }
}
</style>
