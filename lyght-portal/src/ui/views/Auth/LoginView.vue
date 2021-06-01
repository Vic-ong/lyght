<template>
  <div class="page-container">
    <v-row no-gutters>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="6" style="position: relative">
        <v-img :src="homeImg" height="100%" class="primary" style="position: absolute">
          <div class="img-caption pa-10 pb-15">
            <div><v-img :src="appLogo" max-width="100"></v-img></div>
            <div class="background--text">{{ $t('CompanySlogan') }}</div>
          </div>
        </v-img>
      </v-col>

      <v-col :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'">
        <div class="form-container">
          <div class="lang-selector">
            <language-selector></language-selector>
          </div>

          <div :style="formContentStyle">
            <login-form></login-form>

            <div class="switch text-body primary--text">
              <span @click="resetPasswordFormHandler" class="cursor-pointer">{{ $t('AuthDesc-ForgotPassword') }}</span>

              <v-dialog v-model="dialog" max-width="400">
                <v-card class="pa-7">
                  <div class="text-subheading-medium">{{ $t('AuthDesc-ForgotPassword') }}</div>
                  <div class="text-hint grey--text mt-3">{{ $t('AuthDesc-ForgotPasswordDesc') }}</div>

                  <div class="mt-10">
                    <v-form ref="form" v-model="valid" @submit.prevent lazy-validation>
                      <v-text-field
                        v-model="input"
                        :label="$t('Field-Email')"
                        :rules="emailRules"
                        validate-on-blur
                        outlined
                        required
                      ></v-text-field>
                    </v-form>
                  </div>

                  <v-card-text v-if="statusText">
                    <status-info :color="statusColor">{{ statusText }}</status-info>
                  </v-card-text>

                  <v-card-actions class="justify-center">
                    <lyght-button v-if="resetPasswordSent" @click="dialog = false">
                      {{ $t('Button-Complete') }}
                    </lyght-button>
                    <lyght-button v-else @click="resetPasswordHandler" :loading="loading">
                      {{ $t('Button-Submit') }}
                    </lyght-button>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <div class="mt-3">
                {{ $t('AuthDesc-NotRegistered') }}
                <router-link :to="{ name: 'signup' }">{{ $t('AuthDesc-NotRegisteredLink') }}</router-link>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import status from '@/mixins/status';
import appLogo from '@/assets/lyght-white@2x.png';
import homeImg from '@/assets/home-image@2x.png';
import LanguageSelector from '@/ui/shared/LanguageSelector.vue';
import firebase from '@/services/firebase';
import form from '@/utils/validation/form';
import LoginForm from './components/LoginForm.vue';

export default {
  name: 'LoginView',
  components: {
    LanguageSelector,
    LoginForm,
  },
  mixins: [status],
  data() {
    return {
      appLogo,
      homeImg,
      resetPasswordSent: false,
      loading: false,
      dialog: false,
      valid: false,
      input: null,
      info: null,
    };
  },
  computed: {
    formContentStyle() {
      return {
        width: this.$vuetify.breakpoint.xs ? '280px' : '400px',
      };
    },
    emailRules() {
      return [form.required(this.t), form.email(this.t)];
    },
  },
  methods: {
    t(v, params) {
      return this.$t(v, params);
    },
    validate() {
      this.valid = this.$refs.form.validate();
    },
    resetPasswordFormHandler() {
      this.resetPasswordSent = false;
      this.loading = false;
      this.dialog = true;
    },
    resetPasswordHandler() {
      this.clearStatus();
      this.validate();
      if (this.valid) {
        this.loading = true;
        firebase
          .auth()
          .sendPasswordResetEmail(this.input)
          .then(() => {
            this.setStatusInfo(this.$t('NewUser-VerifyEmailDesc'));
          })
          .catch((err) => {
            if (err.code === 'auth/user-not-found') {
              this.setStatusInfo(this.$t('NewUser-VerifyEmailDesc'));
            } else {
              this.setStatusError(err);
            }
          })
          .finally(() => {
            this.resetPasswordSent = true;
            this.loading = false;
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  height: 100vh;

  & > * {
    flex: 1;
  }
}
.form-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
}
.lang-selector {
  position: absolute;
  top: 12px;
  right: 12px;
}
.switch {
  text-align: left;
  margin-top: 24px;
  width: 100%;
}
.img-caption {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  & > div {
    width: 80%;
    font-size: 56px;
    font-weight: 600;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }
}
</style>
