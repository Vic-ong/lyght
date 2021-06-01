<template>
  <v-card>
    <v-toolbar class="primary">
      <div class="text-title white--text">{{ title }}</div>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('close')" icon><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>
    <v-card flat class="px-5 pt-5">
      <Cropper
        ref="cropper"
        :src="src"
        :stencil-props="stencilProps"
        :stencil-size="stencilSize"
        :stencil-component="$options.components.CircleStencil"
        image-restriction="stencil"
        default-boundaries="fill"
      ></Cropper>
      <v-card-actions class="justify-center mt-3">
        <v-btn @click="zoom(1.2)" class="mx-3" rounded>
          <v-icon color="primary">mdi-magnify-plus-outline</v-icon>
        </v-btn>
        <v-btn @click="zoom(0.8)" class="mx-3" rounded>
          <v-icon color="primary">mdi-magnify-minus-outline</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card-actions class="justify-center pb-5">
      <lyght-button @click="cropImage" :loading="loading">{{ $t('Button-CropImage') }}</lyght-button>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

export default {
  components: {
    Cropper,
    // eslint-disable-next-line vue/no-unused-components
    CircleStencil,
  },
  props: {
    title: {
      type: String,
      default: null,
    },
    src: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      cropSize: 512,
    };
  },
  computed: {
    stencilProps() {
      return {
        handlers: {},
        movable: false,
        scalable: false,
        aspectRatio: 1,
      };
    },
    stencilSize() {
      return {
        width: this.cropSize,
        height: this.cropSize,
      };
    },
  },
  methods: {
    zoom(n) {
      this.$refs.cropper.zoom(n);
    },
    resizeCanvas(canvas, newWidth, newHeight) {
      const ctx = canvas.getContext('2d');
      const buffer = document.createElement('canvas');
      buffer.width = ctx.canvas.width;
      buffer.height = ctx.canvas.height;
      const ctxBuf = buffer.getContext('2d');

      let scaleX = newWidth / ctx.canvas.width;
      let scaleY = newHeight / ctx.canvas.height;

      let scaler = Math.min(scaleX, scaleY);

      if (scaler < 0.5) {
        while (scaler < 0.5) {
          ctxBuf.canvas.width *= 0.5;
          ctxBuf.canvas.height *= 0.5;
          ctxBuf.scale(0.5, 0.5);
          ctxBuf.drawImage(canvas, 0, 0);
          ctxBuf.setTransform(1, 0, 0, 1, 0, 0);
          ctx.canvas.width = ctxBuf.canvas.width;
          ctx.canvas.height = ctxBuf.canvas.height;
          ctx.drawImage(buffer, 0, 0);

          scaleX = newWidth / ctxBuf.canvas.width;
          scaleY = newHeight / ctxBuf.canvas.height;
          scaler = Math.min(scaleX, scaleY);
        }
        if (scaler > 0.5) {
          scaleX *= 2.0;
          scaleY *= 2.0;
          ctxBuf.canvas.width *= scaleX;
          ctxBuf.canvas.height *= scaleY;
          ctxBuf.scale(scaleX, scaleY);
          ctxBuf.drawImage(canvas, 0, 0);
          ctxBuf.setTransform(1, 0, 0, 1, 0, 0);
          scaleX = 0.5;
          scaleY = 0.5;
        }
      } else ctxBuf.drawImage(canvas, 0, 0);

      ctx.canvas.width = newWidth;
      ctx.canvas.height = newHeight;
      ctx.scale(scaleX, scaleY);
      ctx.drawImage(buffer, 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      return canvas;
    },
    cropImage() {
      this.loading = true;
      const { canvas } = this.$refs.cropper.getResult();

      if (canvas) {
        const optimizedCanvas = this.resizeCanvas(canvas, this.cropSize, this.cropSize);

        optimizedCanvas.toBlob((blob) => {
          this.loading = false;
          this.$emit('cropped', blob);
        }, 'image/jpeg');
      }
    },
  },
};
</script>
