<template>
  <v-card class="pa-7 rounded-xl text-center">
    <div class="d-flex align-center mb-10">
      <v-icon color="info" class="mr-2">mdi-alert-circle</v-icon>
      <div class="text-subheading black--text">{{ $t('Account-NewIdentity-Step1') }}</div>
    </div>

    <div class="text-body black--text">{{ $t('Account-CompleteProfile') }}</div>

    <v-card-actions class="mt-10 justify-center">
      <lyght-button @click="$router.push({ name: 'account', query: { tab: 1 } })" color="primary">
        {{ $t('Button-Continue') }}
      </lyght-button>
    </v-card-actions>
  </v-card>
</template>
