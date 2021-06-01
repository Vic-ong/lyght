import { baseData } from '@/store/constants';
import { mutations } from '@/store/utils';
import actions from './actions';
import getters from './getters';

const state = {
  activeUserProjectList: baseData,
  activeProjectList: baseData,
  newProjectList: baseData,

  project: baseData,
  projectYieldRates: baseData,

  projectDetails: baseData,
  projectDetailsPrivate: baseData,

  projectOrder: baseData,

  userAssets: baseData,
  userAsset: baseData,
  userProject: baseData,
  userProjectDetails: baseData,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
