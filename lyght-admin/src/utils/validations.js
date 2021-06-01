const PASS_MIN_LENGTH = 6;

const required = ({ msg } = {}) => (v) => {
  const err = msg || 'This field is required';
  const hasValue = !!v || v === 0 || v === '0' || v === false;
  return hasValue || err;
};

const number = ({ msg } = {}) => (v) => {
  const err = msg || 'Invalid input';
  return v === 0 || v === '0' || !!Number(v) || err;
};

const email = ({ msg } = {}) => (v) => {
  const err = msg || 'Invalid e-mail';
  return /.+@.+\..+/.test(v) || err;
};

const exactLength = ({ msg, len = 9 } = {}) => (v) => {
  const err = msg || `Must be a length of ${len}`;
  return !v || (v && v.length === len) || err;
};

const maxLength = ({ msg, len = 3 } = {}) => (v) => {
  const err = msg || `Must be less than ${len + 1} characters`;
  return !v || (v && v.length <= len) || err;
};

const minLength = ({ msg, len = 3 } = {}) => (v) => {
  const err = msg || `Must be more than ${len} characters`;
  return !v || (v && v.length > len) || err;
};

const password = ({ msg } = {}) => {
  const err = msg || `Password must be more than ${PASS_MIN_LENGTH} characters`;
  return minLength(err, PASS_MIN_LENGTH);
};

const retypePassword = ({ msg, pass } = {}) => (v) => {
  const err = msg || 'Password does not match';
  return v === pass || err;
};

const money = ({ msg, allowZero = false } = {}) => (v) => {
  const err = msg || 'Invalid currency format';
  if (Number.isNaN(Number(v))) return err;

  const regex = /^[1-9]\d*(?:\.\d{0,2})?$/;
  if (allowZero) {
    return Number(v) === 0 || regex.test(v) || err;
  }
  return regex.test(v) || err;
};

module.exports = {
  required,
  number,
  email,
  exactLength,
  maxLength,
  minLength,
  password,
  retypePassword,
  money,
};
