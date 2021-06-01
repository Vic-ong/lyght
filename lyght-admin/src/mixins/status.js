export default {
  data() {
    return {
      statusText: null,
      statusColor: null,
    };
  },
  methods: {
    setStatusInfo(text, color = 'info') {
      this.statusText = text;
      this.statusColor = color;
    },
    setStatusError(text, color = 'error') {
      this.statusText = text;
      this.statusColor = color;
    },
    clearStatus() {
      this.statusText = null;
      this.statusColor = null;
    },
  },
};
