<template>
  <div class="loading-container py-5">
    <v-img class="bee-flying" :src="beeFlying" :height="size" contain></v-img>
  </div>
</template>

<script>
import beeFlying from '@/assets/bee_flying.gif';

export default {
  props: {
    size: {
      type: Number,
      default: 40,
    },
  },
  data() {
    return {
      beeFlying,
    };
  },
};
</script>

<style lang="scss" scoped>
.loading-container {
  width: 300px;

  .bee-flying {
    animation: flying 3s linear infinite;
  }

  @keyframes flying {
    0% {
      left: 0%;
      right: 100%;
      width: 0%;
    }
    10% {
      left: 0%;
      right: 75%;
      width: 25%;
      transform: translateY(15px);
    }
    90% {
      right: 0%;
      left: 75%;
      width: 25%;
      transform: translateY(-15px);
    }
    100% {
      left: 100%;
      right: 0%;
      width: 0%;
    }
  }
}
</style>
