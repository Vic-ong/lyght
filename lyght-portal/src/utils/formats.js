import numeral from 'numeral';
import currencies from '@/constants/finance/currencies.json';

export const isObject = (test) =>
  typeof test === 'object' && test !== null && !Array.isArray(test) && !(test instanceof Date);

export const isArray = (test) => test !== null && Array.isArray(test);

const isWhiteListed = (key) => key === '_id' || key.includes('_trans');

export const toSnake = (str) =>
  isWhiteListed(str) ? str : str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const toCamel = (str) =>
  isWhiteListed(str)
    ? str
    : str.toLowerCase().replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));

const loopObject = (obj, fn) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (isObject(value)) {
      newObj[fn(key)] = loopObject(value, fn);
    } else if (isArray(value)) {
      newObj[fn(key)] = value.map((v) => loopObject(v, fn));
    } else {
      newObj[fn(key)] = value;
    }
  });
  return newObj;
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

export const formatAddress = (address, locale) => {
  if (!address) return '';

  const { address1, address2, district, city, country } = address;
  if (locale === 'zhHant') {
    return `${country}${city}${district}${address1}${address2}`;
  }
  const streetAddr = `${address2}, ${address1}`;
  const cityAddr = district ? `${district}, ${city}` : city;
  return `${streetAddr}, ${cityAddr}, ${country}`;
};

export const formatShortAddress = (address, locale) => {
  if (!address) return '';

  const { district, city, country } = address;
  if (locale === 'zhHant') {
    return `${country}${city}${district}`;
  }
  const cityAddr = district ? `${district}, ${city}` : city;
  return `${cityAddr}, ${country}`;
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
