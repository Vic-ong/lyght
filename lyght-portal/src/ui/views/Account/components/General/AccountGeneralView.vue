<template>
  <v-card flat>
    <v-form ref="form" v-model="valid" @submit.prevent lazy-validation>
      <v-row>
        <v-col cols="12" sm="6">
          <general-account-form :input="input" :loading="loading"></general-account-form>
        </v-col>
        <v-col cols="12" sm="6">
          <user-profile-photo :data="data" :size="150"></user-profile-photo>
        </v-col>
      </v-row>
    </v-form>

    <status-info :color="statusColor">{{ statusText }}</status-info>

    <v-card-actions class="justify-end">
      <lyght-button :loading="loading" @click="saveHandler" color="primary">
        {{ $t('Button-Update') }}
      </lyght-button>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import firebase from '@/services/firebase';
import status from '@/mixins/status';
import UserProfilePhoto from '@/ui/shared/Forms/UserProfilePhoto.vue';
import GeneralAccountForm from './GeneralAccountForm.vue';

export default {
  components: {
    UserProfilePhoto,
    GeneralAccountForm,
  },
  mixins: [status],
  props: ['data'],
  mounted() {
    this.initialize();
  },
  data() {
    return {
      valid: true,
      loading: false,
      input: {
        displayName: null,
        firstName: null,
        lastName: null,
      },
    };
  },
  computed: {
    userAuth() {
      return firebase.auth().currentUser;
    },
    userId() {
      return this.userAuth.uid;
    },
  },
  methods: {
    ...mapActions('users', {
      updateUser: 'updateUser',
    }),
    initialize() {
      const d = this.data;

      Object.keys(this.input).forEach((field) => {
        if (this.hasData(d[field])) {
          this.input[field] = d[field];
        }
      });
    },
    hasData(v) {
      return !!v || v === 0 || v === false;
    },
    validate() {
      this.valid = this.$refs.form.validate();
    },
    async saveHandler() {
      this.clearStatus();
      this.validate();
      if (this.valid) {
        this.loading = true;
        try {
          await this.updateUser({
            id: this.userId,
            ...this.input,
          });
          this.loading = false;
        } catch (err) {
          this.loading = false;
          this.setStatusError(err);
        }
      }
    },
  },
};
</script>
