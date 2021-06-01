<template>
  <div class="list-container" :style="containerStyle">
    <v-row>
      <v-col v-for="{ _id, project } in data" v-bind:key="project._id" cols="12" md="6">
        <v-hover v-slot="{ hover }">
          <v-card
            @click="$router.push({ name: 'my-assets/:id', params: { id: _id } })"
            :elevation="hover ? 12 : 2"
            :class="{ 'on-hover': hover }"
            :max-width="isXs ? 'calc(100vw - 24px)' : maxWidth"
          >
            <v-img
              :height="imgHeight"
              :src="project.imagePrimary.url"
              gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.3)"
              class="black"
            >
              <div class="text-in-img">
                <div class="text-subheading white--text">{{ $t('Field-AnnualYieldRate') }}</div>
                <div class="text-emphasis white--text">
                  {{ formatDisplayVal(project.yieldRateAvg, { format: '0.00%' }) }}
                </div>
              </div>
            </v-img>

            <div class="pa-5">
              <div class="flex-container text-subheading black--text mb-4">
                <div>{{ project.name }}</div>
                <div>{{ getCityDisplay(project) }}</div>
              </div>
              <div v-for="item in keys" v-bind:key="item.key" class="flex-container text-body black--text mb-1">
                <div>{{ $t(item.textKey) }}</div>
                <div>{{ renderValue(project, item) }}</div>
              </div>
              <div class="flex-container text-body black--text mb-1">
                <div>{{ $t('Field-ProjectDuration') }}</div>
                <div>{{ projectDuration(project) }}</div>
              </div>
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
import { getProjectDurationText } from '@/ui/shared/Project/utils';

export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    keys: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      imgHeight: 120,
    };
  },
  computed: {
    isXs() {
      return this.$vuetify.breakpoint.xs;
    },
    isMdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
    containerStyle() {
      return {
        minWidth: `${this.isXs ? this.maxWidth : this.maxWidth * 2}px`,
      };
    },
    maxWidth() {
      return this.isMdAndUp ? 400 : 320;
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
    renderValue(data, { key, format, prefix, suffix }) {
      return formatDisplayVal(get(data, key), { format, prefix, suffix });
    },
  },
};
</script>

<style lang="scss" scoped>
.list-container {
  display: flex;
  flex-wrap: wrap;
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
}
.text-in-img {
  position: absolute;
  right: 12px;
  bottom: 12px;
  text-align: right;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}
.flex-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
