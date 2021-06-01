<template>
  <v-row>
    <v-col v-for="item in items" v-bind:key="item.titleKey" cols="6" md="3">
      <a target="_blank" :href="item.file.url" style="text-decoration: none">
        <v-hover v-slot="{ hover }">
          <v-card
            :elevation="hover ? 6 : 2"
            :class="{ 'on-hover': hover }"
            class="d-flex flex-column align-center justify-center pa-3"
          >
            <div class="text-subheading text-center text-ellipsis black--text mb-3" style="width: 100%">
              {{ $t(item.titleKey) }}
            </div>
            <v-icon x-large color="primary">mdi-file-document-outline</v-icon>
            <div class="text-body grey--text mt-1">{{ viewFileText }}</div>
          </v-card>
        </v-hover>
      </a>
    </v-col>
  </v-row>
</template>

<script>
import get from 'lodash/get';

export default {
  name: 'DocumentList',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      viewFileText: 'View PDF',
    };
  },
  computed: {
    items() {
      return [
        {
          file: get(this.data, 'fileProjectLayout'),
          titleKey: 'Field-DocProjectLayout',
        },
        {
          file: get(this.data, 'projectGroup.filePpaContract'),
          titleKey: 'Field-DocPpaContract',
        },
        {
          file: get(this.data, 'projectGroup.fileOngridCert'),
          titleKey: 'Field-DocOnGridCert',
        },
        {
          file: get(this.data, 'fileFactSheet'),
          titleKey: 'Field-DocFactSheet',
        },
        {
          file: get(this.data, 'projectGroup.fileRentalContract'),
          titleKey: 'Field-DocRentalContract',
        },
      ].filter(({ file }) => !!file);
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card {
  transition: all 0.2s ease-out;
  cursor: pointer;
}
.v-card:not(.on-hover) {
  transform: scale(1);
  opacity: 0.85;
}
.v-card.on-hover {
  transform: scale(1.01);
  opacity: 1;
}
</style>
