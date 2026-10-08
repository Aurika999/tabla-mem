import { useEffect, useState } from 'react';
import {
  collection, deleteField, doc, onSnapshot, query, runTransaction, serverTimestamp, setDoc, updateDoc, where,
} from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase';
import { generateQuestion } from './useTablaGame';
import { PROBLEME_LEVEL, AVANSATE_LEVEL } from './data';

const CONTESTS_COLLECTION = 'contests';

export const MAX_PLAYERS = 10;
export const MAX_TITLE_LENGTH = 40;
export const MIN_PLAYERS = 2;
export const CONTEST_QUESTIONS = 10;
export const QUESTION_SECONDS = 20;
export const COUNTDOWN_SECONDS = 3;
// Premii adăugate la punctajul total din clasament.
export const PRIZE_POINTS = [50, 30, 10];
// Un concurs care așteaptă de mai mult de atât nu mai apare în listă.
const OPEN_CONTEST_MAX_AGE_MS = 15 * 60 * 1000;
// Timp de rezervă după ultima întrebare, pentru cei cu internet mai lent.
const FINISH_GRACE_MS = 10000;

// Întrebări din toate nivelurile, de la ușor la greu.
const CONTEST_LEVELS = [1, 2, 3, 3, 4, 4, 5, 5, PROBLEME_LEVEL, AVANSATE_LEVEL];

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

export async function createContest({ uid, name, country, title }) {
  const ref = doc(collection(db, CONTESTS_COLLECTION));
  const cleanTitle = (title || '').trim().slice(0, MAX_TITLE_LENGTH) || `Concursul lui ${name}`;
  await setDoc(ref, {
    host: uid,
    hostName: name,
    title: cleanTitle,
    status: 'waiting',
    players: { [uid]: { name, country: country || '', joinedAt: serverTimestamp() } },
    questions: CONTEST_LEVELS.map(level => generateQuestion(level)),
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
