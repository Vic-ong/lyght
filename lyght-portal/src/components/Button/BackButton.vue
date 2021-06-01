<template>
  <div>
    <div v-if="$vuetify.breakpoint.smAndUp" class="btn-container">
      <v-btn @click="$emit('click')" color="primary" style="flex: 1" class="btn" outlined>
        <slot>
          <v-icon color="primary" class="mr-2">mdi-chevron-left</v-icon>
          {{ $t('Button-Back') }}
        </slot>
      </v-btn>
    </div>
    <div v-else>
      <v-btn @click="$emit('click')" color="primary" outlined icon>
        <v-icon color="primary">mdi-chevron-left</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BackButton',
};
</script>

<style lang="scss" scoped>
.btn-container {
  display: flex;
  width: 150px;
}

.btn {
  font-size: 14px;
  font-weight: 600;
}
</style>
