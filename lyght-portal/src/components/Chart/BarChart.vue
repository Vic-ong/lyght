<template>
  <bar-chart :chartData="chartData" :options="chartOptions" :styles="styles"></bar-chart>
</template>

<script>
import BarChart from './configs/BarChart';
import { COLORS, FONT_STYLE } from './configs/styles';

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
    styles: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: this.datasets.map(({ label, data, ...restOpts }, i) => ({
          data,
          label,
          backgroundColor: COLORS[i].hex,
          ...restOpts,
        })),
      };
    },
    chartOptions() {
      const { tooltips = {}, ...restOpts } = this.options;
      return {
        maintainAspectRatio: false,
        tooltips: {
          ...FONT_STYLE,
          ...tooltips,
        },
        ...restOpts,
      };
    },
  },
};
</script>
