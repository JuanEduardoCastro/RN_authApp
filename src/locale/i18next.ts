import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import es from './es.json';
import { getLocales } from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const resources = {
  en: { translation: en },
  es: { translation: es },
};

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  init: () => {},
  detect: async (callback: (lng: string) => void) => {
    const lngStored = await AsyncStorage.getItem('lng');
    if (lngStored) {
      callback(lngStored);
    } else {
      const locales = getLocales();
      callback(locales[0].languageCode);
    }
  },
  cacheUserLanguaje: async (lng: string) => {
    await AsyncStorage.setItem('lng', lng);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
