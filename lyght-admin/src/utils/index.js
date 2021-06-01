import { getCurrency } from './formats';

export const round = (v, decimals = 0) => {
  const factor = 10 ** decimals;
  return Math.round((v + Number.EPSILON) * factor) / factor;
};

export const roundCurrency = (v, currency) => {
  const c = getCurrency(currency);
  const vNumber = Number(v) || 0;
  return round(vNumber, c.decimal_digits);
};

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
};

export const getTranslationList = (list, textField = 'name_trans', valueField = 'value') =>
  list.map((item) => ({
    text: item[textField].en,
    value: item[valueField],
  }));
