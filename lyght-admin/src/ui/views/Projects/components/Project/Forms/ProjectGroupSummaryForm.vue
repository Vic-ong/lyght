<template>
  <div>
    <dynamic-input :input="data" :fields="fields" :disabled="loading"></dynamic-input>
    <action-panel class="py-0">
      <btn-main @click="routeToProjectGroup" color="primary">
        Group Details
        <v-icon class="ml-2">mdi-magnify-plus-outline</v-icon>
      </btn-main>
    </action-panel>
  </div>
</template>

<script>
import DynamicInput from '@/components/FormInput/DynamicInput.vue';

export default {
  name: 'NewProjectForm',
  components: {
    DynamicInput,
  },
  props: {
    input: { type: Object, required: true },
    data: { type: Object, required: true },
    loading: { type: Boolean, default: false },
  },
  computed: {
    fields() {
      return [
        {
          key: 'details.publicIdentifier',
          component: 'v-text-field',
          cols: '6',
          props: {
            label: 'Public Identifier',
            readonly: true,
          },
        },
        {
          key: 'details.panelsTotal',
          component: 'v-text-field',
          cols: '6',
          props: {
            type: 'number',
            label: 'Total Panels',
            readonly: true,
          },
        },
        {
          key: 'details.ppaContractStartDate',
          component: 'v-text-field',
          cols: '6',
          props: {
            label: 'PPA Start Date',
            readonly: true,
          },
        },
        {
          key: 'details.ppaContractEndDate',
          component: 'v-text-field',
          cols: '6',
          props: {
            label: 'PPA End Date',
            readonly: true,
          },
        },
      ];
    },
  },
  methods: {
    routeToProjectGroup() {
      this.$router.push({
        name: 'projects/groups/:id',
        params: {
          id: this.data.projectGroupId,
        },
      });
    },
  },
};
</script>
