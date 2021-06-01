<template>
  <div class="d-flex justify-center align-center loader-container" :style="containerStyle">
    <div class="d-flex justify-center align-center circle-border" :style="spinnerStyle">
      <div class="circle-core"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoaderSpinner',
  props: {
    color: { type: String, default: 'primary' },
    size: { type: Number, default: 120 },
    width: { type: Number, default: 8 },
  },
  computed: {
    containerStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
      };
    },
    spinnerStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
        padding: `${this.width}px`,
      };
    },
  },
};
</script>

<style class="scss" scoped>
@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(359deg);
  }
}
.loader-container {
  background-color: transparent;
}
.circle-border {
  border-radius: 50%;
  background: var(--v-primary-base);
  background: linear-gradient(0deg, rgba(221, 177, 119, 0.1) 33%, var(--v-primary-base) 100%);
  animation: spin 1s linear 0s infinite;
}
.circle-core {
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 50%;
}
</style>
