<template>
  <v-card>
    <v-card-actions class="justify-end">
      <v-btn @click="$emit('cancel')" icon><v-icon>mdi-close</v-icon></v-btn>
    </v-card-actions>
    <v-form ref="form" v-model="valid" @submit.prevent class="px-5" lazy-validation>
      <div class="d-flex align-center mb-7">
        <v-icon class="mr-3" color="primary">mdi-bank</v-icon>
        <span class="text-subheading">{{ $t('Account-Payment-Title') }}</span>
      </div>
      <bank-data-form :input="input" :loading="loading"></bank-data-form>
      <v-row no-gutters>
        <v-col v-for="item in photoSelectors" v-bind:key="item.key" cols="12" md="6" class="mb-3 px-2">
          <div class="d-flex align-center mb-5">
            <v-icon class="mr-3" color="primary">mdi-image-area</v-icon>
            <span class="text-subheading">{{ $t(item.labelKey) }}</span>
          </div>
          <photo-uploader
            @uploaded="photoUploadedHandler"
            :src="input.bankBookPhoto ? input.bankBookPhoto.url : undefined"
            :placeholder="item.placeholder"
            :bucket="storageBucket"
            :imgPath="item.imgPath"
            :optimizer="identityImgOptimizer"
          ></photo-uploader>
        </v-col>
      </v-row>
    </v-form>
    <v-card-actions v-if="statusText" class="justify-center">
      <status-info :color="statusColor">{{ statusText }}</status-info>
    </v-card-actions>
    <v-card-actions class="justify-center">
      <lyght-button :loading="loading" @click="saveHandler" color="primary">
        {{ $t('Button-Submit') }}
      </lyght-button>
    </v-card-actions>
  </v-card>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { mapActions } from 'vuex';
import status from '@/mixins/status';
import { identityImgOptimizer } from '@/ui/shared/Forms/utils';
import placeholderBankBook from '@/assets/placeholders/placeholder_bank-book.png';
import firebase from '@/services/firebase';
import { PhotoUploader } from '@/components/FormInput';
import BankDataForm from '@/ui/shared/Forms/BankDataForm.vue';

export default {
  components: {
    BankDataForm,
    PhotoUploader,
  },
  mixins: [status],
  data() {
    return {
      valid: true,
      loading: false,
      input: {
        bankName: null,
        bankCode: null,
        bankBranchName: null,
        accountNumber: null,
        accountName: null,
        bankBookPhoto: null,
      },
      photoSelectors: [
        {
          key: 'bankBookPhoto',
          labelKey: 'NewUser-BankInfo-UploadCover',
          placeholder: placeholderBankBook,
          imgPath: uuidv4(),
        },
      ],
    };
  },
  computed: {
    userAuth() {
      return firebase.auth().currentUser;
    },
    userId() {
      return this.userAuth.uid;
    },
    isXs() {
      return this.$vuetify.breakpoint.xs;
    },
    storageBucket() {
      return `users/${this.userAuth.uid}/bank_accounts`;
    },
  },
  methods: {
    ...mapActions('users', {
      createUserBankAccount: 'createUserBankAccount',
    }),
    identityImgOptimizer,
    validate() {
      this.valid = this.$refs.form.validate();
    },
    async saveHandler() {
      this.clearStatus();
      this.validate();
      if (this.valid) {
        try {
          this.loading = true;
          await this.createUserBankAccount({
            userId: this.userId,
            ...this.input,
          });
          this.loading = false;
          this.$emit('complete');
        } catch (err) {
          this.loading = false;
          this.setStatusError(err);
        }
      }
    },
    async photoUploadedHandler(data) {
      this.input.bankBookPhoto = data;
    },
  },
};
</script>
