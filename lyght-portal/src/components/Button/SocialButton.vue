<template>
  <v-btn
    @click="$emit('click')"
    v-bind:style="btnStyles"
    v-bind:class="[btnType]"
    class="btn-container white--text"
    large
  >
    <v-icon class="mr-2">{{ attrs.icon }}</v-icon>
    <slot>{{ attrs.text }}</slot>
  </v-btn>
</template>

<script>
export default {
  name: 'SocialButton',
  props: {
    type: {
      type: String,
      default: 'facebook',
    },
  },
  computed: {
    attrs() {
      switch (this.type) {
        case 'facebook':
          return {
            icon: 'mdi-facebook',
            text: 'Login with Facebook',
            color: '#3c5899',
          };
        case 'google':
          return {
            icon: 'mdi-google',
            text: 'Login with Google',
            color: '#dc4e41',
          };
        default:
          return {
            icon: 'mdi-facebook',
            text: 'Login with Facebook',
            color: '#3c5899',
          };
      }
    },
    btnType() {
      return `type-${this.type}`;
    },
    btnStyles() {
      return {
        backgroundColor: this.attrs.color,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-container {
  font-size: 16px;
  font-weight: 600;
}
.type-facebook {
  font-size: 16px;
}
</style>
