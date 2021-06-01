<template>
  <line-chart :chartData="chartData" :options="chartOptions"></line-chart>
</template>

<script>
import LineChart from './configs/LineChart';
import { STANDARD_COLORS } from './colors';

export default {
  components: {
    LineChart,
  },
  props: {
    labels: {
      type: Array,
      default: () => [],
    },
    datasets: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: this.datasets.map((dataset, i) => ({
          borderColor: STANDARD_COLORS[i],
          pointBackgroundColor: STANDARD_COLORS[i],
          backgroundColor: STANDARD_COLORS[i],
          fill: false,
          borderWidth: 2,
          pointRadius: 2,
          ...dataset,
        })),
      };
    },
    chartOptions() {
      const { tooltips = {}, ...restOpts } = this.options;
      return {
        maintainAspectRatio: false,
        tooltips: {
          mode: 'nearest',
          intersect: false,
          titleFontFamily: 'Karla, Roboto, sans-serif',
          titleFontSize: 12,
          bodyFontFamily: 'Karla, Roboto, sans-serif',
          bodyFontSize: 12,
          ...tooltips,
        },
        ...restOpts,
      };
    },
  },
};
</script>
