import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import React, { FC, createContext } from 'react';
import { initReactI18next, useTranslation } from 'react-i18next';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
  });

export const LanguageContext = createContext<string | null>(null);

export const LanguageProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    i18n: { language },
  } = useTranslation();
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>;
};

export default i18n;
