import aboutEn from "../../../content/about/en";
import aboutEs from "../../../content/about/es";
import contactEn from "../../../content/contact/en";
import contactEs from "../../../content/contact/es";

const isSpanish = (locale: string) => locale === "es";

export const getProfile = (locale: string) => (isSpanish(locale) ? aboutEs : aboutEn);
export const getContact = (locale: string) => (isSpanish(locale) ? contactEs : contactEn);
