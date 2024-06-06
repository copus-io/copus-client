import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en/en';
import zh from './zh/zh';

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
