<template>
  <div>
    <div class="ml-2 mt-3 mb-5">
      <div class="text-subheading primary--text">Cash distribution to buyers</div>
      <div class="d-flex align-center text-body bg-grey--text py-2">
        <span>Note:</span>
        <v-icon small color="info" class="mx-2">mdi-alert-circle</v-icon>
        <span>indicates value that has been modified, which differs from the default calculation.</span>
      </div>
    </div>

    <dynamic-input :input="data" :fields="fields" :disabled="isLocked"></dynamic-input>

    <v-card class="rounded-xl pa-7 my-5">
      <v-data-table
        :headers="headers"
        :items="data.distributions"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :items-per-page="10"
        must-sort
      >
        <template v-slot:[`item.user`]="{ item }">
          <div class="cursor-pointer">
            <router-link
              :to="{ name: 'users/:id', params: { id: item.userId } }"
              target="_blank"
              style="text-decoration: none"
            >
              {{ item.user }}
            </router-link>
          </div>
        </template>

        <template v-slot:[`item.partition`]="{ item }">
          {{ formatPercentage(item.partition) }}
        </template>

        <template v-slot:[`item.revenue`]="{ item }">
          <div @click="setEditAction(item)" class="d-flex align-center" :class="!isLocked && 'cursor-pointer'">
            {{ currencyDisplay(item.revenue) }}
            <v-icon v-if="revenueChanged(item)" small color="info" class="ml-2">mdi-alert-circle</v-icon>
          </div>
        </template>

        <template v-slot:[`item.tax`]="{ item }">
          <div @click="setEditAction(item)" class="d-flex align-center" :class="!isLocked && 'cursor-pointer'">
            {{ currencyDisplay(item.tax) }}
            <v-icon v-if="taxChanged(item)" small color="info" class="ml-2">mdi-alert-circle</v-icon>
          </div>
        </template>

        <template v-slot:[`item.total`]="{ item }">
          <div @click="setEditAction(item)" :class="!isLocked && 'cursor-pointer'">
            <b>{{ currencyDisplay(item.total) }}</b>
          </div>
        </template>

        <template v-slot:[`item.info`]="{ item }">
          <v-hover v-slot="{ hover }">
            <div @click="seeInfo(item)" class="cursor-pointer">
              <v-icon :class="{ 'on-hover': hover }" small>mdi-magnify-plus-outline</v-icon>
            </div>
          </v-hover>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="infoDialog" max-width="400">
      <v-card class="pa-7">
        <div v-for="item in infoFields" v-bind:key="item.key" class="mt-2">
          <div class="text-body">{{ item.name }}</div>
          <v-card class="bg-light pa-2" flat>
            <div class="text-hint bg-grey--text">{{ infoItem[item.key] }}</div>
          </v-card>
        </div>

        <div class="divider-line my-5 mx-5"></div>

        <record-timestamps :data="infoItem"></record-timestamps>
      </v-card>
    </v-dialog>

    <general-dialog
      v-model="dialogProps.show"
      :text="dialogProps.text"
      :status="dialogProps.status"
      @close="clearData"
      max-width="400"
    >
      <template #header>{{ dialogTitle }}</template>

      <template #body>
        <div v-if="dialogTitle === 'Reset All'">
          <div class="text-body">This action will reset all the values based on the default calculations.</div>
        </div>

        <div v-else>
          <v-form ref="form" v-model="valid" class="text-left" lazy-validation>
            <dynamic-input :input="input" :fields="editFields" :disabled="loading"></dynamic-input>
          </v-form>
          <div class="text-right mr-3">
            <div class="text-hint">Total</div>
            <div class="text-subheading">{{ currencyDisplay(input.total) }}</div>
          </div>
        </div>
      </template>

      <template #actions>
        <div v-if="dialogTitle !== 'Reset All'">
          <btn-main @click="resetHandler" :disabled="!hasChanges(input)" :loading="loading" color="primary">
            Reset
          </btn-main>
        </div>
        <div>
          <btn-main @click="submitHandler" :loading="loading" color="primary">Submit</btn-main>
        </div>
      </template>
    </general-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import dayjs from '@/services/dayjs';
import dialog from '@/mixins/dialog';
import currencyList from '@/constants/finance/currencyList.json';
import { round } from '@/utils';
import { formatTimestamp } from '@/utils/date';
import { formatCurrency, formatDisplayVal } from '@/utils/formats';
import v from '@/utils/validations';
import DynamicInput from '@/components/FormInput/DynamicInputLegacy.vue';
import { calcOutstanding } from '../../shared';

