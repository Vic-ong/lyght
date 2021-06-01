<template>
  <bar-chart :chartData="chartData" :options="chartOptions"></bar-chart>
</template>

<script>
import BarChart from './configs/BarChart';
import { STANDARD_COLORS } from './colors';

export default {
  components: {
    BarChart,
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
        datasets: this.datasets.map(({ label, data }, i) => ({
          data,
          label,
          backgroundColor: STANDARD_COLORS[i],
        })),
      };
    },
    chartOptions() {
      const { tooltips = {}, ...restOpts } = this.options;
      return {
        maintainAspectRatio: false,
        tooltips: {
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
