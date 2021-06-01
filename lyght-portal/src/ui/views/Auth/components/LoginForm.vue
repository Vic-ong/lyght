<template>
  <v-form ref="form" v-model="valid" v-on:keyup.native.enter="submitFormHandler" lazy-validation>
    <div v-if="loading" class="page-loader">
      <div class="text-title mb-5">{{ $t('AuthDesc-LoginProgress') }}</div>
      <v-progress-circular :size="80" :width="7" color="primary" indeterminate></v-progress-circular>
    </div>
    <div v-else>
      <div class="text-title">{{ $t('AuthDesc-LoginTitle') }}</div>
      <div class="text-body">{{ $t('AuthDesc-LoginSubheading') }}</div>
      <div class="d-flex flex-column mt-7">
        <FacebookLoginButton @onLoadingChange="loading = true" @error="setError"></FacebookLoginButton>
        <GoogleLoginButton @onLoadingChange="loading = true" class="mt-3" @error="setError"></GoogleLoginButton>
      </div>
      <DividerLineWithText>OR</DividerLineWithText>
      <div class="mt-10">
        <v-text-field
          v-model="input.email"
          :label="$t('Field-Email')"
          :rules="emailRules"
          validate-on-blur
          outlined
          required
        ></v-text-field>
        <v-text-field
          v-model="input.password"
          :label="$t('Field-Password')"
          :rules="passwordRules"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          validate-on-blur
          outlined
          required
        ></v-text-field>
      </div>
      <status-info :color="statusColor">{{ statusText }}</status-info>
      <lyght-button @click="submitFormHandler" :loading="loading">{{ $t('Button-Login') }}</lyght-button>
    </div>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex';
import firebase from '@/services/firebase';
import status from '@/mixins/status';
import form from '@/utils/validation/form';
import { DividerLineWithText } from '@/components/Divider';
import FacebookLoginButton from './FacebookLoginButton.vue';
import GoogleLoginButton from './GoogleLoginButton.vue';
import { getErrorMessage } from './utils';

export default {
  name: 'Login',
  components: {
    FacebookLoginButton,
    GoogleLoginButton,
    DividerLineWithText,
  },
  mixins: [status],
  data() {
    return {
      valid: true,
      input: {
        email: '',
        password: '',
      },
      showPassword: false,
      loading: false,
    };
  },
  computed: {
    emailRules() {
      return [form.required(this.t), form.email(this.t)];
    },
    passwordRules() {
      return [form.required(this.t)];
    },
  },
  methods: {
    ...mapActions('users', {
      createUser: 'createUser',
    }),
    t(v, params) {
      return this.$t(v, params);
    },
    validate() {
      this.valid = this.$refs.form.validate();
    },
    async submitFormHandler() {
      this.clearStatus();
      this.validate();
      if (this.valid) {
        try {
          this.loading = true;
          await this.login();
          this.$router.replace({ name: 'onboarding ' });
        } catch (err) {
          this.setError(err);
        }
      }
    },
    login() {
      return firebase.auth().signInWithEmailAndPassword(this.input.email, this.input.password);
    },
    sendResetPasswordEmail() {
      return firebase.auth().sendPasswordResetEmail(this.input.email);
    },
    setError(err) {
      this.loading = false;
      this.setStatusError(getErrorMessage(err, this.t));
    },
  },
};
</script>
