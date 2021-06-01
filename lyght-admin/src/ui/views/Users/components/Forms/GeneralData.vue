<template>
  <div>
    <div class="text-subheading primary--text ml-2 mt-2 mb-5">Profile</div>
    <dynamic-input :input="input" :fields="profileFields" :disabled="loading"></dynamic-input>
    <div class="text-subheading primary--text ml-2 mt-2 mb-5">Registered Address</div>
    <dynamic-input :input="input.registeredAddress" :fields="addressFields" :disabled="loading"></dynamic-input>
    <div class="text-subheading primary--text ml-2 mt-2 mb-5">Residential Address</div>
    <dynamic-input :input="input.residentialAddress" :fields="addressFields" :disabled="loading"></dynamic-input>
  </div>
</template>

<script>
import v from '@/utils/validations';
import countryList from '@/constants/countryList.json';
import DynamicInput from '@/components/FormInput/DynamicInputLegacy.vue';

export default {
  name: 'GeneralData',
  components: {
    DynamicInput,
  },
  props: {
    input: { type: Object, required: true },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      profileFields: [
        {
          key: 'firstName',
          component: 'v-text-field',
          cols: 6,
          label: 'First Name',
          rules: [v.required()],
        },
        {
          key: 'lastName',
          component: 'v-text-field',
          cols: 6,
          label: 'Last Name',
          rules: [v.required()],
        },
        {
          key: 'displayName',
          component: 'v-text-field',
          cols: 6,
          label: 'Display Name',
          rules: [v.required()],
        },
        {
          key: 'language',
          component: 'v-select',
          cols: 6,
          label: 'Language',
          items: ['en', 'zhHant'],
          rules: [v.required()],
        },
      ],
      addressFields: [
        {
          component: 'v-text-field',
          cols: '12',
          key: 'address1',
          label: 'Address 1',
          placeholder: 'Road/Street/Lane/Alley/Village/Section/Boulevard',
          rules: [v.required()],
        },
        {
          component: 'v-text-field',
          cols: '12',
          key: 'address2',
          label: 'Address 2',
          placeholder: 'Room/Floor/Number',
        },
        {
          component: 'v-text-field',
          cols: '5',
          key: 'district',
          label: 'District/Township',
        },
        {
          component: 'v-text-field',
          cols: '5',
          key: 'city',
          label: 'City/County',
          rules: [v.required()],
        },
        {
          component: 'v-select',
          cols: '5',
          key: 'country',
          label: 'Country',
          items: countryList.map((item) => item.name),
          rules: [v.required()],
        },
        {
          component: 'v-text-field',
          cols: '3',
          key: 'postalCode',
          label: 'Postal Code',
          rules: [v.required(), v.number()],
        },
      ],
    };
  },
};
</script>
