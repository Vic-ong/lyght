<template>
  <div>
    <div>404</div>
  </div>
</template>

<script>
export default {
  name: 'Redirect404',
  created() {
    this.$router.replace({ name: 'projects' });
  },
};
</script>
