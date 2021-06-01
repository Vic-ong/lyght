<template>
  <v-card>
    <v-carousel :height="imgHeight" show-arrows-on-hover hide-delimiters>
      <v-carousel-item v-for="item in data.displayImgs" v-bind:key="item.url" :src="item.url"></v-carousel-item>
    </v-carousel>
    <div class="pa-5">
      <flex-row class="text-subheading mb-4">
        <template #label>{{ data.name }}</template>
        <template #value>{{ getCityDisplay(data.address) }}</template>
      </flex-row>
      <flex-row v-for="field in fields" v-bind:key="field.key">
        <template #label>{{ $t(field.textKey) }}</template>
        <template #value>{{ renderValue(data, field) }}</template>
      </flex-row>
    </div>
  </v-card>
</template>

<script>
import get from 'lodash/get';
import { formatDisplayVal } from '@/utils/formats';
import { FlexRow } from '@/components/Grid';
import { getProjectDurationText } from './utils';

export default {
  name: 'ProjectSummary',
  components: {
    FlexRow,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      imgHeight: 272,
      fields: [
        {
          key: 'ppaContractStartDate',
          textKey: 'Field-FarmEstablishmentDate',
        },
        {
          key: 'estimatedIrr',
          textKey: 'Field-EstimatedIrr',
          config: {
            format: '0.00%',
          },
        },
        {
          key: 'capacity',
          textKey: 'Field-FarmCapacity',
          config: {
            suffix: 'kW',
          },
        },
        {
          key: 'panelsTotal',
          textKey: 'Field-TotalPanels',
        },
        {
          key: 'projectDuration',
          textKey: 'Field-ProjectDuration',
          getValue: this.projectDuration,
        },
      ],
    };
  },
  methods: {
    getCityDisplay(address) {
      return address.city;
    },
    renderValue(data, field) {
      const { key, getValue, config = {} } = field;
      const value = get(data, key);

      return getValue ? getValue(value) : formatDisplayVal(value, config);
    },
    projectDuration() {
      return getProjectDurationText(this.data, (v) => this.$t(v));
    },
  },
};
</script>
