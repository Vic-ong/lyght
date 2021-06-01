import { Bar, mixins } from 'vue-chartjs';

export default {
  extends: Bar,
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
