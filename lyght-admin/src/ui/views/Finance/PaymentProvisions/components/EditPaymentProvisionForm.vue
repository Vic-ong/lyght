<template>
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
          <div v-if="tab === 0" key="general">
            <cash-distribution :data="data"></cash-distribution>
          </div>

          <div v-if="tab === 1" key="approval">
            <approval-form :data="data" :projectGroup="projectGroup" :userAssets="userAssets"></approval-form>
          </div>
        </transition>
      </v-card>
    </v-col>

    <!-- Summary -->
    <v-col :order="$vuetify.breakpoint.lgAndUp ? 2 : 1" cols="12" lg="4">
      <side-panel :data="data" :project="project"></side-panel>
    </v-col>
  </v-row>
</template>

<script>
import { appHeaderProps, pageContainerProps } from '@/ui/shared/Layouts/props';
import SidePanel from './Forms/SidePanel.vue';
import CashDistribution from './Forms/CashDistribution.vue';
import ApprovalForm from './Forms/ApprovalForm.vue';

export default {
  name: 'EditPaymentProvisionForm',
  components: {
    SidePanel,
    ApprovalForm,
    CashDistribution,
  },
  props: {
    data: { type: Object, required: true },
    project: { type: Object, required: true },
    projectGroup: { type: Object, required: true },
    userAssets: { type: Array, required: true },
  },
  data() {
    return {
      tab: null,
      tabs: ['Distribution', 'Approvals'],
    };
  },
  mounted() {
    if (this.$route.query.tab) this.tab = Number(this.$route.query.tab);
  },
  watch: {
    tab(val) {
      if (val !== Number(this.$route.query.tab)) {
        this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, tab: val },
        });
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
