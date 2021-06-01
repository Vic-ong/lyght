<template>
  <div class="d-flex justify-center py-10 px-2">
    <v-card class="pa-7 text-center" max-width="900px">
      <div class="text-title">{{ title }}</div>
      <v-tabs v-model="tab" background-color="transparent" class="mt-5">
        <v-tab v-for="item in items" :key="item.value">
          {{ item.text }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in items" :key="item.value">
          <v-card flat class="mt-7 mb-2 text-left">
            <div class="text-hint black--text text-right mb-3">{{ lastUpdatedDisplay(termsContent.lastUpdated) }}</div>
            <div v-for="term in termsContent.data" v-bind:key="term.index" class="mb-7">
              <div class="d-flex">
                <div :style="{ ...indentStyle, ...titleFontStyle }" class="text-subheading">
                  <span v-if="term.title">{{ term.index }}.</span>
                </div>
                <div>
                  <span v-if="term.title" :style="titleFontStyle" class="text-subheading">{{ term.title }}</span>
                  <div :style="indentOffsetStyle" class="mt-3">
                    <div :style="bodyFontStyle" class="text-body black--text mt-3">
                      <div v-if="!Array.isArray(term.description)">{{ term.description }}</div>
                      <div v-else>
                        <div v-for="(desc, i) in term.description" v-bind:key="desc" :class="i > 0 && 'mt-3'">
                          {{ desc }}
                        </div>
                      </div>
                    </div>
                    <clause-section
                      v-if="term.clauses"
                      v-bind:ClauseSection="term.clauses"
                      :clauses="term.clauses"
                      :offset="0"
                      :style="bodyFontStyle"
                    ></clause-section>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import languageList from '@/constants/languageList.json';
import ClauseSection from './ClauseSection.vue';

export default {
  name: 'TermsContainer',
  components: {
    ClauseSection,
  },
  props: {
    terms: {
      type: Object,
      default: () => {},
    },
    titleKey: {
      type: String,
      default: '',
    },
    lastUpdated: {
      type: String,
      default: '',
    },
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      tab: 0,
      items: languageList,
      tabOrder: {
        en: 0,
        zhHant: 1,
      },
    };
  },
  computed: {
    isXs() {
      return this.$vuetify.breakpoint.xs;
    },
    indentStyle() {
      return {
        minWidth: this.isXs ? '20px' : '28px',
      };
    },
    indentOffsetStyle() {
      return {
        marginLeft: this.isXs ? '-20px' : 'unset',
      };
    },
    termsContent() {
      return this.terms[this.tab];
    },
    title() {
      return this.t(this.titleKey);
    },
    titleFontStyle() {
      return {
        fontSize: `${this.tab === 1 ? '19px' : '18px'} !important`,
      };
    },
    bodyFontStyle() {
      return {
        fontSize: `${this.tab === 1 ? '15px' : '14px'} !important`,
      };
    },
  },
  methods: {
    init() {
      this.tab = this.tabOrder[this.$i18n.locale];
    },
    t(key) {
      if (!this.tab || !languageList[this.tab]) return this.$i18n.messages.en[key];
      return this.$i18n.messages[languageList[this.tab].value][key];
    },
    dateDisplay(date) {
      if (this.tab === 1) return date;
      return dayjs(date).format('DD MMM YYYY');
    },
    lastUpdatedDisplay(date) {
      return `${this.t('LastUpdated')}: ${this.dateDisplay(date)}`;
    },
  },
};
</script>
