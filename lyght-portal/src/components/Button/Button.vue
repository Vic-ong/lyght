<template>
  <div class="btn-container">
    <v-btn
      v-bind="$attrs"
      @click="$emit('click')"
      v-bind:class="[btnColor]"
      style="flex: 1"
      class="btn white--text"
      large
    >
      <slot>Button</slot>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'Button',
  props: {
    color: {
      type: String,
      default: 'primary',
    },
  },
  computed: {
    btnColor() {
      return `${this.color}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-container {
  display: flex;
  width: 190px;
}

.btn {
  font-size: 14px;
  font-weight: 600;
}
</style>
