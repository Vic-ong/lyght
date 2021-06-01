<template>
  <div>
    <div class="text-subheading primary--text ml-2 mt-3 mb-5">General</div>
    <dynamic-input :input="input" :fields="generalFields" :disabled="loading"></dynamic-input>

    <div class="text-subheading primary--text ml-2 mt-3 mb-5">Address</div>
    <dynamic-input :input="input" :fields="addressFields" :disabled="loading"></dynamic-input>

    <div class="text-subheading primary--text ml-2 mt-3 mb-5">PPA Contract</div>
    <dynamic-input :input="input" :fields="contractFields" :disabled="loading"></dynamic-input>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getTranslationList } from '@/utils';
import v from '@/utils/validations';
import countryList from '@/constants/countryList.json';
import electricityPurchaserList from '@/constants/projects/electricityPurchaserList.json';
import solarPanelClassificationList from '@/constants/projects/solarPanelClassificationList.json';
import solarPanelGradeList from '@/constants/projects/solarPanelGradeList.json';
import currencyList from '@/constants/finance/currencyList.json';
import DynamicInput from '@/components/FormInput/DynamicInput.vue';

export default {
  name: 'NewProjectForm',
  components: {
    DynamicInput,
  },
  props: {
    input: { type: Object, required: true },
    loading: { type: Boolean, default: false },
  },
  computed: {
    ...mapGetters('entities', ['entities']),

    generalFields() {
      return [
        {
          key: 'publicIdentifier',
          component: 'v-text-field',
          cols: '4',
          props: {
            label: 'Public Identifier',
            placeholder: 'ex: SS0001',
            rules: [v.required()],
          },
        },
        {
          key: 'entityId',
          component: 'v-autocomplete',
          cols: '8',
          props: {
            label: 'Entity',
            items: this.entityList,
            rules: [v.required()],
          },
        },
        {
          key: 'nameTrans.en',
          component: 'v-text-field',
          cols: '12',
          props: {
            label: 'Project Group Name (en)',
            rules: [v.required(), v.maxLength({ len: 30 })],
          },
        },
        {
          key: 'nameTrans.zhHant',
          component: 'v-text-field',
          cols: '12',
          props: {
            label: 'Project Group Name (zh-hant)',
            rules: [v.required(), v.maxLength({ len: 20 })],
          },
        },
        {
          key: 'panelsTotal',
          component: 'v-text-field',
          cols: '6',
          props: {
            type: 'number',
            label: 'Total Panels',
            rules: [v.required(), v.number()],
          },
        },
        {
          component: 'v-select',
          cols: '6',
          key: 'classification',
          props: {
            label: 'Classfication',
            items: getTranslationList(solarPanelClassificationList),
            rules: [v.required()],
          },
        },
        {
          component: 'v-select',
          cols: '6',
          key: 'grade',
          props: {
            label: 'Grade',
            items: getTranslationList(solarPanelGradeList),
            rules: [v.required()],
          },
        },
        {
          key: 'capacity',
          component: 'v-text-field',
          cols: '6',
          props: {
            type: 'number',
            label: 'Capacity',
            suffix: 'kW',
            rules: [v.required(), v.number()],
          },
        },
      ];
    },

    addressFields() {
      return [
        {
          key: 'address.address1',
          component: 'v-text-field',
          cols: '12',
          props: {
            label: 'Address 1',
            placeholder: 'Road/Street/Lane/Alley/Village/Section/Boulevard',
            rules: [v.required()],
          },
        },
        {
          key: 'address.address2',
          component: 'v-text-field',
          cols: '12',
          props: {
            label: 'Address 2',
            placeholder: 'Room/Floor/Number',
          },
        },
        {
          key: 'address.district',
          component: 'v-text-field',
          cols: '5',
          props: {
            label: 'District/Township',
          },
        },
        {
          key: 'address.city',
          component: 'v-text-field',
          cols: '5',
          props: {
            label: 'City/County',
            rules: [v.required()],
          },
        },
        {
          key: 'address.country',
          component: 'v-select',
          cols: '5',
          props: {
            label: 'Country',
            items: countryList.map((item) => item.name),
            rules: [v.required()],
          },
        },
        {
          key: 'address.postalCode',
          component: 'v-text-field',
          cols: '3',
          props: {
            label: 'Postal Code',
            rules: [v.required(), v.number()],
          },
        },
      ];
    },

    contractFields() {
      return [
        {
          key: 'electricityPurchaser',
          component: 'v-select',
          cols: '10',
          props: {
            label: 'Electricity Purchaser',
            items: getTranslationList(electricityPurchaserList),
            rules: [v.required()],
          },
        },
        {
          key: 'electricityPrice.value',
          component: 'v-text-field',
          cols: '5',
          props: {
            type: 'number',
            label: 'Electricity Price',
            rules: [v.required(), v.number()],
          },
        },
        {
          key: 'electricityPrice.currency',
          component: 'v-select',
          cols: '5',
          props: {
            label: 'Electricity Price Currency',
            items: this.currencyList,
            rules: [v.required()],
          },
        },
        {
          key: 'ppaSerialNumber',
          component: 'v-text-field',
          cols: '10',
          props: {
            label: 'PPA Serial Number',
            rules: [v.required()],
          },
        },
        {
          key: 'ppaContractStartDate',
          component: 'datepicker',
          cols: '5',
          props: {
            label: 'PPA Start Date',
            rules: [v.required()],
          },
        },
        {
          key: 'ppaContractEndDate',
          component: 'datepicker',
          cols: '5',
          props: {
            label: 'PPA End Date',
            rules: [v.required()],
          },
        },
      ];
    },

    entityList() {
      return this.entities.data.map((d) => ({ value: d._id, text: d.name }));
    },
    currencyList() {
      return currencyList.map((item) => ({
        text: item.name,
        value: item.code,
      }));
    },
  },
};
</script>
