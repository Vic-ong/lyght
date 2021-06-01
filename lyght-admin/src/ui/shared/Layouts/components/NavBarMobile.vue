<template>
  <div>
    <v-bottom-navigation v-model="value" color="primary" grow flat app>
      <v-btn
        v-for="item in navs"
        v-bind:key="item.key"
        :to="item.route"
        :value="item.key"
        style="text-decoration: none !important"
      >
        <span>{{ item.name }}</span>
        <v-icon size="20">{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import { navs } from './utils';

export default {
  name: 'NavContent',
  props: {
    user: { type: Object, default: () => {} },
    mini: { type: Boolean, default: false },
  },
  data() {
    return {
      value: 'recent',
      drawer: false,
      navs,
    };
  },
  mounted() {
    const routeName = this.$route.name;
    const parentRouteName = routeName.includes('/') ? routeName.substring(0, routeName.indexOf('/')) : routeName;
    this.value = parentRouteName;
  },
};
</script>
