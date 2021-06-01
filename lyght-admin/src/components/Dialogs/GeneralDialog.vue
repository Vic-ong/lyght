<template>
  <v-dialog v-bind="$attrs" persistent flat>
    <v-card>
      <v-toolbar class="primary" flat>
        <div class="text-subheading bg-light--text">
          <slot name="header"></slot>
        </div>
        <v-spacer></v-spacer>
        <v-btn v-if="!loading" @click="$emit('close')" icon>
          <v-icon color="bg-light--text">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <div class="pt-8 pb-4 px-5 text-body text-center">
        <transition name="transition-slide-right" mode="out-in">
          <div v-if="success" key="success">
            <div class="d-flex align-center justify-center">
              <v-icon color="success" class="mr-2">mdi-checkbox-marked-circle</v-icon>
              Success!
            </div>
            <div class="text-subheading mt-3">{{ text }}</div>
          </div>

          <div v-else-if="error" key="error">
            <div class="d-flex align-center justify-center">
              <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
              Failed!
            </div>
            <div class="text-subheading mt-3">{{ text }}</div>
          </div>

          <div v-else key="action">
            <slot name="body"></slot>
          </div>
        </transition>
      </div>

      <action-panel v-if="success || error">
        <btn-main @click="$emit('close')" color="bg-dark" dark>Close</btn-main>
      </action-panel>

      <action-panel v-else>
        <slot name="actions"></slot>
      </action-panel>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'GeneralDialog',
  props: {
    text: { type: String },
    status: { type: String, validator: (v) => ['success', 'error'].includes(v) },
    loading: { type: Boolean, default: false },
  },
  computed: {
    success() {
      return this.status === 'success';
    },
    error() {
      return this.status === 'error';
    },
  },
};
</script>
