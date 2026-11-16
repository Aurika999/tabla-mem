import { getLang } from './i18n';

// Paginile publice cerute de Google Play: politica de confidențialitate și ștergerea contului.
// Sunt fișiere statice din public/, deci merg și pe site, și în aplicația de Android.
export function privacyUrl() {
  return `${process.env.PUBLIC_URL}/${getLang() === 'en' ? 'privacy.html' : 'confidentialitate.html'}`;
}

export function deleteAccountUrl() {
  return `${process.env.PUBLIC_URL}/${getLang() === 'en' ? 'delete-account.html' : 'sterge-cont.html'}`;
}
