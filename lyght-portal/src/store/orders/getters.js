import { translateGetters } from '@/utils/locale';

const getters = {
  userOrders(state, _, rootState) {
    return translateGetters(state.userOrders, rootState);
  },
  userProjectOrders(state, _, rootState) {
    return translateGetters(state.userProjectOrders, rootState);
  },
};

export default getters;
