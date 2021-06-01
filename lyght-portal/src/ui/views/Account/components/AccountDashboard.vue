<template>
  <div>
    <v-card
      v-for="alert in alerts"
      v-bind:key="alert.titleKey"
      :class="getColor(alert.priority)"
      class="d-flex align-center py-3 px-5 my-3"
    >
      <v-icon color="white">mdi-alert-octagon</v-icon>
      <div class="text-body white--text ml-3">{{ $t(alert.titleKey) }}</div>

      <v-spacer></v-spacer>

      <v-btn @click="alert.buttonClickHandler" :color="`${getColor(alert.priority)} darken-2`" icon>
        <v-icon large>mdi-chevron-right</v-icon>
      </v-btn>
    </v-card>

    <v-card class="my-5">
      <v-tabs v-model="tab" background-color="transparent" show-arrows>
        <v-tab v-for="item in items" :key="item.titleKey">
          {{ $t(item.titleKey) }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in items" :key="item.titleKey">
          <v-card flat class="pa-5 pt-7">
            <component :is="item.component" :data="data"></component>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import tabTracker from '@/mixins/tabTracker';
import AccountGeneralTab from './General/AccountGeneralView.vue';
import AccountPaymentTab from './Payment/AccountPaymentView.vue';
import AccountIdentityTab from './Identity/AccountIdentityView.vue';

export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  mixins: [tabTracker],
  mounted() {
    this.initializeTab();
  },
  data() {
    return {
      items: [
        {
          titleKey: 'Account-GeneralTab',
          component: AccountGeneralTab,
        },
        {
          titleKey: 'Account-IdentityTab',
          component: AccountIdentityTab,
        },
        {
          titleKey: 'Account-PaymentTab',
          component: AccountPaymentTab,
        },
      ],
    };
  },
  computed: {
    alerts() {
      return [this.identityAlert, this.bankAlert].filter((item) => !!item);
    },
    identityAlert() {
      if (!this.data.setup.identityVerification)
        return {
          priority: 'high',
          titleKey: 'Account-IdentityVerificationAlert',
          buttonClickHandler: this.routeToCreateIdentity,
        };
      if (this.data.setup.identityVerification === 'disapproved')
        return {
          priority: 'high',
          titleKey: 'Account-IdentityVerificationDisapproved',
          buttonClickHandler: this.routeToCreateIdentity,
        };
      if (this.data.setup.identityVerification === 'pending')
        return {
          priority: 'low',
          titleKey: 'Account-IdentityVerificationPending',
          buttonClickHandler: this.routeToCreateIdentity,
        };
      return undefined;
    },
    bankAlert() {
      if (this.data.bankAccounts.length === 0)
        return {
          priority: 'high',
          titleKey: 'Account-NoBankInfoAlert',
          buttonClickHandler: this.routeToAddBankAccount,
        };
      return undefined;
    },
  },
  methods: {
    getColor(priority) {
      if (priority === 'high') return 'error';
      return 'info';
    },
    routeToCreateIdentity() {
      this.tab = 1;
    },
    routeToAddBankAccount() {
      this.tab = 2;
    },
  },
};
</script>
