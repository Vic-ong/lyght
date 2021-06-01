<template>
  <div>
    <v-card v-if="hideHover" class="stretch-height rounded-xl" :class="{ 'pa-5': !noPadding }" :v-bind="$attrs">
      <slot></slot>
    </v-card>
    <v-hover v-else v-slot="{ hover }">
      <v-card
        @click="$emit('click')"
        class="stretch-height rounded-xl disable-ripple"
        :class="{ 'on-hover': hover, 'elevation-8': hover, 'pa-5': !noPadding }"
        :v-bind="$attrs"
        v-ripple="false"
      >
        <slot></slot>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
export default {
  name: 'CardPanel',
  props: {
    noPadding: { type: Boolean, default: false },
    hideHover: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped>
.v-card {
  transition: all 0.4s ease-out;
}
.v-card:not(.on-hover) {
  border: 1px solid transparent;
}
.v-card.on-hover {
  border: 1px solid var(--v-bg-grey-base);
}
</style>
