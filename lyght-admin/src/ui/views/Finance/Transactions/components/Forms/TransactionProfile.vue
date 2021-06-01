<template>
  <v-card class="pos-relative rounded-lg">
    <div class="pa-5 text-center">
      <div class="text-body">
        Status: <b>{{ data.status }}</b>
      </div>
    </div>

    <slot></slot>

    <div class="divider-line my-5 mx-5"></div>

    <div class="pb-5">
      <record-timestamps :data="data"></record-timestamps>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'TransactionProfile',
  props: {
    data: { type: Object, required: true },
  },
};
</script>
