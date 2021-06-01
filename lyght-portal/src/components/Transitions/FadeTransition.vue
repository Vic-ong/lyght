<template>
  <transition name="component-fade" mode="out-in">
    <slot></slot>
  </transition>
</template>

<style lang="scss" scoped>
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.2s ease;
}
.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
</style>
