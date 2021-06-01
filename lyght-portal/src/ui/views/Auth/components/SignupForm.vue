<template>
  <div>
    <div v-if="loading" class="page-loader">
      <div class="text-title mb-5">{{ $t('AuthDesc-SignupProgress') }}</div>
      <v-progress-circular :size="80" :width="7" color="primary" indeterminate></v-progress-circular>
    </div>
    <div v-else>
      <v-form ref="form" v-model="valid" v-on:keyup.native.enter="submitFormHandler" lazy-validation>
        <div class="text-title">{{ $t('AuthDesc-SignupTitle') }}</div>
        <div class="mt-7">
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
          <v-text-field
            v-model="input.password2"
            :label="$t('Field-RetypePassword')"
            :rules="passwordMatchRules"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            validate-on-blur
            outlined
            required
          ></v-text-field>
        </div>
        <status-info :color="statusColor">{{ statusText }}</status-info>
        <lyght-button @click="submitFormHandler" @keyup.enter.native="submitFormHandler">
          {{ $t('Button-Signup') }}
        </lyght-button>
      </v-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import firebase from '@/services/firebase';
import status from '@/mixins/status';
import { getGoogleLanguageCode } from '@/utils/locale';
import form from '@/utils/validation/form';

export default {
  name: 'Signup',
  mixins: [status],
  created() {
    if (!this.userAuth) this.loading = false;
  },
  data() {
    return {
      valid: true,
      loading: true,
      input: {
        email: '',
        password: '',
        password2: '',
      },
      showPassword: false,
    };
  },
  computed: {
    userAuth() {
      return firebase.auth().currentUser;
    },
    emailRules() {
      return [form.required(this.t), form.email(this.t)];
    },
    passwordRules() {
      return [form.required(this.t)];
    },
    passwordMatchRules() {
      return [form.required(this.t), (v) => v === this.input.password || this.$t('Status-PasswordMismatch')];
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

          const res = await this.createAccount();
          await this.createUserProfile(res.user.uid);

          // send email verfication if not verified
          if (!res.user.emailVerified) {
            const lang = getGoogleLanguageCode(this.$i18n.locale);
            firebase.auth().languageCode = lang;
            await firebase.auth().currentUser.sendEmailVerification();
          }

          await this.login();
          this.$router.replace({ name: 'onboarding' });
        } catch (err) {
          this.loading = false;
          this.setStatusError(err);
        }
      }
    },

    createAccount() {
      return firebase.auth().createUserWithEmailAndPassword(this.input.email, this.input.password);
    },
    login() {
      return firebase.auth().signInWithEmailAndPassword(this.input.email, this.input.password);
    },
    createUserProfile(_id) {
      const userProfile = {
        _id,
        active: true,
        email: this.input.email,
        language: this.$i18n.locale,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return this.createUser(userProfile);
    },
  },
};
</script>
