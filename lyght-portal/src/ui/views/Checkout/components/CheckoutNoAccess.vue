<template>
  <v-card class="d-flex justify-center align-centerpa-7">
    <div class="pa-7">
      <div class="d-flex align-center">
        <v-icon color="info" class="mr-2">mdi-alert-circle</v-icon>
        <div class="text-subheading-medium black--text">No Purchase Access</div>
      </div>

      <div class="text-body black--text mt-5">{{ $t('Account-CompleteProfile') }}</div>

      <v-card-actions class="mt-10 justify-center">
        <lyght-button @click="$router.push({ name: 'account', query: { tab: 1 } })" color="primary">
          {{ $t('Button-Continue') }}
        </lyght-button>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
export default {};
</script>
