import { useEffect, useState } from 'react';
import {
  addDoc, arrayRemove, arrayUnion, collection, doc, onSnapshot, serverTimestamp, setDoc,
} from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase';

// Siguranța chatului pentru copii: filtru de cuvinte urâte, ascunderea datelor
// personale (telefon, email), blocarea unui jucător și raportarea mesajelor.

// Cuvinte întregi (după ce scoatem diacriticele și literele repetate).
const BAD_WORDS = [
  // română
  'pula', 'pule', 'puli', 'pulii', 'pizda', 'pizde', 'pzd', 'muie', 'mue', 'muist', 'fut', 'futu', 'fute', 'futi',
  'futui', 'futem', 'futut', 'fmm', 'cacat', 'cacatu', 'rahat', 'curva', 'curve', 'curvo', 'tarfa', 'tarfe', 'tarfo',
  'jeg', 'jegos', 'jegosule', 'bou', 'boule', 'prost', 'prostule', 'proasta', 'proasto', 'tampit',
  'tampito', 'tampitule', 'idiot', 'idioto', 'idiotule', 'idioata', 'cretin', 'cretinule', 'cretino', 'dobitoc',
  'dobitocule', 'retardat', 'retardatule', 'retardato', 'handicapat', 'handicapato', 'nenorocit', 'nenorocitule',
  'nenorocito', 'zdreanta', 'zdreanto', 'labagiu', 'labagiule', 'bulangiu', 'bulangiule', 'poponar', 'poponarule',
  'sloboz', 'gaoz', 'gaoaza', 'cur', 'curu', 'tactu', 'dracu', 'urato', 'uratule', 'grasule', 'grasano',
  'grasanule',
  // engleză
  'fuck', 'fucker', 'fucking', 'fck', 'wtf', 'shit', 'shitty', 'bitch', 'ashole', 'dick', 'dickhead', 'pusy',
  'cunt', 'bastard', 'slut', 'whore', 'stupid', 'retard', 'moron', 'dumb', 'loser', 'nigger', 'niga', 'fag',
  'fagot', 'kys', 'damn', 'crap', 'shutup',
];
// Începuturi de cuvânt care sunt urâte în orice formă (ex. „pizdos”, „fuckers”).
const BAD_PREFIXES = ['pizd', 'fuck', 'shit', 'bitch', 'curv', 'labagi', 'bulangi', 'poponar', 'retard', 'muist', 'sloboz', 'cacat', 'tarf', 'jegos'];

// Unele expresii scrise cu cratimă sau separat („mă-ta”, „tac-tu”, „shut up”).
const BAD_PHRASES = [/m[ăa]\s*-\s*ta\b/giu, /tac\s*-\s*tu\b/giu, /shut\s+up/giu, /du-te\s+(dracu|naibii|in\s+m)/giu];

const LEET = {
  0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', '@': 'a', $: 's', '!': 'i',
};

function normalizeWord(word) {
  return word
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[013457@$!]/g, c => LEET[c])
    .replace(/[^a-z]/g, '')
    .replace(/(.)\1+/g, '$1');
}

const BAD_SET = new Set(BAD_WORDS.map(normalizeWord));
const PREFIXES = BAD_PREFIXES.map(normalizeWord);

function isBadWord(word) {
  const w = normalizeWord(word);
  if (!w) return false;
  return BAD_SET.has(w) || PREFIXES.some(p => w.startsWith(p));
}

const STARS = '***';
// Numere de telefon (cel puțin 7 cifre, cu spații, puncte sau cratime între ele) și emailuri.
const PHONE_RE = /\+?\d(?:[\s.-]?\d){6,}/g;
const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/g;

// Textul unui mesaj, curățat: cuvintele urâte devin ***, telefonul și emailul se ascund.
export function cleanText(text) {
  if (!text) return text;
  let out = text.replace(EMAIL_RE, '🔒').replace(PHONE_RE, '🔒');
  BAD_PHRASES.forEach(re => { out = out.replace(re, STARS); });
  // Cuvintele: litere, cifre și semnele folosite ca litere (ex. „f*ck” nu, dar „sh1t” da).
  return out.replace(/[\p{L}\d@$!]+/gu, w => (isBadWord(w) ? STARS : w));
}

// Pentru nume: refuzăm un nume care conține cuvinte urâte.
export function hasBadWords(text) {
  return cleanText(text) !== text;
}

// ---- Blocare ----
// blocks/{uid} = { uids: [...] }: pe cine a blocat jucătorul. Doar el îl poate citi;
// regulile Firestore îl folosesc ca cel blocat să nu-i mai poată scrie sau să-l sune.
const BLOCKS_COLLECTION = 'blocks';

export function useBlockedUids(uid) {
  const [blocked, setBlocked] = useState(() => new Set());
  useEffect(() => {
    setBlocked(new Set());
    if (!firebaseEnabled || !uid) return undefined;
    return onSnapshot(doc(db, BLOCKS_COLLECTION, uid), (snap) => {
      setBlocked(new Set(snap.data()?.uids || []));
    }, (err) => console.error('Nu am putut încărca lista de blocați', err));
  }, [uid]);
  return blocked;
}

export function blockPlayer(uid, otherUid) {
  return setDoc(doc(db, BLOCKS_COLLECTION, uid), { uids: arrayUnion(otherUid) }, { merge: true });
}

export function unblockPlayer(uid, otherUid) {
  return setDoc(doc(db, BLOCKS_COLLECTION, uid), { uids: arrayRemove(otherUid) }, { merge: true });
}

// ---- Raportare ----
// reports: le vede doar administratorul, în consola Firebase.
export const REPORT_REASONS = [
  ['rude', 'Vorbe urâte sau jigniri'],
  ['bully', 'Mă necăjește sau mă amenință'],
  ['personal', 'Îmi cere date personale (adresă, telefon, poze)'],
  ['other', 'Altceva'],
];

export function reportPlayer({ uid, name, reported, chatId, message, reason }) {
  return addDoc(collection(db, 'reports'), {
    reporter: uid,
    reporterName: name || '',
    reported: reported.uid,
    reportedName: reported.name || '',
    chatId: chatId || 'general',
    messageId: message?.id || '',
    messageText: (message?.text || '').slice(0, 300),
    reason,
    createdAt: serverTimestamp(),
    status: 'new',
  });
}

// ---- Acordul părinților pentru chat ----
const CONSENT_KEY = 'tabla-inmultirii:chatConsent';

export function hasChatConsent(player) {
  if (player?.chatConsent) return true;
  try {
    return localStorage.getItem(CONSENT_KEY) === '1';
  } catch {
    return false;
  }
}

export async function saveChatConsent(uid) {
  try {
    localStorage.setItem(CONSENT_KEY, '1');
  } catch {
    // Fără localStorage, acordul rămâne salvat doar în profil.
  }
  if (firebaseEnabled && uid) {
    await setDoc(doc(db, 'players', uid), { chatConsent: true, chatConsentAt: serverTimestamp() }, { merge: true });
  }
}
