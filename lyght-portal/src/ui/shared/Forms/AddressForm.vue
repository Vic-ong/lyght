<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-5">
      <div class="d-flex align-center">
        <v-icon class="mr-3" color="primary">mdi-map-marker</v-icon>
        <span class="text-subheading">{{ title }}</span>
      </div>
      <slot v-if="$vuetify.breakpoint.smAndUp" name="side-header"></slot>
    </div>
    <div v-if="!$vuetify.breakpoint.smAndUp" class="mb-7">
      <slot name="side-header"></slot>
    </div>
    <dynamic-form-input :input="input" :fields="fields" :disabled="loading"></dynamic-form-input>
  </div>
</template>

<script>
import form from '@/utils/validation/form';
import countryList from '@/constants/countryList.json';
import { DynamicFormInput } from '@/components/FormInput';

export default {
  components: {
    DynamicFormInput,
  },
  props: ['title', 'input', 'loading'],
  data() {
    return {
      valid: true,
      status: {
        color: null,
        text: null,
      },
    };
  },
  computed: {
    fields() {
      const address1 = {
        component: 'v-text-field',
        cols: '12',
        key: 'address1',
        labelKey: 'Field-Address1',
        placeholderKey: 'Field-Address1Placeholder',
        rules: [form.required(this.t)],
      };
      const address2 = {
        component: 'v-text-field',
        cols: '12',
        key: 'address2',
        labelKey: 'Field-Address2',
        placeholderKey: 'Field-Address2Placeholder',
      };
      const district = {
        component: 'v-text-field',
        cols: '6',
        key: 'district',
        labelKey: 'Field-District',
        placeholderKey: 'Field-DistrictPlaceholder',
      };
      const city = {
        component: 'v-text-field',
        cols: '6',
        key: 'city',
        labelKey: 'Field-City',
        placeholderKey: 'Field-CityPlaceholder',
        rules: [form.required(this.t)],
      };
      const country = {
        component: 'v-select',
        cols: '5',
        key: 'country',
        labelKey: 'Field-Country',
        items: countryList.map((item) => item.name),
        rules: [form.required(this.t)],
      };
      const postalCode = {
        component: 'v-text-field',
        cols: '3',
        key: 'postalCode',
        labelKey: 'Field-PostalCode',
        rules: [form.required(this.t), form.number(this.t)],
      };

      if (this.$i18n.locale === 'zhHant') {
        return [country, postalCode, city, district, address1, address2];
      }

      return [address1, address2, district, city, country, postalCode];
    },
  },
  methods: {
    t(v, params) {
      return this.$t(v, params);
    },
  },
};
</script>
