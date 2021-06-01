<template>
  <v-navigation-drawer :mini-variant="mini" permanent fixed clipped floating class="elevation-5">
    <div v-bind:style="panelStyle">
      <div class="d-flex" :class="mini ? 'justify-center' : 'justify-end'">
        <v-btn @click="toggleMini(!mini)" :disabled="disabled" class="transparent" tile depressed>
          <v-icon>{{ `mdi-chevron-${mini ? 'right' : 'left'}` }}</v-icon>
        </v-btn>
      </div>
      <side-panel-content :user="user" :mini="mini"></side-panel-content>
    </div>

    <div v-if="!mini" @click="signOutHandler" class="d-flex align-center pa-4 nav-item item-bottom">
      <div class="mr-3">
        <v-icon color="primary">{{ logoutNav.icon }}</v-icon>
      </div>
      <div class="text-body">
        {{ $t(logoutNav.nameKey) }}
      </div>
    </div>
    <div v-else @click="signOutHandler" class="d-flex justify-center py-4 nav-item item-bottom" style="width: 100%">
      <v-tooltip v-model="show" right>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" color="primary">{{ logoutNav.icon }}</v-icon>
        </template>
        <span class="text-body white--text">{{ $t(logoutNav.nameKey) }}</span>
      </v-tooltip>
    </div>
  </v-navigation-drawer>
</template>

<script>
import get from 'lodash/get';
import { mapActions } from 'vuex';
import firebase from '@/services/firebase';
import SidePanelContent from './SidePanelContent.vue';

export default {
  name: 'SidePanel',
  components: {
    SidePanelContent,
  },
  props: {
    offsetTop: {
      type: Number,
      default: 64,
    },
    user: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      disabled: false,
      show: false,
      logoutNav: {
        key: 'logout',
        icon: 'mdi-logout',
        nameKey: 'Button-Signout',
      },
    };
  },
  computed: {
    userAuth() {
      return firebase.auth().currentUser;
    },
    userId() {
      return this.userAuth.uid;
    },
    panelStyle() {
      return {
        position: 'relative',
        marginTop: `${this.offsetTop}px`,
      };
    },
    mini() {
      return get(this.user, 'data.panelMini');
    },
  },
  methods: {
    ...mapActions('users', {
      updateUser: 'updateUser',
    }),
    signOutHandler() {
      try {
        this.signOut().then(() => {
          this.$router.replace({ name: 'login' });
        });
      } catch (err) {
        console.error(err);
      }
    },
    signOut() {
      return firebase.auth().signOut();
    },
    async toggleMini(status) {
      if (this.user.data) {
        try {
          this.disabled = true;
          await this.updateUser({
            id: this.userId,
            panelMini: status,
          });
          this.disabled = false;
        } catch (err) {
          this.disabled = false;
          console.error(err);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-item {
  cursor: pointer;
  text-decoration: none !important;
}
.item-bottom {
  position: absolute;
  bottom: 12px;
}
</style>
