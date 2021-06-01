import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import colors from 'vuetify/lib/util/colors';
import customIcons from './customIcons';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
    values: {
      ...customIcons,
    },
  },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#6495ED', // pastel blue
        secondary: '#4A148C', // dark purple
        accent: '#FFA07A', // light salmon
        background: colors.grey.lighten5, // light
        // grey shades
        'bg-dark': colors.grey.darken4,
        'bg-grey': colors.blueGrey.darken2,
        'bg-light': colors.grey.lighten2,
        // status colors
        info: colors.blue.base,
        success: colors.green.base,
        warning: colors.red.base,
      },
    },
  },
});
