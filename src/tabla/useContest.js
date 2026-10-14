import { useEffect, useState } from 'react';
import {
  collection, deleteField, doc, onSnapshot, query, runTransaction, serverTimestamp, setDoc, updateDoc, where,
} from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase';
import { freshQuestion } from './useTablaGame';
import {
  LEVELS, PROBLEME_LEVEL, AVANSATE_LEVEL, LOGIC_LEVELS, FIVE_LEVELS, SIX_LEVELS, SEVEN_LEVELS,
  EIGHT_LEVELS, NINE_LEVELS, FOUR_LEVELS, THREE_LEVELS, TWO_LEVELS, DIVISION_LEVELS, HALF_LEVELS, THIRD_LEVELS, QUARTER_LEVELS, FIFTH_LEVELS, DIV6_LEVELS, DIV7_LEVELS, DIV8_LEVELS, DIV9_LEVELS,
} from './data';

const CONTESTS_COLLECTION = 'contests';

export const MAX_PLAYERS = 10;
export const MAX_TITLE_LENGTH = 40;
export const MIN_PLAYERS = 2;
export const CONTEST_QUESTIONS = 10;
export const QUESTION_SECONDS = 35;
export const COUNTDOWN_SECONDS = 3;
// Premii adăugate la punctajul total din clasament.
export const PRIZE_POINTS = [50, 30, 10];
// Un concurs care așteaptă de mai mult de atât nu mai apare în listă.
const OPEN_CONTEST_MAX_AGE_MS = 15 * 60 * 1000;
// Timp de rezervă după ultima întrebare, pentru cei cu internet mai lent.
const FINISH_GRACE_MS = 10000;

// Întrebări din toate nivelurile, de la ușor la greu.
const MIX_LEVELS = [1, 2, 3, 3, 4, 4, 5, 5, PROBLEME_LEVEL, AVANSATE_LEVEL];

// Concursurile se fac pe niveluri; „mix” = întrebări din toate nivelurile.
export const MIX_LEVEL = 'mix';
export const CONTEST_LEVEL_GROUPS = [
  { icon: '🧩', title: 'Insula Isteților', levels: [MIX_LEVEL, ...LOGIC_LEVELS] },
  { icon: '🛷', title: 'Înmulțirea cu 2', levels: TWO_LEVELS },
  { icon: '⛄', title: 'Înmulțirea cu 3', levels: THREE_LEVELS },
  { icon: '🐻‍❄️', title: 'Înmulțirea cu 4', levels: FOUR_LEVELS },
  { icon: '🖐️', title: 'Înmulțirea cu 5', levels: FIVE_LEVELS },
  { icon: '🔋', title: 'Înmulțirea cu 6', levels: SIX_LEVELS },
  { icon: '🪙', title: 'Înmulțirea cu 7', levels: SEVEN_LEVELS },
  { icon: '🐙', title: 'Înmulțirea cu 8', levels: EIGHT_LEVELS },
  { icon: '🎈', title: 'Înmulțirea cu 9', levels: NINE_LEVELS },
  { icon: '➗', title: 'Împărțirea', levels: DIVISION_LEVELS },
  { icon: '✌️', title: 'Împărțirea la 2', levels: HALF_LEVELS },
  { icon: '🐦', title: 'Împărțirea la 3', levels: THIRD_LEVELS },
  { icon: '🍀', title: 'Împărțirea la 4', levels: QUARTER_LEVELS },
  { icon: '🏮', title: 'Împărțirea la 5', levels: FIFTH_LEVELS },
  { icon: '🍬', title: 'Împărțirea la 6', levels: DIV6_LEVELS },
  { icon: '📅', title: 'Împărțirea la 7', levels: DIV7_LEVELS },
  { icon: '🐙', title: 'Împărțirea la 8', levels: DIV8_LEVELS },
  { icon: '🎯', title: 'Împărțirea la 9', levels: DIV9_LEVELS },
];

// Insula (grupul din cuprins) în care se află un nivel.
export function contestGroupOf(level) {
  return CONTEST_LEVEL_GROUPS.find(g => g.levels.some(l => String(l) === String(level))) || CONTEST_LEVEL_GROUPS[0];
}

export function contestLevelLabel(level) {
  if (!level || level === MIX_LEVEL) return '🎲 AMESTEC';
  return LEVELS[level]?.label || String(level);
}

// Concursurile vechi n-au câmpul `level`: au fost cu întrebări amestecate.
export function contestLevelOf(contest) {
  return contest?.level ?? MIX_LEVEL;
}

function questionsFor(level) {
  // Fără întrebări repetate în același concurs și fără probleme pe pași
  // (concursul arată o singură întrebare cu un singur răspuns).
  const used = new Set();
  const oneStep = l => {
    let q = freshQuestion(l, used);
    for (let i = 0; i < 30 && q.steps; i += 1) q = freshQuestion(l, used);
    return q;
  };
  if (level === MIX_LEVEL) return MIX_LEVELS.map(oneStep);
  return Array.from({ length: CONTEST_QUESTIONS }, () => oneStep(level));
}

export function contestDeadline(contest, seenRunningAt) {
  const startedAt = contest?.startedAt?.toMillis() ?? seenRunningAt;
  if (!startedAt) return null;
  return startedAt + (COUNTDOWN_SECONDS + CONTEST_QUESTIONS * QUESTION_SECONDS) * 1000 + FINISH_GRACE_MS;
}

