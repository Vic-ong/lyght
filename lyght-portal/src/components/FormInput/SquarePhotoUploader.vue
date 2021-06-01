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

    <!-- Image cropper -->
    <v-dialog v-model="dialog" max-width="600">
      <SquareCropper
        :title="cropperTitle"
        :src="fileUrl"
        @close="closeHandler"
        @cropped="croppedHandler"
      ></SquareCropper>
    </v-dialog>
  </div>
</template>

<script>
import { compressAccurately } from 'image-conversion';
import { v4 as uuidv4 } from 'uuid';
import firebase from '@/services/firebase';
import SquareCropper from './SquareCropper.vue';

export default {
  components: {
    SquareCropper,
  },
  props: {
    src: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    cropperTitle: {
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
      dialog: false,
      loading: false,
      upload: 0,
      pictureData: '',
      fileUrl: '',
      croppedPictureData: '',
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
    async previewImage(event) {
      [this.pictureData] = event.target.files;
      if (this.pictureData) {
        const size = this.pictureData.size / 1000000;
        if (size >= 1) {
          compressAccurately(this.pictureData, {
            size: 500,
            accuracy: 0.9,
            type: 'image/jpeg',
            orientation: 1,
          }).then((res) => {
            this.fileUrl = URL.createObjectURL(new Blob([res], { type: 'image/jpeg' }));
            this.dialog = true;
          });
        } else {
          this.fileUrl = URL.createObjectURL(this.pictureData);
          this.dialog = true;
        }
      }
    },
    closeHandler() {
      this.clearFileInput();
      this.dialog = false;
    },
    croppedHandler(blob) {
      this.dialog = false;
      this.croppedPictureData = blob;
      this.onUpload();
    },
    onUpload() {
      this.clearFileInput();
      this.loading = true;

      const data = this.croppedPictureData;

      const path = `${this.imgPath || uuidv4()}.jpeg`;
      const uploadTask = this.storageRef.child(path).put(data);
      uploadTask.on(
        'state_changed',
        // uploading
        (snapshot) => {
          this.upload = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        // upload error
        (err) => {
          this.clearFileInput();
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
