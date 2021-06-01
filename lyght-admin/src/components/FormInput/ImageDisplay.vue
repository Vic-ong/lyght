<template>
  <v-card class="transparent" flat>
    <v-hover v-if="src">
      <template v-slot:default="{ hover }">
        <v-card class="rounded-btn">
          <v-img :src="src" :height="height" class="background rounded-btn">
            <slot></slot>
          </v-img>
          <transition name="transition-fade">
            <v-overlay v-if="hover" absolute color="bg-dark">
              <slot name="on-hover">
                <!-- Default slot -->
                <a :href="src" target="_blank" style="text-decoration: none">
                  <v-card class="pa-4 transparent text-center" flat>
                    <v-icon size="30" color="accent">$fi-sr-zoom-in</v-icon>
                    <div class="text-body bg-light--text mt-1">View</div>
                  </v-card>
                </a>
              </slot>
            </v-overlay>
          </transition>
        </v-card>
      </template>
    </v-hover>

    <v-card v-else :height="height" class="d-flex justify-center align-center rounded-btn">
      <div class="text-center">
        <v-icon x-large>mdi-image-off</v-icon>
        <div class="text-body mt-2">No Image Found</div>
      </div>
    </v-card>
    <div v-if="title" class="text-subheading mt-3 text-center">
      {{ title }}
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'ImageDisplay',
  props: {
    src: { type: String, default: null },
    title: { type: String, default: null },
    height: { type: Number, default: 200 },
  },
};
</script>
