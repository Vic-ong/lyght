<template>
  <div>
    <div v-if="intro" class="px-5 pb-3">
      <create-identity-intro @next="intro = false"></create-identity-intro>
    </div>

    <div v-else>
      <v-card flat>
        <div class="text-title text-center mb-7">{{ $t('Account-NewIdentity-Title') }}</div>

        <v-form ref="form" v-model="valid" @submit.prevent lazy-validation>
          <user-identification-form :input="input" :loading="loading"></user-identification-form>

          <v-row no-gutters>
            <v-col v-for="item in idPhotoSelectors" v-bind:key="item.key" cols="12" md="6" class="mb-3 px-2">
              <div class="d-flex align-center mb-5">
                <v-icon class="mr-3" color="primary">mdi-image-area</v-icon>
                <span class="text-subheading">{{ $t(item.labelKey) }}</span>
              </div>

              <photo-uploader
                @uploaded="(data) => photoUploadedHandler(data, item.key)"
                :src="idPhotoInput[item.key] ? idPhotoInput[item.key].url : undefined"
                :placeholder="item.placeholder"
                :bucket="storageBucket"
                :imgPath="item.imgPath"
                :optimizer="identityImgOptimizer"
              ></photo-uploader>
            </v-col>
          </v-row>
          <address-form
            :title="$t('NewUser-Personal-RegisteredAddress')"
            :input="registeredAddressInput"
            :loading="loading"
          ></address-form>

          <divider-line class="mb-5" />

          <address-form
            :title="$t('NewUser-Personal-ResidentialAddress')"
            :input="residentialAddressInput"
            :loading="loading"
          >
            <template #side-header>
              <v-btn @click="copyAddress" color="primary" small>{{ $t('NewUser-Personal-CopyAddress') }}</v-btn>
            </template>
          </address-form>
        </v-form>

        <status-info :color="statusColor">{{ statusText }}</status-info>

        <v-card-actions class="justify-end">
          <lyght-button :loading="loading" @click="saveHandler" color="primary">
            {{ $t('Button-Submit') }}
          </lyght-button>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
import { mapActions } from 'vuex';
import firebase from '@/services/firebase';
import status from '@/mixins/status';
import { identityImgOptimizer } from '@/ui/shared/Forms/utils';
import placeholderIdFront from '@/assets/placeholders/placeholder_id-front.png';
import placeholderIdBack from '@/assets/placeholders/placeholder_id-back.png';
import { DividerLine } from '@/components/Divider';
import { PhotoUploader } from '@/components/FormInput';
import UserIdentificationForm from '@/ui/shared/Forms/UserIdentificationForm.vue';
import AddressForm from '@/ui/shared/Forms/AddressForm.vue';
import CreateIdentityIntro from './CreateIdentityIntro.vue';

export default {
  components: {
    DividerLine,
    PhotoUploader,
    UserIdentificationForm,
    AddressForm,
    CreateIdentityIntro,
  },
  mixins: [status],
  props: ['data'],
  mounted() {
    this.initialize();
  },
  data() {
    return {
      intro: true,
      valid: true,
      loading: false,
      input: {
        displayName: null,
        firstName: null,
        lastName: null,
        dob: null,
        nationality: 'Taiwanese',
        usCitizenship: false,
        idNumber: null,
      },
      registeredAddressInput: {
        address1: null,
        address2: null,
        city: null,
        district: null,
        state: 'Taiwan',
        country: 'Taiwan',
        postalCode: null,
      },
      residentialAddressInput: {
        address1: null,
        address2: null,
        city: null,
        district: null,
        state: 'Taiwan',
        country: 'Taiwan',
        postalCode: null,
      },
      idPhotoInput: {
        idPhotoFront: null,
        idPhotoBack: null,
      },
      idPhotoSelectors: [
        {
          key: 'idPhotoFront',
          labelKey: 'NewUser-Personal-UploadFrontID',
          placeholder: placeholderIdFront,
          imgPath: 'id_photo_front',
        },
        {
          key: 'idPhotoBack',
          labelKey: 'NewUser-Personal-UploadBackID',
          placeholder: placeholderIdBack,
          imgPath: 'id_photo_back',
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
      return `users/${this.userAuth.uid}/identity`;
    },
  },
  methods: {
    ...mapActions('users', {
      updateUser: 'updateUser',
    }),
    identityImgOptimizer,
    initialize() {
      const d = this.data;

      if (d.setup.identityVerification === 'disapproved') {
        this.intro = false;
      }

      [this.input, this.idPhotoInput].forEach((input) => {
        Object.keys(input).forEach((field) => {
          if (this.hasData(d[field])) {
            // eslint-disable-next-line no-param-reassign
            input[field] = d[field];
          }
        });
      });

      ['registeredAddress', 'residentialAddress'].forEach((key) => {
        const input = this[`${key}Input`];
        Object.keys(input).forEach((field) => {
          const data = get(d, `${key}.${field}`);
          if (this.hasData(data)) {
            input[field] = data;
          }
        });
      });
    },
    hasData(v) {
      return !!v || v === 0 || v === false;
    },
    copyAddress() {
      this.residentialAddressInput = this.registeredAddressInput;
    },
    validate() {
      this.valid = this.$refs.form.validate();
    },
    async saveHandler() {
      this.clearStatus();
      this.validate();
      const hasPhoto = this.idPhotoInput.idPhotoFront && this.idPhotoInput.idPhotoBack;

      if (!hasPhoto) {
        this.setStatusError(this.$t('Status-IDPhotoRequired'));
      } else if (!this.input.dob) {
        this.setStatusError(this.$t('Status-DobRequired'));
      } else if (this.valid && hasPhoto) {
        this.loading = true;

        try {
          const payload = {
            id: this.userId,
            ...this.input,
            setup: {
              ...this.data.setup,
              identityVerification: 'pending',
            },
            registeredAddress: this.registeredAddressInput,
            residentialAddress: this.residentialAddressInput,
          };

          await this.updateUser(payload);

          this.loading = false;
          this.$emit('next', 'id-pending-approval');
        } catch (err) {
          this.loading = false;
          this.setStatusError(this.$t('Status-InternalError'));
        }
      }
    },
    async photoUploadedHandler(data, key) {
      try {
        this.clearStatus();
        await this.updateUser({
          id: this.userId,
          [key]: data,
        });
        this.idPhotoInput[key] = data;
      } catch (err) {
        this.loading = false;
        this.setStatusError(this.$t('Status-InternalError'));
      }
    },
  },
};
</script>
