<template>
  <v-card flat>
    <v-form ref="form" v-model="valid" @submit.prevent lazy-validation>
      <div class="d-flex align-center mb-5">
        <v-icon class="mr-3" color="primary">mdi-account-circle</v-icon>
        <span class="text-subheading">{{ $t('Account-Identity-Title') }}</span>
      </div>

      <div class="text-hint grey--text mb-7">{{ $t('Account-Identity-ChangeHint') }}</div>

      <dynamic-form-input :input="data" :fields="fields" :disabled="loading"></dynamic-form-input>

      <user-identification-form
        :input="data"
        :loading="loading"
        :display="true"
        :readonlyAll="true"
      ></user-identification-form>

      <v-row no-gutters class="mb-5">
        <v-col v-for="item in idPhotoSelectors" v-bind:key="item.key" cols="12" md="6" class="mb-3 px-2">
          <div class="d-flex align-center mb-5">
            <v-icon class="mr-3" color="primary">mdi-image-area</v-icon>
            <span class="text-subheading">{{ $t(item.labelKey) }}</span>
          </div>

          <photo-uploader
            @uploaded="(data) => photoUploadedHandler(data, item.key)"
            :src="data[item.key] ? data[item.key].url : undefined"
            :placeholder="item.placeholder"
            :bucket="storageBucket"
            :imgPath="item.imgPath"
            :readonly="true"
          ></photo-uploader>
        </v-col>
      </v-row>

      <address-form
        :title="$t('NewUser-Personal-RegisteredAddress')"
        :input="registeredAddressInput"
        :loading="loading"
      ></address-form>

      <divider-line class="mb-5"></divider-line>

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
        {{ $t('Button-Update') }}
      </lyght-button>
    </v-card-actions>
  </v-card>
</template>

<script>
import get from 'lodash/get';
import { mapActions } from 'vuex';
import firebase from '@/services/firebase';
import status from '@/mixins/status';
import placeholderIdFront from '@/assets/placeholders/placeholder_id-front.png';
import placeholderIdBack from '@/assets/placeholders/placeholder_id-back.png';
import form from '@/utils/validation/form';
import { DividerLine } from '@/components/Divider';
import { DynamicFormInput, PhotoUploader } from '@/components/FormInput';
import UserIdentificationForm from '@/ui/shared/Forms/UserIdentificationForm.vue';
import AddressForm from '@/ui/shared/Forms/AddressForm.vue';

export default {
  components: {
    DividerLine,
    DynamicFormInput,
    PhotoUploader,
    UserIdentificationForm,
    AddressForm,
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
      idPhotoSelectors: [
        {
          key: 'idPhotoFront',
          labelKey: 'NewUser-Personal-FrontIDDisplay',
          placeholder: placeholderIdFront,
          imgPath: 'id_photo_front',
        },
        {
          key: 'idPhotoBack',
          labelKey: 'NewUser-Personal-BackIDDisplay',
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
    fields() {
      return [
        {
          key: 'email',
          component: 'v-text-field',
          cols: '6',
          labelKey: 'Field-Email',
          rules: [form.required(this.t)],
          readonly: true,
        },
        {
          key: 'phoneNumber',
          component: 'v-text-field',
          cols: '6',
          labelKey: 'Field-MobileNumber',
          rules: [form.required(this.t)],
          readonly: true,
        },
      ];
    },
  },
  methods: {
    ...mapActions('users', ['updateUser']),

    initialize() {
      const d = this.data;

      // [this.input, this.idPhotoInput].forEach((input) => {
      //   Object.keys(input).forEach((field) => {
      //     if (this.hasData(d[field])) {
      //       // eslint-disable-next-line no-param-reassign
      //       input[field] = d[field];
      //     }
      //   });
      // });

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
    t(v, params) {
      return this.$t(v, params);
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

      if (this.valid) {
        this.loading = true;
        try {
          const payload = {
            id: this.userId,
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
    // async photoUploadedHandler(data, key) {
    //   try {
    //     this.clearStatus();
    //     await this.updateUser({
    //       id: this.userId,
    //       [key]: data,
    //     });
    //     this.idPhotoInput[key] = data;
    //   } catch (err) {
    //     this.loading = false;
    //     this.setStatusError(this.$t('Status-InternalError'));
    //   }
    // },
  },
};
</script>
