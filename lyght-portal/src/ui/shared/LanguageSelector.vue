<template>
  <div style="max-width: 180px">
    <v-select
      v-if="!$vuetify.breakpoint.xs"
      @change="changeLanguage"
      v-model="input"
      :items="languageList"
      :loading="loading"
      :disabled="loading"
      prepend-inner-icon="mdi-translate"
      filled
      dense
      hide-details
    ></v-select>
    <div v-else>
      <v-btn @click="dialog = !dialog" icon>
        <v-icon small>mdi-translate</v-icon>
      </v-btn>
      <v-dialog v-model="dialog">
        <v-card class="pa-5">
          <div class="text-subheading mb-3">{{ $t('SelectLanguage') }}</div>
          <v-select
            @change="changeLanguageMobile"
            v-model="input"
            :items="languageList"
            :loading="loading"
            :disabled="loading"
            prepend-inner-icon="mdi-translate"
            filled
            dense
            hide-details
          ></v-select>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
import { mapGetters, mapActions } from 'vuex';
import firebase from '@/services/firebase';
import languageList from '@/constants/languageList.json';
import { getGoogleLanguageCode } from '@/utils/locale';

export default {
  mounted() {
    this.init();
  },
  data() {
    return {
      input: null,
      languageList,
      dialog: false,
      loading: false,
    };
  },
  computed: {
    ...mapGetters('users', {
      user: 'user',
    }),
    userAuth() {
      return firebase.auth().currentUser;
    },
    userId() {
      return this.userAuth.uid;
    },
  },
  methods: {
    ...mapActions('users', {
      updateUser: 'updateUser',
    }),
    init() {
      const localLocale = localStorage.getItem('locale');
      const userLocale = get(this.user, 'data.language');

      if (userLocale && localLocale && localLocale !== userLocale) {
        this.$i18n.locale = userLocale;
        localStorage.setItem('locale', userLocale);
        this.$store.dispatch('setLocale', userLocale);
      } else {
        this.$store.dispatch('setLocale', this.$i18n.locale);
      }
      this.input = this.$i18n.locale;
    },
    async changeLanguage() {
      try {
        this.loading = true;
        this.$i18n.locale = this.input;
        this.$vuetify.lang.current = this.input;

        this.$store.dispatch('setLocale', this.input);
        firebase.auth().languageCode = getGoogleLanguageCode(this.input);
        localStorage.setItem('locale', this.input);

        if (this.user.data) {
          await this.updateUser({
            id: this.userId,
            language: this.input,
          });
        }
        this.loading = false;
      } catch (err) {
        this.loading = false;
        console.error(err);
      }
    },
    changeLanguageMobile() {
      this.changeLanguage();
      this.dialog = false;
    },
  },
};
</script>
