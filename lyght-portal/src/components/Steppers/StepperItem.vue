<template>
  <div class="d-flex flex-column justify-center mx-3">
    <v-icon :color="active ? 'primary' : 'grey'" class="pa-1">{{ icon }}</v-icon>
    <div class="text-body" :class="active ? 'primary--text' : 'grey--text'">{{ name }}</div>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: undefined,
    },
  },
};
</script>
