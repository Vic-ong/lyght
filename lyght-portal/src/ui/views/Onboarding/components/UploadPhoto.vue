<template>
  <div>
    <input type="file" ref="uploadphoto" style="display: none" @change="previewImage" accept="image/*" />
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
    <div v-else-if="!src">
      <div class="placeholder-container" @click="choosePicture()">
        <div class="img-container">
          <v-img :src="placeholder" class="cursor-pointer" width="100vh" aspect-ratio="1.5" contain />
        </div>
        <div class="text-body grey--text">{{ placeholderImgText }}</div>
      </div>
    </div>
    <div v-else>
      <div class="img-container">
        <v-img @click="choosePicture()" :src="src" class="cursor-pointer" width="100vh" aspect-ratio="1.5" contain />
      </div>
    </div>
  </div>
</template>

<script>
import firebase from '@/services/firebase';

export default {
  props: {
    imgKey: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    src: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '',
    },
    bucket: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      upload: 0,
      placeholderImgText: 'Click to upload file (.jpg, .png)',
      pictureData: '',
    };
  },
  computed: {
    storageRef() {
      return firebase.storage().ref(this.bucket);
    },
  },
  methods: {
    choosePicture() {
      this.$refs.uploadphoto.click();
    },
    previewImage(event) {
      [this.pictureData] = event.target.files;
      this.onUpload();
    },
    onUpload() {
      this.loading = true;

      const uploadTask = this.storageRef.child(this.path).put(this.pictureData);
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
            this.$emit('uploaded', { key: this.imgKey, url });
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
</style>
