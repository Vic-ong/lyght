<template>
  <SocialButton v-bind="$attrs" @click="clickHandler" type="facebook" />
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { mapActions } from 'vuex';
import { getGoogleLanguageCode } from '@/utils/locale';
import { SocialButton } from '@/components/Button';

const facebookProvider = new firebase.auth.FacebookAuthProvider();

export default {
  name: 'FacebookLoginButton',
  components: {
    SocialButton,
  },
  methods: {
    ...mapActions('users', ['createUserSocial']),

    createUserProfile(user) {
      const { uid: _id, email, phoneNumber, displayName } = user;
      const userProfile = {
        _id,
        active: true,
        displayName,
        email,
        phoneNumber,
        language: this.$i18n.locale,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return this.createUserSocial(userProfile);
    },
    async clickHandler() {
      this.setLoading();
      try {
        const res = await this.login();
        await this.createUserProfile(res.user);
        await this.sendEmailVerification();

        this.$router.replace({ name: 'onboarding' });
      } catch (err) {
        this.$emit('error', err);
      }
    },
    setLoading() {
      this.$emit('loading');
    },
    login() {
      return firebase.auth().signInWithPopup(facebookProvider);
    },
    sendEmailVerification() {
      const lang = getGoogleLanguageCode(this.$i18n.locale);
      firebase.auth().languageCode = lang;

      return firebase.auth().currentUser.sendEmailVerification();
    },
  },
};
</script>
