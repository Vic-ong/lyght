import { getStatus } from '@/store/utils';

const getters = {
  paymentProvision(state) {
    const { paymentProvision, paymentDistributions } = state;
    const { valid, error, loading } = getStatus([paymentProvision, paymentDistributions]);
    return {
      error,
      loading,
      data: valid
        ? {
            ...paymentProvision.data,
            distributions: paymentDistributions.data,
          }
        : undefined,
    };
  },
  paymentProvisions(state) {
    return state.paymentProvisions;
  },
};

export default getters;
