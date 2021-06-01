<template>
  <page-container :title="$t('Route-UserAssets-Title')" :isLoading="isLoading" :isError="isError">
    <template #rendered>
      <div v-if="hasData(userAssets)">
        <user-asset-list :data="userAssets.data" :keys="keys"></user-asset-list>
      </div>

      <div v-else>
        <v-card class="d-flex justify-center align-center text-center background" min-height="300" flat>
          <v-card class="transparent" flat>
            <v-card-text>
              <div class="text-body black--text py-3">{{ $t('UserAsset-NoRecord') }}</div>
              <div class="text-subheading black--text">{{ $t('UserAsset-StartParticipating') }}</div>
            </v-card-text>

            <v-card-actions class="justify-center">
              <lyght-button @click="$router.push({ name: 'projects' })">{{ $t('Button-ViewProjects') }}</lyght-button>
            </v-card-actions>
          </v-card>
        </v-card>
      </div>
    </template>
  </page-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { PageContainer } from '@/ui/shared/Layout';
import UserAssetList from './components/UserAssetList.vue';

export default {
  name: 'UserAssets',
  components: {
    PageContainer,
    UserAssetList,
  },
  created() {
    if (!this.userAssets.data) this.getUserAssets(this.userId.data);
  },
  data() {
    return {
      renderers: ['userAssets'],
      keys: [
        {
          key: 'projectGroup.ppaContractStartDate',
          textKey: 'Field-FarmEstablishmentDate',
        },
        {
          key: 'estimatedIrr',
          textKey: 'Field-EstimatedIrr',
          format: '0.00%',
        },
        {
          key: 'projectGroup.capacity',
          textKey: 'Field-FarmCapacity',
          suffix: 'kW',
        },
        {
          key: 'panelsTotal',
          textKey: 'Field-TotalPanels',
        },
      ],
    };
  },
  computed: {
    ...mapGetters('users', ['userId']),
    ...mapGetters('projects', ['userAssets']),

    isLoading() {
      return this.renderers.some((r) => this[r].loading);
    },
    isError() {
      return this.renderers.some((r) => this[r].error);
    },
  },
  methods: {
    ...mapActions('projects', ['getUserAssets']),

    hasData(state) {
      return state.data && state.data.length > 0;
    },
  },
};
</script>
