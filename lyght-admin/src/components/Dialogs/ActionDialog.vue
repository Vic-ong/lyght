<template>
  <general-dialog @close="$emit('close')" v-bind="$attrs" :text="data.text" :status="data.status" :max-width="maxWidth">
    <template #header>Confirm Action</template>

    <template #body>
      <slot></slot>
    </template>

    <template #actions>
      <btn-main @click="$emit('submit')" color="bg-dark" :loading="loading" dark>Confirm</btn-main>
    </template>
  </general-dialog>
</template>

<script>
import GeneralDialog from './GeneralDialog.vue';

export default {
  name: 'ActionDialog',
  components: {
    GeneralDialog,
  },
  props: {
    data: { type: Object, default: () => {} },
    loading: { type: Boolean, default: false },
    maxWidth: { type: Number, default: 400 },
  },
};
</script>
