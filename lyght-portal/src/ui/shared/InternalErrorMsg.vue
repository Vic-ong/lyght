<template>
  <div class="error-page px-3">
    <v-card max-width="600" class="pa-7">
      <div class="text-emphasis grey--text" style="font-size: 70px">500</div>
      <div class="text-subheading black--text" style="text-align: left">
        {{ $t('InternalError-Desc') }}
      </div>
      <div class="text-body black--text py-3" style="text-align: left">
        {{ $t('InternalError-Help') }}
        <a href="mailto:support@lyght.com.tw">{{ $t('InternalError-HelpLink') }}</a>
      </div>
      <v-card-actions class="justify-center">
        <v-btn @click="resetApp" :loading="loading" color="primary">{{ $t('InternalError-ReloadButton') }}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import firebase from '@/services/firebase';

export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async resetApp() {
      this.loading = true;
      await firebase.auth().signOut();
      if (this.$route.name !== 'login') this.$router.replace({ name: 'login' });
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.error-page {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