export default {
  name: 'PaymentProvision.UserRevenues',
  components: {
    DynamicInput,
  },
  props: {
    data: { type: Object, required: true },
  },
  mixins: [dialog],
  data() {
    return {
      sortBy: 'partition',
      sortDesc: true,
      currencyRules: [v.required(), v.money()],
      headers: [
        { text: 'User', value: 'user' },
        { text: 'Partition', value: 'partition' },
        { text: 'Revenue', value: 'revenue', sortable: false },
        { text: 'Tax', value: 'tax', sortable: false },
        { text: 'Total', value: 'total', sortable: false },
        { text: '', value: 'info', sortable: false },
      ],

      infoDialog: false,
      infoItem: {},
      infoFields: [
        { key: '_id', name: 'User Asset ID' },
        { key: 'userId', name: 'User ID' },
      ],

      valid: true,
      loading: false,
      dialogTitle: null,
      input: {
        id: null,
        user: null,
        parition: 0,
        revenue: 0,
        tax: 0,
        total: 0,
      },
    };
  },
  computed: {
    isLocked() {
      return this.data.status === 'closed';
    },
    fields() {
      return [
        {
          key: 'date',
          component: 'v-text-field',
          cols: '6',
          label: 'Date',
          readonly: true,
        },
        {
          key: 'status',
          component: 'v-select',
          cols: '6',
          label: 'Status',
          items: [
            { text: 'Open', value: 'open' },
            { text: 'Closed', value: 'closed' },
          ],
          readonly: true,
        },
        {
          key: 'currency',
          component: 'v-select',
          cols: '6',
          label: 'Currency',
          items: this.currencyList,
          readonly: true,
        },
        {
          key: 'revenue',
          component: 'v-text-field',
          type: 'number',
          cols: '6',
          label: 'Revenue',
          readonly: true,
        },
        {
          key: 'valueAddedTax',
          component: 'v-text-field',
          type: 'number',
          cols: '6',
          label: 'Value-added Tax',
          readonly: true,
        },
        {
          key: 'paymentDate',
          component: 'datepicker',
          max: dayjs(`${this.data.date}-15`).add(5, 'month').format('YYYY-MM-DD'),
          min: dayjs(`${this.data.date}-15`).add(3, 'month').format('YYYY-MM-DD'),
          cols: '6',
          label: 'Payment Date',
          rules: [v.required()],
        },
      ];
    },

    editFields() {
      return [
        {
          key: 'revenue',
          component: 'v-text-field',
          type: 'number',
          cols: '12',
          label: 'Revenue',
          onChange: this.calcTotal,
          rules: [v.required(), v.money()],
        },
        {
          key: 'tax',
          component: 'v-text-field',
          type: 'number',
          cols: '12',
          label: 'Tax',
          onChange: this.calcTotal,
          rules: [v.required(), v.money({ allowZero: true })],
        },
      ];
    },

    currencyList() {
      return currencyList.map((item) => ({
        text: item.name,
        value: item.code,
      }));
    },
  },
  methods: {
    ...mapActions('paymentProvisions', ['updatePaymentProvision', 'updateDistribution']),

    formatTimestamp,
    formatPercentage(value) {
      return formatDisplayVal(round(value, 3), { format: '0.[00]%' });
    },
    formatCurrency(value) {
      return formatCurrency({ value, currency: this.data.currency });
    },
    currencyDisplay(value) {
      return value ? this.formatCurrency(value).display : '-';
    },

    seeInfo(item) {
      this.infoItem = item;
      this.infoDialog = true;
    },

    calcPartitionValue(partition) {
      const { revenue } = this.data;
      return round(revenue * partition, 2);
    },
    calcTotal() {
      const revenue = Number(this.input.revenue);
      const tax = Number(this.input.tax);
      if (!Number.isNaN(revenue) && !Number.isNaN(tax)) {
        this.input.total = revenue + tax;
      }
    },
    revenueChanged(input) {
      const { partition } = input;
      const revenue = Number(input.revenue);
      if (!Number.isNaN(revenue)) return this.calcPartitionValue(partition) !== revenue;
      return true;
    },
    taxChanged(input) {
      // TODO: Calc tax changes
      const tax = Number(input.tax);
      if (!Number.isNaN(tax)) return tax !== 0;
      return true;
    },
    hasChanges(input) {
      return this.revenueChanged(input) || this.taxChanged(input);
    },
    setEditAction({ _id, user, partition, revenue, tax, total } = {}) {
      if (!this.isLocked) {
        this.input = {
          id: _id,
          user,
          partition,
          revenue,
          tax,
          total,
        };
        this.dialogTitle = `Edit Payment (${user})`;
        this.setAction({ handler: this.submitHandler });
      }
    },
    clearData() {
      this.input = {
        id: null,
        user: null,
        parition: 0,
        revenue: 0,
        tax: 0,
        total: 0,
      };
      this.clearDialog();
    },

    resetHandler() {
      const { partition } = this.input;
      this.input.revenue = this.calcPartitionValue(partition);
      this.input.tax = 0;
      this.calcTotal();
    },

    validate() {
      this.valid = this.$refs.form.validate();
    },
    async submitHandler() {
      this.validate();
      if (this.valid) {
        try {
          this.loading = true;

          const res = await this.updateDistribution({
            paymentProvisionId: this.$route.params.id,
            edited: this.hasChanges(this.input),
            ...this.input,
          });

          const outstanding = calcOutstanding(this.data);
          if (outstanding !== this.data.outstanding) {
            await this.updatePaymentProvision({
              id: this.$route.params.id,
              outstanding,
            });
          }

          this.loading = false;
          this.setActionSuccess(res.message);
        } catch (err) {
          this.loading = false;
          this.setActionError(err);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-icon {
  transition: all 0.3s ease-out;
}
.v-icon:not(.on-hover) {
  transform: scale(1);
}
.v-icon.on-hover {
  color: var(--v-primary-base) !important;
  transform: scale(1.4);
  animation: animate-grow 0.3s ease-out;
}
</style>
