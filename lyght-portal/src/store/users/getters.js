const getters = {
  user(state) {
    return state.user;
  },
  userId(state) {
    return {
      loading: state.user.loading,
      error: state.user.error,
      ...(state.user.data && { data: state.user.data._id }),
    };
  },
  userBankAccounts(state) {
    return state.userBankAccounts;
  },
};

export default getters;
