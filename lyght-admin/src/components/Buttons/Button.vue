<template>
  <v-tooltip :disabled="!tooltip" v-bind="{ [direction]: true }">
    <template v-slot:activator="{ on }">
      <div v-on="on" class="d-inline-block">
        <v-btn @click="$emit('click')" v-bind="$attrs" min-width="120" class="rounded-btn" large>
          <slot></slot>
        </v-btn>
      </div>
    </template>
    <div>
      <slot name="tooltip"></slot>
    </div>
  </v-tooltip>
</template>

<script>
export default {
  name: 'Button',
  props: {
    tooltip: { type: Boolean, default: false },
    direction: { type: String, default: 'bottom' },
  },
};
</script>
