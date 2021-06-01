<template>
  <v-row dense>
    <v-col cols="6" class="text-center">
      <div class="text-body">Created On</div>
      <div class="text-hint grey--text">
        {{ createdAt }}
        <router-link v-if="createdBy" :to="{ name: 'users/:id', params: { id: createdBy._id } }" target="_blank">
          ({{ createdBy.name }})
        </router-link>
      </div>
    </v-col>

    <v-col cols="6" class="text-center">
      <div class="text-body">Last Updated</div>
      <div class="text-hint grey--text">
        {{ updatedAt }}
        <router-link v-if="updatedBy" :to="{ name: 'users/:id', params: { id: updatedBy._id } }" target="_blank">
          ({{ updatedBy.name }})
        </router-link>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import get from 'lodash/get';
import { formatTimestamp } from '@/utils/date';

export default {
  name: 'RecordTimestamps',
  props: {
    data: { type: Object },
  },
  computed: {
    createdAt() {
      const timestamp = get(this.data, 'createdAt');
      return formatTimestamp(timestamp);
    },
    createdBy() {
      return get(this.data, 'createdBy');
    },
    updatedAt() {
      const timestamp = get(this.data, 'updatedAt');
      return formatTimestamp(timestamp);
    },
    updatedBy() {
      return get(this.data, 'updatedBy');
    },
  },
};
</script>
