<template>
  <v-card class="pa-7 rounded-xl">
    <!-- Loading -->
    <div v-if="isLoading" class="buffer-container">
      <v-progress-circular :size="60" :width="6" color="primary" indeterminate></v-progress-circular>
    </div>
    <!-- Error -->
    <div v-else-if="isError" class="buffer-container">
      <div class="text-subheading error--text mb-2">{{ $t('Project-UnableToFetchParticipationFormData') }}</div>
      <div class="text-body black--text">
        {{ $t('InternalError-Help') }}
        <a href="mailto:support@lyght.com.tw">{{ $t('InternalError-HelpLink') }}</a>
      </div>
    </div>

    <div v-else>
      <v-row>
        <v-col cols="12" class="text-right">
          <div class="text-title">{{ panelsAvailable }} {{ $t('Project-Panels') }}</div>
          <div class="text-body grey--text">{{ $t('Project-PanelsAvailable') }}</div>
          <div class="text-title" style="text-transform: capitalize">
            {{ remainingTime }} {{ $t('Datetime-Days-Display') }}
          </div>
          <div class="text-body grey--text">{{ $t('Project-RemainingTime') }}</div>
        </v-col>

        <v-col cols="12" class="mt-8">
          <div class="d-flex justify-center">
            <div class="text-subheading">{{ $t('Project-PanelsSold', { panels: data.panelsSold }) }}</div>
            <div class="text-subheading black--text ml-2 mr-2">/</div>
            <div class="text-subheading primary--text text--darken-2">
              {{ $t('Project-PanelsReserved', { panels: data.panelsReserved }) }}
            </div>
            <div class="text-subheading black--text ml-2 mr-2">/</div>
            <div class="text-subheading background--text text--darken-2">
              {{ $t('Project-TotalPanels', { panels: data.panelsTotal }) }}
            </div>
          </div>
          <div class="panels-progress-container background darken-2 mt-3">
            <div class="primary-value primary" :style="primaryValueStyle"></div>
            <div class="secondary-value primary darken-2" :style="secondaryValueStyle"></div>
          </div>
        </v-col>

        <v-col cols="12" class="mt-3">
          <div class="black--text">
            <div v-if="!hasPendingOrder" class="text-subheading text-center black--text">
              <div>{{ panelCost }}</div>
            </div>
            <div v-else class="text-hint">
              <div>{{ $t('Project-OrderedDesc') }}</div>
              <div>
                {{ $t('Project-OrderedDescLink') }}
                <v-icon color="primary">mdi-menu-down</v-icon>
              </div>
            </div>
          </div>
          <div class="d-flex justify-center mt-3">
            <lyght-button v-if="!hasPendingOrder" @click="routeToCheckout">
              {{ $t(panelsAvailable === 0 ? 'Button-JoinWaitlist' : 'Button-Participate') }}
            </lyght-button>
            <lyght-button v-else @click="$router.push({ name: 'my-orders' })">
              {{ $t('Button-Ordered') }}
            </lyght-button>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapGetters } from 'vuex';
import { formatCurrency } from '@/utils/formats';
import { dateDiff } from '@/utils/date';

export default {
  name: 'ParticipationForm',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    input: { type: Number },
  },
  mounted() {
    const d = this.userProjectOrders.data;
    if (!d || d.some((v) => get(v, 'project._id') !== this.$route.params.id)) {
      this.getOrdersByUserAndProject({
        userId: this.user.data._id,
        projectId: this.$route.params.id,
      });
    }
  },
  data() {
    return {
      dialog: false,
      valid: true,
      loading: false,
      disabled: false,
      status: {
        text: '',
        color: '',
      },
    };
  },
  computed: {
    ...mapGetters('users', {
      user: 'user',
    }),
    ...mapGetters('orders', {
      userProjectOrders: 'userProjectOrders',
    }),
    isLoading() {
      return this.userProjectOrders.loading;
    },
    isError() {
      return this.userProjectOrders.error;
    },
    hasPendingOrder() {
      const d = this.userProjectOrders.data;
      if (!d) return true;
      const pendingOrders = d.filter((order) => order.status !== 'paid' && order.status !== 'cancelled');
      return pendingOrders.length > 0;
    },
    panelCost() {
      return `${formatCurrency(this.data.unitCost).display}/${this.$t('Project-Panel')}`;
    },
    panelsAvailable() {
      return this.data.panelsTotal - this.data.panelsSold - this.data.panelsReserved;
    },
    remainingTime() {
      const date1 = new Date();
      const date2 = new Date(this.data.fundingEndDate);
      const duration = dateDiff({ date1, date2, unit: 'day' });
      return `${duration}`;
    },
    primaryValueStyle() {
      const value = (this.data.panelsSold / this.data.panelsTotal) * 100;
      return {
        width: value > 4.5 ? `${value}%` : '4.5%',
      };
    },
    secondaryValueStyle() {
      const value = ((this.data.panelsSold + this.data.panelsReserved) / this.data.panelsTotal) * 100;
      return {
        width: value > 4.5 ? `${value}%` : '4.5%',
      };
    },
  },
  methods: {
    ...mapActions('orders', {
      getOrdersByUserAndProject: 'getOrdersByUserAndProject',
    }),
    routeToCheckout() {
      this.$router.push({
        name: 'orders/checkout',
        query: {
          project: this.$route.params.id,
          projectGroup: this.$route.query.projectGroup,
          quantity: this.input,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.panels-progress-container {
  position: relative;
  height: 16px;
  border-radius: 8px;
  .primary-value {
    position: absolute;
    z-index: 2;
    height: 16px;
    border-radius: 8px;
  }
  .secondary-value {
    position: absolute;
    z-index: 1;
    height: 16px;
    border-radius: 8px;
  }
}
.buffer-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 150px;
}
</style>
