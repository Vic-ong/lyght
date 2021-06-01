import Vue from 'vue';
import Vuex from 'vuex';
import users from './users';
import entities from './entities';
import projects from './projects';
import projectGroups from './projectGroups';
import orders from './orders';
import transactions from './transactions';
import expenses from './expenses';
import paymentProvisions from './paymentProvisions';
import userAssets from './userAssets';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    users,
    projects,
    projectGroups,
    entities,
    orders,
    transactions,
    expenses,
    paymentProvisions,
    userAssets,
  },
  getters: {
    userMap(state) {
      return state.userMap;
    },
    projectMap(state) {
      return state.projectMap;
    },
  },
  state: {
    userMap: new Map(),
    userAssetMap: new Map(),
    projectMap: new Map(),
  },
  mutations: {
    SET_MAP(state, { stateKey, payload }) {
      const stateData = state[stateKey];
      if (!stateData) {
        throw new Error(`Unable to find ${stateKey} state.`);
      }
      if (stateData instanceof Map === false) {
        throw new Error(`${stateKey} data is not an instance of Map.`);
      }
      if (!stateData.has(payload._id)) {
        stateData.set(payload._id, payload.data);
      }
    },
  },
  actions: {
    setMap: ({ commit }, { stateKey, payload } = {}) => {
      if (!stateKey) throw new Error('Missing "stateKey" value');
      if (!payload) throw new Error('Missing "payload" value');
      commit('SET_MAP', { stateKey, payload });
    },
  },
});
