<template>
  <v-card
    v-bind="$attrs"
    width="28"
    height="28"
    class="d-flex justify-center align-center rounded-lg"
    :class="[pointerClass]"
    :color="color"
    flat
  >
    <slot></slot>
  </v-card>
</template>

<script>
export default {
  name: 'ButtonIcon',
  props: {
    color: { type: String, default: 'background' },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    pointerClass() {
      if (this.loading) return 'cursor-progress';
      if (this.disabled) return 'cursor-not-allowed';
      return 'cursor-pointer';
    },
  },
};
</script>
