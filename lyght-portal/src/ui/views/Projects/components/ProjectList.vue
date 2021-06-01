<template>
  <div>
    <v-row>
      <v-col v-for="item in data" v-bind:key="item._id" cols="12" md="6">
        <v-hover v-slot="{ hover }">
          <v-card @click="$emit('item-click', item)" :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }">
            <v-img
              :src="item.imagePrimary.url"
              aspect-ratio="2.7"
              gradient="to right, rgba(0,0,0,0), rgba(0,0,0,.3)"
              class="black"
            >
              <div class="d-flex flex-column justify-center text-right text-shadow pr-3" style="height: 100%">
                <div class="text-subheading white--text">{{ $t('Field-AnnualYieldRate') }}</div>
                <div class="text-emphasis white--text">
                  {{ formatDisplayVal(item.yieldRateAvg, { format: '0.00%' }) }}
                </div>
              </div>
            </v-img>
            <div class="pa-5">
              <flex-row :valueCols="5" class="mb-2">
                <template #label>
                  <b>{{ item.name }}</b>
                </template>
                <template #value>
                  <b>{{ getCityDisplay(item) }}</b>
                </template>
              </flex-row>

              <flex-row v-for="field in fields" v-bind:key="field.key" :valueCols="5">
                <template #label>
                  {{ field.text }}
                </template>
                <template #value>
                  {{ field.renderValue(item) }}
                </template>
              </flex-row>

              <flex-row :valueCols="5">
                <template #label>
                  {{ $t('Field-ProjectDuration') }}
                </template>
                <template #value>
                  {{ projectDuration(item) }}
                </template>
              </flex-row>
            </div>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import get from 'lodash/get';
import { formatDisplayVal } from '@/utils/formats';
import { FlexRow } from '@/components/Grid';
import { getProjectDurationText } from '@/ui/shared/Project/utils';

export default {
  components: {
    FlexRow,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    isXs() {
      return this.$vuetify.breakpoint.xs;
    },
    isMdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
    fields() {
      return [
        {
          key: 'ppaContractStartDate',
          text: this.$t('Field-FarmEstablishmentDate'),
          renderValue: (v) => get(v, 'projectGroup.ppaContractStartDate'),
        },
        {
          key: 'estimatedIrr',
          text: this.$t('Field-EstimatedIrr'),
          renderValue: (v) => formatDisplayVal(v.estimatedIrr, { format: '0.00%' }),
        },
        {
          key: 'capacity',
          text: this.$t('Field-FarmCapacity'),
          renderValue: (v) => formatDisplayVal(get(v, 'projectGroup.capacity'), { suffix: 'kW' }),
        },
        {
          key: 'panelsTotal',
          text: this.$t('Field-TotalPanels'),
          renderValue: (v) => v.panelsTotal,
        },
      ];
    },
  },
  methods: {
    formatDisplayVal,

    getCityDisplay(data) {
      return get(data, 'projectGroup.address.city');
    },
    projectDuration(data) {
      return getProjectDurationText(data, (v) => this.$t(v));
    },
  },
};
</script>

<style lang="scss" scoped>
.list-container {
  display: flex;
  flex-wrap: wrap;
}
.v-card {
  transition: all 0.2s ease-out;
  cursor: pointer;
}
.v-card:not(.on-hover) {
  transform: scale(1);
}
.v-card.on-hover {
  transform: scale(1.01);
}
.text-shadow {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}
</style>