// Corecte descrescător, apoi timp crescător.
export function rankResults(results) {
  return [...results].sort((a, b) => (b.correct - a.correct) || (a.timeMs - b.timeMs));
}

// Concursurile vechi (dinainte de nume) primesc un nume implicit.
export function contestTitle(contest) {
  return contest?.title || `Concursul lui ${contest?.hostName || 'cuiva'}`;
}

function contestRef(contestId) {
  return doc(db, CONTESTS_COLLECTION, contestId);
}

export function useOpenContests() {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    if (!firebaseEnabled) return undefined;
    const q = query(collection(db, CONTESTS_COLLECTION), where('status', '==', 'waiting'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = Date.now();
      const list = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(c => now - (c.createdAt?.toMillis() ?? now) < OPEN_CONTEST_MAX_AGE_MS);
      list.sort((a, b) => (b.createdAt?.toMillis() ?? now) - (a.createdAt?.toMillis() ?? now));
      setContests(list);
    }, (err) => {
      console.error('Nu am putut încărca concursurile', err);
    });
    return unsubscribe;
  }, []);

  return contests;
}

export function useContest(contestId) {
  const [contest, setContest] = useState(null);
  const [contestLoaded, setContestLoaded] = useState(false);
  const [results, setResults] = useState([]);
  const [resultsLoaded, setResultsLoaded] = useState(false);

  useEffect(() => {
    setContest(null);
    setContestLoaded(false);
    setResults([]);
    setResultsLoaded(false);
    if (!firebaseEnabled || !contestId) return undefined;
    const unsubContest = onSnapshot(contestRef(contestId), (snap) => {
      setContest(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setContestLoaded(true);
    }, (err) => {
      console.error('Nu am putut încărca concursul', err);
      setContestLoaded(true);
    });
    const unsubResults = onSnapshot(collection(db, CONTESTS_COLLECTION, contestId, 'results'), (snapshot) => {
      setResults(snapshot.docs.map(d => ({ uid: d.id, ...d.data() })));
      setResultsLoaded(true);
    }, (err) => console.error('Nu am putut încărca rezultatele', err));
    return () => {
      unsubContest();
      unsubResults();
    };
  }, [contestId]);

  return { contest, results, loaded: contestLoaded && resultsLoaded, contestLoaded };
}

export async function createContest({ uid, name, country, title, level = MIX_LEVEL }) {
  const ref = doc(collection(db, CONTESTS_COLLECTION));
  const levelName = contestLevelLabel(level).replace(/^[^\p{L}]+/u, '');
  const cleanTitle = (title || '').trim().slice(0, MAX_TITLE_LENGTH) || `Concurs ${levelName}`.slice(0, MAX_TITLE_LENGTH);
  await setDoc(ref, {
    host: uid,
    hostName: name,
    title: cleanTitle,
    status: 'waiting',
    players: { [uid]: { name, country: country || '', joinedAt: serverTimestamp() } },
    level,
    questions: questionsFor(level),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function joinContest(contestId, { uid, name, country }) {
  return updateDoc(contestRef(contestId), {
    [`players.${uid}`]: { name, country: country || '', joinedAt: serverTimestamp() },
  });
}

export function leaveContest(contest, uid) {
  if (contest.host === uid) {
    return updateDoc(contestRef(contest.id), { status: 'cancelled' });
  }
  return updateDoc(contestRef(contest.id), { [`players.${uid}`]: deleteField() });
}

export function startContest(contestId) {
  return updateDoc(contestRef(contestId), { status: 'running', startedAt: serverTimestamp() });
}

// Salvează clasamentul final în concurs, pentru istoricul din Statistici.
// Oricare participant îl poate scrie; tranzacția asigură că se scrie o singură dată.
export function recordContestResult(contestId, standings) {
  return runTransaction(db, async (tx) => {
    const ref = contestRef(contestId);
    const snap = await tx.get(ref);
    if (!snap.exists() || snap.data().status !== 'running') return;
    tx.update(ref, {
      status: 'finished',
      finishedAt: serverTimestamp(),
      participants: standings.map(r => r.uid),
      ranking: standings.map(r => ({
        uid: r.uid,
        name: r.name,
        country: r.country || '',
        answered: r.answered,
        correct: r.correct,
        timeMs: r.answered ? r.timeMs : null,
      })),
    });
  });
}

// Concursurile încheiate la care a participat jucătorul, cele mai noi primele.
export function useContestHistory(uid) {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(firebaseEnabled);

  useEffect(() => {
    setContests([]);
    if (!firebaseEnabled || !uid) {
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    // Doar array-contains: o combinație cu alt filtru ar cere un index compus.
    // `participants` există doar pe concursurile încheiate.
    const q = query(collection(db, CONTESTS_COLLECTION), where('participants', 'array-contains', uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.finishedAt?.toMillis() ?? 0) - (a.finishedAt?.toMillis() ?? 0));
      setContests(list);
      setLoading(false);
    }, (err) => {
      console.error('Nu am putut încărca istoricul concursurilor', err);
      setLoading(false);
    });
    return unsubscribe;
  }, [uid]);

  return { contests, loading };
}

export function saveContestProgress(contestId, uid, progress) {
  return setDoc(doc(db, CONTESTS_COLLECTION, contestId, 'results', uid), {
    ...progress,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
