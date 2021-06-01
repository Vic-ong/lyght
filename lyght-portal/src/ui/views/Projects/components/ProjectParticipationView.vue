<template>
  <div class="project-view">
    <v-row>
      <v-col cols="12">
        <project-photo-gallery :data="data" style="height: 100%"></project-photo-gallery>
      </v-col>

      <v-col cols="12" md="7">
        <project-summary :data="data"></project-summary>
      </v-col>

      <v-col cols="12" md="5" v-if="data.status === 'active'">
        <participation-form
          v-if="hasFullAccess"
          :data="data"
          :input="calculatorInput"
          class="mt-5"
        ></participation-form>
        <complete-profile-reminder v-else class="mt-5"></complete-profile-reminder>
      </v-col>

      <v-col v-if="data.status === 'active'" cols="12" class="mt-5">
        <div class="title-container mb-2">
          <v-icon color="primary" class="mr-2">mdi-finance</v-icon>
          <div class="text-subheading">{{ $t('Project-Calculator-Title') }}</div>
        </div>
        <roi-calculator
          :data="data"
          :calculatorInput="calculatorInput"
          @change="(v) => (calculatorInput = v)"
        ></roi-calculator>
      </v-col>

      <v-col cols="12" class="mt-5">
        <div class="title-container mb-2">
          <v-icon color="primary" class="mr-2">mdi-chart-bar</v-icon>
          <div class="text-subheading">{{ $t('Project-Historical-Title') }}</div>
        </div>
        <historical-data-graphs :data="data"></historical-data-graphs>
      </v-col>
    </v-row>

    <div v-if="userVerified" class="mt-5">
      <project-details :data="data"></project-details>
    </div>

    <div v-if="data.status === 'active' && userVerified" class="mt-5">
      <div class="title-container mb-2">
        <v-icon color="primary" class="mr-2">mdi-clipboard-text</v-icon>
        <div class="text-subheading">{{ $t('Project-Documents-Title') }}</div>
      </div>
      <document-list :data="data"></document-list>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProjectPhotoGallery from '@/ui/shared/Project/ProjectPhotoGallery.vue';
import ProjectSummary from '@/ui/shared/Project/ProjectSummary.vue';
import RoiCalculator from '@/ui/shared/Project/RoiCalculator.vue';
import ParticipationForm from '@/ui/shared/Project/ParticipationForm.vue';
import ProjectDetails from '@/ui/shared/Project/ProjectDetails.vue';
import HistoricalDataGraphs from '@/ui/shared/Project/HistoricalDataGraphs.vue';
import DocumentList from '@/ui/shared/Project/DocumentList.vue';
import CompleteProfileReminder from '@/ui/shared/Project/CompleteProfileReminder.vue';

export default {
  name: 'ProjectParticipationView',
  components: {
    ProjectPhotoGallery,
    ProjectSummary,
    RoiCalculator,
    ParticipationForm,
    ProjectDetails,
    HistoricalDataGraphs,
    DocumentList,
    CompleteProfileReminder,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    hasFullAccess: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      calculatorInput: Math.round((this.data.panelsTotal - this.data.panelsSold) * 0.1),
    };
  },
  computed: {
    ...mapGetters('users', ['user']),

    userVerified() {
      return this.user.data.setup.identityVerification === 'approved';
    },
  },
};
</script>

<style lang="scss" scoped>
.title-container {
  display: flex;
  align-items: center;
}
</style>
