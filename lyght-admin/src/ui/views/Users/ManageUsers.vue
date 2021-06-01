<template>
  <page-container :navs="navs" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <v-row>
        <v-col cols="12">
          <activity-insights :data="users.data"></activity-insights>
        </v-col>
        <v-col cols="12">
          <user-list :data="users.data" @item-select="routeToEditUser"></user-list>
        </v-col>
      </v-row>
    </template>
  </page-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';
import ActivityInsights from './components/ActivityInsights.vue';
import UserList from './components/UserList.vue';

export default {
  name: 'ManageUsers',
  components: {
    PageContainer,
    ActivityInsights,
    UserList,
  },
  created() {
    if (!this.users.data) this.getUsers();
  },
  data() {
    return {
      navs: ['users'],
      renderers: ['users'],
    };
  },
  computed: {
    ...mapGetters('users', ['users']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
  },
  methods: {
    ...mapActions('users', ['getUsers']),

    routeToEditUser(data) {
      this.$router.push({ name: 'users/:id', params: { id: data._id } });
    },
  },
};
</script>
