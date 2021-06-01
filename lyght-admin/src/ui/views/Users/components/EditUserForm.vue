<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-row>
      <!-- Main view -->
      <v-col :order="$vuetify.breakpoint.lgAndUp ? 1 : 2" cols="12" lg="8">
        <v-card :height="tabHeight" class="transparent" flat>
          <v-tabs v-model="tab" class="tabs-container" grow show-arrows>
            <v-tabs-slider color="primary"></v-tabs-slider>
            <v-tab v-for="item in tabs" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>
        </v-card>
        <v-card :height="formHeight" class="rounded-lg overflow-y-auto pa-5">
          <transition name="transition-fade" mode="out-in">
            <component
              v-bind:is="tabComponents[tab]"
              :user="user"
              :input="tab === 2 ? bankAccountsInput : input"
              :loading="loading"
            ></component>
          </transition>
        </v-card>
      </v-col>

      <!-- Profile summary -->
      <v-col :order="$vuetify.breakpoint.lgAndUp ? 2 : 1" cols="12" lg="4">
        <user-profile :user="user" :bankAccounts="bankAccounts">
          <div class="mt-7">
            <action-panel>
              <div v-for="item in actionButtons" v-bind:key="item.name">
                <btn-main
                  @click="item.handler ? item.handler() : setAction(item.action)"
                  :color="item.color"
                  :disabled="item.disabled || loading"
                >
                  {{ item.name }}
                </btn-main>
              </div>

              <btn-main v-if="!idStatus || idStatus === 'disapproved'" disabled tooltip>
                Approve
                <template #tooltip>
                  <div v-if="!idStatus" class="text-center">User has not verify his/her ID.</div>
                  <div v-else class="text-center">ID disapproved. <br />Pending changes from user.</div>
                </template>
              </btn-main>
            </action-panel>
          </div>
        </user-profile>
      </v-col>
    </v-row>

    <action-dialog
      v-model="dialogProps.show"
      :data="dialogProps"
      :loading="loading"
      @submit="dialogProps.action"
      @close="clearDialog"
    >
      Action: <b>{{ dialogProps.text }}</b>
    </action-dialog>
  </v-form>
</template>

<script>
import get from 'lodash/get';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import { mapActions } from 'vuex';
import { sendEmailAccountApproved } from '@/services/functions';
import dialog from '@/mixins/dialog';
import { appHeaderProps, pageContainerProps } from '@/ui/shared/Layouts/props';
import UserProfile from './Forms/UserProfile.vue';
import GeneralData from './Forms/GeneralData.vue';
import IdentityData from './Forms/IdentityData.vue';
import BankData from './Forms/BankData.vue';

export default {
  name: 'EditUserForm',
  components: {
    UserProfile,
  },
  props: {
    user: { type: Object, required: true },
    bankAccounts: { type: Array, default: () => [] },
  },
  mixins: [dialog],
  data() {
    return {
      valid: true,
      loading: false,
      initialized: false,
      inputChanged: false,
      input: {
        active: false,
        firstName: null,
        lastName: null,
        displayName: null,
        language: null,
        email: null,
        dob: null,
        nationality: null,
        usCitizenship: null,
        idNumber: null,
        phoneNumber: null,
        registeredAddress: {
          address1: null,
          address2: null,
          district: null,
          city: null,
          state: 'Taiwan',
          country: 'Taiwan',
          postalCode: null,
        },
        residentialAddress: {
          address1: null,
          address2: null,
          district: null,
          city: null,
          state: 'Taiwan',
          country: 'Taiwan',
          postalCode: null,
        },
        setup: {
          accountVerified: false,
          identityVerification: null,
        },
      },
      bankFields: ['_id', 'bankCode', 'bankName', 'bankBranchName', 'accountName', 'accountNumber', 'bankBookPhoto'],
      bankAccountsInput: [],
      tab: null,
      tabs: ['General', 'Identity', 'Bank'],
    };
  },
  mounted() {
    this.initialize();
  },
  watch: {
    input: {
      handler() {
        if (this.initialized && !this.inputChanged) {
          this.inputChanged = true;
        }
      },
      deep: true,
    },
  },
  computed: {
    layoutHeight() {
      const appHeader = appHeaderProps(this.$vuetify.breakpoint);
      const pageContainer = pageContainerProps(this.$vuetify.breakpoint);
      return appHeader.height + pageContainer.header.height;
    },
    tabHeight() {
      return 60;
    },
    formHeight() {
      return `calc(100vh - ${this.tabHeight + 15}px - ${this.layoutHeight}px)`;
    },
    tabComponents() {
      return [GeneralData, IdentityData, BankData];
    },
    idStatus() {
      return get(this.user, 'setup.identityVerification');
    },
    actionButtons() {
      return [
        {
          name: 'Update',
          show: this.idStatus === 'approved',
          disabled: !this.inputChanged,
          color: 'primary',
          handler: this.setUpdateAction,
        },
        {
          name: 'Reset',
          show: this.idStatus === 'approved',
          disabled: !this.inputChanged,
          color: 'secondary',
          handler: this.initialize,
        },
        {
          name: 'Approve',
          show: this.idStatus === 'pending',
          color: 'primary',
          action: {
            name: 'Approve user identity',
            handler: this.approveIdentity,
          },
        },
        {
          name: 'Disapprove',
          show: this.idStatus === 'pending',
          color: 'secondary',
          action: {
            name: 'Diapprove user identity',
            handler: this.disapproveIdentity,
          },
        },
      ].filter((item) => item.show);
    },
  },
  methods: {
    ...mapActions('users', ['updateUser']),

    initialize() {
      const user = cloneDeep(this.user);

      Object.keys(this.input).forEach((field) => {
        const data = get(user, field);
        if (this.hasValue(data)) set(this.input, field, data);
      });

      this.bankAccounts.forEach((bankAccount, index) => {
        this.bankFields.forEach((field) => {
          const data = get(bankAccount, field);
          if (this.hasValue(data)) set(this.bankAccountsInput, `[${index}].${field}`, data);
        });
      });

      this.$nextTick(() => {
        this.initialized = true;
        this.inputChanged = false;
      });
    },
    hasValue(v) {
      return !!v || v === 0 || v === false;
    },
    validate() {
      this.valid = this.$refs.form.validate();
    },
    setUpdateAction() {
      this.validate();
      if (this.valid) {
        this.setAction({
          name: 'Update user data',
          handler: this.updateUserData,
        });
      }
    },
    async approveIdentity() {
      try {
        this.loading = true;

        await this.updateUser({
          id: this.$route.params.id,
          setup: {
            ...this.user.setup,
            identityVerification: 'approved',
          },
        });
        sendEmailAccountApproved({
          to: this.user.email,
          lang: this.user.language || 'en',
          params: {
            name: `${this.user.firstName} ${this.user.lastName}`,
          },
        });

        this.setActionSuccess('Identity approved.');
        this.inputChanged = false;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
    },
    async disapproveIdentity() {
      try {
        this.loading = true;

        await this.updateUser({
          id: this.$route.params.id,
          setup: {
            ...this.user.setup,
            identityVerification: 'disapproved',
          },
        });

        this.setActionComplete('Identity disapproved.');
        this.inputChanged = false;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
    },
    async updateUserData() {
      try {
        this.loading = true;

        await this.updateUser({
          id: this.$route.params.id,
          ...this.input,
        });

        this.setActionSuccess('Updated user record.');
        this.inputChanged = false;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs-container ::v-deep {
  .v-tabs-bar {
    background-color: transparent !important;
  }
}
</style>
