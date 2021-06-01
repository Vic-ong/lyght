<template>
  <v-row no-gutters v-bind="$attrs" :style="rowStyle" class="mb-1 row-container">
    <v-col :cols="12 - valueCols">
      <div class="text-body black--text">
        <slot name="label"></slot>
      </div>
    </v-col>
    <v-col :cols="valueCols">
      <div class="text-body black--text value-container">
        <slot name="value"></slot>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'FlexRow',
  props: {
    valueCols: { type: Number, default: 6 },
    rowStyle: { type: Object, default: null },
  },
};
</script>

<style lang="scss" scoped>
.row-container {
  display: flex;
}
.value-container {
  text-align: right;
}
</style>
