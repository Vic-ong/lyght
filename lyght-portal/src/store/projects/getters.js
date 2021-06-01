import { translateGetters as $t } from '@/utils/locale';

const getters = {
  activeUserProjectList(state, _, rootState) {
    return $t(state.activeUserProjectList, rootState);
  },
  activeProjectList(state, _, rootState) {
    return $t(state.activeProjectList, rootState);
  },
  newProjectList(state, _, rootState) {
    return $t(state.newProjectList, rootState);
  },
  projectDetails(state, _, rootState) {
    return $t(state.projectDetails, rootState);
  },
  projectDetailsPrivate(state, _, rootState) {
    return $t(state.projectDetailsPrivate, rootState);
  },
  projectOrder(state) {
    return state.projectOrder;
  },
  userAssets(state, _, rootState) {
    return $t(state.userAssets, rootState);
  },
  userAsset(state, _, rootState) {
    return $t(state.userAsset, rootState);
  },

  project(state, _, rootState) {
    return $t(state.project, rootState);
  },
};

export default getters;
