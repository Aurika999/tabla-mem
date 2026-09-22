import { useCallback, useEffect, useState } from 'react';
import { auth, firebaseEnabled, onAuthStateChanged, signInAnonymously, updateProfile } from '../firebase';

const NAME_STORAGE_KEY = 'tabla-inmultirii:playerName';

export function usePlayerProfile() {
  const [uid, setUid] = useState(null);
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem(NAME_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [ready, setReady] = useState(!firebaseEnabled);

  useEffect(() => {
    if (!firebaseEnabled) return undefined;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        if (user.displayName) setName(user.displayName);
        setReady(true);
      } else {
        try {
          await signInAnonymously(auth);
        } catch (err) {
          console.error('Autentificare anonimă eșuată', err);
          setReady(true);
        }
      }
    });

    return unsubscribe;
  }, []);

  const saveName = useCallback(async (newName) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setName(trimmed);
    try {
      localStorage.setItem(NAME_STORAGE_KEY, trimmed);
    } catch {
      // localStorage poate fi indisponibil (mod privat) — nu blocăm jocul.
    }
    if (firebaseEnabled && auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: trimmed });
      } catch (err) {
        console.error('Nu am putut salva numele în profil', err);
      }
    }
  }, []);

  return { uid, name, ready, saveName, firebaseEnabled };
}
