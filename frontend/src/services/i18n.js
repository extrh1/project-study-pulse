const defaultLanguage = "en";
const translations = {};

const humanizeKey = (key) => {
  const label = key.split(".").pop();
  return label
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
};

export const t = (key, params = {}) => {
  let result = translations[key] || humanizeKey(key);
  Object.keys(params).forEach((param) => {
    result = result.replace(new RegExp(`\{\{${param}\}\}`, "g"), params[param]);
  });
  return result;
};

export const getCurrentLanguage = () => defaultLanguage;
export const setLanguage = async () => defaultLanguage;
export const subscribeI18n = () => () => {};
export const initI18n = async () => {};
export const isI18nInitialized = () => true;
export const getAllTranslations = () => translations;
