<template>
  <v-card flat>
    <div v-if="!data.bankAccounts || data.bankAccounts.length === 0" class="py-7">
      <div class="text-body black--text" style="text-align: center">No records found</div>
    </div>
    <v-row v-else>
      <v-col v-for="(item, i) in data.bankAccounts" v-bind:key="item._id" cols="12" sm="5">
        <bank-account-card
          :data="item"
          :style="cardColorStyle(i)"
          @click="updateBankAccountHandler"
        ></bank-account-card>
      </v-col>
    </v-row>

    <v-card-actions class="justify-end">
      <lyght-button
        v-if="data.bankAccounts.length < colors.length"
        :loading="loading"
        @click="addBankAccountHandler"
        color="primary"
      >
        {{ $t('Button-Add-BankAccount') }}
      </lyght-button>
    </v-card-actions>

    <v-dialog v-model="dialog" max-width="600" persistent>
      <component
        v-bind:key="dialogKey"
        @cancel="dialog = false"
        @complete="dialog = false"
        :is="dialogView"
        :data="dialogData"
      ></component>
    </v-dialog>
  </v-card>
</template>

<script>
import firebase from '@/services/firebase';
import CreateBankAccount from './CreateBankAccount.vue';
import UpdateBankAccount from './UpdateBankAccount.vue';
import BankAccountCard from './BankAccountCard.vue';

export default {
  components: {
    'create-bank-account': CreateBankAccount,
    'update-bank-account': UpdateBankAccount,
    BankAccountCard,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      valid: true,
      loading: false,
      dialog: false,
      dialogKey: null,
      dialogView: null,
      dialogData: null,
      colors: [
        {
          from: 'rgba(227,155,81,1)',
          to: 'rgba(19,167,204,1)',
        },
        {
          from: 'rgba(67,138,168,1)',
          to: 'rgba(51,18,83,1)',
        },
        {
          from: 'rgba(53,191,137,1)',
          to: 'rgba(92,92,92,1)',
        },
      ],
      defaultColor: {
        from: 'rgba(227,155,81,1)',
        to: 'rgba(19,167,204,1)',
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
    cardColorStyle(i) {
      const color = this.colors[i] || this.defaultColor;
      return {
        background: `linear-gradient(50deg, ${color.from} 0%, ${color.to} 100%)`,
      };
    },
    addBankAccountHandler() {
      const date = new Date();
      this.dialogKey = date.toString();
      this.dialogView = 'create-bank-account';
      this.dialog = true;
    },
    updateBankAccountHandler(data) {
      this.dialogKey = data._id;
      this.dialogView = 'update-bank-account';
      this.dialogData = data;
      this.dialog = true;
    },
  },
};
</script>
