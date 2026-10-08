import { useEffect, useState } from 'react';
import {
  collection, doc, getFirestore, increment, onSnapshot, query,
  runTransaction, serverTimestamp, setDoc, limit, where,
} from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase';

const SCORES_COLLECTION = 'scores';
const PLAYERS_COLLECTION = 'players';
const MAX_PLAYERS = 200;

export function useMyScores(uid) {
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(firebaseEnabled);

  useEffect(() => {
    if (!firebaseEnabled || !uid) {
      setScores({});
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const q = query(collection(db, SCORES_COLLECTION), where('uid', '==', uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const byLevel = {};
      snapshot.docs.forEach(d => { byLevel[d.data().level] = d.data(); });
      setScores(byLevel);
      setLoading(false);
    }, (err) => {
      console.error('Nu am putut încărca scorurile tale', err);
      setLoading(false);
    });
    return unsubscribe;
  }, [uid]);

  return { scores, loading };
}

export function useGlobalLeaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(firebaseEnabled);

  useEffect(() => {
    if (!firebaseEnabled) {
      setEntries([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    // Fără orderBy pe server: Firestore ar ascunde jucătorii fără totalPoints
    // (cei care n-au terminat încă niciun nivel). Îi punem cu 0 și sortăm aici.
    const q = query(collection(db, PLAYERS_COLLECTION), limit(MAX_PLAYERS));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p => p.name)
        .map(p => ({ ...p, totalPoints: p.totalPoints || 0 }));
      list.sort((a, b) => b.totalPoints - a.totalPoints);
      setEntries(list);
      setLoading(false);
    }, (err) => {
      console.error('Nu am putut încărca clasamentul general', err);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { entries, loading };
}

export async function submitScore({ uid, name, level, points, correct, bestCombo }) {
  if (!firebaseEnabled || !uid || !name) return;
  const scoreId = `${uid}_${level}`;
  const scoreRef = doc(getFirestore(), SCORES_COLLECTION, scoreId);
  try {
    await runTransaction(getFirestore(), async (tx) => {
      const snap = await tx.get(scoreRef);
      const existingPoints = snap.exists() ? snap.data().points : -1;
      if (points <= existingPoints) return;
      tx.set(scoreRef, {
        uid, name, level, points, correct, bestCombo,
        updatedAt: serverTimestamp(),
      });
    });
  } catch (err) {
    console.error('Nu am putut salva scorul în clasament', err);
  }
}

export async function addPlayerPoints({ uid, name, pointsEarned }) {
  if (!firebaseEnabled || !uid || !name || !pointsEarned) return;
  const playerRef = doc(getFirestore(), PLAYERS_COLLECTION, uid);
  try {
    await setDoc(playerRef, {
      name,
      totalPoints: increment(pointsEarned),
      lastPlayedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('Nu am putut actualiza scorul total al jucătorului', err);
  }
}
