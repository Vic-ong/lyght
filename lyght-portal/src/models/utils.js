export const uuid = (key = '_id', { optional = false } = {}) => ({
  key,
  type: String,
  optional,
});

export const trans = (key = 'nameTrans', { optional = false } = {}) => ({
  key,
  type: Object,
  optional,
  fields: [
    {
      key: 'en',
      type: String,
    },
    {
      key: 'zhHant',
      type: String,
    },
  ],
});

export const file = (key = 'file', { optional = false } = {}) => ({
  key,
  type: Object,
  optional,
  fields: [
    {
      key: 'path',
      type: String,
    },
    {
      key: 'url',
      type: String,
    },
  ],
});

export const files = (key = 'file', { optional = false } = {}) => ({
  key,
  type: Array,
  optional,
  fields: [
    {
      key: 'path',
      type: String,
    },
    {
      key: 'url',
      type: String,
    },
  ],
});

export const address = (key = 'address', { optional = false } = {}) => ({
  key,
  type: Object,
  optional,
  fields: [
    {
      key: 'address1',
      type: String,
    },
    {
      key: 'address2',
      type: String,
      optional: true,
    },
    {
      key: 'city',
      type: String,
    },
    {
      key: 'district',
      type: String,
      optional: true,
    },
    {
      key: 'postalCode',
      type: String,
    },
    {
      key: 'state',
      type: String,
    },
    {
      key: 'country',
      type: String,
    },
  ],
});

export const currency = (key = 'amount', { optional = false } = {}) => ({
  key,
  type: Object,
  optional,
  fields: [
    {
      key: 'currency',
      type: String,
    },
    {
      key: 'value',
      type: Number,
    },
  ],
});

export const paymentInfo = (key = 'paymentInfo', { optional = false } = {}) => ({
  key,
  type: Object,
  optional,
  fields: [
    {
      key: 'accountName',
      type: String,
    },
    {
      key: 'accountNumber',
      type: String,
    },
    {
      key: 'bankCode',
      type: String,
    },
  ],
});
