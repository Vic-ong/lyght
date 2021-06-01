<template>
  <v-card class="pos-relative mt-15 rounded-lg project-card-container">
    <div class="pos-absolute top-n15 stretch-width d-flex justify-center">
      <v-hover v-if="primaryImg">
        <template v-slot:default="{ hover }">
          <v-card :width="imgSize.width" :height="imgSize.height" class="elevation-5 bg-grey">
            <v-img :src="primaryImg" :height="imgSize.height"></v-img>
            <transition name="transition-fade">
              <v-overlay v-if="hover" absolute color="bg-dark">
                <a :href="primaryImg" target="_blank" style="text-decoration: none">
                  <v-card class="pa-4 transparent text-center" flat>
                    <v-icon size="24" color="accent">$fi-sr-zoom-in</v-icon>
                    <div class="text-body bg-light--text mt-1">View</div>
                  </v-card>
                </a>
              </v-overlay>
            </transition>
          </v-card>
        </template>
      </v-hover>

      <v-card v-else :width="imgSize.width" :height="imgSize.height" class="elevation-5 bg-grey">
        <div class="d-flex align-center justify-center stretch-height">
          <v-icon :size="50" color="white">mdi-image-off</v-icon>
        </div>
      </v-card>
    </div>

    <div class="text-center pa-5">
      <div class="text-center text-body pt-5 px-3">
        <div class="text-subtitle">{{ projectName }}</div>
      </div>
      <div class="mt-5 px-3">
        <v-row dense>
          <v-col v-for="item in checks" v-bind:key="item.icon" cols="12" md="6" lg="12" class="d-flex align-center">
            <v-card class="pa-3 bg-light rounded-btn" flat>
              <v-icon color="bg-dark" size="20">{{ item.icon }}</v-icon>
            </v-card>
            <div class="text-left ml-3">
              <div class="text-subheading">{{ item.title }}</div>
              <div class="text-hint bg-grey--text">{{ item.desc }}</div>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

    <slot></slot>

    <div class="divider-line my-5 mx-5"></div>

    <div class="pb-5">
      <record-timestamps :data="data"></record-timestamps>
    </div>
  </v-card>
</template>

<script>
import get from 'lodash/get';
import { dateDiff, formatDuration } from '@/utils/date';
import { formatDisplayVal } from '@/utils/formats';
import { projectScale, projectEstablishment, projectLength } from '@/ui/views/Projects/shared';

export default {
  name: 'Project.SidePanel',
  props: {
    data: { type: Object, required: true },
  },
  computed: {
    projectName() {
      return get(this.data, 'nameTrans.en');
    },
    primaryImg() {
      return get(this.data, 'imagePrimary.url');
    },
    imgSize() {
      return {
        width: 250,
        height: 150,
      };
    },
    percentageFormat() {
      return { format: '0.00%' };
    },
    performanceTitle() {
      const { yieldRateAvg } = this.data;

      if (yieldRateAvg < 0.06) return 'Acceptable performance';
      if (yieldRateAvg < 0.09) return 'Performant';
      return 'Highly performant';
    },
    performanceDesc() {
      const { estimatedIrr = 0, yieldRateAvg = 0 } = this.data;
      const irr = formatDisplayVal(estimatedIrr, this.percentageFormat);
      const yieldRate = formatDisplayVal(yieldRateAvg, this.percentageFormat);

      return `Estimated ${yieldRate} annual yield rate and estimated ${irr} IRR`;
    },
    checks() {
      return [
        {
          title: this.performanceTitle,
          desc: this.performanceDesc,
          icon: 'mdi-chart-timeline-variant-shimmer',
          show: !!this.data.yieldRateAvg,
        },
        projectScale(this.data.details),
        projectEstablishment(this.data.details),
        projectLength({
          start: this.data.fundingEndDate,
          end: this.data.details.ppaContractEndDate,
        }),
      ].filter(({ show }) => show !== false);
    },
  },
  methods: {
    getProjectDuration() {
      const start = this.data.fundingEndDate;
      const end = this.data.ppaContractEndDate;
      const duration = dateDiff(start, end, 'all', true);
      return formatDuration(duration);
    },
    yearsDiff(date) {
      return dateDiff({ date1: date, date2: new Date(), unit: 'year', precise: true });
    },
  },
};
</script>

<style lang="scss" scoped>
.project-card-container {
  padding-top: 80px;
}
</style>
