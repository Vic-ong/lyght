<template>
  <line-chart-gradient :chartData="chartData" :options="chartOptions" :styles="styles"></line-chart-gradient>
</template>

<script>
import LineChartGradient from './configs/LineChartGradient';
import { COLORS, FONT_STYLE } from './configs/styles';

export default {
  components: {
    LineChartGradient,
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
          label,
          data,
          borderColor: COLORS[i].hex,
          pointBorderColor: COLORS[i].hex,
          pointBackgroundColor: 'white',
          borderWidth: 2,
          gradient: COLORS[i],
          ...restOpts,
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
          ...FONT_STYLE,
          ...tooltips,
        },
        ...restOpts,
      };
    },
  },
};
</script>
