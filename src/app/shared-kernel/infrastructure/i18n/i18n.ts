import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "@/locales/ru.json";
// import en from "@/locales/en.json";

i18n
  .use(initReactI18next) // передаем экземпляр i18n в react-i18next
  .init({
    resources: {
      ru: ru, // Загружаем наши переводы
      // en: en,
    },
    lng: "ru", // Язык по умолчанию
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false, // React уже защищает от XSS
    },
  });

// eslint-disable-next-line import/no-default-export
export default i18n;
