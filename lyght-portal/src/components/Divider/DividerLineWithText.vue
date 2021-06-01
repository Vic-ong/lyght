<template>
  <div v-bind="$attrs" class="divider mt-5">
    <div class="divider-line"></div>
    <div class="divider-text grey--text text--darken-3">
      <slot>Text</slot>
    </div>
    <div class="divider-line"></div>
  </div>
</template>

<script>
export default {
  name: 'DividerLineWithText',
};
</script>

<style lang="scss" scoped>
.divider {
  display: flex;
  justify-content: center;
  align-items: center;

  .divider-text {
    flex: 1;
    text-align: center;
  }

  .divider-line {
    border-bottom: 1px solid #424242;
    width: 40%;
  }
}
</style>
