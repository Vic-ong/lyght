<template>
  <v-img :src="img">
    <v-card class="vh-100 d-flex justify-center align-center transparent" flat>
      <slot></slot>
    </v-card>
  </v-img>
</template>

<script>
import landingPageImg from '@/assets/landing-page-bg.jpg';

export default {
  name: 'LandingPageLayout',
  computed: {
    img() {
      return landingPageImg;
    },
  },
};
</script>
