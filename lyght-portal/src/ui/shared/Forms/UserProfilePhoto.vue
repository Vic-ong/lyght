<template>
  <div>
    <div v-if="!mini" class="py-5">
      <div class="d-flex justify-center">
        <div :style="`width: ${size}px; height: ${size}px`">
          <v-img
            @click="dialog = true"
            aspect-ratio="1"
            :src="userInfo.photoUrl || photoPlaceholder"
            alt="Profile Photo"
            class="elevation-3 cursor-pointer"
            :style="`border-radius: ${size / 2}px`"
          ></v-img>
        </div>
      </div>
      <div v-if="userInfo.displayName" class="text-subheading text-center mt-3">{{ userInfo.displayName }}</div>
    </div>
    <div v-else class="d-flex justify-center py-3">
      <div :style="`width: ${size / 2}px; height: ${size / 2}px`">
        <v-img
          aspect-ratio="1"
          :src="userInfo.photoUrl || photoPlaceholder"
          alt="Profile Photo"
          class="elevation-3"
          :style="`border-radius: ${size / 4}px`"
        ></v-img>
      </div>
    </div>

    <v-dialog v-model="dialog" max-width="400" persistent>
      <v-card class="text-center">
        <v-card-actions class="justify-end">
          <v-btn @click="dialog = false" icon><v-icon>mdi-close</v-icon></v-btn>
        </v-card-actions>

        <div class="px-5">
          <div class="text-title">{{ $t('Account-ProfilePhotoTitle') }}</div>
          <div class="d-flex justify-center py-5">
            <square-photo-uploader
              v-if="$vuetify.breakpoint.mdAndUp"
              @uploaded="fileUploadedHandler"
              :src="userInfo.photoUrl"
              :placeholder="photoPlaceholder"
              :cropperTitle="$t('Account-ProfilePhotoTitle')"
              :bucket="storageBucket"
              :imgPath="imgPath"
            ></square-photo-uploader>
            <photo-uploader
              v-else
              @uploaded="fileUploadedHandler"
              :src="userInfo.photoUrl"
              :placeholder="photoPlaceholder"
              :cropperTitle="$t('Account-ProfilePhotoTitle')"
              :bucket="storageBucket"
              :imgPath="imgPath"
              :optimizer="profileImgOptimizer"
            ></photo-uploader>
          </div>
          <div class="text-hint grey--text">{{ $t('Account-ProfilePhotoHint') }}</div>
        </div>

        <v-card-actions class="justify-center">
          <status-info :color="statusColor">{{ statusText }}</status-info>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import get from 'lodash/get';
import { mapActions } from 'vuex';
import status from '@/mixins/status';
import { profileImgOptimizer } from '@/ui/shared/Forms/utils';
import placeholderProfile from '@/assets/placeholders/placeholder_profile.png';
import { PhotoUploader, SquarePhotoUploader } from '@/components/FormInput';

export default {
  components: {
    PhotoUploader,
    SquarePhotoUploader,
  },
  mixins: [status],
  props: {
    data: { type: Object, default: () => {} },
    mini: { type: Boolean, default: false },
    size: { type: Number, default: 70 },
  },
  data() {
    return {
      dialog: false,
      imgPath: 'profile_photo',
    };
  },
  computed: {
    userId() {
      return this.data._id;
    },
    storageBucket() {
      return `users/${this.userId}/identity`;
    },
    photoPlaceholder() {
      return placeholderProfile;
    },
    userInfo() {
      return {
        photoUrl: get(this.data, 'profilePhoto.url'),
        displayName: get(this.data, 'displayName'),
      };
    },
  },
  methods: {
    ...mapActions('users', {
      updateUser: 'updateUser',
    }),
    profileImgOptimizer,
    async fileUploadedHandler(data) {
      try {
        this.clearStatus();
        await this.updateUser({
          id: this.userId,
          profilePhoto: data,
        });
      } catch (err) {
        this.setStatusError(this.$t('Status-InternalError'));
      }
    },
  },
};
</script>
