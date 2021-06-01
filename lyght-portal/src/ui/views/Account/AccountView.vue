<template>
  <page-container :title="title" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <account-dashboard :data="data"></account-dashboard>
    </template>
  </page-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import firebase from '@/services/firebase';
import { PageContainer } from '@/ui/shared/Layout';
import AccountDashboard from './components/AccountDashboard.vue';

export default {
  name: 'AccountView',
  components: {
    PageContainer,
    AccountDashboard,
  },
  created() {
    const userId = firebase.auth().currentUser.uid;
    if (!this.userBankAccounts.data || this.userBankAccounts.data.userId !== userId) {
      this.getBankAccountsByUser(userId);
    }
  },
  data() {
    return {
      renderers: ['user'],
    };
  },
  computed: {
    ...mapGetters('users', ['user', 'userBankAccounts']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
    data() {
      return {
        ...this.user.data,
        bankAccounts: this.userBankAccounts.data ? this.userBankAccounts.data.items : [],
      };
    },
    title() {
      return this.$t('Account-Title');
    },
  },
  methods: {
    ...mapActions('users', ['getBankAccountsByUser']),
  },
};
</script>
