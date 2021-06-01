<template>
  <v-card class="pa-5">
    <v-radio-group v-model="graphDisplay" row>
      <v-radio
        v-for="item in graphChoices"
        :key="item.labelKey"
        :label="$t(item.labelKey)"
        :value="item.value"
      ></v-radio>
    </v-radio-group>
    <transition name="transition-fade" mode="out-in">
      <component v-bind:is="graphDisplay" :data="data.projectGroup.performance"></component>
    </transition>
  </v-card>
</template>

<script>
import EnergyGraph from './EnergyGraph.vue';
import RevenueGraph from './RevenueGraph.vue';

export default {
  name: 'HistorialDataGraphs',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      graphDisplay: EnergyGraph,
      graphChoices: [
        {
          labelKey: 'Project-Historical-EnergyGraphTitle',
          value: EnergyGraph,
        },
        {
          labelKey: 'Project-Historical-RevenueGraphTitle',
          value: RevenueGraph,
        },
      ],
    };
  },
};
</script>
