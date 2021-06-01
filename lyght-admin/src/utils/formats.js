import numeral from 'numeral';
import currencies from '@/constants/finance/currencies.json';

export const isObject = (test) =>
  typeof test === 'object' && test !== null && !Array.isArray(test) && !(test instanceof Date);

export const isArray = (test) => test !== null && Array.isArray(test);

const isKeyId = (x) => x === '_id';

const loopObject = (obj, fn) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (isObject(value) && !value._) {
      newObj[fn(key)] = loopObject(value, fn);
    } else if (isArray(value)) {
      newObj[fn(key)] = value.map((v) => loopObject(v, fn));
    } else {
      newObj[fn(key)] = value;
    }
  });
  return newObj;
};

export const toSnake = (str) => {
  if (isKeyId(str)) return str;
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export const toCamel = (str) => {
  if (isKeyId(str)) return str;
  return str.toLowerCase().replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
};

export const camelToSnake = (obj) => loopObject(obj, toSnake);

export const snakeToCamel = (obj) => loopObject(obj, toCamel);

export const formatDisplayVal = (val, config) => {
  const { format, prefix, suffix } = config;
  const prefixVal = prefix ? `${prefix} ` : '';
  const suffixVal = suffix ? ` ${suffix}` : '';
  if (format) {
    return `${prefixVal}${numeral(val).format(format)}${suffixVal}`;
  }
  return `${prefixVal}${val}${suffixVal}`;
};

export const getCurrency = (currency) => currencies[currency || 'TWD'];

export const formatCurrency = ({ currency, value } = {}) => {
  const c = getCurrency(currency);
  const { symbol_native: symbol, decimal_digits: decimals } = c;

  const decimalFormat = decimals > 0 ? `.${'0'.repeat(decimals)}` : '';
  const format = { format: `0,0${decimalFormat}`, prefix: symbol };
  const display = value ? formatDisplayVal(value, format) : '-';

  return {
    value,
    symbol,
    display,
  };
};

export const formatBankNumber = (data) => (data ? data.replace(/\d{4}(?=.)/g, '$& ') : data);
