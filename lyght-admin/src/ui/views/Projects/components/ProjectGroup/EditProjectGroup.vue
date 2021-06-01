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
              <project-group-form :input="input" :loading="loading"></project-group-form>
            </div>

            <div v-if="tab === 1" key="financials">
              <div class="text-subheading primary--text ml-2 mt-3 mb-5">Bank Account (Trust 1)</div>
              <bank-account-form :input="input.bankAccount.primary_account" :loading="loading"></bank-account-form>

              <div class="text-subheading primary--text ml-2 mt-3 mb-5">Bank Account (Trust 2)</div>
              <bank-account-form :input="input.bankAccount.cost_account" :loading="loading"></bank-account-form>

              <div class="text-subheading primary--text ml-2 mt-3 mb-5">Expense Allocations</div>
              <expense-allocations :data="data.expenseAllocations || []" :loading="loading"></expense-allocations>
            </div>

            <div v-if="tab === 2" key="misc">
              <div class="text-subheading primary--text ml-2 mt-3 mb-5">Performance</div>
              <performance-data :data="data.performance"></performance-data>

              <div class="text-subheading primary--text ml-2 mt-3 mb-5">Files</div>
              <project-documents :data="data"></project-documents>

              <div class="text-subheading primary--text ml-2 mt-7 mb-5">Insurance</div>
              <insurance-form :data="data.insurance || []"></insurance-form>

              <div class="text-subheading primary--text ml-2 mt-3 mb-5">Manufacturers</div>
              <manufacturer-form :data="data.manufacturers || []"></manufacturer-form>
            </div>
          </transition>
        </v-card>
      </v-col>

      <!-- Profile summary -->
      <v-col :order="$vuetify.breakpoint.lgAndUp ? 2 : 1" cols="12" lg="4">
        <side-panel :data="data">
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
import { mapActions } from 'vuex';
import dialog from '@/mixins/dialog';
import { appHeaderProps, pageContainerProps } from '@/ui/shared/Layouts/props';
import SidePanel from './Forms/SidePanel.vue';
import ProjectGroupForm from './Forms/ProjectGroupForm.vue';
import BankAccountForm from './Forms/BankAccountForm.vue';
import ExpenseAllocations from './Forms/ExpenseAllocations.vue';
import PerformanceData from './Forms/PerformanceData.vue';
import InsuranceForm from './Forms/InsuranceForm.vue';
import ManufacturerForm from './Forms/ManufacturerForm.vue';
import ProjectDocuments from './Forms/ProjectDocuments.vue';

export default {
  name: 'EditProjectGroup',
  components: {
    SidePanel,
    ProjectGroupForm,
    BankAccountForm,
    ExpenseAllocations,
    PerformanceData,
    InsuranceForm,
    ManufacturerForm,
    ProjectDocuments,
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
        entityId: null,
        publicIdentifier: null,
        nameTrans: {
          en: null,
          zhHant: null,
        },
        panelsTotal: null,
        capacity: null,
        ppaSerialNumber: null,
        ppaContractStartDate: null,
        ppaContractEndDate: null,
        electricityPurchaser: 'taiwan_power',
        electricityPrice: {
          currency: null,
          value: null,
        },
        classification: null,
        grade: null,
        address: {
          address1: null,
          address2: null,
          district: null,
          city: null,
          state: 'Taiwan',
          country: 'Taiwan',
          postalCode: null,
        },
        bankAccount: {
          primary_account: {
            accountName: null,
            accountNumber: null,
            bankCode: null,
          },
          cost_account: {
            accountName: null,
            accountNumber: null,
            bankCode: null,
          },
        },
        status: 'incomplete',
      },

      tab: 0,
      tabs: ['General', 'Financials', 'Misc'],
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
        this.$router.replace({ path: this.$route.path, query: { tab: val } });
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
    actionButtons() {
      return [
        {
          name: 'Update',
          disabled: !this.inputChanged,
          color: 'primary',
          handler: this.setUpdateAction,
        },
      ].filter((item) => item.show !== false);
    },
  },
  methods: {
    ...mapActions('projectGroups', ['updateProjectGroup', 'updateProjectGroupDetailed', 'updateBankAccount']),

    initialize() {
      if (this.$route.query.tab) this.tab = Number(this.$route.query.tab);

      Object.keys(this.input).forEach((field) => {
        const data = get(this.data, field);
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
    validate() {
      this.valid = this.$refs.form.validate();
    },
    setUpdateAction() {
      this.validate();
      if (this.valid) {
        this.setAction({
          name: 'Update project group data',
          handler: this.updateProjectGroupHandler,
        });
      }
    },
    async updateProjectGroupHandler() {
      try {
        this.loading = true;

        // TODO: refactor to only update affected docs
        const res = await this.updateProjectGroup({
          id: this.$route.params.id,
          ...this.input,
        });
        await this.updateProjectGroupDetailed({
          id: this.$route.params.id,
          ...this.input,
        });

        if (this.input.bankAccount.primary_account.bankCode) {
          await this.updateBankAccount({
            id: 'primary_account',
            projectGroupId: this.$route.params.id,
            ...this.input.bankAccount.primary_account,
          });
        }
        if (this.input.bankAccount.cost_account.bankCode) {
          await this.updateBankAccount({
            id: 'cost_account',
            projectGroupId: this.$route.params.id,
            ...this.input.bankAccount.cost_account,
          });
        }

        this.setActionSuccess(res.message);
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
