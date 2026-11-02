// Traducerea interfeței: româna e limba de bază, engleza vine din dicționarul i18n.en.js.
// tr('Text în română') întoarce textul în limba aleasă; {nume} se înlocuiește cu vars.nume.
import { useSyncExternalStore } from 'react';
import EN from './i18n.en';

const STORAGE_KEY = 'tabla-inmultirii:lang';
export const LANGUAGES = [
  { code: 'ro', flag: '🇷🇴', short: 'RO', name: 'Română' },
  { code: 'en', flag: '🇬🇧', short: 'EN', name: 'English' },
];

function readLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'ro' || saved === 'en') return saved;
  } catch {
    // Fără localStorage rămânem pe română.
  }
  return 'ro';
}

let lang = readLang();
if (typeof document !== 'undefined') document.documentElement.lang = lang;
// Textele care sunt deja traducerea unei chei (ca tr(tr(x)) să nu strice nimic).
const EN_VALUES = new Set(Object.values(EN));
const listeners = new Set();
// În dezvoltare: textele care nu au încă traducere, ca să le putem completa.
const missing = new Set();
if (typeof window !== 'undefined') window.__missingTr = missing;

export function getLang() {
  return lang;
}

export function setLang(next) {
  lang = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Alegerea ține doar până la reîncărcarea paginii.
  }
  if (typeof document !== 'undefined') document.documentElement.lang = next;
  listeners.forEach(listener => listener());
}

// Componenta de sus folosește acest hook; la schimbarea limbii se redesenează toată aplicația.
export function useLang() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => lang,
  );
}

// Dicționarul invers (engleză → română), pentru textele generate înainte de schimbarea limbii.
const RO = {};
for (const [ro, en] of Object.entries(EN)) if (RO[en] === undefined) RO[en] = ro;
const DICTS = { en: EN, ro: RO };

