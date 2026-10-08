import { useCallback, useEffect, useState } from 'react';
import {
  auth, firebaseEnabled, onAuthStateChanged, signInAnonymously, updateProfile,
  EmailAuthProvider, linkWithCredential, signInWithEmailAndPassword, signOut, sendPasswordResetEmail,
  reauthenticateWithCredential, updatePassword,
} from '../firebase';
import { loadPlayer, savePlayerAvatar, touchPlayer } from './useChat';
import { isValidCountry } from './countries';

const NAME_STORAGE_KEY = 'tabla-inmultirii:playerName';
const COUNTRY_STORAGE_KEY = 'tabla-inmultirii:playerCountry';
const PRESENCE_INTERVAL_MS = 60 * 1000;

// Contul folosește adresa de email, ca parola să poată fi resetată prin email.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 6;

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

const AUTH_ERRORS = {
  'auth/email-already-in-use': 'Există deja un cont cu acest email. Alege „Am deja cont”.',
  'auth/credential-already-in-use': 'Există deja un cont cu acest email. Alege „Am deja cont”.',
  'auth/weak-password': `Parola trebuie să aibă cel puțin ${MIN_PASSWORD_LENGTH} caractere.`,
  'auth/invalid-credential': 'Email sau parolă greșită.',
  'auth/wrong-password': 'Email sau parolă greșită.',
  'auth/user-not-found': 'Email sau parolă greșită.',
  'auth/invalid-email': 'Adresa de email nu e validă.',
  'auth/missing-email': 'Scrie adresa de email.',
  'auth/too-many-requests': 'Prea multe încercări. Așteaptă puțin și încearcă din nou.',
  'auth/network-request-failed': 'Nu e conexiune la internet.',
  'auth/requires-recent-login': 'Din motive de siguranță, ieși din cont și intră din nou, apoi încearcă iar.',
  'auth/operation-not-allowed': 'Conturile cu parolă nu sunt activate încă în Firebase.',
};

export function authErrorMessage(err) {
  return AUTH_ERRORS[err?.code] || 'Ceva n-a mers. Mai încearcă!';
}

function readStorage(key) {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function writeStorage(key, value) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // localStorage poate fi indisponibil (mod privat) — nu blocăm jocul.
  }
}

