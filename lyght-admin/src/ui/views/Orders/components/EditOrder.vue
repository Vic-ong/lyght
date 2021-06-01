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
        <v-card :height="formHeight" class="rounded-lg pa-5 overflow-y-auto">
          <transition name="transition-fade" mode="out-in">
            <div v-if="tab === 0" key="general">
              <order-form
                :input="input"
                :data="data"
                :panelQuantitiesResult="getPanelQuantitiesResult"
                :disabled="lockedOrder"
                :loading="loading"
              ></order-form>
            </div>

            <div v-if="tab === 1" key="timeline">
              <order-timeline :data="data"></order-timeline>
            </div>

            <div v-if="tab === 2" key="panels">
              <panels-assignment
                :data="data"
                :input="input"
                :disabled="lockedOrder"
                @assign-panels="setPanelAssignmentAction"
              ></panels-assignment>
            </div>
          </transition>
        </v-card>
      </v-col>

      <!-- Order summary -->
      <v-col :order="$vuetify.breakpoint.lgAndUp ? 2 : 1" cols="12" lg="4">
        <side-panel :data="data" :input="input">
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
          </action-panel>
        </side-panel>
      </v-col>
    </v-row>

    <action-dialog
      v-model="dialogProps.show"
      :data="dialogProps"
      :loading="loading"
      :maxWidth="dialogType ? 500 : undefined"
      @submit="dialogProps.action"
      @close="clearDialog"
    >
      <div v-if="!dialogType">
        Action: <b>{{ dialogProps.text }}</b>
      </div>

      <v-card v-else-if="dialogType === 'cancelOrder'" class="transparent" flat>
        <div v-if="loading">
          <div class="text-subheading black--text py-3">
            Cancelling {{ recordsUploaded.count }}/{{ recordsUploaded.total }} records
          </div>
          <v-progress-linear indeterminate rounded color="secondary" class="my-3"></v-progress-linear>
        </div>
        <div v-else class="text-left py-2">
          <div class="text-body">
            Cancelling an order will flag the record inactive and deduct the quantity from the reserved pool.
          </div>
          <div class="text-subheading mt-3">Note: This is an irreversible process.</div>
        </div>
      </v-card>

      <v-card v-else-if="dialogType === 'assignPanels'" class="transparent overflow-y-auto" max-height="700" flat>
        <div v-if="loading">
          <div class="text-subheading black--text py-3">
            Writing {{ recordsUploaded.count }}/{{ recordsUploaded.total }} records
          </div>
          <v-progress-linear indeterminate rounded color="secondary" class="my-3"></v-progress-linear>
        </div>
        <div v-else class="text-hint black--text py-2">
          <div class="text-body mb-2">
            {{ panelsToAssign.operation === 'add' ? 'Add panel assignment:' : 'Remove panel assignment' }}
          </div>
          <v-row no-gutters>
            <v-col :cols="panelsCol(panelsToAssign.data)" v-for="panel in panelsToAssign.data" v-bind:key="panel._id">
              {{ panel._id }}
            </v-col>
          </v-row>
        </div>
      </v-card>
    </action-dialog>
  </v-form>
</template>

<script>
import get from 'lodash/get';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import { mapActions } from 'vuex';
import dialog from '@/mixins/dialog';
import { asyncForEach } from '@/utils';
import { toCamel } from '@/utils/formats';
import { timestampToDate } from '@/utils/date';
import { sendEmailOrderPaid, sendEmailOrderCancelled } from '@/services/functions';
import { appHeaderProps, pageContainerProps } from '@/ui/shared/Layouts/props';
import SidePanel from './Forms/SidePanel.vue';
import OrderForm from './Forms/OrderForm.vue';
import OrderTimeline from './Forms/OrderTimeline.vue';
import PanelsAssignment from './Forms/PanelsAssignment.vue';

