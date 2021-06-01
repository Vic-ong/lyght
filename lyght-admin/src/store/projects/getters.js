import { getStatus } from '@/store/utils';

const getters = {
  projects(state) {
    return state.projects;
  },
  project(state) {
    const { project, projectYieldRates, panels } = state;
    const { valid, error, loading } = getStatus([project, projectYieldRates, panels]);
    return {
      error,
      loading,
      data: valid
        ? {
            ...project.data,
            yieldRates: projectYieldRates.data,
            panels: panels.data,
          }
        : undefined,
    };
  },
  projectInfo(state) {
    return state.projectInfo;
  },
  projectExpenses(state) {
    return state.projectExpenses;
  },
  projectBankAccounts(state) {
    return state.projectBankAccounts;
  },
  panels(state) {
    return state.panels;
  },
};

export default getters;
