import Vue from 'vue';
import VueRouter from 'vue-router';

import Redirect404 from '@/ui/views/Redirect404.vue';
import LoginView from '@/ui/views/Auth/LoginView.vue';
import OnboardingView from '@/ui/views/Onboarding/OnboardingView.vue';
import ServiceTerms from '@/ui/views/Legal/ServiceTerms.vue';
import PrivacyPolicy from '@/ui/views/Legal/PrivacyPolicy.vue';
import AccountView from '@/ui/views/Account/AccountView.vue';
import Projects from '@/ui/views/Projects/Projects.vue';
import ActiveProjectView from '@/ui/views/Projects/ActiveProjectView.vue';
import NewProjectView from '@/ui/views/Projects/NewProjectView.vue';
import UserAssetView from '@/ui/views/UserAssets/UserAssetView.vue';
import UserAssets from '@/ui/views/UserAssets/UserAssets.vue';
import CheckoutView from '@/ui/views/Checkout/CheckoutView.vue';
import OrdersView from '@/ui/views/Orders/OrdersView.vue';
import OrderView from '@/ui/views/Orders/OrderView.vue';

import routeAccessHandler from './routeAccess';

Vue.use(VueRouter);

const routes = [
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/ui/views/Auth/SignupView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: OnboardingView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/legal/service-terms',
    name: 'legal/service-terms',
    component: ServiceTerms,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/legal/privacy-policy',
    name: 'legal/privacy-policy',
    component: PrivacyPolicy,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView,
    meta: {
      requiresAuth: true,
      requiresVerifiedAcc: true,
    },
  },
  {
    path: '/projects',
    name: 'projects',
    component: Projects,
    meta: {
      requiresAuth: true,
      requiresVerifiedAcc: true,
    },
  },
  {
    path: '/projects/active/:id',
    name: 'projects/active/:id',
    component: ActiveProjectView,
    meta: {
      requiresAuth: true,
      requiresVerifiedAcc: true,
    },
  },
  {
    path: '/projects/new/:id',
    name: 'projects/new/:id',
    component: NewProjectView,
    meta: {
      requiresAuth: true,
      requiresVerifiedAcc: true,
    },
  },

  {
    path: '/my-assets',
    name: 'my-assets',
    component: UserAssets,
    meta: {
      requiresAuth: true,
      requiresVerifiedAcc: true,
      requiresVerifiedId: true,
    },
  },
  {
    path: '/my-assets/:id',
    name: 'my-assets/:id',
    component: UserAssetView,
    meta: {
      requiresAuth: true,
      requiresVerifiedAcc: true,
      requiresVerifiedId: true,
    },
  },
  {
    path: '/orders/checkout',
    name: 'orders/checkout',
    component: CheckoutView,
    meta: {
      requiresAuth: true,
      requiresVerifiedAcc: true,
      requiresVerifiedId: true,
    },
  },
  {
    path: '/my-orders',
    name: 'my-orders',
    component: OrdersView,
    meta: {
      requiresAuth: true,
      requiresVerifiedAcc: true,
    },
  },
  {
    path: '/orders/:id',
    name: 'orders/:id',
    component: OrderView,
    meta: {
      requiresAuth: true,
      requiresVerifiedAcc: true,
    },
  },
  {
    path: '/',
    redirect: { name: 'login' },
  },
  {
    path: '*',
    name: 'others',
    component: Redirect404,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(routeAccessHandler);

export default router;
