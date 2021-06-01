import { fetchCurrentWeather } from '@/services/functions/weather';
import { snakeToCamel } from '@/utils/formats';
import { mutations } from '@/store/utils';
import { baseData } from '@/store/constants';

export default {
  namespaced: true,
  state: {
    currentWeather: baseData,
  },
  getters: {
    currentWeather(state) {
      return state.currentWeather;
    },
  },
  actions: {
    getCurrentWeather: async (store, param) => {
      const state = { state: 'currentWeather' };
      try {
        store.commit('SET_LOADING', state);
        const res = await fetchCurrentWeather(param);
        store.commit('SET_DATA_REPLACE', { ...state, payload: snakeToCamel(res.data.result) });
      } catch (err) {
        store.commit('SET_ERROR', state);
        console.error('Error fetching data: ', err);
      }
    },
  },
  mutations,
};
