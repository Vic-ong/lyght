<template>
  <div class="d-flex align-center justify-center mb-7">
    <div :style="pageStyle">
      <div v-if="title" class="d-flex align-center justify-space-between mt-3">
        <div class="text-title mt-3">{{ title }}</div>
        <slot name="side-header"></slot>
      </div>
      <div class="text-body mt-2">{{ description }}</div>

      <transition name="transition-fade" mode="out-in">
        <div v-if="isLoading" key="loading" class="page-loader">
          <v-progress-circular :size="80" :width="7" color="primary" indeterminate></v-progress-circular>
        </div>

        <div v-else-if="isError" key="error">
          <v-card class="buffer-state">
            <div class="text-subheading">Internal Error!</div>
            <div class="error-title primary--text">500</div>
            <div class="text-body black--text">
              An error occurred and your request couldn't be completed. Please contact our adminstration team for help.
            </div>
          </v-card>
        </div>

        <div v-else key="content">
          <slot name="rendered"></slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
import { mapGetters } from 'vuex';

export default {
  name: 'PageContainer',
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    buttonTitle: {
      type: String,
      default: null,
    },
    width: {
      type: Number,
      default: 850,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isError: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters('users', {
      user: 'user',
    }),
    query() {
      return this.$vuetify.breakpoint;
    },
    pageWidth() {
      const mini = get(this.user, 'data.panelMini');
      if (mini && this.query.mdAndUp) return `${this.width * 1.1}px`;
      if (!mini && this.query.md) return `${this.width / 1.1}px`;
      if (!mini && this.query.lgAndUp) return `${this.width}px`;
      return '100%';
    },
    pagePadding() {
      if (this.query.lgAndUp) return '12px 0';
      if (this.query.smAndUp) return '24px';
      return '12px';
    },
    pageStyle() {
      return {
        width: this.pageWidth,
        padding: this.pagePadding,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.buffer-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
}
.error-title {
  font-size: 72px;
  font-weight: 600;
}
</style>
