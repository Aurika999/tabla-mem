import { useCallback, useEffect, useRef, useState } from 'react';
import {
  addDoc, collection, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where,
} from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase';
import { notifySystem } from './useChat';

// Apeluri audio WebRTC. Firestore e folosit doar pentru „semnalizare”
// (ofertă/răspuns/candidați ICE); sunetul merge direct între jucători.
const CALLS_COLLECTION = 'calls';
const ICE_SERVERS = [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }];
const RING_TIMEOUT_MS = 30000;
// Un apel „ringing” mai vechi de atât e considerat abandonat (ex. apelantul a închis tab-ul).
const STALE_RING_MS = 45000;
const NOTICE_MS = 3500;

function callDocRef(callId) {
  return doc(db, CALLS_COLLECTION, callId);
}

export function useCall({ uid, name }) {
  // call: { id, role: 'caller' | 'callee', peer, status: 'ringing' | 'connecting' | 'connected', connectedAt }
  const [call, setCall] = useState(null);
  const [incoming, setIncoming] = useState(null);
  const [muted, setMuted] = useState(false);
  const [notice, setNotice] = useState('');

  const callRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const unsubsRef = useRef([]);
  const timersRef = useRef([]);
  const remoteAudioRef = useRef(null);

  const updateCall = useCallback((next) => {
    callRef.current = typeof next === 'function' ? next(callRef.current) : next;
    setCall(callRef.current);
  }, []);

  const showNotice = useCallback((text) => {
    setNotice(text);
    const id = setTimeout(() => setNotice(''), NOTICE_MS);
    timersRef.current.push(id);
  }, []);

  const cleanup = useCallback(() => {
    unsubsRef.current.forEach(unsub => unsub());
    unsubsRef.current = [];
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (pcRef.current) {
      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.onconnectionstatechange = null;
      pcRef.current.close();
      pcRef.current = null;
    }
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
    setMuted(false);
  }, []);

  // Încheie apelul local; dacă status e dat, îl scrie și în Firestore ca să afle și celălalt.
  const finish = useCallback((message, status) => {
    const current = callRef.current;
    if (current && status) {
      updateDoc(callDocRef(current.id), { status, endedAt: serverTimestamp() })
        .catch(err => console.error('Nu am putut închide apelul', err));
    }
    cleanup();
    updateCall(null);
    if (message) showNotice(message);
  }, [cleanup, updateCall, showNotice]);

  const createPeerConnection = useCallback((callId, ownSide, otherSide) => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;
    localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current));

    pc.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
        remoteAudioRef.current.play().catch(() => {});
      }
    };
    pc.onicecandidate = (event) => {
      if (!event.candidate) return;
      addDoc(collection(db, CALLS_COLLECTION, callId, ownSide), event.candidate.toJSON())
        .catch(err => console.error('Nu am putut trimite candidatul ICE', err));
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        updateCall(prev => (prev && prev.status !== 'connected'
          ? { ...prev, status: 'connected', connectedAt: Date.now() }
          : prev));
      } else if (pc.connectionState === 'failed') {
        finish('Conexiunea a eșuat. Mai încearcă!', 'ended');
      }
    };

    // Candidații celuilalt pot sosi înainte să avem descrierea lui; îi ținem la coadă.
    const pending = [];
    const addCandidate = (data) => {
      pc.addIceCandidate(new RTCIceCandidate(data)).catch(err => console.error('Candidat ICE invalid', err));
    };
    // Se apelează doar după ce documentul apelului există: regulile îl citesc
    // ca să verifice participanții, altfel ascultarea e refuzată definitiv.
    const listenForCandidates = () => {
      const unsub = onSnapshot(collection(db, CALLS_COLLECTION, callId, otherSide), (snapshot) => {
        snapshot.docChanges().forEach(change => {
          if (change.type !== 'added') return;
          if (pc.remoteDescription) addCandidate(change.doc.data());
          else pending.push(change.doc.data());
        });
      }, (err) => {
        console.error('Nu am putut asculta candidații ICE', err);
      });
      unsubsRef.current.push(unsub);
    };

    return {
      pc,
      listenForCandidates,
      flushCandidates: () => pending.splice(0).forEach(addCandidate),
    };
  }, [finish, updateCall]);

  const getMicrophone = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      showNotice('Browserul tău nu permite apeluri.');
      return null;
    }
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch (err) {
      console.error('Fără acces la microfon', err);
      showNotice('🎤 Permite accesul la microfon ca să poți vorbi.');
      return null;
    }
  }, [showNotice]);

  const startCall = useCallback(async (peer) => {
    if (!firebaseEnabled || !uid || !name || !peer || callRef.current) return;
    const stream = await getMicrophone();
    if (!stream) return;
    localStreamRef.current = stream;

    const callDoc = doc(collection(db, CALLS_COLLECTION));
    updateCall({ id: callDoc.id, role: 'caller', peer, status: 'ringing' });

    try {
      const { pc, listenForCandidates, flushCandidates } = createPeerConnection(
        callDoc.id, 'callerCandidates', 'calleeCandidates',
      );
      const offer = await pc.createOffer();
      // Documentul trebuie să existe înainte de candidații ICE (regulile îl citesc).
      await setDoc(callDoc, {
        caller: uid, callerName: name,
        callee: peer.uid, calleeName: peer.name,
        status: 'ringing',
        offer: { type: offer.type, sdp: offer.sdp },
        createdAt: serverTimestamp(),
      });
      listenForCandidates();
      await pc.setLocalDescription(offer);

      const unsub = onSnapshot(callDoc, async (snap) => {
        const data = snap.data();
        if (!data || !callRef.current) return;
        if (data.answer && !pc.currentRemoteDescription) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
          flushCandidates();
          updateCall(prev => (prev && prev.status === 'ringing' ? { ...prev, status: 'connecting' } : prev));
        }
        if (data.status === 'declined') finish(`${peer.name} a refuzat apelul.`);
        else if (data.status === 'busy') finish(`${peer.name} e într-un alt apel.`);
        else if (data.status === 'ended') finish('Apel încheiat.');
      });
      unsubsRef.current.push(unsub);

      const timeoutId = setTimeout(() => {
        if (callRef.current?.id === callDoc.id && callRef.current.status === 'ringing') {
          finish(`${peer.name} nu a răspuns.`, 'missed');
        }
      }, RING_TIMEOUT_MS);
      timersRef.current.push(timeoutId);
    } catch (err) {
      console.error('Nu am putut porni apelul', err);
      finish(err?.code === 'permission-denied'
        ? 'Apelurile nu sunt activate încă în Firebase (regulile pentru apeluri).'
        : 'Apelul nu a putut fi pornit.', 'ended');
    }
  }, [uid, name, getMicrophone, createPeerConnection, updateCall, finish]);

  const acceptCall = useCallback(async () => {
    const offerCall = incoming;
    if (!offerCall || callRef.current) return;
    setIncoming(null);
    const stream = await getMicrophone();
    if (!stream) {
      updateDoc(callDocRef(offerCall.id), { status: 'declined' }).catch(() => {});
      return;
    }
    localStreamRef.current = stream;
    updateCall({ id: offerCall.id, role: 'callee', peer: offerCall.peer, status: 'connecting' });

    try {
      const callDoc = callDocRef(offerCall.id);
      const snap = await getDoc(callDoc);
      const data = snap.data();
      if (!data || data.status !== 'ringing') {
        finish('Apelul s-a încheiat deja.');
        return;
      }
      const { pc, listenForCandidates, flushCandidates } = createPeerConnection(
        offerCall.id, 'calleeCandidates', 'callerCandidates',
      );
      listenForCandidates();
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      flushCandidates();
      const answer = await pc.createAnswer();
      // Răspunsul ajunge la apelant înaintea candidaților noștri ICE.
      await updateDoc(callDoc, {
        answer: { type: answer.type, sdp: answer.sdp },
        status: 'accepted',
        answeredAt: serverTimestamp(),
      });
      await pc.setLocalDescription(answer);

      const unsub = onSnapshot(callDoc, (s) => {
        if (s.data()?.status === 'ended' && callRef.current) finish('Apel încheiat.');
      });
      unsubsRef.current.push(unsub);
    } catch (err) {
      console.error('Nu am putut răspunde la apel', err);
      finish('Nu am putut răspunde la apel.', 'ended');
    }
  }, [incoming, getMicrophone, createPeerConnection, updateCall, finish]);

  const declineCall = useCallback(() => {
    if (!incoming) return;
    updateDoc(callDocRef(incoming.id), { status: 'declined' })
      .catch(err => console.error('Nu am putut refuza apelul', err));
    setIncoming(null);
  }, [incoming]);

  const hangUp = useCallback(() => {
    const current = callRef.current;
    if (!current) return;
    const status = current.role === 'caller' && current.status === 'ringing' ? 'missed' : 'ended';
    finish('Apel încheiat.', status);
  }, [finish]);

  const toggleMute = useCallback(() => {
    const tracks = localStreamRef.current?.getAudioTracks() ?? [];
    const nextMuted = !muted;
    tracks.forEach(t => { t.enabled = !nextMuted; });
    setMuted(nextMuted);
  }, [muted]);

  // Ascultăm apelurile primite.
  useEffect(() => {
    if (!firebaseEnabled || !uid) return undefined;
    const q = query(
      collection(db, CALLS_COLLECTION),
      where('callee', '==', uid),
      where('status', '==', 'ringing'),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(change => {
        const data = change.doc.data();
        if (change.type === 'removed') {
          // Apelantul a renunțat sau apelul a fost preluat/refuzat.
          setIncoming(prev => (prev?.id === change.doc.id ? null : prev));
          return;
        }
        if (change.type !== 'added') return;
        const createdAt = data.createdAt?.toMillis() ?? Date.now();
        if (Date.now() - createdAt > STALE_RING_MS) return;
        if (callRef.current) {
          updateDoc(change.doc.ref, { status: 'busy' }).catch(() => {});
          return;
        }
        const peer = { uid: data.caller, name: data.callerName || 'Jucător' };
        setIncoming({ id: change.doc.id, peer });
        notifySystem(`📞 ${peer.name} te sună`, 'Deschide jocul ca să răspunzi.', 'tabla-call');
      });
    }, (err) => {
      console.error('Nu am putut asculta apelurile', err);
    });
    return unsubscribe;
  }, [uid]);

  // Un apel primit nepreluat dispare singur după timpul de sunat.
  useEffect(() => {
    if (!incoming) return undefined;
    const id = setTimeout(() => setIncoming(prev => (prev?.id === incoming.id ? null : prev)), RING_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [incoming]);

  // Închidem apelul dacă jucătorul închide pagina sau componenta dispare.
  useEffect(() => {
    const onUnload = () => {
      const current = callRef.current;
      if (current) updateDoc(callDocRef(current.id), { status: 'ended' }).catch(() => {});
    };
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('beforeunload', onUnload);
      onUnload();
      cleanup();
    };
  }, [cleanup]);

  return {
    call, incoming, muted, notice, remoteAudioRef,
    startCall, acceptCall, declineCall, hangUp, toggleMute,
  };
}
