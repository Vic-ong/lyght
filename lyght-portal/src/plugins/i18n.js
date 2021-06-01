import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messages from '@/locales';
import getInitLocale from '@/locales/utils';

Vue.use(VueI18n);

export default new VueI18n({
  locale: getInitLocale(),
  messages,
});
