import { getStatus } from '@/store/utils';

const getters = {
  projectGroups(state) {
    return state.projectGroups;
  },
  projectGroupDetailed(state) {
    const {
      projectGroup,
      projectGroupDetails,
      insurance,
      manufacturers,
      expenseAllocations,
      performance,
      bankAccounts,
    } = state;
    const { valid, error, loading } = getStatus([
      projectGroup,
      projectGroupDetails,
      insurance,
      manufacturers,
      expenseAllocations,
      performance,
      bankAccounts,
    ]);
    return {
      error,
      loading,
      data: valid
        ? {
            ...projectGroup.data,
            ...projectGroupDetails.data,
            insurance: insurance.data,
            manufacturers: manufacturers.data,
            expenseAllocations: expenseAllocations.data,
            performance: performance.data,
            bankAccount: bankAccounts.data.reduce((acc, curr) => {
              const data = acc || {};
              data[curr._id] = curr;
              return data;
            }, undefined),
          }
        : undefined,
    };
  },
  projectGroup(state) {
    const { projectGroup, projectGroupDetails } = state;
    const { valid, error, loading } = getStatus([projectGroup, projectGroupDetails]);
    return {
      error,
      loading,
      data: valid
        ? {
            ...projectGroup.data,
            ...projectGroupDetails.data,
          }
        : undefined,
    };
  },
  projectGroupExpenseInfo(state) {
    const { projectGroup, expenseAllocations, bankAccounts } = state;
    const { valid, error, loading } = getStatus([projectGroup, expenseAllocations, bankAccounts]);
    return {
      error,
      loading,
      data: valid
        ? {
            ...projectGroup.data,
            expenseAllocations: expenseAllocations.data,
            bankAccount: bankAccounts.data.reduce((acc, curr) => {
              const data = acc || {};
              data[curr._id] = curr;
              return data;
            }, undefined),
          }
        : undefined,
    };
  },
  projectGroupPaymentInfo(state) {
    const { bankAccounts } = state;
    const { data, error, loading } = bankAccounts;

    return {
      error,
      loading,
      data: data
        ? data.reduce((acc, curr) => {
            acc[curr._id] = curr;
            return acc;
          }, {})
        : undefined,
    };
  },
};

export default getters;
