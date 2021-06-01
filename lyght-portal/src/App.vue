<template>
  <v-app :style="styleConfigs">
    <v-main>
      <div v-if="loading" id="page-loader">
        <v-progress-circular :size="80" :width="7" color="primary" indeterminate></v-progress-circular>
      </div>
      <page-layout v-else-if="showPageLayout">
        <transition name="transition-fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </page-layout>
      <router-view v-else></router-view>
    </v-main>
  </v-app>
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { PageLayout } from '@/ui/shared/Layout';

export default {
  name: 'App',
  components: {
    PageLayout,
  },

  created() {
    this.loading = true;
    firebase.auth().onAuthStateChanged((user) => {
      this.authenticated = !!user;
      this.loading = false;
    });
  },

  data() {
    return {
      loading: false,
      authenticated: false,
    };
  },

  computed: {
    showPageLayout() {
      const routeList = ['login', 'signup'];
      return this.authenticated && !routeList.includes(this.$route.name);
    },
    styleConfigs() {
      if (this.$i18n.locale === 'zhHant') {
        return {
          '--font-small': '14px',
          '--font-regular': '15px',
          '--font-medium': '19px',
          '--font-large': '33px',
          '--font-x-large': '39px',
        };
      }
      return {
        '--font-small': '13px',
        '--font-regular': '14px',
        '--font-medium': '18px',
        '--font-large': '32px',
        '--font-x-large': '38px',
      };
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Montserrat, Helvetica, Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  #page-loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .page-loader {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 50vh;
  }

  a {
    text-decoration: underline;
    color: inherit;
  }

  .v-btn {
    text-transform: none !important;
  }

  // cursors
  .cursor-pointer {
    cursor: pointer;
  }
  .cursor-not-allowed {
    cursor: not-allowed;
  }
  .cursor-progress {
    cursor: progress;
  }

  // typography
  .text-body {
    font-size: var(--font-regular);
    color: var(--v-primary-base);
  }
  .text-body-medium {
    font-size: var(--font-medium);
    color: var(--v-primary-base);
  }
  .text-subheading {
    font-size: var(--font-regular);
    font-weight: 600;
    color: var(--v-primary-base);
  }
  .text-subheading-medium {
    font-size: var(--font-medium);
    font-weight: 600;
    color: var(--v-primary-base);
  }
  .text-title {
    font-size: var(--font-large);
    font-weight: 600;
    color: var(--v-primary-base);
  }
  .text-hint {
    font-size: var(--font-small);
    font-weight: 500;
    line-height: 1.25;
    font-style: italic;
    color: var(--v-primary-base);
  }
  .text-subtitle {
    font-size: var(--font-small);
    color: var(--v-primary-base);
  }
  .text-emphasis {
    font-size: var(--font-x-large);
    font-weight: 600;
    color: var(--v-primary-base);
  }
  .text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
