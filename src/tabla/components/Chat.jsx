import { useEffect, useRef, useState } from 'react';
import {
  useMessages, useConversations, usePlayers, useSendMessage, privateChatId, MAX_MESSAGE_LENGTH,
} from '../useChat';

const READ_STORAGE_PREFIX = 'tabla-inmultirii:chatRead:';

function formatTime(timestamp) {
  if (!timestamp) return '';
  return timestamp.toDate().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
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

function Conversation({ uid, name, peer }) {
  const chatId = peer ? privateChatId(uid, peer.uid) : null;
  const { messages, loading } = useMessages(chatId);
  const sendMessage = useSendMessage();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    setError('');
    const ok = await sendMessage({ uid, name, text, peer });
    setSending(false);
    if (ok) setText('');
    else setError('Mesajul nu a putut fi trimis. Mai încearcă!');
  };

  const emptyText = peer ? `Scrie-i primul mesaj lui ${peer.name}! 👋` : 'Niciun mesaj încă. Spune salut! 👋';

  return (
    <div className="chat-conversation">
      <div className="chat-title">{peer ? `💬 ${peer.name}` : '🌍 General — toți jucătorii'}</div>
      <div className="chat-messages" ref={listRef}>
        {loading && <p className="leaderboard-empty">Se încarcă…</p>}
        {!loading && messages.length === 0 && <p className="leaderboard-empty">{emptyText}</p>}
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message${msg.uid === uid ? ' me' : ''}`}>
            <div className="chat-meta">
              <b>{msg.name}</b> <span>{formatTime(msg.createdAt)}</span>
            </div>
            <div className="chat-text">{msg.text}</div>
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder={name ? 'Scrie un mesaj…' : 'Alege-ți un nume ca să scrii'}
          disabled={!name || !uid}
        />
        <button type="submit" disabled={!name || !uid || !text.trim() || sending}>Trimite</button>
      </form>
      {error && <p className="chat-error">{error}</p>}
    </div>
  );
}

export default function Chat({ uid, name, firebaseEnabled }) {
  const conversations = useConversations(uid);
  const players = usePlayers();
  const [peer, setPeer] = useState(null);
  const [search, setSearch] = useState('');
  const [readTimes, setReadTimes] = useState({});

  const activeChatId = peer && uid ? privateChatId(uid, peer.uid) : null;
  const activeConversation = conversations.find(c => c.id === activeChatId);

  // Conversația deschisă e considerată citită, inclusiv la mesaje noi.
  useEffect(() => {
    if (!activeChatId) return;
    const now = Date.now();
    saveReadTime(activeChatId, now);
    setReadTimes(prev => ({ ...prev, [activeChatId]: now }));
  }, [activeChatId, activeConversation?.updatedAt]);

  if (!firebaseEnabled) {
    return (
      <aside className="panel chat">
        <h2>💬 CHAT</h2>
        <p className="leaderboard-empty">Chatul are nevoie de Firebase configurat.</p>
      </aside>
    );
  }

  const isUnread = (conv) => {
    if (conv.lastSender === uid || !conv.updatedAt) return false;
    const readAt = readTimes[conv.id] ?? loadReadTime(conv.id);
    return conv.updatedAt.toMillis() > readAt;
  };

  const peerOf = (conv) => {
    const otherUid = conv.members.find(m => m !== uid);
    return { uid: otherUid, name: conv.names?.[otherUid] || 'Jucător' };
  };

  const conversationUids = new Set(conversations.map(c => peerOf(c).uid));
  const term = search.trim().toLowerCase();
  const otherPlayers = players.filter(p =>
    p.uid !== uid && p.name && !conversationUids.has(p.uid)
    && (!term || p.name.toLowerCase().includes(term)));
  const shownConversations = conversations.filter(c =>
    !term || peerOf(c).name.toLowerCase().includes(term));

  return (
    <aside className="panel chat">
      <h2>💬 CHAT</h2>
      <div className="chat-layout">
        <div className="chat-sidebar">
          <button
            className={`chat-contact${!peer ? ' active' : ''}`}
            onClick={() => setPeer(null)}
          >
            🌍 General
          </button>
          <input
            className="chat-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Caută un jucător"
          />
          {shownConversations.length > 0 && <div className="chat-section">Conversațiile mele</div>}
          {shownConversations.map(conv => {
            const other = peerOf(conv);
            return (
              <button
                key={conv.id}
                className={`chat-contact${peer?.uid === other.uid ? ' active' : ''}`}
                onClick={() => setPeer(other)}
              >
                <span className="chat-contact-name">{other.name}</span>
                {isUnread(conv) && <span className="chat-unread" title="Mesaj nou" />}
                <small>{conv.lastMessage}</small>
              </button>
            );
          })}
          {otherPlayers.length > 0 && <div className="chat-section">Jucători</div>}
          {otherPlayers.map(p => (
            <button
              key={p.uid}
              className={`chat-contact${peer?.uid === p.uid ? ' active' : ''}`}
              onClick={() => setPeer({ uid: p.uid, name: p.name })}
            >
              <span className="chat-contact-name">{p.name}</span>
            </button>
          ))}
          {shownConversations.length === 0 && otherPlayers.length === 0 && (
            <p className="leaderboard-empty">{term ? 'Niciun jucător găsit.' : 'Încă nu sunt alți jucători.'}</p>
          )}
        </div>
        <Conversation key={activeChatId || 'general'} uid={uid} name={name} peer={peer} />
      </div>
    </aside>
  );
}
