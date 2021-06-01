const numeral = require('numeral');
const currencies = require('@/constants/currencies.json');

const isObject = (test) => typeof test === 'object' && test !== null && !Array.isArray(test) && !(test instanceof Date);

const isKeyId = (x) => x === '_id';

const toSnake = (str) => (isKeyId(str) ? str : str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`));

const toCamel = (str) =>
  isKeyId(str)
    ? str
    : str.toLowerCase().replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));

const loopObject = (obj, fn) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value && value.constructor.name === 'Timestamp') {
      newObj[fn(key)] = value;
    } else if (isObject(value)) {
      newObj[fn(key)] = loopObject(value, fn);
    } else {
      newObj[fn(key)] = value;
    }
  });
  return newObj;
};

const camelToSnake = (obj) => loopObject(obj, toSnake);

const snakeToCamel = (obj) => loopObject(obj, toCamel);

const formatDisplayVal = (val, config) => {
  const { format, prefix, suffix } = config;
  const prefixVal = prefix ? `${prefix} ` : '';
  const suffixVal = suffix ? ` ${suffix}` : '';
  if (format) {
    return `${prefixVal}${numeral(val).format(format)}${suffixVal}`;
  }
  return `${prefixVal}${val}${suffixVal}`;
};

const getCurrency = (currency) => currencies[currency || 'TWD'];

const formatCurrency = ({ value, currency } = {}) => {
  const c = getCurrency(currency);
  const { symbol_native: symbol, decimal_digits: decimals } = c;

  const decimalFormat = decimals > 0 ? `.${'0'.repeat(decimals)}` : '';
  const format = { format: `0,0${decimalFormat}`, prefix: symbol };
  const display = value ? formatDisplayVal(value, format) : '-';

  return { value, symbol, display };
};

module.exports = {
  toSnake,
  toCamel,
  camelToSnake,
  snakeToCamel,
  formatCurrency,
};
