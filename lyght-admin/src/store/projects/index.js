import { baseData } from '@/store/constants';
import { mutations } from '@/store/utils';
import actions from './actions';
import getters from './getters';

const state = {
  projects: baseData,
  project: baseData,
  projectYieldRates: baseData,
  projectInfo: baseData,
  projectExpenses: baseData,
  projectBankAccounts: baseData,

  panels: baseData,
  panelsByOrder: baseData,
  availablePanels: baseData,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
