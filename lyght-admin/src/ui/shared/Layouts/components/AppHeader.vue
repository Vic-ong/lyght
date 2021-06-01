<template>
  <v-app-bar :style="toolbarStyle" class="background" flat fixed>
    <v-btn v-if="$vuetify.breakpoint.xs" @click="$emit('open-menu')" icon>
      <v-icon color="bg-dark" size="20">$fi-sr-menu-burger</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-menu bottom offset-y origin="center center" transition="scale-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-card
          v-bind="attrs"
          v-on="on"
          class="d-flex justify-center align-center transparent disable-ripple pa-2"
          v-ripple="false"
          flat
        >
          <v-card class="rounded-btn">
            <v-img :src="profileImg" :height="profileImgSize" :width="profileImgSize"></v-img>
          </v-card>
          <div class="text-subheading mx-4">{{ profileName }}</div>
          <btn-icon color="transparent">
            <v-icon color="bg-dark" size="16">$fi-sr-caret-down</v-icon>
          </btn-icon>
        </v-card>
      </template>

      <v-list>
        <v-list-item>
          <v-list-item-title @click="signOutHandler" class="cursor-pointer">Sign Out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import get from 'lodash/get';
import firebase from '@/services/firebase';
import { mapGetters } from 'vuex';
import { navBarProps } from '../props';

export default {
  name: 'AppHeader',
  computed: {
    ...mapGetters('users', ['user']),

    navBarWidth() {
      return navBarProps().width;
    },
    toolbarStyle() {
      const { xs } = this.$vuetify.breakpoint;
      return {
        marginLeft: xs ? 'unset' : `${this.navBarWidth}px`,
      };
    },
    profileImg() {
      return get(this.user, 'data.profilePhoto.url');
    },
    profileImgSize() {
      return this.$vuetify.breakpoint.xs ? 35 : 40;
    },
    profileName() {
      return get(this.user, 'data.displayName');
    },
  },
  methods: {
    async signOutHandler() {
      await firebase.auth().signOut();
      this.$router.replace({ name: 'login' });
    },
  },
};
</script>
