<template>
  <div>
    <!-- Mobile -->
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.xs"
      v-model="drawer"
      @input="inputChange"
      :width="navBarWidth"
      absolute
      temporary
    >
      <div class="mt-5 mb-16 text-center">
        <span class="text-logo1">Lyght</span>
        <span class="ml-1"></span>
        <span class="text-logo2">Admin</span>
      </div>
      <div v-for="item in navs" v-bind:key="item.key" :style="item.active ? activeStyle : inactiveStyle">
        <nav-content :item="item"></nav-content>
      </div>

      <template v-slot:append>
        <div v-for="item in secondaryNavs" v-bind:key="item.key" :style="item.active ? activeStyle : inactiveStyle">
          <nav-content :item="item"></nav-content>
        </div>

        <div class="divider-line mx-5"></div>

        <div @click="signOutHandler" class="d-flex align-center py-4 px-7 cursor-pointer" :style="inactiveStyle">
          <div class="mr-3">
            <v-icon color="bg-dark" size="18">{{ logoutNav.icon }}</v-icon>
          </div>
          <div class="text-body">{{ logoutNav.name }}</div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Desktop -->
    <v-navigation-drawer v-else class="elevation-7" :width="navBarWidth" flat app permanent>
      <div class="mt-5 mb-16 text-center">
        <span class="text-logo1">Lyght</span>
        <span class="ml-1"></span>
        <span class="text-logo2">Admin</span>
      </div>
      <div v-for="item in navs" v-bind:key="item.key" :style="item.active ? activeStyle : inactiveStyle">
        <nav-content :item="item"></nav-content>
      </div>

      <template v-slot:append>
        <div v-for="item in secondaryNavs" v-bind:key="item.key" :style="item.active ? activeStyle : inactiveStyle">
          <nav-content :item="item"></nav-content>
        </div>

        <div class="divider-line mx-5"></div>

        <div @click="signOutHandler" class="d-flex align-center py-4 px-7 cursor-pointer" :style="inactiveStyle">
          <div class="mr-3">
            <v-icon color="bg-light" size="18">{{ logoutNav.icon }}</v-icon>
          </div>
          <div class="text-body bg-light--text">{{ logoutNav.name }}</div>
        </div>
      </template>

      <template #img>
        <v-card class="black" tile>
          <v-img class="nav-bar-background" height="100vh" :src="navBarImg"></v-img>
        </v-card>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import get from 'lodash/get';
import { mapGetters } from 'vuex';
import firebase from '@/services/firebase';
import { themeColors } from '@/constants/themes';

import { navBarProps } from '../props';
import { navs, secondaryNavs, logoutNav } from './utils';
import NavContent from './NavContent.vue';

export default {
  name: 'NavBar',
  components: {
    NavContent,
  },
  props: {
    menu: { type: Boolean, default: false },
  },
  data() {
    return {
      drawer: false,
      navs,
      secondaryNavs,
      logoutNav,
      navBarImgDefault:
        'https://firebasestorage.googleapis.com/v0/b/lyght-dev.appspot.com/o/public%2Flyght-admin-arctic%2Fmountain-gradient.jpg?alt=media&token=33214be2-b8db-4a50-92ab-2d9363060eae',
    };
  },
  mounted() {
    this.setRouteStatus();
    const theme = get(this.user, 'data.settings.theme') || 'default';
    this.$vuetify.theme.themes.light = {
      ...this.$vuetify.theme.themes.light,
      ...themeColors[theme],
    };
  },
  watch: {
    $route() {
      this.setRouteStatus();
    },
    menu(v) {
      this.drawer = v;
    },
  },
  computed: {
    ...mapGetters('users', ['user']),

    navBarWidth() {
      return navBarProps().width;
    },
    navBarImg() {
      return get(this.user, 'data.settings.navBarBackground') || this.navBarImgDefault;
    },
    activeStyle() {
      return {
        borderLeft: '5px solid var(--v-primary-base)',
        backgroundColor: 'var(--v-bg-light-base)',
        opacity: 0.7,
      };
    },
    inactiveStyle() {
      return {
        borderLeft: '5px solid transparent',
      };
    },
  },
  methods: {
    inputChange(v) {
      if (v === false) this.$emit('close');
    },
    setRouteStatus() {
      const routeName = this.$route.name;
      const allNavs = [...this.navs, ...this.secondaryNavs];

      allNavs.forEach((item, index) => {
        const parentRouteName = routeName.includes('/') ? routeName.substring(0, routeName.indexOf('/')) : routeName;
        if (item.route.name === parentRouteName) {
          allNavs[index].active = true;
        } else {
          allNavs[index].active = false;
        }
      });
    },
    async signOutHandler() {
      await firebase.auth().signOut();
      this.$router.replace({ name: 'login' });
    },
  },
};
</script>

<style lang="scss" scoped>
.divider-line {
  border-bottom: 1px solid var(--v-bg-light-base);
}
.nav-bar-background {
  opacity: 0.6;
}
</style>
