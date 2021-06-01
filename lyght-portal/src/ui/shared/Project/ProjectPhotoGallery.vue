<template>
  <v-card flat>
    <v-row>
      <v-col cols="12">
        <v-card flat>
          <v-row v-if="!isXs" dense>
            <v-col cols="12" sm="6">
              <v-card>
                <v-img
                  @click="previewImgHandler(0)"
                  :src="primaryImage"
                  :height="imgHeight"
                  class="cursor-pointer"
                ></v-img>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6">
              <v-row dense>
                <v-col cols="6" v-for="(item, i) in otherImages" v-bind:key="item" :class="i < 2 ? 'pt-0' : 'pb-0'">
                  <v-card>
                    <v-img
                      @click="previewImgHandler(i + 1)"
                      :src="item"
                      :height="sideImgHeight"
                      class="cursor-pointer"
                    ></v-img>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row v-else dense>
            <v-col>
              <v-carousel :height="imgHeight" show-arrows-on-hover hide-delimiters>
                <v-carousel-item v-for="item in imageCarousel" v-bind:key="item" :src="item"></v-carousel-item>
              </v-carousel>
            </v-col>
          </v-row>

          <v-dialog v-model="previewDialog" max-width="900">
            <v-card style="position: relative">
              <div class="top-right">
                <v-btn @click="previewDialog = false" class="ma-3" icon>
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
              <ImageCarousel
                :key="uniqueKey()"
                :data="imageCarousel"
                :initKey="preview"
                :keyboardEnabled="previewDialog"
              ></ImageCarousel>
            </v-card>
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import get from 'lodash/get';
import { ImageCarousel } from '@/components/Grid';

export default {
  name: 'ProjectPhotoGallery',
  components: { ImageCarousel },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      imgHeight: 400,
      sideImgHeight: 196,
      previewDialog: false,
      preview: 0,
    };
  },
  computed: {
    isXs() {
      return this.$vuetify.breakpoint.xs;
    },
    primaryImage() {
      return get(this.data, 'imagePrimary.url');
    },
    otherImages() {
      const primaryImgPath = get(this.data, 'imagePrimary.path');
      const imgs = get(this.data, 'images');
      const filteredImgs = imgs.filter((img) => img.path !== primaryImgPath).map((img) => img.url);
      return filteredImgs.slice(0, 4);
    },
    imageCarousel() {
      return [this.primaryImage, ...this.otherImages];
    },
  },
  methods: {
    previewImgHandler(index) {
      this.preview = index;
      this.previewDialog = true;
    },
    uniqueKey() {
      const d = new Date();
      return d.toString();
    },
  },
};
</script>

<style lang="scss" scoped>
.top-right {
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
}
</style>
