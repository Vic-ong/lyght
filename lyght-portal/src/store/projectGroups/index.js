import { baseData } from '@/store/constants';
import { mutations } from '@/store/utils';
import actions from './actions';
import getters from './getters';

const state = {
  projectGroups: baseData,
  projectGroup: baseData,
  projectGroupDetails: baseData,

  insurances: baseData,
  manufacturers: baseData,
  performance: baseData,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
