import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from '@/services/firebase';
import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((route) => route.meta.requiresAuth);
  const isAuthenticated = firebase.auth().currentUser;

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (!requiresAuth && isAuthenticated) {
    // TODO: change this after overview page is up
    next('/users');
  } else {
    next();
  }
});

const DEFAULT_TITLE = 'Admin';

router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title ? `Admin | ${to.meta.title}` : DEFAULT_TITLE;
  });
});

export default router;
