<template>
  <div>
    <div class="text-subheading primary--text ml-2 mt-3 mb-5">General</div>
    <dynamic-input :input="input" :fields="generalFields" :disabled="loading"></dynamic-input>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import v from '@/utils/validations';
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
    ...mapGetters('projectGroups', ['projectGroups']),

    generalFields() {
      return [
        {
          key: 'projectGroupId',
          component: 'v-autocomplete',
          cols: '12',
          props: {
            label: 'Project Group',
            items: this.projectGroupList,
            rules: [v.required()],
          },
        },
        {
          key: 'nameTrans.en',
          component: 'v-text-field',
          cols: '12',
          props: {
            label: 'Project Name (en)',
            rules: [v.required(), v.maxLength({ len: 30 })],
          },
        },
        {
          key: 'nameTrans.zhHant',
          component: 'v-text-field',
          cols: '12',
          props: {
            label: 'Project Name (zh-hant)',
            rules: [v.required(), v.maxLength({ len: 20 })],
          },
        },
        {
          key: 'estimatedIrr',
          component: 'v-text-field',
          cols: '6',
          props: {
            type: 'number',
            label: 'Estimated IRR',
            rules: [v.required(), v.number()],
          },
        },
        {
          key: 'panelsTotal',
          component: 'v-text-field',
          cols: '6',
          props: {
            type: 'number',
            label: 'No. of Panels For Sale',
            rules: [v.required(), v.number()],
          },
        },
        {
          key: 'unitCost.value',
          component: 'v-text-field',
          cols: '6',
          props: {
            type: 'number',
            label: 'Unit Cost',
            rules: [v.required(), v.number()],
          },
        },
        {
          key: 'unitCost.currency',
          component: 'v-autocomplete',
          cols: '6',
          props: {
            label: 'Currency',
            items: this.currencyList,
            rules: [v.required()],
          },
        },
        {
          key: 'fundingStartDate',
          component: 'datepicker',
          cols: '6',
          props: {
            label: 'Funding Start Date',
            rules: [v.required()],
          },
        },
        {
          key: 'fundingEndDate',
          component: 'datepicker',
          cols: '6',
          props: {
            label: 'Funding End Date',
            rules: [v.required()],
          },
        },
      ];
    },

    projectGroupList() {
      return this.projectGroups.data.map((d) => ({ value: d._id, text: d.nameTrans.en }));
    },
    currencyList() {
      return currencyList.map((d) => ({
        value: d.code,
        text: `${d.name} (${d.symbol})`,
      }));
    },
  },
};
</script>
