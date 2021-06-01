import Vue from 'vue';
import axios from 'axios';
import firebase from '@/services/firebase';
import './registerServiceWorker';
import router from '@/router';
import store from '@/store';
import vuetify from '@/plugins/vuetify';
import i18n from '@/plugins/i18n';
import '@/plugins/components';
import '@babel/polyfill';
import App from './App.vue';

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

firebase.auth().onAuthStateChanged(() => {
  new Vue({
    router,
    store,
    vuetify,
    i18n,
    render: (h) => h(App),
  }).$mount('#app');
});
