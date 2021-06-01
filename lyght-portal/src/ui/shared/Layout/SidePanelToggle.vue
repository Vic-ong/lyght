<template>
  <v-navigation-drawer v-model="drawer" absolute temporary class="elevation-5">
    <div>
      <side-panel-content :user="user"></side-panel-content>
    </div>

    <div @click="signOutHandler" class="nav-item item-bottom">
      <div class="nav-icon">
        <v-icon color="primary" small>{{ logoutNav.icon }}</v-icon>
      </div>
      <div class="text-body">
        {{ $t(logoutNav.nameKey) }}
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import firebase from '@/services/firebase';
import SidePanelContent from './SidePanelContent.vue';

export default {
  name: 'SidePanel',
  components: {
    SidePanelContent,
  },
  props: {
    open: {
      type: Boolean,
      default: true,
    },
    offsetTop: {
      type: Number,
      default: 64,
    },
    user: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    open(val) {
      if (this.drawer !== val) {
        this.drawer = val;
      }
    },
    drawer(val) {
      if (this.open !== val) {
        this.$emit('open-update', val);
      }
    },
  },
  data() {
    return {
      drawer: false,
      logoutNav: {
        key: 'logout',
        icon: 'mdi-logout',
        nameKey: 'Button-Signout',
      },
    };
  },
  methods: {
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
  },
};
</script>

<style lang="scss" scoped>
.nav-item {
  cursor: pointer;
  text-decoration: none !important;
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 24px;
  .nav-icon {
    margin-right: 12px;
  }
}
.item-bottom {
  position: absolute;
  bottom: 12px;
}
</style>
