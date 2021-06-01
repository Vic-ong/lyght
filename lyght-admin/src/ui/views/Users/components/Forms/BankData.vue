<template>
  <div>
    <div v-if="input.length === 0">
      <v-card class="d-flex justify-center align-center transparent" height="200" flat>
        <v-card class="bg-light text-center pa-5" flat>
          <div class="d-flex align-center justify-center">
            <v-icon color="info" size="20">$fi-sr-info</v-icon>
            <div class="text-subheading ml-2">No records found!</div>
          </div>
          <div class="text-body mt-4">This user has not added his/her bank information.</div>
        </v-card>
      </v-card>
    </div>
    <div v-else>
      <div v-for="item in input" v-bind:key="item.accountNumber">
        <div class="text-subheading primary--text ml-2 mt-2 mb-5">Personal</div>
        <dynamic-input :input="item" :fields="fields" :disabled="loading"></dynamic-input>
        <div class="text-subheading primary--text ml-2 mt-2 mb-5">Attachments</div>
        <v-row>
          <v-col cols="12" md="6">
            <image-display title="Bank cover photo" :src="getBankImage(item)"></image-display>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
import v from '@/utils/validations';
import twBankList from '@/constants/banks/TW.json';
import DynamicInput from '@/components/FormInput/DynamicInputLegacy.vue';
import ImageDisplay from '@/components/FormInput/ImageDisplay.vue';

export default {
  name: 'BankData',
  components: {
    DynamicInput,
    ImageDisplay,
  },
  props: {
    input: { type: Array, required: true },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      fields: [
        {
          key: 'bankName',
          component: 'v-select',
          cols: '8',
          label: 'Bank Name',
          items: twBankList.map(({ name }) => name),
          rules: [v.required()],
          readonly: true,
        },
        {
          key: 'bankCode',
          component: 'v-select',
          cols: '4',
          label: 'Bank Code',
          items: twBankList.map(({ code }) => code),
          rules: [v.required(), v.number()],
          readonly: true,
        },
        {
          component: 'v-text-field',
          cols: '12',
          key: 'bankBranchName',
          label: 'Bank Branch Name',
          rules: [v.required()],
          readonly: true,
        },
        {
          component: 'v-text-field',
          cols: '12',
          key: 'accountNumber',
          label: 'Account Number',
          rules: [v.required(), v.number()],
          readonly: true,
        },
        {
          component: 'v-text-field',
          cols: '12',
          key: 'accountName',
          label: 'Account Name',
          rules: [v.required()],
          readonly: true,
        },
      ],
    };
  },
  methods: {
    getBankImage(data) {
      return get(data, 'bankBookPhoto.url');
    },
  },
};
</script>
