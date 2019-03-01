import en from './en'
import i18n from 'i18next'
import nl from './nl'
import { initReactI18next } from 'react-i18next'

const resources = {
  en, nl
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng:           'en',
    fallbackLng:   'en',
    keySeparator:  false,
    interpolation: {
      escapeValue: false
    }
  })
