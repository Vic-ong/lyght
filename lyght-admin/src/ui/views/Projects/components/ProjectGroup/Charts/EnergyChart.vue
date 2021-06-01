<template>
  <line-chart :datasets="datasets" :labels="labels" :options="options"></line-chart>
</template>

<script>
import { formatDisplayVal } from '@/utils/formats';
import { formatDate } from '@/utils/date';
import LineChart from '@/components/Chart/LineChart.vue';

export default {
  components: {
    LineChart,
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
                stepSize: 200,
                reverse: false,
                callback(value) {
                  return formatDisplayVal(value, { format: '0,0', suffix: 'kWh' });
                },
              },
            },
          ],
        },
        tooltips: {
          callbacks: {
            label(tooltipItem, data) {
              const year = data.datasets[tooltipItem.datasetIndex].label || '';
              const formattedValue = formatDisplayVal(tooltipItem.yLabel, { format: '0,0.[00]', suffix: 'kWh' });

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
      // reduce to only last 2 years
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
          label: this.chartData[0][0].date.substring(0, 4),
          data: this.chartData[0].map(({ energy }) => energy),
        },
        {
          label: this.chartData[1][0].date.substring(0, 4),
          data: this.chartData[1].map(({ energy }) => energy),
        },
      ];
    },
    labels() {
      if (!this.hasData) return undefined;
      return this.chartData[1].map(({ date }) => formatDate(date, 'MMM'));
    },
  },
};
</script>
