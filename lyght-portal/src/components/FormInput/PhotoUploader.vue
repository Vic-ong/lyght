<template>
  <div style="min-width: 250px">
    <input type="file" ref="uploadphoto" style="display: none" @change="previewImage" :accept="fileTypes" />

    <!-- Photo uploading -->
    <div v-if="loading">
      <div class="picture-uploading">
        <div class="text-body secondary--text mb-5">Uploading ({{ upload }}%)</div>
        <v-progress-linear
          color="secondary"
          buffer-value="0"
          :value="upload"
          class="pl-5 pr-5"
          stream
        ></v-progress-linear>
      </div>
    </div>

    <!-- Click disabled -->
    <div v-else-if="readonly">
      <div class="img-container">
        <v-img :src="src" class="background" width="100vh" aspect-ratio="1.5" contain />
      </div>
    </div>

    <!-- No src -->
    <div v-else-if="!src">
      <div class="placeholder-container" @click="choosePicture()">
        <div class="img-container my-2">
          <v-img :src="placeholder" class="img-preview" width="100vh" aspect-ratio="1.5" contain />
        </div>
        <div class="text-body grey--text">{{ hint }}</div>
      </div>
    </div>

    <!-- Active -->
    <div v-else>
      <div class="img-container">
        <v-img
          @click="choosePicture()"
          :src="src"
          class="img-preview background"
          width="100vh"
          aspect-ratio="1.5"
          contain
        />
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import firebase from '@/services/firebase';

export default {
  props: {
    src: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    bucket: {
      type: String,
      default: '',
    },
    imgPath: {
      type: String,
      default: undefined,
    },
    optimizer: {
      type: Function,
      default: undefined,
    },
    fileTypes: {
      type: Array,
      default: () => ['image/jpeg', 'image/png'],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      upload: 0,
      pictureData: '',
    };
  },
  computed: {
    hint() {
      const files = this.fileTypes.map((f) => f.split('/')[1]);
      return this.$t('Field-UploadFileHint', { types: `(${files.join(', ')})` });
    },
    storageRef() {
      return firebase.storage().ref(this.bucket);
    },
  },
  methods: {
    choosePicture() {
      this.$refs.uploadphoto.click();
    },
    clearFileInput() {
      this.$refs.uploadphoto.value = null;
    },
    previewImage(event) {
      const [file] = event.target.files;
      if (this.optimizer) {
        this.optimizer(file).then((res) => {
          this.pictureData = res;
          this.onUpload();
        });
      } else {
        this.pictureData = file;
        this.onUpload();
      }
    },
    onUpload() {
      this.clearFileInput();
      this.loading = true;

      const path = `${this.imgPath || uuidv4()}.${this.pictureData.type.split('/')[1]}`;
      const uploadTask = this.storageRef.child(path).put(this.pictureData);
      uploadTask.on(
        'state_changed',
        // uploading
        (snapshot) => {
          this.upload = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        // upload error
        (err) => {
          this.pictureUploadDisabled = false;
          this.loading = false;
          console.error(err.message);
        },
        // upload complete
        () => {
          this.pictureUploadDisabled = false;
          this.loading = false;
          this.upload = 100;
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            this.$emit('uploaded', { path, url });
          });
        },
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.placeholder-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  border: 1px solid #bdbdbd;
  border-radius: 5px;
  cursor: pointer;

  .img-container {
    position: relative;
    width: 150px;
    height: 100px;
  }
}
.img-container {
  position: relative;
  width: 300px;
  height: 200px;
}
.picture-uploading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  height: 200px;
  width: 300px;
}
.img-preview {
  cursor: pointer;
}
</style>
