import { baseData } from '@/store/constants';
import { mutations } from '@/store/utils';
import actions from './actions';
import getters from './getters';

const state = {
  order: baseData,
  orders: baseData,
  orderProjectDetails: baseData,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
