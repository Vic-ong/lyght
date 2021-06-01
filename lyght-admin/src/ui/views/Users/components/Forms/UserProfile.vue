<template>
  <v-card class="pos-relative mt-15 pt-15 rounded-lg">
    <div class="pos-absolute top-n15 stretch-width d-flex justify-center">
      <v-hover v-if="profileImg">
        <template v-slot:default="{ hover }">
          <v-avatar :size="profileImgSize" class="elevation-5 bg-grey">
            <v-img v-if="profileImg" :src="profileImg"></v-img>
            <transition name="transition-fade">
              <v-overlay v-if="hover" absolute color="bg-dark">
                <a :href="profileImg" target="_blank" style="text-decoration: none">
                  <v-card class="pa-4 transparent text-center" flat>
                    <v-icon size="20" color="accent">$fi-sr-zoom-in</v-icon>
                    <div class="text-body bg-light--text mt-1">View</div>
                  </v-card>
                </a>
              </v-overlay>
            </transition>
          </v-avatar>
        </template>
      </v-hover>
      <v-avatar v-else :size="profileImgSize" class="elevation-5 bg-grey">
        <v-icon :size="profileImgSize / 2.5" color="white">$fi-sr-mode-portrait</v-icon>
      </v-avatar>
    </div>

    <div class="text-center pa-5">
      <div class="text-subtitle">{{ user.firstName }} {{ user.lastName }}</div>
      <div class="text-body bg-grey--text">{{ user.email }}</div>
      <div class="text-body bg-grey--text">{{ user.phoneNumber }}</div>
      <div class="mt-10">
        <v-row justify="center">
          <v-col v-for="item in checks" v-bind:key="item.icon" cols="auto">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-badge
                  :icon="item.checked ? 'mdi-check' : 'mdi-exclamation'"
                  :color="item.checked ? 'success' : 'accent'"
                  bordered
                  overlap
                >
                  <v-card v-bind="attrs" v-on="on" class="pa-3 bg-light rounded-btn" flat>
                    <v-icon color="bg-dark" size="20">{{ item.icon }}</v-icon>
                  </v-card>
                </v-badge>
              </template>
              <span>{{ item.text }}</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </div>
    </div>

    <slot></slot>

    <div class="divider-line my-5 mx-5"></div>

    <div class="pb-5">
      <record-timestamps :data="user"></record-timestamps>
    </div>
  </v-card>
</template>

<script>
import get from 'lodash/get';

export default {
  name: 'UserProfile',
  props: {
    user: { type: Object, required: true },
    bankAccounts: { type: Array, required: true },
  },
  computed: {
    profileImg() {
      return get(this.user, 'profilePhoto.url');
    },
    profileImgSize() {
      return 120;
    },
    checks() {
      const accountVerified = get(this.user, 'setup.accountVerified');
      const idVerify = get(this.user, 'setup.identityVerification');
      const hasBankAccount = this.bankAccounts.length > 0;

      let idVerifyText = 'ID verified';
      if (!idVerify) idVerifyText = 'ID not verified';
      if (idVerify === 'pending') idVerifyText = 'ID needs to be reviewed';
      if (idVerify === 'disapproved') idVerifyText = 'ID disapproved';

      return [
        {
          checked: accountVerified,
          text: accountVerified ? 'Mobile verified' : 'Mobile not verified',
          icon: 'mdi-cellphone',
        },
        {
          checked: accountVerified,
          text: accountVerified ? 'Email verified' : 'Email not verified',
          icon: 'mdi-email',
        },
        {
          checked: idVerify === 'approved',
          text: idVerifyText,
          icon: '$fi-sr-user',
        },
        {
          checked: hasBankAccount,
          text: hasBankAccount ? 'Bank setup done' : 'Bank is not set-up',
          icon: '$fi-sr-bank',
        },
      ];
    },
  },
};
</script>
