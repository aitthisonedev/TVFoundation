import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import lo from './locales/lo.json'

// Get the stored language or default to 'en'
const savedLocale = localStorage.getItem('locale') || 'lo'

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'lo',
  messages: {
    en,
    lo
  }
})

// Helper function to set language
export const setI18nLanguage = (locale) => {
  localStorage.setItem('locale', locale)
  i18n.global.locale.value = locale
  document.querySelector('html').setAttribute('lang', locale)
  return locale
}

// Set initial language
setI18nLanguage(savedLocale)

export default i18n