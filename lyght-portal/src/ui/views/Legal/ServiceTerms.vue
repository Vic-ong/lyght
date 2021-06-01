<template>
  <TermsContainer :terms="terms" :titleKey="titleKey"></TermsContainer>
</template>

<script>
import TermsContainer from './components/TermsContainer.vue';
import termsEn from './components/ServiceTerms/termsEn.json';
import termsZhHant from './components/ServiceTerms/termsZhHant.json';

export default {
  name: 'ServiceTerms',
  components: {
    TermsContainer,
  },
  data() {
    return {
      terms: {
        0: {
          data: termsEn,
          lastUpdated: '2020-12-18',
        },
        1: {
          data: termsZhHant,
          lastUpdated: '1100105',
        },
      },
      titleKey: 'NewUser-ServiceTerms-Title',
    };
  },
};
</script>
