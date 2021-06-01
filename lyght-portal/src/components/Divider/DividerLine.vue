<template>
  <div v-bind="$attrs" class="divider">
    <div :style="lineStyle"></div>
  </div>
</template>

<script>
export default {
  name: 'DividerLine',
  props: {
    color: { type: String, default: '#ccbfb4' },
  },
  computed: {
    lineStyle() {
      return {
        borderBottom: `1px solid ${this.color}`,
        width: '100%',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.divider {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
