<template>
  <div>
    <div class="text-subheading primary--text ml-2 mt-2 mb-5">Personal</div>
    <dynamic-input :input="input" :fields="fields" :disabled="loading"></dynamic-input>
    <div class="text-subheading primary--text ml-2 mt-2 mb-5">Attachments</div>
    <v-row>
      <v-col v-for="item in attachments" v-bind:key="item.src" cols="12" md="6">
        <image-display :title="item.title" :src="item.src"></image-display>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import get from 'lodash/get';
import v from '@/utils/validations';
import nationalityList from '@/constants/nationalityList.json';
import DynamicInput from '@/components/FormInput/DynamicInputLegacy.vue';
import ImageDisplay from '@/components/FormInput/ImageDisplay.vue';

export default {
  name: 'IdentityData',
  components: {
    DynamicInput,
    ImageDisplay,
  },
  props: {
    user: { type: Object, required: true },
    input: { type: Object, required: true },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      fields: [
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
          key: 'idNumber',
          component: 'v-text-field',
          cols: 6,
          label: 'ID Number',
          rules: [v.required(this.t)],
        },
        {
          key: 'dob',
          component: 'datepicker',
          cols: 4,
          label: 'Date Of Birth',
          rules: [v.required()],
        },
        {
          key: 'nationality',
          component: 'v-select',
          cols: 6,
          label: 'Nationality',
          items: nationalityList,
          rules: [v.required()],
        },
        {
          key: 'usCitizenship',
          component: 'v-select',
          cols: 4,
          label: 'US Citizenship',
          items: [
            { text: 'Yes', value: true },
            { text: 'No', value: false },
          ],
          rules: [v.required()],
        },
      ],
    };
  },
  computed: {
    attachments() {
      return [
        {
          title: 'ID card - front',
          src: get(this.user, 'idPhotoFront.url'),
        },
        {
          title: 'ID card - back',
          src: get(this.user, 'idPhotoBack.url'),
        },
      ];
    },
  },
};
</script>
