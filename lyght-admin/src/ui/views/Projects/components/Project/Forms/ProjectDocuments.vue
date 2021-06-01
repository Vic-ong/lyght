<template>
  <div>
    <v-row>
      <v-col v-for="item in uploaders" v-bind:key="item.key" cols="12" md="4">
        <div v-if="getDocument(item.key)">
          <v-card class="rounded-btn">
            <div class="pa-5 text-center">
              <div class="text-subheading mb-2">{{ item.title }}</div>
              <v-icon color="bg-grey" large>mdi-file-pdf-box</v-icon>
              <div class="d-flex justify-center panel-container mt-5">
                <v-hover v-slot="{ hover }">
                  <a :href="getDocument(item.key).url" target="_blank" style="text-decoration: none">
                    <v-btn small rounded depressed class="background mx-1">
                      View
                      <v-icon size="14" :color="hover ? 'accent' : 'bg-light'" class="ml-2">$fi-sr-zoom-in</v-icon>
                    </v-btn>
                  </a>
                </v-hover>
                <v-hover v-slot="{ hover }">
                  <v-btn @click="setDeleteAction(item)" small rounded depressed class="background mx-1">
                    Delete
                    <v-icon small :color="hover ? 'error' : 'bg-light'" class="ml-2">mdi-delete</v-icon>
                  </v-btn>
                </v-hover>
              </div>
            </div>
          </v-card>
        </div>

        <div v-else class="stretch-height">
          <v-card v-if="item.loading" class="image-uploading stretch-height rounded-btn py-10">
            <div class="text-body mb-5">Uploading...</div>
            <v-progress-linear color="secondary" buffer-value="0" class="pl-5 pr-5" stream></v-progress-linear>
          </v-card>
          <v-card v-else class="image-uploader stretch-height rounded-btn py-5">
            <div class="text-subheading">{{ item.title }}</div>
            <file-input
              :ref="`inputRef${item.key}`"
              @click="() => clearErrors(item.key)"
              @on-select="(e) => onSelectKeyFile(e, item.key)"
              :disabled="disabled"
              :fileTypes="fileTypes"
              class="pa-3"
            ></file-input>
            <div v-if="item.error" class="error-description text-body error--text px-2">
              {{ item.error }}
            </div>
          </v-card>
        </div>
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
import FileInput from '@/components/FormInput/FileInput.vue';

export default {
  components: {
    FileInput,
  },
  props: {
    data: { type: Object, default: () => {} },
  },
  mixins: [dialog],
  data() {
    return {
      errors: [],
      maxSize: 5,
      fileTypes: ['application/pdf'],
      uploaders: [
        {
          key: 'fileFactSheet',
          title: 'Fact Sheet',
          loading: false,
          error: null,
        },
        {
          key: 'fileProjectLayout',
          title: 'Project Layout',
          loading: false,
          error: null,
        },
      ],
      disabled: false,
      loading: false,
      fileToDelete: null,
    };
  },
  computed: {
    storageRef() {
      return firebase.storage().ref(`projects/${this.$route.params.id}`);
    },
  },
  methods: {
    ...mapActions('projects', ['updateProject']),
    getDocument(key) {
      return this.data[key];
    },
    clearErrors(key) {
      this.uploaders.find((item) => item.key === key).error = null;
    },
    resetInput(key) {
      const ref = get(this.$refs, `[inputRef${key}][0].$refs.fileInput`);
      ref.value = null;
    },
    validFileSize(v) {
      return v.every((f) => f.size <= this.maxSize * 1000000);
    },

    async onSelectKeyFile(e, key) {
      this.clearErrors(key);
      const uploader = this.uploaders.find((item) => item.key === key);
      const file = e.target.files[0];
      if (file) {
        if (!this.validFileSize([file])) {
          uploader.error = `Please upload a file below ${this.maxSize} MB`;
          this.resetInput(key);
        }
        if (!uploader.error) {
          try {
            uploader.loading = true;
            const path = `${uuidv4()}.${file.type.split('/')[1]}`;
            const url = await this.triggerUpload(file, path);

            await this.updateProject({
              id: this.$route.params.id,
              [key]: { url, path },
            });
            uploader.loading = false;
          } catch (err) {
            uploader.loading = false;
            this.resetInput(key);
          }
        }
      }
    },
    async triggerUpload(file, path) {
      const metadata = { contentType: file.type };

      const fileRef = this.storageRef.child(path);
      const uploadTaskSnapshot = await fileRef.put(file, metadata);

      return uploadTaskSnapshot.ref.getDownloadURL();
    },

    setDeleteAction(item) {
      const { key, title } = item;
      const file = this.getDocument(key);
      this.fileToDelete = { key, file };
      this.setAction({
        name: `Remove ${title} document`,
        handler: this.deleteFile,
      });
    },
    async deleteFile() {
      try {
        this.loading = true;
        const { key, file } = this.fileToDelete;

        const fileRef = this.storageRef.child(file.path);
        await fileRef.delete();
        const res = await this.updateProject({
          id: this.$route.params.id,
          [key]: null,
        });

        this.loading = false;
        this.setActionSuccess(res.message);
      } catch (err) {
        this.loading = false;
        this.setActionError(err);
      }
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
