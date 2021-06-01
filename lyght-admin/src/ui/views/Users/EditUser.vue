<template>
  <page-container :navs="navs" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <edit-user-form
        :key="$route.params.id"
        :user="userData.data"
        :bankAccounts="userBankAccounts.data"
      ></edit-user-form>
    </template>
  </page-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';
import EditUserForm from './components/EditUserForm.vue';

export default {
  name: 'EditUser',
  components: {
    PageContainer,
    EditUserForm,
  },
  data() {
    return {
      navs: ['users', 'users/:id'],
      renderers: ['userData', 'userBankAccounts'],
    };
  },
  created() {
    this.initialize();
  },
  watch: {
    $route() {
      this.initialize();
    },
  },
  computed: {
    ...mapGetters('users', ['userData', 'userBankAccounts']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
  },
  methods: {
    ...mapActions('users', ['getUserData', 'getUserBankAccounts']),

    initialize() {
      const { id } = this.$route.params;
      if (!this.userData.data || this.userData.data._id !== id) {
        this.getUserBankAccounts(id);
        this.getUserData(id);
      }
    },
    returnHandler() {
      this.$router.push({ name: 'users' });
    },
  },
};
</script>
