<template>
  <v-card min-height="100vh" class="d-flex justify-center align-center" flat tile>
    <div>
      <bee-loading :size="55"></bee-loading>
      <div class="d-flex justify-center text-title">Buzzing you in...</div>
    </div>
  </v-card>
</template>

<script>
import BeeLoading from './BeeLoading.vue';

export default {
  components: {
    BeeLoading,
  },
};
</script>