export default {
  name: 'EditOrder',
  components: {
    SidePanel,
    OrderForm,
    OrderTimeline,
    PanelsAssignment,
  },
  props: {
    data: { type: Object, required: true },
  },
  mixins: [dialog],
  data() {
    return {
      valid: true,
      loading: false,
      initialized: false,
      inputChanged: false,
      input: {
        quantity: 0,
        unitCost: {
          value: null,
          currency: null,
        },
        status: null,
        statusDates: {
          waitlist: null,
          unfulfilled: null,
          contract_signed: null,
          paid: null,
          cancelled: null,
        },
      },
      recordsUploaded: {
        count: 0,
        total: 0,
      },
      dialogType: null,
      tab: null,
      tabs: ['General', 'Timeline', 'Panels Assigned'],
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
    tab(val) {
      if (val !== Number(this.$route.query.tab)) {
        this.$router.replace({ path: this.$route.path, query: { ...this.$route.query, tab: val } });
      }
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
    order() {
      return this.data.order;
    },
    user() {
      return this.data.user;
    },
    project() {
      return this.data.project;
    },
    lockedOrder() {
      const status = get(this.data, 'order.status');
      return status === 'cancelled' || status === 'paid';
    },
    panelsAssigned() {
      const { panels } = this.data;
      if (panels) return panels.length > 0 && panels.length === Number(this.input.quantity);
      return false;
    },
    actionButtons() {
      return [
        {
          name: 'Update',
          show: this.panelsAssigned && !this.lockedOrder,
          disabled: !this.inputChanged,
          color: 'primary',
          handler: this.setUpdateAction,
        },
        {
          name: 'Assign Panels',
          show: !this.panelsAssigned && !this.lockedOrder,
          disabled: false,
          color: 'primary',
          handler: this.setPanelAssignmentAction,
        },
        {
          name: 'Cancel Order',
          show: !this.lockedOrder,
          disabled: false,
          color: 'error',
          handler: this.setCancelAction,
        },
      ].filter(({ show }) => show !== false);
    },

    // Details
    getPanelQuantitiesResult() {
      const { quantity: prevQuantity } = this.order;
      const { panelsTotal, panelsSold, panelsReserved } = this.project;
      const { quantity } = this.input;

      if (this.input.status === 'paid') {
        const paidReserved = panelsReserved - Number(prevQuantity);
        const paidSold = panelsSold + Number(quantity);
        return {
          total: panelsTotal,
          reserved: paidReserved,
          sold: paidSold,
        };
      }

      if (this.order.status === 'waitlist') {
        return {
          total: panelsTotal,
          reserved: this.input.status === 'waitlist' ? 0 : Number(quantity),
          sold: panelsSold,
        };
      }

      const diffQuantity = Number(quantity) - Number(prevQuantity);
      const amendReserved = panelsReserved + diffQuantity;
      return {
        total: panelsTotal,
        reserved: amendReserved,
        sold: panelsSold,
      };
    },
    panelsToAssign() {
      const { panels, availablePanels } = this.data;
      if (panels && availablePanels) {
        const inputQuantity = Number(this.input.quantity || 0);
        const panelsAssigned = panels.length;
        const diff = inputQuantity - panelsAssigned;

        if (inputQuantity > panelsAssigned) {
          return {
            data: availablePanels.slice(0, diff),
            curr: panelsAssigned,
            operation: 'add',
          };
        }
        if (inputQuantity < panelsAssigned) {
          return {
            data: panels.slice(diff),
            curr: panelsAssigned,
            operation: 'remove',
          };
        }
      }
      return { data: [], curr: 0, operation: '' };
    },
    totalAmount() {
      return {
        value: this.order.unitCost.value * Number(this.input.quantity || 0),
        currency: this.order.total.currency,
      };
    },
  },
  methods: {
    ...mapActions('orders', ['updateOrder']),
    ...mapActions('projects', ['updateProject', 'createAndUpdatePanel']),
    ...mapActions('userAssets', ['createUserAsset']),

    initialize() {
      if (this.$route.query.tab) this.tab = Number(this.$route.query.tab);

      const { order } = this.data;

      Object.keys(this.input).forEach((field) => {
        const data = get(order, field);
        if (this.hasValue(data)) set(this.input, field, data);
      });

      this.$nextTick(() => {
        this.initialized = true;
        this.inputChanged = false;
      });
    },
    hasValue(v) {
      return !!v || v === 0 || v === false;
    },
    panelsCol(item) {
      const count = item.length;
      if (count > 100) return 4;
      if (count > 25) return 6;
      return 12;
    },
    validate() {
      this.valid = this.$refs.form.validate();
    },
    setUpdateAction() {
      this.validate();
      if (this.valid) {
        this.dialogType = null;
        this.setAction({
          name: 'Update order data',
          handler: this.updateOrderDoc,
        });
      }
    },
    setCancelAction() {
      this.dialogType = 'cancelOrder';
      this.setAction({
        name: 'Cancel order',
        handler: this.cancelOrder,
      });
    },
    setPanelAssignmentAction() {
      this.dialogType = 'assignPanels';
      this.setAction({
        name: 'Assign panels',
        handler: this.assignPanels,
      });
    },

    // Handlers
    async assignPanels() {
      try {
        this.loading = true;

        if (this.input.quantity !== this.order.quantity) {
          this.updatePanelQuantity();
          await this.updateOrderData();
        }
        await this.updateProjectPanelsData();

        this.setActionSuccess('Panels assigned to order record.');
        this.inputChanged = false;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
    },
    async updateOrderDoc() {
      try {
        this.loading = true;

        if (this.input.status === 'paid') {
          this.createNewUserAsset();
          this.sendEmail();
        }
        this.updatePanelQuantity();
        await this.updateOrderData();

        this.setActionSuccess('Updated order record.');
        this.inputChanged = false;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
    },
    async cancelOrder() {
      try {
        this.loading = true;

        if (this.order.status !== 'waitlist') {
          this.updatePanelQuantityCancel();
        }
        this.sendCancellationEmail();
        await this.updateOrderDataCancel();
        await this.assignPanelsCancel();

        this.setActionSuccess('Cancelled order.');
        this.inputChanged = false;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
    },

    // Operations
    async updateProjectPanelsData() {
      const data = cloneDeep(this.panelsToAssign.data);
      this.recordsUploaded.count = 0;
      this.recordsUploaded.total = data.length;

      await asyncForEach(data, async (item) => {
        const params = {
          id: item._id,
          projectId: this.project._id,
          orderId: this.panelsToAssign.operation === 'add' ? this.order._id : null,
          userId: this.panelsToAssign.operation === 'add' ? this.user._id : null,
        };
        await this.createAndUpdatePanel(params);
        this.recordsUploaded.count += 1;
      });
    },
    updateOrderData() {
      const params = {
        id: this.order._id,
        status: this.input.status,
        quantity: Number(this.input.quantity),
        unitCost: this.input.unitCost,
        total: {
          value: this.input.unitCost.value * Number(this.input.quantity || 0),
          currency: this.input.unitCost.currency,
        },
      };

      if (this.order.status !== this.input.status) {
        params.statusDates = {};

        Object.keys(this.order.statusDates).forEach((statusKey) => {
          if (statusKey !== this.input.status && this.order.statusDates[statusKey]) {
            params.statusDates[statusKey] = timestampToDate(this.order.statusDates[statusKey]);
          } else if (statusKey === toCamel(this.input.status)) {
            params.statusDates[statusKey] = new Date();
          } else {
            params.statusDates[statusKey] = null;
          }
        });
      }

      return this.updateOrder(params);
    },
    updatePanelQuantity() {
      let panelsReservedIncrement = 0;
      let panelsSoldIncrement = 0;

      const quantity = Number(this.order.quantity);
      const newQuantity = Number(this.input.quantity);

      if (quantity !== newQuantity && ['unfulfilled', 'contract_signed'].includes(this.input.status)) {
        // unfulfilled -> contract_signed
        panelsReservedIncrement = newQuantity - quantity;
      } else if (this.order.status === 'waitlist' && ['unfulfilled', 'contract_signed'].includes(this.input.status)) {
        // waitlist -> unfulfilled/contract_signed
        panelsReservedIncrement = quantity;
      } else if (this.order.status === 'waitlist' && this.input.status === 'paid') {
        // waitlist -> paid
        panelsSoldIncrement = newQuantity;
      } else if (['unfulfilled', 'contract_signed'].includes(this.order.status) && this.input.status === 'waitlist') {
        // unfulfilled/contract_signed -> waitlist
        panelsReservedIncrement = quantity * -1;
      } else if (this.input.status === 'paid') {
        // -> paid
        panelsReservedIncrement = quantity * -1;
        panelsSoldIncrement = newQuantity;
      }

      const params = {
        id: this.project._id,
        panelsReservedIncrement,
        panelsSoldIncrement,
      };

      return this.updateProject(params);
    },
    createNewUserAsset() {
      const { currency } = this.input.unitCost;

      const params = {
        userId: this.user._id,
        bankAccountId: this.order.bankAccountId,
        projectId: this.project._id,
        projectGroupId: this.project.projectGroupId,
        quantity: Number(this.input.quantity),
        revenueLatestDate: null,
        revenueLatest: {
          currency: null,
          value: null,
        },
        revenueUpcomingDate: null,
        revenueUpcoming: {
          currency: null,
          value: null,
        },
        revenueTotal: {
          currency,
          value: 0,
        },
        status: 'active',
      };

      return this.createUserAsset(params);
    },
    sendEmail() {
      const params = {
        to: this.user.email,
        lang: this.user.language,
        params: {
          name: this.user.firstName,
          order: {
            orderNumber: this.order.orderNumber,
            quantity: this.input.quantity,
            total: this.totalAmount,
          },
          project: {
            name: this.project.nameTrans[this.user.language],
          },
        },
      };

      return sendEmailOrderPaid(params);
    },
    // Order cancellations
    updateOrderDataCancel() {
      const params = {
        id: this.order._id,
        status: 'cancelled',
        statusDates: {},
      };

      Object.keys(this.order.statusDates).forEach((statusKey) => {
        if (statusKey !== 'cancelled' && this.input.statusDates[statusKey]) {
          params.statusDates[statusKey] = timestampToDate(this.input.statusDates[statusKey]);
        } else if (statusKey === 'cancelled') {
          params.statusDates[statusKey] = new Date();
        } else {
          params.statusDates[statusKey] = null;
        }
      });

      this.updateOrder(params);
    },
    updatePanelQuantityCancel() {
      const params = {
        id: this.project._id,
        panelsReservedIncrement: Number(this.order.quantity) * -1,
      };

      this.updateProject(params);
    },
    async assignPanelsCancel() {
      const data = cloneDeep(this.data.panels);
      this.recordsUploaded.count = 0;
      this.recordsUploaded.total = data.length;
      await asyncForEach(data, async (item) => {
        const param = {
          id: item._id,
          projectId: this.project._id,
          orderId: null,
          userId: null,
        };
        await this.createAndUpdatePanel(param);
        this.recordsUploaded.count += 1;
      });
    },
    sendCancellationEmail() {
      const params = {
        to: this.user.email,
        lang: this.user.language,
        params: {
          name: this.user.firstName,
          order: {
            orderNumber: this.order.orderNumber,
            quantity: this.input.quantity,
            total: this.totalAmount,
          },
          project: {
            name: this.project.nameTrans[this.user.language],
          },
        },
      };

      return sendEmailOrderCancelled(params);
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
