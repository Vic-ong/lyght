const PASS_MIN_LENGTH = 6;

const required = (translate, { msg } = {}) => (v) => {
  const err = msg || translate('Status-FieldRequired');
  return !!v || err;
};

const number = (translate, { msg } = {}) => (v) => {
  const err = msg || translate('Status-InvalidInput');
  return /^\d+$/.test(v) || err;
};

const email = (translate, { msg } = {}) => (v) => {
  const err = msg || translate('Status-InvalidEmail');
  return /.+@.+\..+/.test(v) || err;
};

const exactLength = (translate, { msg, len } = { len: 9 }) => (v) => {
  const err = msg || translate('Status-ExactLength', { len });
  return (v && v.length === len) || err;
};

const maxLength = (translate, { msg, len } = { len: 3 }) => (v) => {
  const err = msg || translate('Status-MaxLength', { len });
  return (v && v.length < len) || err;
};

const minLength = (translate, { msg, len } = { len: 3 }) => (v) => {
  const err = msg || translate('Status-MinLength', { len });
  return (v && v.length > len) || err;
};

const phoneNumber = (translate, { msg } = {}) => (v) => {
  const err = msg || translate('Status-InvalidPhoneNumber');
  return (v && /^\d+$/.test(v) && v.length > 6 && v.length < 13) || err;
};

const password = (translate, { msg } = {}) => {
  const err = msg || translate('Status-PasswordMinLength', { len: PASS_MIN_LENGTH });
  return minLength(err, PASS_MIN_LENGTH);
};

const retypePassword = (translate, { msg, pass } = {}) => (v) => {
  const err = msg || translate('Status-PasswordMismatch');
  return v === pass || err;
};

module.exports = {
  required,
  number,
  email,
  exactLength,
  maxLength,
  minLength,
  phoneNumber,
  password,
  retypePassword,
};
