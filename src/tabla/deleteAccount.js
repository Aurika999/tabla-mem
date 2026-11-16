import {
  collection, deleteDoc, doc, getDocs, query, where, writeBatch,
} from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase';

// Câte ștergeri trimitem odată (Firestore acceptă cel mult 500 într-un batch).
const BATCH_SIZE = 400;

async function deleteRefs(refs) {
  for (let i = 0; i < refs.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    refs.slice(i, i + BATCH_SIZE).forEach(ref => batch.delete(ref));
    // eslint-disable-next-line no-await-in-loop
    await batch.commit();
  }
}

async function refsWhere(path, field, value) {
  const snap = await getDocs(query(collection(db, path), where(field, '==', value)));
  return snap.docs.map(d => d.ref);
}

// Toate datele unui jucător din Firestore: profilul, scorurile, lista de blocați,
// mesajele din camera generală și conversațiile private (cu mesajele lui).
// Regulile Firestore permit fiecăruia să șteargă doar datele proprii.
export async function deletePlayerData(uid) {
  if (!firebaseEnabled || !uid) return;
  const refs = [
    ...await refsWhere('scores', 'uid', uid),
    ...await refsWhere('messages', 'uid', uid),
  ];

  const chats = await getDocs(query(collection(db, 'chats'), where('members', 'array-contains', uid)));
  for (const chat of chats.docs) {
    // eslint-disable-next-line no-await-in-loop
    refs.push(...await refsWhere(`chats/${chat.id}/messages`, 'uid', uid));
    refs.push(chat.ref);
  }

  // Rezultatele din concursurile la care a participat.
  const contests = await getDocs(query(collection(db, 'contests'), where('participants', 'array-contains', uid)));
  contests.docs.forEach(c => refs.push(doc(db, 'contests', c.id, 'results', uid)));

  await deleteRefs(refs);
  await deleteDoc(doc(db, 'blocks', uid));
  await deleteDoc(doc(db, 'players', uid));
}
