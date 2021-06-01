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
              <div class="text-subheading primary--text ml-2 mt-3 mb-5">General</div>
              <project-form :input="input" :data="data" :loading="loading"></project-form>

              <div class="text-subheading primary--text ml-2 mt-3 mb-5">Yield Rates</div>
              <yield-rates :data="data"></yield-rates>

              <div class="text-subheading primary--text ml-2 mt-3 mb-5">Project Group Info</div>
              <project-group-summary-form :input="input" :data="data" :loading="loading"></project-group-summary-form>
            </div>

            <div v-if="tab === 1" key="files">
              <div class="text-subheading primary--text ml-2 mt-3 mb-5">Images</div>
              <project-images :data="data"></project-images>

              <div class="text-subheading primary--text ml-2 mt-7 mb-5">Files</div>
              <project-documents :data="data"></project-documents>
            </div>

            <div v-if="tab === 2" key="panels">
              <div class="text-subheading primary--text ml-2 mt-3 mb-5">Panels</div>
              <panels :data="data"></panels>
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
import ProjectForm from './Forms/ProjectForm.vue';
import ProjectGroupSummaryForm from './Forms/ProjectGroupSummaryForm.vue';
import ProjectImages from './Forms/ProjectImages.vue';
import ProjectDocuments from './Forms/ProjectDocuments.vue';
import YieldRates from './Forms/YieldRates.vue';
import Panels from './Forms/Panels.vue';

export default {
  name: 'EditProject',
  components: {
    SidePanel,
    ProjectForm,
    ProjectGroupSummaryForm,
    ProjectImages,
    ProjectDocuments,
    YieldRates,
    Panels,
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
        projectGroupId: null,
        nameTrans: {
          en: null,
          zhHant: null,
        },
        unitCost: {
          value: null,
          currency: 'TWD',
        },
        estimatedIrr: null,
        panelsTotal: null,
        panelsReserved: 0,
        panelsSold: 0,
        fundingStartDate: null,
        fundingEndDate: null,
        status: 'incomplete',
      },

      tab: null,
      tabs: ['General', 'Files', 'Panels'],
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
    projectStatus() {
      return this.data.status;
    },
    actionButtons() {
      return [
        {
          name: 'Update',
          disabled: !this.inputChanged,
          color: 'primary',
          handler: this.setUpdateAction,
        },
        {
          name: 'Reset',
          show: this.projectStatus !== 'incomplete',
          disabled: !this.inputChanged,
          color: 'secondary',
          handler: this.initialize,
        },
      ].filter((item) => item.show !== false);
    },
  },
  methods: {
    ...mapActions('projects', ['updateProject']),

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
          name: 'Update project data',
          handler: this.updateProjectHandler,
        });
      }
    },
    async updateProjectHandler() {
      try {
        this.loading = true;

        const res = await this.updateProject({
          id: this.$route.params.id,
          ...this.input,
        });

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
