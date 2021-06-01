<template>
  <page-container :navs="navs" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <v-card class="rounded-xl pa-5">
        <div>template view</div>
      </v-card>
    </template>
  </page-container>
</template>

<script>
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';

export default {
  name: 'Overview',
  components: {
    PageContainer,
  },
  data() {
    return {
      navs: ['overview'],
    };
  },
  computed: {
    isLoading() {
      return false;
    },
    isError() {
      return false;
    },
  },
};
</script>
