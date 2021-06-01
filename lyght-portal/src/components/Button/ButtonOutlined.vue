<template>
  <div class="btn-container">
    <v-btn v-bind="$attrs" @click="$emit('click')" style="flex: 1" v-bind:color="color" class="btn" large outlined>
      <slot>Button</slot>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'ButtonOutlined',
  props: {
    color: {
      type: String,
      default: 'primary',
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
