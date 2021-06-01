<template>
  <v-card @click="$emit('click', data)" class="cursor-pointer rounded-lg pa-7" max-width="320px">
    <div class="text-body white--text bank-name" style="opacity: 0.8">
      <v-icon class="mr-2">mdi-bank</v-icon>
      {{ data.bankName }}
    </div>
    <div class="d-flex justify-space-between align-center mt-10" style="opacity: 0.8">
      <div class="text-subheading white--text bank-holder">{{ data.accountName }}</div>
      <div class="text-body white--text bank-number">{{ accountNumber(data.accountNumber) }}</div>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    accountNumber(v) {
      return `****${v.substr(v.length - 4)}`;
    },
  },
};
</script>
