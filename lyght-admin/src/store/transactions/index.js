import { baseData } from '@/store/constants';
import { mutations } from '@/store/utils';
import actions from './actions';
import getters from './getters';

const state = {
  transaction: baseData,
  transactions: baseData,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
