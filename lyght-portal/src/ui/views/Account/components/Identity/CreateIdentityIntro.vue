<template>
  <v-card>
    <v-img :src="formHeaderImg" max-height="120"></v-img>
    <v-card class="py-5 px-10" flat>
      <div class="text-subheading black--text">{{ $t('Account-NewIdentity-Intro-Title') }}</div>
      <div class="text-body grey--text text--darken-2 mt-3">
        {{ $t('Account-NewIdentity-Intro-Desc') }}
      </div>
      <v-card flat class="pa-10">
        <div class="content-flex">
          <div class="text-body grey--text text--darken-2 subcontent-flex px-3">
            <v-icon color="primary">mdi-account-circle</v-icon>
            <div class="subcontent-text mt-1">{{ $t('Account-NewIdentity-Step1') }}</div>
          </div>
          <div class="divider-line"></div>
          <div class="text-body grey--text text--darken-2 subcontent-flex px-3">
            <v-icon color="primary">mdi-badge-account-horizontal</v-icon>
            <div class="subcontent-text mt-1">{{ $t('Account-NewIdentity-Step2') }}</div>
          </div>
          <div class="divider-line"></div>
          <div class="text-body grey--text text--darken-2 subcontent-flex px-3">
            <v-icon color="primary">mdi-shield-check</v-icon>
            <div class="subcontent-text mt-1">{{ $t('Account-NewIdentity-Step3') }}</div>
          </div>
        </div>
      </v-card>
    </v-card>
    <v-card-actions class="justify-center">
      <lyght-button @click="$emit('next')" color="primary">
        {{ $t('Button-Continue') }}
      </lyght-button>
    </v-card-actions>
  </v-card>
</template>

<script>
import bannerImg from '@/assets/getstarted@2x.jpg';

export default {
  computed: {
    formHeaderImg() {
      return bannerImg;
    },
  },
};
</script>

<style lang="scss" scoped>
.content-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .divider-line {
    width: 100px;
    border-bottom: 1px solid grey;
  }
}
.subcontent-flex {
  width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  .subcontent-text {
    font-size: 11px !important;
  }
}
</style>
