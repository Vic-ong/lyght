<template>
  <v-card class="rounded-xl pa-7">
    <div class="text-subtitle mb-3">Personalization</div>
    <div class="text-subheading primary--text mb-3 mt-5">Color palette</div>
    <v-row align="center">
      <v-col cols="4">
        <dynamic-input :input="settings" :fields="fields" :disabled="loading"></dynamic-input>
      </v-col>
      <v-col cols="8">
        <div class="d-flex px-10">
          <div v-for="color in ['primary', 'secondary', 'accent', 'bg-dark', 'bg-grey', 'bg-light']" v-bind:key="color">
            <v-card height="48" width="48" :color="color" tile flat></v-card>
          </div>
        </div>
      </v-col>
    </v-row>

    <div class="text-subheading primary--text mb-3 mt-8">Navigation bar background</div>
    <v-row>
      <v-col v-for="item in themeBgList" v-bind:key="item" cols="3" sm="2">
        <v-hover v-slot="{ hover }">
          <v-card class="card-hover rounded-lg" :class="{ 'on-hover': hover, 'elevation-8': hover }">
            <v-card v-ripple="false" class="rounded-lg black" @click="loading ? noop : selectThemeBg(item)" flat>
              <v-img height="350" style="opacity: 0.9" :src="item"></v-img>
            </v-card>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import get from 'lodash/get';
import noop from 'lodash/noop';
import { mapActions } from 'vuex';
import firebase from '@/services/firebase';
import { themeColors } from '@/constants/themes';
import v from '@/utils/validations';
import DynamicInput from '@/components/FormInput/DynamicInputLegacy.vue';

export default {
  name: 'Themes',
  components: {
    DynamicInput,
  },
  props: {
    user: { type: Object, required: true },
  },
  data() {
    return {
      loading: false,
      themeBgList: [],
    };
  },
  mounted() {
    this.initialize();
  },
  computed: {
    settings() {
      return get(this.user, 'settings') || {};
    },
    storageRef() {
      return firebase.storage().ref(`public/lyght-admin-arctic`);
    },
    fields() {
      return [
        {
          key: 'theme',
          component: 'v-select',
          cols: 12,
          label: 'Theme color',
          items: this.themes,
          rules: [v.required()],
          onChange: this.selectTheme,
          hideDetails: true,
        },
      ];
    },
    themes() {
      return Object.keys(themeColors);
    },
  },
  methods: {
    ...mapActions('users', ['updateSettings']),

    noop,

    initialize() {
      this.getThemeBgList();
    },
    getThemeBgList() {
      this.storageRef.listAll().then(async (res) => {
        const urls = [];
        await res.items.forEach(async (itemRef) => {
          const url = await itemRef.getDownloadURL();
          urls.push(url);
        });
        this.themeBgList = urls;
      });
    },
    async selectTheme(val) {
      await this.updateSettingsDoc({ theme: val });
      this.$vuetify.theme.themes.light = {
        ...this.$vuetify.theme.themes.light,
        ...themeColors[val],
      };
    },
    async selectThemeBg(item) {
      await this.updateSettingsDoc({ navBarBackground: item });
    },
    async updateSettingsDoc(param) {
      try {
        this.loading = true;
        await this.updateSettings({
          userId: this.user._id,
          ...param,
        });
        this.loading = false;
      } catch (err) {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card.card-hover {
  transition: all 0.4s ease-out;
}
.v-card.card-hover:not(.on-hover) {
  border: 1px solid transparent;
}
.v-card.card-hover.on-hover {
  border: 1px solid var(--v-bg-grey-base);
}
</style>
