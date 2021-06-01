<template>
  <div>
    <v-card class="pa-7 mb-7 elevation-3">
      <div class="d-flex align-center mb-5">
        <v-icon class="mr-3" color="primary">mdi-cellphone-key</v-icon>
        <span class="text-subheading">{{ $t('NewUser-VerifyMobileTitle') }}</span>
      </div>
      <v-form ref="form" v-model="valid" @submit.prevent lazy-validation>
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="input.countryCode"
              :items="countryCode.items"
              :label="$t('Field-CountryCode')"
              :rules="countryCode.rules"
              :disabled="loading"
              validate-on-blur
              outlined
              required
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="input.phoneNumber"
              :label="$t('Field-MobileNumber')"
              :rules="phoneNumberRules"
              :disabled="loading"
              validate-on-blur
              outlined
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
    <status-info v-if="statusText" :color="statusColor">{{ statusText }}</status-info>
    <div class="text-body mb-2">{{ $t('NewUser-VerifyMobileNote') }}</div>
    <div>
      <div id="recaptcha-container"></div>
    </div>
    <lyght-button color="primary" :disabled="disabled" :loading="loading" @click="verifyMobile">
      {{ $t('Button-Verify') }}
    </lyght-button>
    <v-dialog v-model="codeVerifyDialog" max-width="400px" persistent>
      <v-card>
        <v-card-actions class="justify-end">
          <v-btn @click="resetHandler" icon><v-icon>mdi-close</v-icon></v-btn>
        </v-card-actions>
        <v-form ref="formCodeVerifier" v-model="validCode" class="px-7 pb-5" lazy-validation>
          <div class="text-title">{{ $t('NewUser-VerifyMobileDialogTitle') }}</div>
          <div class="text-body mb-5">
            {{ $t('NewUser-VerifyMobileDialogDesc', { number: phoneNumberDisplay }) }}
          </div>
          <v-text-field
            v-model="input.code"
            :label="$t('Field-MobileVerificationCode')"
            :placeholder="$t('Field-MobileVerificationPlaceholder')"
            :rules="codeRules"
            :loading="loading"
            :disabled="loading"
            validate-on-blur
            outlined
            required
          ></v-text-field>
          <div class="text-body black--text">
            {{ $t('NewUser-VerifyMobileHelp') }}
            <span @click="resetHandler" class="cursor-pointer" style="text-decoration: underline">
              {{ $t('NewUser-VerifyMobileHelpLink') }}
            </span>
          </div>
          <v-card-actions class="justify-center">
            <lyght-button color="primary" class="mt-3" :loading="loading" @click="verifyCodeHandler">
              {{ $t('Button-Submit') }}
            </lyght-button>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { mapActions } from 'vuex';
import status from '@/mixins/status';
import { sendCode, verifyCode } from '@/services/functions/auth';
import phoneCountryCodeList from '@/constants/phoneCountryCodeList.json';
import form from '@/utils/validation/form';

export default {
  name: 'MobileVerification',
  mixins: [status],
  props: {
    user: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    firebase.auth().useDeviceLanguage();
  },
  mounted() {
    if (this.user.data.setup && this.user.data.setup.accountVerified) {
      this.$router.replace({ name: 'projects' });
    }
    this.initRecaptcha();
  },
  data() {
    return {
      valid: true,
      loading: false,
      disabled: false,
      input: {
        countryCode: '+886',
        phoneNumber: null,
        code: null,
        sessionInfo: null,
      },
      codeVerifyDialog: false,
      validCode: true,
    };
  },
  computed: {
    userAuth() {
      return firebase.auth().currentUser;
    },
    isXs() {
      return this.$vuetify.breakpoint.xs;
    },
    countryCode() {
      return {
        items: phoneCountryCodeList.map((item) => ({
          text: `${item.name} (${item.dial_code})`,
          value: item.dial_code,
        })),
        rules: [form.required(this.t)],
      };
    },
    phoneNumberRules() {
      return [form.required(this.t), form.phoneNumber(this.t)];
    },
    codeRules() {
      return [form.required(this.t), form.number(this.t), form.exactLength(this.t, { len: 6 })];
    },
    phoneNumberDisplay() {
      return this.input.phoneNumber ? this.input.phoneNumber.toString().slice(5) : null;
    },
    fullPhoneNumber() {
      return `${this.input.countryCode}${this.input.phoneNumber}`;
    },
  },
  methods: {
    ...mapActions('users', {
      createAuth: 'createAuth',
      updateUser: 'updateUser',
    }),
    t(v, params) {
      return this.$t(v, params);
    },
    initRecaptcha() {
      // Start Firebase invisible reCAPTCHA verifier
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback() {
          // reCAPTCHA solved, return token.
        },
      });
    },
    validateForm() {
      this.valid = this.$refs.form.validate();
    },
    validateCodeForm() {
      this.validCode = this.$refs.formCodeVerifier.validate();
    },
    async verifyMobile() {
      this.clearStatus();
      this.validateForm();
      if (this.valid) {
        try {
          this.disabled = true;
          this.loading = true;

          const appVerifier = window.recaptchaVerifier;
          const recaptchaToken = await appVerifier.verify();

          this.codeVerifyDialog = true;
          const res = await sendCode({
            userId: this.userAuth.uid,
            phoneNumber: this.fullPhoneNumber,
            recaptchaToken,
          });
          this.input.sessionInfo = res.data.result.sessionInfo;
          this.loading = false;
        } catch (err) {
          this.codeVerifyDialog = false;
          this.loading = false;
          this.disabled = false;
          this.setStatusError(err);
        }
      }
    },
    async verifyCodeHandler() {
      this.clearStatus();
      this.validateCodeForm();
      if (this.validCode) {
        try {
          this.loading = true;
          const { code, sessionInfo } = this.input;
          await verifyCode({ code, sessionInfo });

          await this.setUserAccess();
          await this.updateUserProfile();

          this.codeVerifyDialog = false;
          // auto re-route when data is user data is updated
        } catch (err) {
          this.loading = false;
          this.disabled = false;
          this.codeVerifyDialog = false;
          this.setStatusError(err);
        }
      }
    },
    resetHandler() {
      window.location.reload(true);
    },
    async setUserAccess() {
      await this.createAuth({
        _id: this.userAuth.uid,
        email: this.user.data.email,
      });
      // Force token refresh. The token claims will contain the additional claims.
      firebase.auth().currentUser.getIdToken(true);
    },
    async updateUserProfile() {
      const param = {
        id: this.userAuth.uid,
        phoneNumber: this.fullPhoneNumber,
        setup: {
          accountVerified: true,
        },
      };
      await this.updateUser(param);
    },
  },
};
</script>
