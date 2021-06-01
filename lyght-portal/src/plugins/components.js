import Vue from 'vue';
import '@/sass/transitions.scss';
import Status from '@/components/Popup/Status.vue';
import Button from '@/components/Button/Button.vue';
import ButtonOutlined from '@/components/Button/ButtonOutlined.vue';

Vue.component('status-info', Status);
Vue.component('lyght-button', Button);
Vue.component('lyght-button-outlined', ButtonOutlined);
