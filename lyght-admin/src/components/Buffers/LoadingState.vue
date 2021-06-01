<template>
  <v-card v-bind="$attrs" class="d-flex flex-column justify-center align-center transparent" flat>
    <loader-spinner></loader-spinner>
    <div v-if="title" class="text-subtitle py-3">{{ title }}</div>
  </v-card>
</template>

<script>
export default {
  name: 'LoadingState',
  props: {
    title: { type: String },
  },
};
</script>
