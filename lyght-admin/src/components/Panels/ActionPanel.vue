<template>
  <div v-bind="$attrs" class="d-flex justify-center panel-container pa-4">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ActionPanel',
};
</script>

<style lang="scss" scoped>
.panel-container {
  & > div:not(:last-child) {
    margin-right: 8px;
  }
}
</style>
