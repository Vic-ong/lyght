<template>
  <TermsContainer :terms="terms" :titleKey="titleKey"></TermsContainer>
</template>

<script>
import TermsContainer from './components/TermsContainer.vue';
import termsEn from './components/PrivacyPolicy/termsEn.json';
import termsZhHant from './components/PrivacyPolicy/termsZhHant.json';

export default {
  name: 'PrivacyPolicy',
  components: {
    TermsContainer,
  },
  data() {
    return {
      terms: {
        0: {
          data: termsEn,
          lastUpdated: '2020-12-30',
        },
        1: {
          data: termsZhHant,
          lastUpdated: '1100105',
        },
      },
      titleKey: 'NewUser-PrivacyPolicy-Title',
    };
  },
};
</script>
