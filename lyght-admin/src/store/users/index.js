import { baseData } from '@/store/constants';
import { mutations } from '@/store/utils';
import actions from './actions';
import getters from './getters';

const state = {
  user: baseData,
  userData: baseData,
  userBankAccounts: baseData,
  users: baseData,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
