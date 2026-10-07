import { useCallback, useEffect, useState } from 'react';
import { auth, firebaseEnabled, onAuthStateChanged, signInAnonymously, updateProfile } from '../firebase';
import { loadPlayerCountry, touchPlayer } from './useChat';
import { isValidCountry } from './countries';

const NAME_STORAGE_KEY = 'tabla-inmultirii:playerName';
const COUNTRY_STORAGE_KEY = 'tabla-inmultirii:playerCountry';

function readStorage(key) {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage poate fi indisponibil (mod privat) — nu blocăm jocul.
  }
}

export function usePlayerProfile() {
  const [uid, setUid] = useState(null);
  const [name, setName] = useState(() => readStorage(NAME_STORAGE_KEY));
  const [country, setCountry] = useState(() => {
    const stored = readStorage(COUNTRY_STORAGE_KEY);
    return isValidCountry(stored) ? stored : '';
  });
  const [ready, setReady] = useState(!firebaseEnabled);

  useEffect(() => {
    if (!firebaseEnabled) return undefined;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        if (user.displayName) setName(user.displayName);
        // Țara poate fi salvată doar în Firebase (ex. localStorage golit);
        // o căutăm înainte de a decide dacă cerem din nou profilul.
        const savedCountry = await loadPlayerCountry(user.uid);
        if (isValidCountry(savedCountry)) {
          setCountry(prev => prev || savedCountry);
          writeStorage(COUNTRY_STORAGE_KEY, savedCountry);
        }
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

  useEffect(() => {
    touchPlayer({ uid, name, country });
  }, [uid, name, country]);

  const saveProfile = useCallback(async (newName, newCountry) => {
    const trimmed = newName.trim();
    if (!trimmed || !isValidCountry(newCountry)) return;
    setName(trimmed);
    setCountry(newCountry);
    writeStorage(NAME_STORAGE_KEY, trimmed);
    writeStorage(COUNTRY_STORAGE_KEY, newCountry);
    if (firebaseEnabled && auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: trimmed });
      } catch (err) {
        console.error('Nu am putut salva numele în profil', err);
      }
    }
  }, []);

  return { uid, name, country, ready, saveProfile, firebaseEnabled };
}
