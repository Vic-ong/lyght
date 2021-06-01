<template>
  <div>
    <app-header @open-menu="menu = true"></app-header>
    <nav-bar-mobile v-if="$vuetify.breakpoint.xs"></nav-bar-mobile>
    <nav-bar @close="menu = false" :menu="menu"></nav-bar>
    <div class="overflow-y-auto" :style="slotStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { appHeaderProps, navBarProps } from './props';
import AppHeader from './components/AppHeader.vue';
import NavBar from './components/NavBar.vue';
import NavBarMobile from './components/NavBarMobile.vue';

export default {
  name: 'AuthenticatedLayout',
  components: {
    AppHeader,
    NavBar,
    NavBarMobile,
  },
  data() {
    return {
      menu: false,
    };
  },
  computed: {
    appHeaderProps() {
      return appHeaderProps(this.$vuetify.breakpoint);
    },
    navBarProps() {
      return navBarProps(this.$vuetify.breakpoint);
    },
    slotStyle() {
      const { xs } = this.$vuetify.breakpoint;

      return {
        marginTop: `${this.appHeaderProps.height}px`,
        marginLeft: xs ? 'unset' : `${this.navBarProps.width}px`,
        height: `calc(100vh - ${xs ? this.appHeaderProps.height * 2 : this.appHeaderProps.height}px)`,
        width: xs ? '100vw' : `calc(100vw - ${this.navBarProps.width}px)`,
      };
    },
  },
};
</script>
