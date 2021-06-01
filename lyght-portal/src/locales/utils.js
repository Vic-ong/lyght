const fallbackLocale = 'en';

const localeKeys = {
  en: 'en',
  zh: 'zhHant',
};

const getBrowserLocale = () => {
  const navigatorLocale = navigator.languages !== undefined ? navigator.languages[0] : navigator.language;

  if (!navigatorLocale) return undefined;

  const trimmedLocale = navigatorLocale.trim().split(/-|_/)[0];

  return trimmedLocale;
};

const getInitLocale = () => {
  const localLocale = localStorage.getItem('locale');
  if (localLocale && localLocale !== 'undefined' && localLocale !== 'null') return localLocale;

  const browserLocale = getBrowserLocale();
  const locale = localeKeys[browserLocale] || fallbackLocale;
  localStorage.setItem('locale', locale);
  return locale;
};

export default getInitLocale;
