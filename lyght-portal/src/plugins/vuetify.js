import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import locales from '@/locales/vuetifyLocales';
import getInitLocale from '@/locales/utils';

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales,
    current: getInitLocale(),
  },
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#08ae8b',
        secondary: '#e7ad3c',
        accent: '#e88831',
        error: '#e53c26',
        info: '#2196F3',
        success: '#08ae8b',
        warning: '#FFC107',
        background: '#f5f5f5',
        foreground: 'ffeee1',
      },
    },
  },
});
