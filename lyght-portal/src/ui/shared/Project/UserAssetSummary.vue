<template>
  <v-card flat>
    <v-row>
      <v-col cols="12">
        <v-row no-gutters>
          <v-col cols="12" sm="4" :class="isXs && 'text-center'">
            <div class="text-emphasis">
              <animated-number
                v-if="yieldRateAvg"
                :value="yieldRateAvg"
                :formatValue="formatPercentage"
                :duration="animationTime"
              ></animated-number>
              <div v-else>N/A</div>
            </div>
            <div class="text-body grey--text">{{ $t('Field-AnnualYieldRate') }}</div>
          </v-col>

          <v-spacer></v-spacer>

          <v-col cols="12" sm="7" :class="isXs && 'text-center'">
            <div class="text-emphasis">
              <animated-number
                v-if="estimatedIrr"
                :value="estimatedIrr"
                :formatValue="formatPercentage"
                :duration="animationTime"
              ></animated-number>
              <div v-else>N/A</div>
            </div>
            <div class="text-body grey--text">{{ $t('Field-EstimatedIrr') }}</div>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" v-for="field in fields" v-bind:key="field.key">
        <v-card flat class="d-flex mt-2" :class="isXs && 'px-3'">
          <v-icon class="mr-4" color="black" large>{{ field.icon }}</v-icon>
          <div>
            <div class="text-subheading-medium black--text">{{ field.title }}</div>
            <div class="text-subtitle grey--text text--darken-3">{{ field.desc }}</div>
            <div class="text-hint black--text" style="text-decoration: underline">
              <a v-if="field.learnMore" :href="field.learnMore()" target="_blank">
                {{ $t('Info-LearnMore') }}
              </a>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { formatDisplayVal } from '@/utils/formats';
import { formatDate, dateDiff } from '@/utils/date';
import AnimatedNumber from 'animated-number-vue';
import { getProjectDuration, getProjectDurationText } from './utils';

export default {
  name: 'ProjectSummary',
  components: {
    AnimatedNumber,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      animationTime: 600,
    };
  },
  computed: {
    isXs() {
      return this.$vuetify.breakpoint.xs;
    },
    fields() {
      return [
        {
          key: 'scale',
          title: this.projectScaleTitle(),
          desc: this.projectScaleDesc(),
          icon: 'mdi-flash-circle',
        },
        {
          key: 'performance',
          title: this.performanceTitle(),
          desc: this.performanceDesc(),
          icon: 'mdi-chart-timeline-variant-shimmer',
          learnMore: this.performanceFAQ,
        },
        {
          key: 'establishment',
          title: this.projectEstablishmentTitle(),
          desc: this.projectEstablishmentDesc(),
          icon: 'mdi-layers',
        },
        {
          key: 'length',
          title: this.projectLengthTitle(),
          desc: this.projectLengthDesc(),
          icon: 'mdi-map-clock',
        },
      ];
    },
    percentageFormat() {
      return { format: '0.00%' };
    },
    capacityFormat() {
      return { suffix: 'kW' };
    },
    moneyFormat() {
      return { format: '0,0', suffix: this.data.unitCost.currency };
    },
    yieldRateAvg() {
      return this.data.yieldRateAvg;
    },
    estimatedIrr() {
      return this.data.estimatedIrr;
    },
  },
  methods: {
    formatPercentage(v) {
      return formatDisplayVal(v, this.percentageFormat);
    },
    yearsDiff(date) {
      return dateDiff({ date1: date, date2: new Date(), unit: 'year', precise: true });
    },
    projectScaleTitle() {
      const { capacity } = this.data;

      if (capacity < 190) return this.$t('Project-SmallScale');
      if (capacity < 800) return this.$t('Project-MediumScale');
      if (capacity < 1600) return this.$t('Project-LargeScale');
      return this.$t('Project-MassiveScale');
    },
    projectScaleDesc() {
      const { panelsTotal: panels, projectGroup } = this.data;
      const { capacity } = projectGroup;
      const capacityFormatted = formatDisplayVal(capacity, this.capacityFormat);

      return this.$t('Project-ScaleDesc', { panels, capacity: capacityFormatted });
    },
    performanceTitle() {
      const yieldRate = this.yieldRateAvg;

      if (yieldRate < 0.06) return this.$t('Project-BadPerformance');
      if (yieldRate < 0.09) return this.$t('Project-StandardPerformance');
      return this.$t('Project-HighPerformance');
    },
    performanceDesc() {
      const { estimatedIrr } = this.data;
      const irr = formatDisplayVal(estimatedIrr, this.percentageFormat);
      const yieldRate = formatDisplayVal(this.yieldRateAvg, this.percentageFormat);

      return this.$t('Project-PerformanceDesc', { yieldRate, irr });
    },
    projectEstablishmentTitle() {
      const { ppaContractStartDate } = this.data.projectGroup;
      const diff = this.yearsDiff(ppaContractStartDate);

      if (diff < 3) return this.$t('Project-NewEstablishment');
      if (diff < 6) return this.$t('Project-RecentEstablishment');
      return this.$t('Project-MatureEstablishment');
    },
    projectEstablishmentDesc() {
      const { ppaContractStartDate } = this.data.projectGroup;
      const date = formatDate(ppaContractStartDate, 'MMM YYYY');
      return this.$t('Project-EstablishmentDesc', { date });
    },
    projectLengthTitle() {
      const { unit, value } = getProjectDuration(this.data);
      if (value < 10 || unit !== 'year') return this.$t('Project-ShortLength');
      if (value < 20) return this.$t('Project-StandardLength');
      return this.$t('Project-ExtendedLength');
    },
    projectLengthDesc() {
      const period = getProjectDurationText(this.data, (v) => this.$t(v));
      return this.$t('Project-LengthDesc', { period });
    },
    performanceFAQ() {
      const links = {
        en: 'https://lyght.zendesk.com/hc/en-us/articles/360058387013',
        zhHant: 'https://lyght.zendesk.com/hc/zh-tw/articles/360058387013-%E4%BB%80%E9%BA%BC%E6%98%AFIRR%E5%91%A2-',
      };
      return links[this.$i18n.locale];
    },
  },
};
</script>
