<template>
  <v-card :min-width="minWidth" class="rounded-xl elevation-7" :min-height="minHeight">
    <transition name="transition-scale-center" mode="out-in">
      <loading-state v-if="loading" key="loading" :title="signingInText" :min-height="minHeight"></loading-state>
      <div v-else key="rendered" class="pa-7">
        <v-img :src="logo" height="30" contain></v-img>
        <v-form ref="form" v-model="valid" style="height: 100%" class="pt-5" lazy-validation>
          <v-text-field
            v-model="input.email"
            :label="emailField.label"
            :rules="emailField.rules"
            validate-on-blur
            dense
            filled
            rounded
            required
          ></v-text-field>
          <v-text-field
            v-model="input.password"
            :label="passwordField.label"
            :rules="passwordField.rules"
            :append-icon="passwordField.hideValue ? 'mdi-eye-off' : 'mdi-eye'"
            :type="passwordField.hideValue ? 'password' : 'text'"
            @click:append="passwordField.hideValue = !passwordField.hideValue"
            validate-on-blur
            dense
            filled
            rounded
            required
          ></v-text-field>
        </v-form>
        <div class="d-flex justify-center">
          <btn-main @click="signInHandler" color="primary">Sign In</btn-main>
        </div>
        <div class="divider-line my-5"></div>
        <div class="text-body text-center">Or sign in with</div>
        <div class="d-flex justify-center mt-4">
          <component
            v-for="item in providers"
            v-bind:key="item.key"
            :is="item.component"
            :loadingHandler="loadingHandler"
            :successHandler="successHandler"
            :errorHandler="errorHandler"
            class="mx-2"
          ></component>
        </div>
      </div>
    </transition>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import firebase from '@/services/firebase';
import v from '@/utils/validations';
import logoGreenSm from '@/assets/lyght-logo-green-sm.png';
import GoogleLogin from './components/GoogleLogin.vue';
import FacebookLogin from './components/FacebookLogin.vue';

export default {
  name: 'Login',
  data() {
    return {
      valid: true,
      input: {
        email: '',
        password: '',
      },
      emailField: {
        label: 'Email',
        rules: [v.required(), v.email()],
      },
      passwordField: {
        label: 'Password',
        rules: [v.required()],
        hideValue: true,
      },
      loading: false,
      signingInText: 'Authenticating...',
      minWidth: 400,
      minHeight: 400,
    };
  },
  computed: {
    logo() {
      return logoGreenSm;
    },
    providers() {
      return [
        { key: 'google', component: GoogleLogin },
        { key: 'facebook', component: FacebookLogin },
      ];
    },
  },
  methods: {
    ...mapActions('users', ['createUser']),

    validate() {
      this.valid = this.$refs.form.validate();
    },
    async signInHandler() {
      this.validate();
      if (this.valid) {
        try {
          this.loadingHandler();
          await firebase.auth().signInWithEmailAndPassword(this.input.email, this.input.password);
          this.successHandler();
        } catch (err) {
          this.errorHandler();
        }
      }
    },
    loadingHandler() {
      this.loading = true;
    },
    successHandler() {
      this.$router.replace({ name: 'users' });
    },
    errorHandler() {
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.divider-line {
  border-bottom: 1px solid var(--v-bg-light-base);
}
</style>
