import { baseData } from '@/store/constants';
import { mutations } from '@/store/utils';
import actions from './actions';
import getters from './getters';

const state = {
  projectGroups: baseData,
  projectGroup: baseData,
  projectGroupDetails: baseData,

  insurance: baseData,
  manufacturers: baseData,
  expenseAllocations: baseData,
  performance: baseData,
  bankAccounts: baseData,
  panels: baseData,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
