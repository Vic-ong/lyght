<template>
  <page-container :navs="navs" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex filters-container">
              <v-autocomplete
                v-model="filter"
                :items="projectList"
                label="Project"
                validate-on-blur
                dense
                filled
                rounded
                hide-details
              ></v-autocomplete>
            </div>

            <new-payment-provision :list="list"></new-payment-provision>
          </div>
        </v-col>

        <v-col cols="12">
          <payment-provision-list
            :data="data"
            :projectList="projects.data"
            @item-select="routeToEdit"
          ></payment-provision-list>
        </v-col>
      </v-row>
    </template>
  </page-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';
import NewPaymentProvision from './components/NewPaymentProvision.vue';
import PaymentProvisionList from './components/PaymentProvisionList.vue';

export default {
  name: 'PaymentProvisions',
  components: {
    PageContainer,
    NewPaymentProvision,
    PaymentProvisionList,
  },
  data() {
    return {
      navs: ['finance', 'finance/payment-provisions'],
      renderers: ['paymentProvisions', 'closedExpenses', 'projectGroups', 'projects'],
      filter: 'all',
    };
  },
  created() {
    this.initialize();
  },
  computed: {
    ...mapGetters('paymentProvisions', ['paymentProvisions']),
    ...mapGetters('projectGroups', ['projectGroups']),
    ...mapGetters('projects', ['projects']),
    ...mapState('expenses', ['closedExpenses']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
    list() {
      return {
        expenses: this.closedExpenses.data,
        projects: this.projects.data,
        projectGroups: this.projectGroups.data,
      };
    },
    projectList() {
      if (!this.projects.data || this.projects.data.length === 0) return [];
      const list = this.projects.data.map((item) => ({
        text: item.nameTrans.en,
        value: item._id,
      }));
      list.unshift({ text: 'All', value: 'all' });
      return list;
    },
    data() {
      if (!this.paymentProvisions.data || this.paymentProvisions.data.length === 0) return [];
      return this.paymentProvisions.data.filter((item) => {
        if (this.filter === 'all') return true;
        return item.projectId === this.filter;
      });
    },
  },
  methods: {
    ...mapActions('paymentProvisions', ['getPaymentProvisions']),
    ...mapActions('expenses', ['getClosedExpenses']),
    ...mapActions('projectGroups', ['getProjectGroups']),
    ...mapActions('projects', ['getProjects']),

    initialize() {
      if (!this.paymentProvisions.data) this.getPaymentProvisions();
      if (!this.closedExpenses.data) this.getClosedExpenses();
      if (!this.projects.data) this.getProjects();
      if (!this.projectGroups.data) this.getProjectGroups();
    },
    routeToEdit(data) {
      this.$router.push({
        name: 'finance/payment-provisions/:id',
        params: {
          id: data._id,
        },
        query: {
          project: data.projectId,
          projectGroup: data.projectGroupId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.filters-container {
  & > div {
    margin-right: 12px;
  }
}
</style>
