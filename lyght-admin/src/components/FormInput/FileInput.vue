<template>
  <v-hover v-slot="{ hover }">
    <div @click="clickHandler" class="file-input-container cursor-pointer">
      <input
        type="file"
        ref="fileInput"
        style="display: none"
        @change="fileInputHandler"
        :accept="fileTypes"
        :multiple="multiple"
      />
      <v-icon :class="{ 'on-hover': hover }" :color="disabled ? 'grey' : 'primary'" size="30">
        $fi-sr-cloud-upload
      </v-icon>
      <div class="text-hint grey--text mt-1">{{ disabled ? '' : hint }}</div>
      <div v-if="files.length > 0" class="text-body mt-1">{{ files.length }} file(s) selected</div>
    </div>
  </v-hover>
</template>

<script>
export default {
  name: 'FileInput',
  props: {
    label: { type: String, default: 'Select File(s)' },
    multiple: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    fileTypes: {
      type: Array,
      default: () => ['image/jpeg', 'image/png'],
    },
  },
  data() {
    return {
      files: [],
    };
  },
  methods: {
    clickHandler() {
      this.$refs.fileInput.click();
      this.$emit('click');
    },
    fileInputHandler(event) {
      this.files = event.target.files;
      this.$emit('on-select', event);
    },
  },
  computed: {
    hint() {
      const files = this.fileTypes.map((f) => f.split('/')[1]);
      return `Click to upload file${this.multiple ? 's' : ''} (${files.join(', ')})`;
    },
  },
};
</script>

<style lang="scss" scoped>
.file-input-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .v-icon {
    transition: all 0.2s ease-out;
  }
  .v-icon.on-hover {
    transform: scale(1.4);
    animation: animate-grow 0.3s ease-out;
  }
}
</style>
