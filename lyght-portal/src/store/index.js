import Vue from 'vue';
import Vuex from 'vuex';
import { baseData } from '@/store/constants';
import { mutations } from '@/store/utils';
import users from './users';
import projectGroups from './projectGroups';
import projects from './projects';
import orders from './orders';
import weather from './weather';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    users,
    projectGroups,
    projects,
    orders,
    weather,
  },
  state: {
    locale: baseData,
  },
  mutations,
  actions: {
    setLocale(store, param) {
      store.commit('SET_DATA_REPLACE', { state: 'locale', payload: param });
    },
  },
});
