import { useCallback, useEffect, useRef, useState } from 'react';
import {
  addDoc, collection, doc, getDoc, limit, onSnapshot, orderBy, query, serverTimestamp,
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

function useConversations(uid) {
  const [conversations, setConversations] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setConversations([]);
    setLoaded(false);
    if (!firebaseEnabled || !uid) return undefined;
    const q = query(collection(db, CHATS_COLLECTION), where('members', 'array-contains', uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => updatedMillis(b) - updatedMillis(a));
      setConversations(list);
      setLoaded(true);
    }, (err) => {
      console.error('Nu am putut încărca conversațiile', err);
    });
    return unsubscribe;
  }, [uid]);

  return { conversations, loaded };
}

const READ_STORAGE_PREFIX = 'tabla-inmultirii:chatRead:';

function updatedMillis(conv) {
  return conv.updatedAt?.toMillis() ?? 0;
}

function loadReadTime(chatId) {
  try {
    return Number(localStorage.getItem(READ_STORAGE_PREFIX + chatId)) || 0;
  } catch {
    return 0;
  }
}

function saveReadTime(chatId, time) {
  try {
    localStorage.setItem(READ_STORAGE_PREFIX + chatId, String(time));
  } catch {
    // localStorage poate fi indisponibil (mod privat) — doar pierdem marcajul de citit.
  }
}

export function peerOf(conv, uid) {
  const otherUid = conv.members.find(m => m !== uid);
  return { uid: otherUid, name: conv.names?.[otherUid] || 'Jucător' };
}

export function requestSystemNotifications() {
  if (typeof Notification === 'undefined' || Notification.permission !== 'default') return;
  Notification.requestPermission().catch(() => {});
}

// Notificare de sistem, doar când tab-ul e în fundal și avem permisiune.
export function notifySystem(title, body, tag) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  if (!document.hidden) return;
  try {
    new Notification(title, { body, icon: '/logo192.png', tag });
  } catch {
    // Unele browsere (ex. Android WebView) nu permit Notification direct.
  }
}

function showSystemNotification(sender, text) {
  notifySystem(`💬 ${sender} ți-a scris`, text, 'tabla-chat');
}

// Conversațiile private ale jucătorului, ce e necitit și notificarea pentru
// mesajele noi. activeChatId = conversația deschisă acum (null dacă niciuna).
export function useChatNotifications(uid, activeChatId) {
  const { conversations, loaded } = useConversations(uid);
  const [readTimes, setReadTimes] = useState({});
  const [incoming, setIncoming] = useState(null);
  const seenRef = useRef(null);
  const activeChatRef = useRef(activeChatId);
  activeChatRef.current = activeChatId;

  const activeUpdated = updatedMillis(conversations.find(c => c.id === activeChatId) ?? {});

  // Conversația deschisă e considerată citită, inclusiv la mesaje noi.
  useEffect(() => {
    if (!activeChatId) return;
    const now = Math.max(Date.now(), activeUpdated);
    saveReadTime(activeChatId, now);
    setReadTimes(prev => ({ ...prev, [activeChatId]: now }));
    setIncoming(prev => (prev?.chatId === activeChatId ? null : prev));
  }, [activeChatId, activeUpdated]);

  // Detectăm mesajele sosite după încărcarea inițială, ca să nu anunțăm
  // mesaje vechi la fiecare pornire a jocului.
  useEffect(() => {
    if (!loaded) {
      seenRef.current = null;
      return;
    }
    const prev = seenRef.current;
    const next = {};
    conversations.forEach(c => { next[c.id] = updatedMillis(c); });
    seenRef.current = next;
    if (prev === null) return;
    const fresh = conversations.find(c =>
      c.lastSender !== uid && next[c.id] > (prev[c.id] ?? 0) && c.id !== activeChatRef.current);
    if (!fresh) return;
    const sender = peerOf(fresh, uid);
    setIncoming({ chatId: fresh.id, peer: sender, text: fresh.lastMessage, at: next[fresh.id] });
    showSystemNotification(sender.name, fresh.lastMessage);
  }, [conversations, loaded, uid]);

  const isUnread = useCallback((conv) => {
    if (conv.lastSender === uid || !conv.updatedAt) return false;
    const readAt = readTimes[conv.id] ?? loadReadTime(conv.id);
    return updatedMillis(conv) > readAt;
  }, [readTimes, uid]);

  const unreadCount = conversations.filter(isUnread).length;
  const dismissIncoming = useCallback(() => setIncoming(null), []);

  return { conversations, isUnread, unreadCount, incoming, dismissIncoming };
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
export async function touchPlayer({ uid, name, country }) {
  if (!firebaseEnabled || !uid || !name) return;
  const data = { name, lastSeenAt: serverTimestamp() };
  if (country) data.country = country;
  try {
    await setDoc(doc(db, PLAYERS_COLLECTION, uid), data, { merge: true });
  } catch (err) {
    console.error('Nu am putut actualiza jucătorul', err);
  }
}

export async function loadPlayerCountry(uid) {
  if (!firebaseEnabled || !uid) return '';
  try {
    const snap = await getDoc(doc(db, PLAYERS_COLLECTION, uid));
    return snap.exists() ? snap.data().country || '' : '';
  } catch (err) {
    console.error('Nu am putut încărca țara jucătorului', err);
    return '';
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
