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
      this.renderChart(this.chartData, this.options);
    },
  },
};
