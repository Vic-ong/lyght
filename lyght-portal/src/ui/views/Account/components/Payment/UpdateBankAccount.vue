<template>
  <v-card flat>
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
            :src="bankBookPhotoInput ? bankBookPhotoInput.url : undefined"
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
import { mapActions } from 'vuex';
import firebase from '@/services/firebase';
import status from '@/mixins/status';
import { identityImgOptimizer } from '@/ui/shared/Forms/utils';
import placeholderBankBook from '@/assets/placeholders/placeholder_bank-book.png';
import { PhotoUploader } from '@/components/FormInput';
import BankDataForm from '@/ui/shared/Forms/BankDataForm.vue';

export default {
  components: {
    BankDataForm,
    PhotoUploader,
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
        bankName: null,
        bankCode: null,
        bankBranchName: null,
        accountNumber: null,
        accountName: null,
      },
      bankBookPhotoInput: null,
      photoSelectors: [
        {
          key: 'bankBookPhoto',
          labelKey: 'NewUser-BankInfo-UploadCover',
          placeholder: placeholderBankBook,
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
    storageBucket() {
      return `users/${this.userAuth.uid}/bank_accounts`;
    },
  },
  methods: {
    ...mapActions('users', {
      updateUserBankAccount: 'updateUserBankAccount',
    }),
    identityImgOptimizer,
    initialize() {
      const d = this.data;
      this.input = {
        bankName: d.bankName || null,
        bankCode: d.bankCode || null,
        bankBranchName: d.bankBranchName || null,
        accountNumber: d.accountNumber || null,
        accountName: d.accountName || null,
      };
      this.bankBookPhotoInput = d.bankBookPhoto;

      if (d.bankBookPhoto && d.bankBookPhoto.path) {
        const { path } = d.bankBookPhoto;
        this.photoSelectors[0].imgPath = path.substring(0, path.indexOf('.'));
      }
    },
    validate() {
      this.valid = this.$refs.form.validate();
    },
    async saveHandler() {
      this.clearStatus();
      this.validate();
      if (this.valid) {
        try {
          this.loading = true;
          await this.updateUserBankAccount({
            userId: this.userId,
            bankId: this.data._id,
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
      try {
        this.clearStatus();
        await this.updateUserBankAccount({
          userId: this.userId,
          bankId: this.data._id,
          bankBookPhoto: data,
        });
        this.bankBookPhotoInput = data;
      } catch (err) {
        this.loading = false;
        this.setStatusError(this.$t('Status-InternalError'));
      }
    },
  },
};
</script>
