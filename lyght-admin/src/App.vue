<template>
  <v-app>
    <div v-if="!authenticated">
      <landing-page-layout>
        <router-view></router-view>
      </landing-page-layout>
    </div>

    <div v-else class="background" style="min-height: 100vh">
      <transition name="transition-fade" mode="out-in">
        <splash-screen v-if="isLoading" key="loading"></splash-screen>
        <error-state v-else-if="isError" key="error" min-height="100vh"></error-state>

        <div v-else key="rendered">
          <authenticated-layout>
            <transition name="transition-fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </authenticated-layout>
        </div>
      </transition>
    </div>
  </v-app>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import { mapActions, mapGetters } from 'vuex';
import LandingPageLayout from '@/ui/shared/Layouts/LandingPageLayout.vue';
import AuthenticatedLayout from '@/ui/shared/Layouts/AuthenticatedLayout.vue';
import SplashScreen from '@/ui/shared/Loaders/SplashScreen.vue';

export default {
  name: 'App',
  components: {
    LandingPageLayout,
    AuthenticatedLayout,
    SplashScreen,
  },
  data() {
    return {
      authenticated: false,
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.checkAccess(user);
      } else {
        this.authenticated = false;
      }
    });
  },
  computed: {
    ...mapGetters('users', ['user']),

    isLoading() {
      return this.user.loading;
    },
    isError() {
      return this.user.error;
    },
  },
  methods: {
    ...mapActions('users', ['getMyUserData']),

    async checkAccess(user) {
      const idToken = await user.getIdTokenResult();
      const { claims } = idToken;
      if (claims.isAdmin === true) {
        this.authenticated = true;
        if (!this.user.data) this.getMyUserData();
      } else {
        this.signOut();
        this.authenticated = false;
      }
    },
    signOut() {
      console.error('Unauthorized access!');
      return firebase.auth().signOut();
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Karla, Helvetica, Roboto, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
