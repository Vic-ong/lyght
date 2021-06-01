<template>
  <div>
    <v-card class="pa-7 mb-7 elevation-3">
      <div class="d-flex align-center mb-5">
        <v-icon class="mr-3" color="primary">mdi-email-lock</v-icon>
        <span class="text-subheading">{{ $t('NewUser-VerifyEmailTitle') }}</span>
      </div>
      <div class="text-body black--text">{{ $t('NewUser-VerifyEmailDesc') }}</div>
      <div class="text-body black--text">
        <div>
          {{ $t('NewUser-ResendVerifyEmail') }}
          <a @click="resendEmailHandler">
            {{ $t('NewUser-ResendVerifyEmailLink') }}
          </a>
        </div>
      </div>
      <status-info :color="statusColor">{{ statusText }}</status-info>
    </v-card>
    <lyght-button @click="handleNext" :loading="loading" color="primary">{{ $t('Button-Continue') }}</lyght-button>
  </div>
</template>

<script>
import firebase from '@/services/firebase';
import status from '@/mixins/status';
import { getGoogleLanguageCode } from '@/utils/locale';

export default {
  name: 'EmailVerification',
  mixins: [status],
  data() {
    return {
      checkForVerifiedInterval: null,
      loading: false,
      nextStep: 3,
    };
  },
  created() {
    if (this.isVerified()) this.$emit('next', this.nextStep);
    this.checkForVerifiedInterval = setInterval(() => {
      firebase
        .auth()
        .currentUser.reload()
        .then(() => {
          if (this.isVerified()) {
            clearInterval(this.checkForVerifiedInterval);
            this.$emit('next', this.nextStep);
          }
        });
    }, 1000);
  },
  beforeDestroy() {
    if (this.checkForVerifiedInterval) clearInterval(this.checkForVerifiedInterval);
  },
  methods: {
    isVerified() {
      return firebase.auth().currentUser.emailVerified === true;
    },
    sendEmailVerification() {
      this.clearStatus();
      const lang = getGoogleLanguageCode(this.$i18n.locale);
      firebase.auth().languageCode = lang;

      return firebase.auth().currentUser.sendEmailVerification();
    },
    resendEmailHandler() {
      this.clearStatus();
      this.loading = true;

      firebase
        .auth()
        .currentUser.reload()
        .then(() => {
          if (!this.isVerified()) {
            this.sendEmailVerification()
              .then(() => {
                this.loading = false;
                this.status = {
                  text: this.$t('Status-NewVerificationLink'),
                  color: 'info--text',
                };
              })
              .catch((err) => {
                this.loading = false;
                this.setStatusError(err);
              });
          } else {
            this.$emit('next', this.nextStep);
          }
        });
    },
    handleNext() {
      this.clearStatus();
      this.loading = true;

      firebase
        .auth()
        .currentUser.reload()
        .then(() => {
          if (this.isVerified()) {
            this.$emit('next', this.nextStep);
          } else {
            this.loading = false;
            this.setStatusError(this.$t('Status-EmailNotVerified'));
          }
        });
    },
  },
};
</script>
