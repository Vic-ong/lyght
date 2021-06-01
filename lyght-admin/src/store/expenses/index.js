import { baseData } from '@/store/constants';
import { mutations } from '@/store/utils';
import actions from './actions';
import getters from './getters';

const state = {
  expense: baseData,
  expenses: baseData,
  closedExpenses: baseData,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
