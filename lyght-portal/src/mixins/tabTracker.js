export default {
  data() {
    return {
      tab: null,
    };
  },
  watch: {
    tab(val) {
      if (val !== Number(this.$route.query.tab)) {
        this.$router.replace({ path: this.$route.path, query: { ...this.$route.query, tab: val } });
      }
    },
  },
  methods: {
    initializeTab() {
      if (this.$route.query.tab) this.tab = Number(this.$route.query.tab);
    },
  },
};
