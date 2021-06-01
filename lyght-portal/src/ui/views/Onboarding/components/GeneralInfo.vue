<template>
  <div>
    <v-card class="pa-7 mb-7 elevation-3">
      <v-form ref="form" v-model="valid" @submit.prevent lazy-validation>
        <div class="d-flex align-center mb-5">
          <v-icon class="mr-3" color="primary">mdi-account-circle</v-icon>
          <span class="text-subheading">{{ $t('NewUser-Personal-GeneralInfo') }}</span>
        </div>
        <username-form :input="input" :loading="loading"></username-form>

        <!-- Service terms -->
        <v-checkbox v-model="serviceTermCheckbox" :rules="termsRules">
          <template #label>
            <div class="text-body">
              {{ $t('NewUser-Personal-AgreeTo') }}
              <a @click.stop href="/legal/service-terms" target="_blank">
                {{ $t('NewUser-Personal-ServiceTermsLink') }}
              </a>
            </div>
          </template>
        </v-checkbox>

        <!-- Privacy policy -->
        <v-checkbox v-model="privacyPolicyCheckbox" :rules="termsRules">
          <template #label>
            <div class="text-body">
              {{ $t('NewUser-Personal-AgreeTo') }}
              <a @click.stop href="/legal/privacy-policy" target="_blank">
                {{ $t('NewUser-Personal-PrivacyPolicyLink') }}
              </a>
            </div>
          </template>
        </v-checkbox>
      </v-form>
    </v-card>

    <status-info v-if="statusText" :color="statusColor">{{ statusText }}</status-info>
    <lyght-button :loading="loading" @click="handleNext" color="primary">
      {{ $t('Button-Continue') }}
    </lyght-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import firebase from '@/services/firebase';
import status from '@/mixins/status';
import UsernameForm from '@/ui/shared/Forms/UsernameForm.vue';

export default {
  name: 'GeneralInfo',
  components: {
    UsernameForm,
  },
  mixins: [status],
  props: {
    user: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.initialize();
  },
  data() {
    return {
      valid: true,
      loading: false,
      input: {
        displayName: null,
        firstName: null,
        lastName: null,
      },
      serviceTermCheckbox: false,
      privacyPolicyCheckbox: false,
    };
  },
  computed: {
    userAuth() {
      return firebase.auth().currentUser;
    },
    userId() {
      return this.userAuth.uid;
    },
    isXs() {
      return this.$vuetify.breakpoint.xs;
    },
    termsRules() {
      return [(v) => !!v || this.$t('Status-AgreeToTerms')];
    },
  },
  methods: {
    ...mapActions('users', {
      updateUser: 'updateUser',
    }),
    initialize() {
      const d = this.user.data;

      Object.keys(this.input).forEach((field) => {
        if (this.hasData(d[field])) {
          this.input[field] = d[field];
        }
      });

      const complete = Object.keys(this.input).every((field) => this.hasData(d[field]));
      if (complete) {
        this.$emit('next', 2);
      }
    },
    hasData(v) {
      return !!v || v === 0 || v === false;
    },
    validate() {
      this.valid = this.$refs.form.validate();
    },
    async handleNext() {
      this.clearStatus();
      this.validate();
      if (this.valid) {
        this.loading = true;
        try {
          await this.updateUser({
            id: this.userId,
            ...this.input,
          });
          this.$emit('next', 2);
        } catch (err) {
          this.loading = false;
          this.setStatusError(this.$t('Status-InternalError'));
        }
      }
    },
  },
};
</script>
