<template>
  <v-btn @click="signInHandler" color="#3C5A99" height="60" width="60" class="rounded-xl">
    <v-icon color="white">mdi-facebook</v-icon>
  </v-btn>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

const provider = new firebase.auth.FacebookAuthProvider();

export default {
  name: 'GoogleLogin',
  props: {
    loadingHandler: { type: Function },
    successHandler: { type: Function },
    errorHandler: { type: Function },
  },
  methods: {
    emit(eventName, value) {
      return new Promise((resolve) => {
        this.$emit(eventName, value);
        this.$nextTick(resolve);
      });
    },
    async signInHandler() {
      this.loadingHandler();
      this.signInWithGoogle();
    },
    async signInWithGoogle() {
      try {
        await firebase.auth().signInWithPopup(provider);
        this.successHandler();
      } catch (err) {
        this.errorHandler();
      }
    },
  },
};
</script>
