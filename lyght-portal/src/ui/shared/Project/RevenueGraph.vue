<template>
  <div class="chart-container">
    <bar-chart :datasets="datasets" :labels="labels" :options="options" :styles="graphStyle"></bar-chart>
  </div>
</template>

<script>
import { formatDisplayVal } from '@/utils/formats';
import { formatDate } from '@/utils/date';
import BarChart from '@/components/Chart/BarChart.vue';

export default {
  name: 'RevenueGraph',
  components: {
    BarChart,
  },
  props: {
    data: { type: Array, required: true },
  },
  data() {
    return {
      options: {
        legend: {
          display: true,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                stepSize: 30000,
                reverse: false,
                callback(value) {
                  return formatDisplayVal(value, { format: '0,0', suffix: 'NT$' });
                },
              },
            },
          ],
        },
        tooltips: {
          xPadding: 10,
          yPadding: 10,
          cornerRadius: 10,
          callbacks: {
            label(tooltipItem, data) {
              const year = data.datasets[tooltipItem.datasetIndex].label || '';
              const formattedValue = formatDisplayVal(tooltipItem.yLabel, { format: '0,0.[00]', suffix: 'NT$' });
              return ` ${year}  ${formattedValue}`;
            },
          },
        },
      },
    };
  },
  computed: {
    hasData() {
      return this.data && this.data.length > 0;
    },
    chartData() {
      // split last 2 years data
      const datasets = [[], []];
      if (this.hasData) {
        const currDate = new Date();
        const prevYear1 = currDate.getFullYear() - 1;
        const prevYear2 = prevYear1 - 1;
        const reducer = (acc, curr) => {
          if (curr.date.includes(prevYear1)) {
            acc[0].push(curr);
          } else if (curr.date.includes(prevYear2)) {
            acc[1].push(curr);
          }
          return acc;
        };
        return this.data.reduce(reducer, datasets);
      }
      return datasets;
    },
    datasets() {
      if (!this.hasData) return undefined;
      return [
        {
          label: this.chartData[1][0].date.substring(0, 4),
          data: this.chartData[1].map(({ revenue }) => revenue),
        },
        {
          label: this.chartData[0][0].date.substring(0, 4),
          data: this.chartData[0].map(({ revenue }) => revenue),
        },
      ];
    },
    labels() {
      if (!this.hasData) return undefined;
      if (this.$i18n.locale === 'zhHant') {
        return this.chartData[1].map(({ date }) => `${formatDate(date, 'M')}${this.$t('Datetime-Months-Display')}`);
      }
      return this.chartData[1].map(({ date }) => formatDate(date, 'MMM'));
    },
    graphStyle() {
      return {
        height: '300px',
        width: '100%',
        position: 'absolute',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-container {
  height: 300px;
  position: relative;
}
</style>
