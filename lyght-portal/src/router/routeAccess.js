// import get from 'lodash/get';
import * as firebase from 'firebase/app';
import 'firebase/auth';
// import store from '@/store';

const routeAccess = async (to, from, next) => {
  const isAuthenticated = !!firebase.auth().currentUser;

  // const userState = get(store, 'state.users.user');
  // const accVerified = get(userState, 'data.setup.accountVerified') === true;
  // const idVerified = get(userState, 'data.setup.identityVerification') === 'approved';

  const requiresAuth = to.matched.some((route) => route.meta.requiresAuth);
  // const requiresVerifiedAcc = to.matched.some((route) => route.meta.requiresVerifiedAcc);
  // const requiresVerifiedId = to.matched.some((route) => route.meta.requiresVerifiedId);

  // const securedRouteLevel1 = requiresAuth && !requiresVerifiedAcc && !requiresVerifiedId;
  // const securedRouteLevel2 = requiresAuth && requiresVerifiedAcc && !requiresVerifiedId;
  // const securedRouteLevel3 = requiresAuth && requiresVerifiedAcc && requiresVerifiedId;

  if (!requiresAuth && isAuthenticated) {
    // Redirect to onboarding from login/signup
    next('onboarding');
  } else if (
    // (securedRouteLevel1 && !isAuthenticated) ||
    // (securedRouteLevel2 && (!isAuthenticated || !accVerified)) ||
    // (securedRouteLevel3 && (!isAuthenticated || !accVerified || !idVerified))
    requiresAuth &&
    !isAuthenticated
  ) {
    // Does not have required clearance
    next('/login');
  } else {
    // Has the required clearance
    next();
  }
};

export default routeAccess;
