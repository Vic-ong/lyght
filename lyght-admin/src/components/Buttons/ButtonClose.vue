<template>
  <v-btn @click="$emit('click')" v-bind="$attrs" min-width="120" class="rounded-btn" large>
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  name: 'Button',
};
</script>