export function usePlayerProfile() {
  const [uid, setUid] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState(() => readStorage(NAME_STORAGE_KEY));
  const [country, setCountry] = useState(() => {
    const stored = readStorage(COUNTRY_STORAGE_KEY);
    return isValidCountry(stored) ? stored : '';
  });
  const [ready, setReady] = useState(!firebaseEnabled);
  const [avatar, setAvatar] = useState('');
  // Date despre cont din Firebase Auth: când a fost creat, ultima logare.
  const [account, setAccount] = useState({ createdAt: null, lastLoginAt: null });

  useEffect(() => {
    if (!firebaseEnabled) return undefined;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          await signInAnonymously(auth);
        } catch (err) {
          console.error('Autentificare anonimă eșuată', err);
          setReady(true);
        }
        return;
      }

      // Ascundem ecranul de cont cât încărcăm profilul, ca să nu clipească.
      setReady(false);
      setUid(user.uid);
      setIsAnonymous(user.isAnonymous);
      setEmail(user.isAnonymous ? '' : (user.email || ''));
      setAccount({
        createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : null,
        lastLoginAt: user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime) : null,
      });

      // Țara și avatarul pot fi salvate doar în Firebase (ex. alt dispozitiv).
      const player = await loadPlayer(user.uid);
      const savedCountry = player.country || '';
      setAvatar(player.avatar || '');
      if (user.isAnonymous) {
        if (user.displayName) setName(user.displayName);
        if (isValidCountry(savedCountry)) setCountry(prev => prev || savedCountry);
      } else {
        // Cont cu parolă: profilul din Firebase are prioritate față de ce e pe dispozitiv.
        const accountName = user.displayName || (user.email || '').split('@')[0];
        const accountCountry = isValidCountry(savedCountry) ? savedCountry : '';
        setName(accountName);
        setCountry(accountCountry);
        writeStorage(NAME_STORAGE_KEY, accountName);
        writeStorage(COUNTRY_STORAGE_KEY, accountCountry);
      }
      setReady(true);
    });

    return unsubscribe;
  }, []);

  // Doar când profilul e încărcat: altfel, la schimbarea contului, am scrie
  // numele vechi de pe dispozitiv peste profilul contului nou.
  useEffect(() => {
    if (ready) touchPlayer({ uid, name, country });
  }, [ready, uid, name, country]);

  // Semn de viață cât timp jocul e deschis și vizibil, pentru „online” în chat.
  useEffect(() => {
    if (!ready || !uid || !name) return undefined;
    const beat = () => {
      if (document.visibilityState === 'visible') touchPlayer({ uid, name, country });
    };
    const id = setInterval(beat, PRESENCE_INTERVAL_MS);
    document.addEventListener('visibilitychange', beat);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', beat);
    };
  }, [ready, uid, name, country]);

  const applyProfile = useCallback(async (newName, newCountry) => {
    const trimmed = newName.trim();
    setName(trimmed);
    setCountry(newCountry);
    writeStorage(NAME_STORAGE_KEY, trimmed);
    writeStorage(COUNTRY_STORAGE_KEY, newCountry);
    if (auth?.currentUser && auth.currentUser.displayName !== trimmed) {
      try {
        await updateProfile(auth.currentUser, { displayName: trimmed });
      } catch (err) {
        console.error('Nu am putut salva numele în profil', err);
      }
    }
  }, []);

  const updateAvatar = useCallback(async (dataUrl) => {
    await savePlayerAvatar(uid, dataUrl);
    setAvatar(dataUrl || '');
  }, [uid]);

  // Firebase cere parola actuală înainte de a o schimba.
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  }, []);

  // Completează numele/țara pentru un cont care nu le are încă.
  const saveProfile = useCallback(async (newName, newCountry) => {
    if (!newName.trim() || !isValidCountry(newCountry)) return;
    await applyProfile(newName, newCountry);
  }, [applyProfile]);

  // Transformă contul anonim de pe acest dispozitiv în cont cu parolă,
  // păstrând uid-ul — deci și punctele, scorurile, conversațiile.
  const register = useCallback(async ({ displayName, email: newEmail, password, country: newCountry }) => {
    const credential = EmailAuthProvider.credential(normalizeEmail(newEmail), password);
    const result = await linkWithCredential(auth.currentUser, credential);
    setIsAnonymous(false);
    setEmail(normalizeEmail(newEmail));
    setUid(result.user.uid);
    await applyProfile(displayName, newCountry);
  }, [applyProfile]);

  const login = useCallback(async ({ email: loginEmail, password }) => {
    // onAuthStateChanged încarcă profilul contului.
    await signInWithEmailAndPassword(auth, normalizeEmail(loginEmail), password);
  }, []);

  // Firebase nu spune dacă emailul are cont (protecție anti-ghicit), deci
  // mesajul de confirmare e același în ambele cazuri.
  const resetPassword = useCallback(async (resetEmail) => {
    await sendPasswordResetEmail(auth, normalizeEmail(resetEmail));
  }, []);

  const logout = useCallback(async () => {
    writeStorage(NAME_STORAGE_KEY, '');
    writeStorage(COUNTRY_STORAGE_KEY, '');
    setName('');
    setCountry('');
    setEmail('');
    setAvatar('');
    // onAuthStateChanged(null) pornește o sesiune anonimă nouă și cere din nou contul.
    await signOut(auth);
  }, []);

  return {
    uid, name, country, email, isAnonymous, ready, avatar, account,
    saveProfile, register, login, logout, resetPassword, updateAvatar, changePassword, firebaseEnabled,
  };
}
