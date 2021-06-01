import Vue from 'vue';
import VuePapaParse from 'vue-papa-parse';
import '@/sass/layouts.scss';
import '@/sass/transitions.scss';
import StatusInfo from '@/components/StatusInfo.vue';
import LoaderSpinner from '@/components/LoaderSpinner.vue';
import LoadingState from '@/components/Buffers/LoadingState.vue';
import ErrorState from '@/components/Buffers/ErrorState.vue';

import Button from '@/components/Buttons/Button.vue';
import ButtonIcon from '@/components/Buttons/ButtonIcon.vue';
import ActionDialog from '@/components/Dialogs/ActionDialog.vue';
import GeneralDialog from '@/components/Dialogs/GeneralDialog.vue';
import ActionPanel from '@/components/Panels/ActionPanel.vue';
import CardPanel from '@/components/Panels/CardPanel.vue';

import RecordTimestamps from '@/components/RecordTimestamps.vue';

Vue.use(VuePapaParse);

// Components
Vue.component('status-info', StatusInfo);
Vue.component('loader-spinner', LoaderSpinner);
Vue.component('loading-state', LoadingState);
Vue.component('error-state', ErrorState);

Vue.component('btn-main', Button);
Vue.component('btn-icon', ButtonIcon);
Vue.component('action-dialog', ActionDialog);
Vue.component('general-dialog', GeneralDialog);
Vue.component('action-panel', ActionPanel);
Vue.component('card-panel', CardPanel);
Vue.component('record-timestamps', RecordTimestamps);
