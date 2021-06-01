<template>
  <div class="project-view">
    <v-row>
      <v-col cols="12">
        <project-photo-gallery :data="projectDetails" style="height: 100%"></project-photo-gallery>
      </v-col>

      <v-col cols="12" md="6">
        <user-asset-summary class="summary-container" :data="projectDetails"></user-asset-summary>
      </v-col>

      <v-col cols="12" md="6">
        <v-row no-gutters>
          <v-col cols="12">
            <current-weather :data="projectDetails"></current-weather>
          </v-col>
          <v-col cols="12">
            <asset-roi-summary :data="data"></asset-roi-summary>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <div class="mt-5">
      <project-details :data="projectDetails" :defaultExpand="false"></project-details>
    </div>

    <div class="mt-5">
      <div class="title-container mb-2">
        <v-icon color="primary" class="mr-2">mdi-chart-bar</v-icon>
        <div class="text-subheading">{{ $t('Project-Historical-Title') }}</div>
      </div>
      <historical-data-graphs :data="projectDetails"></historical-data-graphs>
    </div>

    <div class="mt-5">
      <div class="title-container mb-2">
        <v-icon color="primary" class="mr-2">mdi-clipboard-text</v-icon>
        <div class="text-subheading">{{ $t('Project-Documents-Title') }}</div>
      </div>
      <document-list :data="projectDetails"></document-list>
    </div>
  </div>
</template>

<script>
import ProjectPhotoGallery from '@/ui/shared/Project/ProjectPhotoGallery.vue';
import AssetRoiSummary from '@/ui/shared/Project/AssetRoiSummary.vue';
import UserAssetSummary from '@/ui/shared/Project/UserAssetSummary.vue';
import CurrentWeather from '@/ui/shared/Project/CurrentWeather.vue';
import ProjectDetails from '@/ui/shared/Project/ProjectDetails.vue';
import HistoricalDataGraphs from '@/ui/shared/Project/HistoricalDataGraphs.vue';
import DocumentList from '@/ui/shared/Project/DocumentList.vue';

export default {
  name: 'UserAssetDetails',
  components: {
    ProjectPhotoGallery,
    AssetRoiSummary,
    UserAssetSummary,
    CurrentWeather,
    ProjectDetails,
    HistoricalDataGraphs,
    DocumentList,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    projectDetails() {
      return this.data.project;
    },
  },
};
</script>

<style lang="scss" scoped>
.summary-container {
  height: calc(100% - 12px);
}
.price-container {
  height: 135px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .price-content {
    text-align: right;
  }
}
.title-container {
  display: flex;
  align-items: center;
}
.flex-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
