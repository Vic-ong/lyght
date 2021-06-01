<template>
  <page-container :title="title" :description="description" :isLoading="isLoading" :isError="isError">
    <template #side-header>
      <back-button @click="returnHandler"></back-button>
    </template>

    <template #rendered>
      <user-asset-details :key="$route.fullPath" :data="userAsset.data"></user-asset-details>
    </template>
  </page-container>
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapGetters } from 'vuex';
import { formatAddress } from '@/utils/formats';
import { BackButton } from '@/components/Button';
import { PageContainer } from '@/ui/shared/Layout';
import UserAssetDetails from './components/UserAssetDetails.vue';

export default {
  name: 'UserAssetView',
  components: {
    BackButton,
    PageContainer,
    UserAssetDetails,
  },
  created() {
    const { id } = this.$route.params;
    if (!this.userAsset.data || this.userAsset.data._id !== id) {
      this.getUserAssetDetails(id);
    }
  },
  data() {
    return {
      renderers: ['userAsset'],
    };
  },
  computed: {
    ...mapGetters('projects', ['userAsset']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
    title() {
      return get(this.userAsset, 'data.project.name') || '';
    },
    description() {
      const address = get(this.userAsset, 'data.project.address');
      return address ? formatAddress(address, this.$i18n.locale) : '';
    },
  },
  methods: {
    ...mapActions('projects', ['getUserAssetDetails']),

    returnHandler() {
      this.$router.push({ name: 'my-assets' });
    },
  },
};
</script>
