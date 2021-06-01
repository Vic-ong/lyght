<template>
  <SocialButton v-bind="$attrs" @click="clickHandler" type="google" />
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { mapActions } from 'vuex';
import { getGoogleLanguageCode } from '@/utils/locale';
import { SocialButton } from '@/components/Button';

const googleProvider = new firebase.auth.GoogleAuthProvider();

export default {
  name: 'GoogleLoginButton',
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
    /**
     * Google login handlers
     */
    async clickHandler() {
      this.setLoading();
      try {
        const res = await this.login();

        // send email verfication if not verified
        if (!res.user.emailVerified) {
          const lang = getGoogleLanguageCode(this.$i18n.locale);
          firebase.auth().languageCode = lang;
          await firebase.auth().currentUser.sendEmailVerification();
        }

        await this.createUserProfile(res.user);
        this.$router.replace({ name: 'onboarding' });
      } catch (err) {
        this.$emit('error', err);
      }
    },
    login() {
      return firebase.auth().signInWithPopup(googleProvider);
    },
    setLoading() {
      this.$emit('loading');
    },
  },
};
</script>
