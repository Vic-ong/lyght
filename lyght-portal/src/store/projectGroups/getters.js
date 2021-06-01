import { translateGetters as $t } from '@/utils/locale';

const getters = {
  projectGroups(state, _, rootState) {
    return $t(state.projectGroups, rootState);
  },
  projectGroup(state, _, rootState) {
    return $t(state.projectGroup, rootState);
  },
};

export default getters;
