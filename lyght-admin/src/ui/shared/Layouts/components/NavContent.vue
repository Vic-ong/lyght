<template>
  <router-link :to="item.route" class="d-flex align-center py-4 px-7 nav-item">
    <v-icon :color="item.active ? 'primary' : 'bg-light'" size="18" class="mr-4">{{ item.icon }}</v-icon>
    <div class="text-body" :class="!item.active && 'bg-light--text'">{{ item.name }}</div>
  </router-link>
</template>

<script>
export default {
  name: 'NavContent',
  props: {
    item: { type: Object, required: true },
  },
};
</script>

<style lang="scss" scoped>
.nav-item {
  cursor: pointer;
  text-decoration: none !important;
}
</style>