// Un exercițiu generat într-o limbă are deja numerele puse în șablon („Află câtul: 12 : 3 = ?”).
// Dacă limba se schimbă între timp, recunoaștem șablonul după textul fix și îl refacem în cealaltă limbă.
const templates = {};
function templatesFor(target) {
  if (templates[target]) return templates[target];
  const dict = DICTS[target];
  const list = [];
  for (const [src, dst] of Object.entries(dict)) {
    if (!src.includes('{')) continue;
    const literal = src.replace(/\{\w+\}/g, '');
    const letters = literal.replace(/[^A-Za-zăâîșțĂÂÎȘȚ]/g, '').length;
    if (letters < 3) continue;
    const names = [];
    const body = src.split(/(\{\w+\})/).map(part => {
      const m = part.match(/^\{(\w+)\}$/);
      if (m) { names.push(m[1]); return '(.+?)'; }
      return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('');
    list.push({ full: new RegExp(`^${body}$`), prefix: /\{\w+\}$/.test(src) || letters < 6 ? null : new RegExp(`^${body}`), names, dst, weight: literal.length });
  }
  list.sort((a, b) => b.weight - a.weight);
  templates[target] = list;
  return list;
}

function convertValue(value, dict) {
  if (dict[value] !== undefined) return dict[value];
  // „21 de bomboane”: numărul a prins doar „21”, iar „de” a rămas lângă cuvânt.
  if (dict === EN && value.startsWith('de ') && dict[value.slice(3)] !== undefined) return dict[value.slice(3)];
  if (dict === EN && /^\d+ de$/.test(value)) return value.slice(0, -3);
  // „20 de păpădii” / „20 dandelions”
  const m = value.match(/^(\d+)(?: de)? (.+)$/);
  if (m && dict[m[2]] !== undefined) return `${m[1]} ${dict[m[2]]}`;
  return value;
}

function fill(t, match, dict) {
  const vals = {};
  for (let i = 0; i < t.names.length; i++) {
    const value = convertValue(match[i + 1], dict);
    // O bucată de propoziție rămasă netradusă înseamnă că șablonul nu e cel potrivit.
    if (value === match[i + 1] && /[A-Za-zăâîșț]{2,}\S*\s+\S*[A-Za-zăâîșț]{2,}/.test(value)) return null;
    vals[t.names[i]] = value;
  }
  return t.dst.replace(/\{(\w+)\}/g, (all, key) => (vals[key] !== undefined ? vals[key] : all));
}

const converted = { en: new Map(), ro: new Map() };
function convertFilled(text, target, depth = 0) {
  const dict = DICTS[target];
  if (dict[text] !== undefined) return dict[text];
  if (depth > 0 && !/[A-Za-zăâîșțĂÂÎȘȚ]/.test(text)) return text;
  if (depth === 0 && converted[target].has(text)) return converted[target].get(text);
  let result = null;
  for (const t of templatesFor(target)) {
    const m = text.match(t.full);
    if (m) { result = fill(t, m, dict); if (result !== null) break; }
  }
  // Textul poate fi lipit din mai multe bucăți: traducem bucată cu bucată.
  if (result === null && depth < 4) {
    // Un calcul la început („4 × 3 = 12, 4 + 3 = 7. Ca să obținem…”): îl păstrăm și traducem restul.
    const lead = text.match(/^[^A-Za-zăâîșțĂÂÎȘȚ]+[.!?] (?=[A-ZĂÂÎȘȚ])/);
    if (lead) {
      const rest = convertFilled(text.slice(lead[0].length), target, depth + 1);
      if (rest !== null) result = lead[0] + rest;
    }
  }
  if (result === null) {
    // Doar numere, semne și cuvinte din dicționar („32 : 8 = 4 cutiuțe.”).
    const parts = text.split(/([A-Za-zăâîșțĂÂÎȘȚ][A-Za-zăâîșțĂÂÎȘȚ-]*)/);
    const words = parts.filter((part, i) => i % 2 === 1);
    if (words.length && words.length <= 3 && words.every(w => dict[w] !== undefined)) {
      result = parts.map((part, i) => (i % 2 === 1 ? dict[part] : part)).join('');
    }
  }
  if (result === null && depth < 4) {
    for (const t of templatesFor(target)) {
      if (!t.prefix) continue;
      const m = text.match(t.prefix);
      if (!m || m[0].length === text.length) continue;
      const head = fill(t, m, dict);
      if (head === null) continue;
      const rest = convertFilled(text.slice(m[0].length), target, depth + 1);
      if (rest !== null) { result = head + rest; break; }
    }
    if (result === null) {
      for (const [src, dst] of Object.entries(dict)) {
        if (src.length < 8 || src.includes('{') || !text.startsWith(src)) continue;
        const rest = convertFilled(text.slice(src.length), target, depth + 1);
        if (rest !== null) { result = dst + rest; break; }
      }
    }
  }
  // În română, de la 20 în sus spunem „21 de bomboane”.
  if (depth === 0 && result !== null && target === 'ro') result = addDe(result);
  if (depth === 0) converted[target].set(text, result);
  return result;
}

const NOT_NOUNS = /^(și|sau|iar|dar|mai|cu|la|pe|în|din|apoi|deci|este|sunt|pentru|de|kg|cm|unei|unui|unor|lui|ei|lor)\b/;
function addDe(text) {
  return text.replace(/(\d+) (?=([a-zăâîșț]{3,}))/g, (all, num, word, offset, whole) => {
    const n = Number(num) % 100;
    const before = whole.slice(Math.max(0, offset - 1), offset);
    if (/[\d:×+−-]/.test(before) || NOT_NOUNS.test(whole.slice(offset + all.length))) return all;
    return (n === 0 && Number(num) > 0) || n >= 20 ? `${num} de ` : all;
  });
}

export function tr(text, vars) {
  let out = text;
  if (typeof text === 'string' && !vars && EN[text] === undefined && /[A-Za-zăâîșțĂÂÎȘȚ]{3}/.test(text)) {
    if (lang === 'en' && !EN_VALUES.has(text)) {
      const conv = convertFilled(text, 'en');
      if (conv !== null) return conv;
      if (process.env.NODE_ENV !== 'production') missing.add(text);
    } else if (lang === 'ro') {
      // Text englezesc rămas de dinainte de schimbarea limbii.
      const conv = convertFilled(text, 'ro');
      if (conv !== null) return conv;
    }
  }
  if (lang === 'en' && typeof text === 'string' && EN[text] !== undefined) out = EN[text];
  if (vars) {
    out = out.replace(/\{(\w+)\}/g, (match, key) => {
      const value = vars[key];
      if (value === undefined) return match;
      // Cuvintele din liste („mere”, „baloane”) se traduc și ele, dacă sunt în dicționar.
      return lang === 'en' && typeof value === 'string' && EN[value] !== undefined ? EN[value] : value;
    });
  }
  return out;
}
