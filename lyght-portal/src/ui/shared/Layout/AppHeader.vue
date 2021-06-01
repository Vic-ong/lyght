<template>
  <v-app-bar v-bind:fixed="isMdAndUp" v-bind:absolute="!isMdAndUp" color="primary">
    <v-app-bar-nav-icon v-if="!isMdAndUp" @click="$emit('click')"></v-app-bar-nav-icon>

    <router-link to="/projects" :class="{ 'ml-5': !isMdAndUp }">
      <v-img :src="appLogo" max-width="100" />
    </router-link>

    <v-spacer></v-spacer>

    <language-selector v-if="!isLoading && !isError"></language-selector>
  </v-app-bar>
</template>

<script>
import appLogo from '@/assets/lyght-white@2x.png';
import LanguageSelector from '@/ui/shared/LanguageSelector.vue';

export default {
  name: 'AppHeader',
  components: {
    LanguageSelector,
  },
  props: ['isLoading', 'isError'],
  data() {
    return {
      appLogo,
    };
  },
  computed: {
    isMdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
  },
};
</script>
