<template>
  <div class="page-container">
    <div class="page-content">
      <div class="title-container">
        <div class="text-title mt-3 mb-3">{{ $t('NewUser-Welcome') }}</div>
        <v-spacer></v-spacer>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <div @click="signOutHandler" v-bind="attrs" v-on="on" class="signout-button">
              <v-icon color="primary mr-2" small>mdi-logout</v-icon>
              <div class="text-body">{{ $t('Button-Signout') }}</div>
            </div>
          </template>
          <div class="text-body white--text pa-2" style="max-width: 250px">{{ $t('NewUser-SignoutTooltip') }}</div>
        </v-tooltip>
      </div>

      <div v-if="isLoading" class="page-loader">
        <v-progress-circular :size="80" :width="7" color="primary" indeterminate></v-progress-circular>
      </div>

      <div v-else-if="isError" class="pt-10">
        <internal-error-msg></internal-error-msg>
      </div>

      <div v-else>
        <v-stepper v-model="step" class="onboarding-container" vertical>
          <div v-for="({ titleKey, component }, i) in steps" v-bind:key="titleKey">
            <v-stepper-step :complete="step > i + 1" :step="i + 1" class="pa-0 pt-3 pb-3">
              {{ $t(titleKey) }}
            </v-stepper-step>
            <v-stepper-content :step="i + 1" class="pa-2 pl-0">
              <div class="pa-2 pb-4 pr-12">
                <component v-if="step === i + 1" :is="component" :user="user" @next="handleNext" />
              </div>
            </v-stepper-content>
          </div>
        </v-stepper>
      </div>
    </div>
  </div>
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { mapGetters } from 'vuex';
import InternalErrorMsg from '@/ui/shared/InternalErrorMsg.vue';
import EmailVerification from './components/EmailVerification.vue';
import MobileVerification from './components/MobileVerification.vue';
import GeneralInfo from './components/GeneralInfo.vue';

export default {
  name: 'Onboarding',
  components: {
    InternalErrorMsg,
  },
  data() {
    return {
      step: 1,
      steps: [
        {
          titleKey: 'NewUser-Step-Username',
          component: GeneralInfo,
        },
        {
          titleKey: 'NewUser-Step-EmailVerification',
          component: EmailVerification,
        },
        {
          titleKey: 'NewUser-Step-MobileVerification',
          component: MobileVerification,
        },
      ],
    };
  },
  computed: {
    ...mapGetters('users', {
      user: 'user',
    }),
    isXs() {
      return this.$vuetify.breakpoint.xs;
    },
    userAuth() {
      return firebase.auth().currentUser;
    },
    isLoading() {
      return !this.userAuth || this.user.loading;
    },
    isError() {
      return !this.userAuth || this.user.error;
    },
  },
  methods: {
    handleNext(step) {
      this.step = step;
    },
    signOutHandler() {
      try {
        this.signOut().then(() => {
          this.$router.replace({ name: 'login' });
        });
      } catch (err) {
        console.error(err);
      }
    },
    signOut() {
      return firebase.auth().signOut();
    },
  },
};
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  .page-content {
    display: flex;
    flex-direction: column;
    max-width: 800px;
  }
}
.title-container {
  display: flex;
  align-items: center;
}
.signout-button {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.onboarding-container {
  box-shadow: none;
}
</style>
