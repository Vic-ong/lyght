import { Line, mixins } from 'vue-chartjs';

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    this.render();
  },
  methods: {
    render() {
      const { labels, datasets } = this.chartData;

      const chartData = {
        labels,
        datasets: datasets.map(({ gradient, ...data }) => {
          const { r, g, b } = gradient;
          const gradientColor = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450);
          gradientColor.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
          gradientColor.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.5)`);
          gradientColor.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          return {
            ...data,
            backgroundColor: gradientColor,
          };
        }),
      };
      this.renderChart(chartData, this.options);
    },
  },
};
