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
            <signup-form></signup-form>

            <div class="switch text-body primary--text">
              <div>
                {{ $t('AuthDesc-Registered') }}
                <router-link :to="{ name: 'login' }">{{ $t('AuthDesc-RegisteredLink') }}</router-link>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import appLogo from '@/assets/lyght-white@2x.png';
import homeImg from '@/assets/home-image@2x.png';
import LanguageSelector from '@/ui/shared/LanguageSelector.vue';
import SignupForm from './components/SignupForm.vue';

export default {
  name: 'SignupView',
  components: {
    SignupForm,
    LanguageSelector,
  },
  data() {
    return {
      appLogo,
      homeImg,
    };
  },
  computed: {
    formContentStyle() {
      return {
        width: this.$vuetify.breakpoint.xs ? '280px' : '400px',
      };
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
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  position: relative;
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
.picture-container {
  position: relative;
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
