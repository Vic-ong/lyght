<template>
  <div>
    <v-row>
      <v-col v-for="img in images" v-bind:key="img.path" cols="12" md="4">
        <image-display :src="img.url">
          <div v-if="isPrimary(img)" class="pa-2">
            <v-icon color="primary">mdi-star</v-icon>
          </div>

          <template #on-hover>
            <a :href="img.url" target="_blank" style="text-decoration: none">
              <v-card class="pa-1 transparent text-center" flat>
                <v-icon size="20" color="accent">$fi-sr-zoom-in</v-icon>
                <div class="text-body bg-light--text mt-1">View</div>
              </v-card>
            </a>
            <action-panel v-if="!isPrimary(img)">
              <v-card @click="setPrimaryAction(img)" class="pa-1 transparent text-center" flat>
                <v-icon color="primary">mdi-star</v-icon>
                <div class="text-body bg-light--text mt-1">Set Primary</div>
              </v-card>
              <v-card @click="setDeleteAction(img)" class="pa-1 transparent text-center" flat>
                <v-icon color="error">mdi-delete</v-icon>
                <div class="text-body bg-light--text mt-1">Delete</div>
              </v-card>
            </action-panel>
          </template>
        </image-display>
      </v-col>

      <v-col v-if="images.length < maxFiles" cols="12" md="4">
        <v-card v-if="loading" class="image-uploading stretch-height rounded-btn py-10">
          <div class="text-body mb-5">Uploading...</div>
          <v-progress-linear color="secondary" buffer-value="0" class="pl-5 pr-5" stream></v-progress-linear>
        </v-card>
        <v-card v-else class="image-uploader stretch-height rounded-btn py-5">
          <file-input
            ref="inputRef"
            @click="clearErrors"
            @on-select="onSelectHandler"
            :disabled="disabled"
            class="pa-5"
            multiple
          ></file-input>
          <div v-for="err in errors" v-bind:key="err" class="text-center text-body error--text">
            {{ err }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <action-dialog
      v-model="dialogProps.show"
      :data="dialogProps"
      :loading="loading"
      @submit="dialogProps.action"
      @close="clearDialog"
    >
      Action: <b>{{ dialogProps.text }}</b>
    </action-dialog>
  </div>
</template>

<script>
import get from 'lodash/get';
import firebase from '@/services/firebase';
import { mapActions } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import dialog from '@/mixins/dialog';
import { asyncForEach } from '@/utils';
import FileInput from '@/components/FormInput/FileInput.vue';
import ImageDisplay from '@/components/FormInput/ImageDisplay.vue';

export default {
  components: {
    FileInput,
    ImageDisplay,
  },
  props: {
    data: { type: Object, default: () => {} },
  },
  mixins: [dialog],
  data() {
    return {
      errors: [],
      maxSize: 2,
      maxFiles: 5,
      disabled: false,
      loading: false,
      imgToSetPrimary: null,
      imgToDelete: null,
    };
  },
  computed: {
    projectId() {
      return this.$route.params.id;
    },
    storageRef() {
      return firebase.storage().ref(`projects/${this.$route.params.id}/images`);
    },
    imagePrimary() {
      return this.data.imagePrimary;
    },
    images() {
      return this.data.images || [];
    },
  },
  methods: {
    ...mapActions('projects', ['updateProject']),
    isPrimary(item) {
      return this.imagePrimary && item.path === this.imagePrimary.path;
    },
    setPrimaryAction(item) {
      this.imgToSetPrimary = item;
      this.setAction({
        name: `Set as primary image`,
        handler: this.setPrimaryImage,
      });
    },
    setDeleteAction(item) {
      this.imgToDelete = item;
      this.setAction({
        name: `Remove image`,
        handler: this.deleteFile,
      });
    },

    async onSelectHandler(e) {
      this.clearErrors();
      try {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          this.validate(files);
          if (this.errors.length === 0) {
            this.loading = true;
            await asyncForEach(files, (file, i) => this.uploadFile(file, i === 0 && !this.imagePrimary));
            this.loading = false;
          } else {
            this.resetInput();
          }
        }
      } catch (err) {
        this.loading = false;
        this.resetInput();
      }
    },
    clearErrors() {
      this.errors = [];
    },
    resetInput() {
      const ref = get(this.$refs, 'inputRef.$refs.fileInput');
      if (ref) ref.value = null;
    },
    validate(v) {
      if (!this.validFileCount(v)) {
        this.errors.push(`Maximum of ${this.maxFiles} display images`);
      }
      if (!this.validFileSize(v)) {
        this.errors.push(`Please upload an image below ${this.maxSize} MB`);
      }
    },
    validFileCount(v) {
      return this.images.length + v.length <= this.maxFiles;
    },
    validFileSize(v) {
      return v.every((f) => f.size <= this.maxSize * 1000000);
    },

    async setPrimaryImage() {
      try {
        this.loading = true;

        const res = await this.updateProject({
          id: this.projectId,
          imagePrimary: this.imgToSetPrimary,
        });

        this.loading = false;
        this.setActionSuccess(res.message);
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
    },

    async deleteFile() {
      try {
        this.loading = true;
        const { path } = this.imgToDelete;
        const files = this.images.filter((v) => v.path !== path);

        const fileRef = this.storageRef.child(path);
        await fileRef.delete();
        const res = await this.updateProject({
          id: this.projectId,
          images: files,
        });

        this.loading = false;
        this.setActionSuccess(res.message);
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
    },

    async uploadFile(file, primary) {
      const path = `${uuidv4()}.${file.type.split('/')[1]}`;
      const url = await this.triggerUpload(file, path);

      const files = [...this.images, { url, path }];

      this.updateProject({
        id: this.projectId,
        images: files,
        ...(primary && { imagePrimary: { url, path } }),
      });
    },
    async triggerUpload(file, path) {
      const metadata = { contentType: file.type };

      const fileRef = this.storageRef.child(path);
      const uploadTaskSnapshot = await fileRef.put(file, metadata);

      return uploadTaskSnapshot.ref.getDownloadURL();
    },
  },
};
</script>

<style lang="scss" scoped>
.image-uploader {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.image-uploading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  & > div {
    width: 50%;
  }
}
</style>
