<template>
  <v-carousel v-model="img" show-arrows-on-hover hide-delimiters>
    <v-carousel-item v-for="item in data" v-bind:key="item" :src="item"></v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  props: {
    data: { type: Array, required: true },
    initKey: { type: Number, default: 0 },
    keyboardEnabled: { type: Boolean, default: true },
  },
  beforeMount() {
    if (this.keyboardEnabled) window.addEventListener('keydown', this.handleKeydown, null);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown);
  },
  mounted() {
    this.img = this.initKey;
  },
  data() {
    return {
      img: null,
    };
  },
  methods: {
    handleKeydown(e) {
      switch (e.keyCode) {
        case 37:
          this.previousImage();
          break;
        case 39:
          this.nextImge();
          break;
        default:
          break;
      }
    },
    nextImge() {
      if (this.keyboardEnabled) {
        if (this.img + 1 < this.data.length) {
          this.img += 1;
        } else {
          this.img = 0;
        }
      }
    },
    previousImage() {
      if (this.keyboardEnabled) {
        if (this.img - 1 >= 0) {
          this.img -= 1;
        } else {
          this.img = this.data.length - 1;
        }
      }
    },
  },
};
</script>
