<template>
  <div>
    <transition name="transition-fade" mode="out-in">
      <loading-state v-if="isLoading" key="loading" title="Loading..." min-height="50vh"></loading-state>
      <error-state v-else-if="isError" key="error" min-height="50vh"></error-state>

      <div v-else class="px-10">
        <v-card :height="pageContainerProps.header.height" class="d-flex align-baseline transparent" flat>
          <div v-for="(item, index) in breadcrumbs" v-bind:key="item.title">
            <div v-if="breadcrumbs.length === 1" class="text-subtitle">{{ item.title }}</div>
            <div v-else-if="index === breadcrumbs.length - 1" class="text-subheading grey--text">{{ item.title }}</div>
            <div v-else class="d-flex text-subtitle">
              <router-link :to="item.to" style="text-decoration: none">
                {{ item.title }}
              </router-link>
              <div class="px-2">/</div>
            </div>
          </div>
        </v-card>
        <v-card class="transparent" flat>
          <slot name="rendered"></slot>
        </v-card>
      </div>
    </transition>
  </div>
</template>

<script>
import routes from '@/router/routes';
import { pageContainerProps } from './props';

export default {
  name: 'PageContainer',
  props: {
    navs: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
    isError: { type: Boolean, default: false },
  },
  computed: {
    pageContainerProps() {
      return pageContainerProps(this.$vuetify.breakpoint);
    },
    breadcrumbs() {
      const items = [];

      this.navs.forEach((nav) => {
        const route = routes.find((r) => r.name === nav);
        if (route)
          items.push({
            to: route.path,
            title: route.meta.title,
          });
      });
      return items;
    },
  },
};
</script>
