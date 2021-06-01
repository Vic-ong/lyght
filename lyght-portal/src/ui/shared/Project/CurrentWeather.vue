<template>
  <v-card>
    <div class="weather-container pa-5">
      <div v-if="currentWeather.loading" class="page-loader-weather">
        <v-progress-circular :size="60" :width="4" color="primary" indeterminate></v-progress-circular>
      </div>
      <div v-else>
        <div class="text-subheading white--text">{{ $t('Project-CurrentWeather-Title') }}</div>
        <DividerLine class="mb-3 mt-3"></DividerLine>
        <v-row no-gutters>
          <v-col cols="7">
            <div class="temperature-title text-body white--text">
              {{ temperature }}
              <span class="temperature-subtitle white--text">°C</span>
            </div>
            <div class="text-body white--text">{{ cityName }}</div>
          </v-col>
          <v-col cols="5">
            <div class="weather-icon">
              <component class="text-center" :is="weatherIcon" :size="70"></component>
              <div class="text-center text-body white--text">{{ description }}</div>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-card>
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapGetters } from 'vuex';
import {
  SunnyIcon,
  SunnyRainyIcon,
  SunnyCoudyIcon,
  CloudyIcon,
  CloudyRainyIcon,
  CloudyRainyLightningIcon,
  NightIcon,
  NightRainyIcon,
  FreezingIcon,
} from '@/components/Icons/Weather';
import { DividerLine } from '@/components/Divider';

export default {
  name: 'CurrentWeather',
  components: {
    DividerLine,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.getCurrentWeather({ city: this.cityName });
  },
  computed: {
    ...mapGetters('weather', ['currentWeather']),

    temperature() {
      return get(this.currentWeather, 'data.temperature.metric.value');
    },
    description() {
      return get(this.currentWeather, 'data.weathertext');
    },
    cityName() {
      return get(this.data, 'projectGroup.address.city');
    },
    weatherIcon() {
      const index = get(this.currentWeather, 'data.weathericon');
      switch (index) {
        case 1:
        case 2:
        case 3:
          return SunnyIcon;
        case 4:
        case 5:
        case 6:
          return SunnyCoudyIcon;
        case 7:
        case 8:
        case 11:
          return CloudyIcon;
        case 13:
        case 14:
        case 17:
        case 32:
          return SunnyRainyIcon;
        case 12:
        case 18:
        case 29:
          return CloudyRainyIcon;
        case 15:
        case 16:
          return CloudyRainyLightningIcon;
        case 33:
        case 34:
        case 35:
        case 36:
        case 37:
        case 38:
          return NightIcon;
        case 39:
        case 40:
        case 41:
        case 42:
          return NightRainyIcon;
        case 20:
        case 21:
        case 23:
        case 24:
        case 25:
        case 26:
        case 31:
        case 43:
        case 44:
          return FreezingIcon;
        default:
          return SunnyIcon;
      }
    },
  },
  methods: {
    ...mapActions('weather', ['getCurrentWeather']),
  },
};
</script>

<style lang="scss" scoped>
.weather-container {
  background: rgb(7, 116, 94);
  background: linear-gradient(180deg, rgba(7, 116, 94, 1) 0%, rgba(8, 174, 139, 1) 100%);
}
.temperature-title {
  font-size: 48px !important;
}
.temperature-subtitle {
  font-size: 24px !important;
}
.page-loader-weather {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
