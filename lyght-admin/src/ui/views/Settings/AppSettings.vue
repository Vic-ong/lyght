<template>
  <page-container :navs="navs" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <v-row>
        <v-col cols="12">
          <themes :user="user.data || {}"></themes>
        </v-col>
      </v-row>
    </template>
  </page-container>
</template>

<script>
import { mapGetters } from 'vuex';
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';
import Themes from './components/Themes.vue';

export default {
  name: 'AppSettings',
  components: {
    PageContainer,
    Themes,
  },
  data() {
    return {
      navs: ['settings'],
      renderers: ['user'],
    };
  },
  computed: {
    ...mapGetters('users', {
      user: 'user',
    }),
    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
  },
};
</script>
