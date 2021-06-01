const googleLannguagesMap = {
  en: 'en',
  zhHant: 'zh-Hant',
};

export const getGoogleLanguageCode = (lang) => googleLannguagesMap[lang] || 'en';

export const translate = (trans, lang = 'en') => trans[lang];

export const translateObj = (data = {}, lang = 'en') => {
  const keys = Object.keys(data);
  const result = {};
  keys.forEach((key) => {
    const d = data[key];
    if (key.includes('_trans')) {
      result[key] = d;
      result[key.replace('_trans', '')] = translate(d, lang);
    } else if (!!d && d.constructor.name === 'Object') {
      result[key] = translateObj(d, lang);
    } else if (!!d && d.constructor.name === 'Array') {
      result[key] = d.map((v) => translateObj(v, lang));
    } else {
      result[key] = d;
    }
  });
  return result;
};

export const translateGetters = (data, rootState) => {
  const { locale } = rootState;
  return translateObj(data, locale.data);
};

export const getTranslationList = ({ list, locale = 'en', textField = 'name_trans', valueField = 'value' } = {}) =>
  list.map((item) => ({
    text: item[textField][locale],
    value: item[valueField],
  }));
