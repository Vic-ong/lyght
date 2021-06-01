<template>
  <div>
    <transition name="transition-fade" mode="out-in">
      <component v-bind:is="componentView" :data="data"></component>
    </transition>
  </div>
</template>

<script>
import firebase from '@/services/firebase';
import CreateIdentityForm from './CreateIdentityForm.vue';
import IdentityForm from './IdentityForm.vue';
import identityUnderReview from './IdentityUnderReview.vue';

export default {
  props: ['data'],
  computed: {
    userAuth() {
      return firebase.auth().currentUser;
    },
    componentView() {
      const { setup = {} } = this.data;

      if (setup.identityVerification === 'approved') {
        return IdentityForm;
      }
      if (setup.identityVerification === 'pending') {
        return identityUnderReview;
      }
      return CreateIdentityForm;
    },
  },
};
</script>
