import { useCallback, useEffect, useState } from 'react';
import {
  addDoc, collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp,
  setDoc, where, writeBatch,
} from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase';

const GENERAL_COLLECTION = 'messages';
const CHATS_COLLECTION = 'chats';
const PLAYERS_COLLECTION = 'players';
const LAST_N = 50;
const MAX_PLAYERS = 200;
export const MAX_MESSAGE_LENGTH = 300;

// Id-ul unei conversații private e format din cele două uid-uri sortate,
// ca ambii jucători să ajungă la același document.
export function privateChatId(uidA, uidB) {
  return [uidA, uidB].sort().join('_');
}

function messagesPath(chatId) {
  return chatId ? `${CHATS_COLLECTION}/${chatId}/messages` : GENERAL_COLLECTION;
}

// chatId null = camera generală.
export function useMessages(chatId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(firebaseEnabled);

  useEffect(() => {
    if (!firebaseEnabled) {
      setMessages([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    setMessages([]);
    const q = query(
      collection(db, messagesPath(chatId)),
      orderBy('createdAt', 'desc'),
      limit(LAST_N),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Cele mai noi vin primele din query; le afișăm în ordine cronologică.
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })).reverse());
      setLoading(false);
    }, (err) => {
      console.error('Nu am putut încărca mesajele', err);
      setLoading(false);
    });
    return unsubscribe;
  }, [chatId]);

  return { messages, loading };
}

export function useConversations(uid) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!firebaseEnabled || !uid) {
      setConversations([]);
      return undefined;
    }
    const q = query(collection(db, CHATS_COLLECTION), where('members', 'array-contains', uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.updatedAt?.toMillis() ?? 0) - (a.updatedAt?.toMillis() ?? 0));
      setConversations(list);
    }, (err) => {
      console.error('Nu am putut încărca conversațiile', err);
    });
    return unsubscribe;
  }, [uid]);

  return conversations;
}

export function usePlayers() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!firebaseEnabled) {
      setPlayers([]);
      return undefined;
    }
    // Fără orderBy pe server: Firestore ar ascunde jucătorii vechi, care nu au
    // încă lastSeenAt. Sortăm aici după ultima activitate cunoscută.
    const q = query(collection(db, PLAYERS_COLLECTION), limit(MAX_PLAYERS));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lastActive = p => (p.lastSeenAt ?? p.lastPlayedAt)?.toMillis() ?? 0;
      const list = snapshot.docs.map(d => ({ uid: d.id, ...d.data() }));
      list.sort((a, b) => lastActive(b) - lastActive(a));
      setPlayers(list);
    }, (err) => {
      console.error('Nu am putut încărca jucătorii', err);
    });
    return unsubscribe;
  }, []);

  return players;
}

// Marchează jucătorul ca activ, ca să apară în lista de chat.
export async function touchPlayer({ uid, name }) {
  if (!firebaseEnabled || !uid || !name) return;
  try {
    await setDoc(doc(db, PLAYERS_COLLECTION, uid), {
      name, lastSeenAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('Nu am putut actualiza jucătorul', err);
  }
}

export function useSendMessage() {
  // peer null = camera generală; altfel { uid, name } al celuilalt jucător.
  return useCallback(async ({ uid, name, text, peer }) => {
    const trimmed = text.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!firebaseEnabled || !uid || !name || !trimmed) return false;
    const message = { uid, name, text: trimmed, createdAt: serverTimestamp() };
    try {
      if (!peer) {
        await addDoc(collection(db, GENERAL_COLLECTION), message);
        return true;
      }
      const chatId = privateChatId(uid, peer.uid);
      const batch = writeBatch(db);
      batch.set(doc(collection(db, messagesPath(chatId))), message);
      batch.set(doc(db, CHATS_COLLECTION, chatId), {
        members: [uid, peer.uid].sort(),
        names: { [uid]: name, [peer.uid]: peer.name },
        lastMessage: trimmed,
        lastSender: uid,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      await batch.commit();
      return true;
    } catch (err) {
      console.error('Nu am putut trimite mesajul', err);
      return false;
    }
  }, []);
}
