<template>
  <v-card height="120" class="d-flex align-center justify-center rounded-xl bg-light" flat>
    <div>
      <file-input
        v-show="files.length === 0"
        ref="inputRef"
        @click="clearErrors"
        @on-select="onSelectFile"
        :disabled="loading"
        :fileTypes="fileTypes"
      ></file-input>

      <div v-if="files.length > 0" @click="clickInput" class="cursor-pointer">
        <div v-for="file in files" v-bind:key="file.name" class="d-flex align-center justify-center">
          <v-icon :color="loading ? 'grey' : 'primary'">mdi-file</v-icon>
          <div class="text-body text-overflow-mask ml-2" style="max-width: 150px">{{ file.name }}</div>
        </div>
      </div>

      <div v-if="error" class="error-description text-body error--text px-2">
        {{ error }}
      </div>
    </div>
  </v-card>
</template>

<script>
import get from 'lodash/get';
import { v4 as uuidv4 } from 'uuid';
import firebase from '@/services/firebase';
import FileInput from './FileInput.vue';

export default {
  components: {
    FileInput,
  },
  props: {
    input: {
      type: Object,
      default: () => ({
        path: null,
        url: null,
      }),
    },
    storagePath: {
      type: String,
      required: true,
    },
    fileTypes: {
      type: Array,
      default: () => ['image/jpeg', 'image/png'],
    },
    maxSize: {
      type: Number,
      default: 5,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      files: [],
      error: null,
    };
  },
  watch: {
    input: {
      handler() {
        if (!this.input || !this.input.path) this.resetInput();
      },
      deep: true,
    },
  },
  computed: {
    storageRef() {
      return firebase.storage().ref(this.storagePath);
    },
  },
  methods: {
    validFileSize(files) {
      return files.every((f) => f.size <= this.maxSize * 1000000);
    },
    clickInput() {
      const ref = get(this.$refs, `inputRef.$refs.fileInput`);
      if (ref) ref.click();
    },
    resetInput() {
      const ref = get(this.$refs, `inputRef.$refs.fileInput`);
      if (ref) ref.value = null;
    },
    clearErrors() {
      this.error = null;
    },
    onSelectFile(e) {
      this.clearErrors();
      const file = e.target.files[0];
      if (file) {
        if (!this.validFileSize([file])) {
          this.error = `Please upload a file below ${this.maxSize} MB`;
          this.resetInput();
        } else {
          this.files = e.target.files;
          const path = `${uuidv4()}.${file.type.split('/')[1]}`;
          this.$emit('select', { file, path });
        }
      }
    },
  },
};
</script>
