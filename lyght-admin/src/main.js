import Vue from 'vue';
import axios from 'axios';

import firebase from '@/services/firebase';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import './plugins/configs';
import '@babel/polyfill';

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

firebase.auth().onAuthStateChanged(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount('#app');
});
