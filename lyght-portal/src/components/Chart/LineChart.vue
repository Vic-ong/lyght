<template>
  <line-chart ref="lineChart" :chartData="chartData" :options="chartOptions" :styles="styles"></line-chart>
</template>

<script>
import LineChart from './configs/LineChart';
import { COLORS, FONT_STYLE } from './configs/styles';

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
    styles: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: this.datasets.map(({ label, data, ...restOpts }, i) => {
          const { r, g, b, hex: hexColor } = COLORS[i];
          const gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450);
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
          gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.5)`);
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          return {
            label,
            data,
            borderColor: hexColor,
            pointBorderColor: hexColor,
            backgroundColor: gradient,
            pointBackgroundColor: 'white',
            borderWidth: 2,
            ...restOpts,
          };
        }),
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
