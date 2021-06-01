<template>
  <v-form ref="form" v-model="valid" @submit.prevent lazy-validation>
    <cart-item v-for="item in items" v-bind:key="item._id" :data="item"></cart-item>

    <v-divider class="my-10"></v-divider>

    <cart-summary :items="items"></cart-summary>

    <v-card-actions class="justify-end mt-10">
      <lyght-button @click="submitHandler">
        {{ $t('Button-Continue') }}
      </lyght-button>
    </v-card-actions>
  </v-form>
</template>

<script>
import CartItem from './CartItem.vue';
import CartSummary from './CartSummary.vue';

export default {
  components: {
    CartItem,
    CartSummary,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      valid: true,
    };
  },
  methods: {
    validate() {
      this.valid = this.$refs.form.validate();
    },
    submitHandler() {
      this.validate();
      if (this.valid) {
        this.$emit('set-step', 2);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
