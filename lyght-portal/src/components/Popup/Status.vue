<template>
  <div class="text-body py-3" :class="`${color}--text`">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Status',
  props: {
    color: {
      type: String,
      default: 'red',
    },
  },
};
</script>
