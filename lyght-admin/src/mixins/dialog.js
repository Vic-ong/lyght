import noop from 'lodash/noop';

export default {
  data() {
    return {
      dialogProps: {
        show: false,
        text: null,
        status: null,
        action: noop,
      },
    };
  },
  methods: {
    setAction(action = {}) {
      const { name, handler } = action;
      this.dialogProps = {
        show: true,
        text: name,
        status: null,
        action: handler,
      };
    },
    setActionSuccess(msg = 'Job complete.') {
      this.dialogProps = {
        show: true,
        text: msg,
        status: 'success',
        action: noop,
      };
    },
    setActionError(err = 'Internal error! Please check the error logs.') {
      this.dialogProps = {
        show: true,
        text: err,
        status: 'error',
        action: noop,
      };
    },
    clearDialog() {
      this.dialogProps = {
        show: false,
        text: null,
        status: null,
        action: noop,
      };
    },
  },
};
