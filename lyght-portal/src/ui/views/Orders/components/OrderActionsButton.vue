<template>
  <div class="text-center">
    <v-menu offset-y nudge-top="-10">
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab absolute bottom right small v-bind="attrs" v-on="on">
          <v-icon color="primary">mdi-dots-horizontal</v-icon>
        </v-btn>
      </template>

      <v-card class="pa-1" min-width="150px">
        <div v-for="(item, index) in items" :key="index">
          <div v-if="item.disabled" class="text-body grey--text pa-2">{{ item.name }}</div>
          <div v-else @click="item.handler()" class="cursor-pointer text-body black--text pa-2">{{ item.name }}</div>
        </div>
      </v-card>
    </v-menu>

    <v-dialog v-model="dialog" width="400" persistent>
      <v-card>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false" icon><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>

        <div v-if="!complete" class="px-5 text-center">
          <div class="text-subheading-medium black--text">{{ $t('Order-OrderDetails-CancelTitle') }}</div>
          <div class="text-hint grey--text mt-3">{{ $t('Order-OrderDetails-CancelDesc') }}</div>
        </div>
        <div v-else class="px-5 text-center">
          <div class="text-subheading-medium black--text">{{ $t('Order-OrderDetails-Cancelled') }}</div>
        </div>

        <status-info :color="statusColor" class="text-center">{{ statusText }}</status-info>

        <div class="d-flex justify-center py-7">
          <lyght-button v-if="!complete" @click="submitHandler" :loading="loading">
            {{ $t('Button-Submit') }}
          </lyght-button>
          <lyght-button v-else @click="dialog = false">
            {{ $t('Button-Complete') }}
          </lyght-button>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import status from '@/mixins/status';

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  mixins: [status],
  data() {
    return {
      loading: false,
      dialog: false,
      complete: false,
    };
  },
  watch: {
    dialog() {
      this.reset();
    },
  },
  computed: {
    ...mapGetters('users', ['user']),

    items() {
      return [
        {
          handler: () => {
            this.dialog = true;
          },
          name: this.$t('Button-CancelOrder'),
          disabled: ['contractSigned', 'paid', 'cancelled'].includes(this.data.status),
        },
        {
          handler: () => {
            this.$emit('print-order');
          },
          name: this.$t('Button-Print'),
          disabled: false,
        },
        {
          handler: () => {
            window.open('mailto:support@lyght.com.tw', '_blank');
          },
          name: this.$t('ContactUs'),
          disabled: false,
        },
      ];
    },
  },
  methods: {
    ...mapActions('orders', ['cancelOrder']),

    reset() {
      this.clearStatus();
      this.complete = false;
    },
    async submitHandler() {
      try {
        this.reset();
        this.loading = true;

        await this.cancelOrder({
          id: this.$route.params.id,
        });

        this.loading = false;
        this.complete = true;
      } catch (err) {
        this.loading = false;
        this.setStatusError(this.$t('Status-InternalError'));
      }
    },
  },
};
</script>
