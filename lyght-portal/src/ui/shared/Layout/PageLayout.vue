<template>
  <div v-if="$route.name">
    <app-header @click="drawer = true" :isLoading="isLoading" :isError="isError"></app-header>

    <div v-if="isLoading" class="page-loader">
      <v-progress-circular :size="80" :width="7" color="primary" indeterminate></v-progress-circular>
    </div>

    <div v-else-if="isError" style="height: 100vh">
      <internal-error-msg></internal-error-msg>
    </div>

    <div v-else>
      <v-card v-bind:style="sidePanelContainerStyle" flat tile>
        <side-panel v-if="showPanel && isMdAndUp" :user="user" :offsetTop="headerHeight"></side-panel>
        <side-panel-toggle
          v-else-if="showPanel && !isMdAndUp"
          :open="drawer"
          :user="user"
          @open-update="updateDrawer"
          :offsetTop="headerHeight"
        ></side-panel-toggle>

        <div v-bind:style="contentStyle">
          <slot></slot>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapGetters } from 'vuex';
import firebase from '@/services/firebase';
import InternalErrorMsg from '@/ui/shared/InternalErrorMsg.vue';
import AppHeader from './AppHeader.vue';
import SidePanel from './SidePanel.vue';
import SidePanelToggle from './SidePanelToggle.vue';

export default {
  name: 'PageLayout',
  components: {
    SidePanel,
    SidePanelToggle,
    AppHeader,
    InternalErrorMsg,
  },
  created() {
    if (!this.user.data) this.getUser(firebase.auth().currentUser.uid);
  },
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    ...mapGetters('users', {
      user: 'user',
    }),
    isMdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
    isLoading() {
      if (this.user.data) {
        const { setup = {} } = this.user.data;
        if (this.showPanel && !setup.accountVerified) {
          this.$router.replace({ name: 'onboarding' });
        } else if (this.$route.name === 'onboarding' && setup.accountVerified) {
          this.$router.replace({ name: 'projects' });
        }
      }
      return this.user.loading;
    },
    isError() {
      return this.user.error;
    },
    headerHeight() {
      return this.$vuetify.breakpoint.smAndDown ? 56 : 64;
    },
    sidePanelWidth() {
      const miniPanel = get(this.user, 'data.panelMini');
      return miniPanel ? 56 : 256;
    },
    showPanel() {
      const routes = ['onboarding', 'legal/service-terms', 'legal/privacy-policy'];
      return routes.every((route) => this.$route.name !== route);
    },
    sidePanelContainerStyle() {
      return {
        position: 'relative',
        height: `calc((var(--vh, 1vh) * 100) - ${this.headerHeight}px)`,
      };
    },
    contentStyle() {
      return {
        margin:
          this.isMdAndUp && this.showPanel
            ? `${this.headerHeight}px 0 0 ${this.sidePanelWidth}px`
            : `${this.headerHeight}px 0 0 0`,
        height: `calc((var(--vh, 1vh) * 100) - ${this.headerHeight}px)`,
      };
    },
  },
  methods: {
    // vuex methods
    ...mapActions('users', {
      getUser: 'getUser',
    }),
    // local methods
    updateDrawer(val) {
      this.drawer = val;
    },
  },
};
</script>
