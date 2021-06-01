<template>
  <v-card v-bind="$attrs" class="d-flex flex-column justify-center align-center transparent" flat>
    <v-icon color="error" x-large>$fi-sr-exclamation</v-icon>
    <div v-if="title" class="text-subtitle py-3">{{ title }}</div>
    <div v-if="subtitle" class="text-body py-3">{{ subtitle }}</div>
  </v-card>
</template>

<script>
export default {
  name: 'ErrorState',
  props: {
    title: { type: String, default: 'Internal Error' },
    subtitle: {
      type: String,
      default: 'An unexpected error was detected. Please check the error logs for more information',
    },
  },
};
</script>
