import { useEffect, useRef, useState } from 'react';
import {
  useMessages, usePlayers, useSendMessage, privateChatId, peerOf, MAX_MESSAGE_LENGTH,
} from '../useChat';

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😂', '🤣', '😊', '🙂', '😉',
  '😍', '🥰', '😘', '😎', '🤩', '🥳', '😜', '🤪', '🤔', '🤗',
  '😮', '😢', '😭', '😡', '😴', '🙈', '👍', '👎', '👏', '🙌',
  '👋', '🤝', '💪', '❤️', '💜', '💙', '⭐', '🌟', '🔥', '🎉',
  '🏆', '🥇', '🎯', '🧠', '📚', '✏️', '🧮', '✅', '❌', '💯',
  '🐶', '🐱', '🦄', '🐼', '🍕', '🍦', '🍭', '⚽', '🎮', '🚀',
];

function formatTime(timestamp) {
  if (!timestamp) return '';
  return timestamp.toDate().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
}

function Conversation({ uid, name, peer, onCall, callBusy }) {
  const chatId = peer ? privateChatId(uid, peer.uid) : null;
  const { messages, loading } = useMessages(chatId);
  const sendMessage = useSendMessage();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  const insertEmoji = (emoji) => {
    const input = inputRef.current;
    const start = input?.selectionStart ?? text.length;
    const end = input?.selectionEnd ?? text.length;
    const next = (text.slice(0, start) + emoji + text.slice(end)).slice(0, MAX_MESSAGE_LENGTH);
    setText(next);
    requestAnimationFrame(() => {
      if (!input) return;
      input.focus();
      const caret = Math.min(start + emoji.length, next.length);
      input.setSelectionRange(caret, caret);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    setError('');
    const ok = await sendMessage({ uid, name, text, peer });
    setSending(false);
    if (ok) {
      setText('');
      setShowEmojis(false);
    } else {
      setError('Mesajul nu a putut fi trimis. Mai încearcă!');
    }
  };

  const canWrite = Boolean(name && uid);
  const emptyText = peer ? `Scrie-i primul mesaj lui ${peer.name}! 👋` : 'Niciun mesaj încă. Spune salut! 👋';

  return (
    <div className="chat-conversation">
      <div className="chat-title">
        <span>{peer ? `💬 ${peer.name}` : '🌍 General — toți jucătorii'}</span>
        {peer && (
          <button
            className="chat-call-btn"
            onClick={() => onCall(peer)}
            disabled={!canWrite || callBusy}
            title={callBusy ? 'Ești deja într-un apel' : `Sună-l pe ${peer.name}`}
          >
            📞 Sună
          </button>
        )}
      </div>
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
      {showEmojis && canWrite && (
        <div className="chat-emoji-picker">
          {EMOJIS.map(emoji => (
            <button key={emoji} type="button" onClick={() => insertEmoji(emoji)}>{emoji}</button>
          ))}
        </div>
      )}
      <form className="chat-form" onSubmit={handleSubmit}>
        <button
          type="button"
          className={`chat-emoji-toggle${showEmojis ? ' active' : ''}`}
          onClick={() => setShowEmojis(v => !v)}
          disabled={!canWrite}
          title="Emoticoane"
        >
          😊
        </button>
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder={name ? 'Scrie un mesaj…' : 'Alege-ți un nume ca să scrii'}
          disabled={!canWrite}
        />
        <button type="submit" disabled={!canWrite || !text.trim() || sending}>Trimite</button>
      </form>
      {error && <p className="chat-error">{error}</p>}
    </div>
  );
}

export default function Chat({
  uid, name, firebaseEnabled, peer, onSelectPeer, conversations, isUnread, onCall, callBusy,
}) {
  const players = usePlayers();
  const [search, setSearch] = useState('');

  if (!firebaseEnabled) {
    return (
      <aside className="panel chat">
        <h2>💬 CHAT</h2>
        <p className="leaderboard-empty">Chatul are nevoie de Firebase configurat.</p>
      </aside>
    );
  }

  const activeChatId = peer && uid ? privateChatId(uid, peer.uid) : null;
  const conversationUids = new Set(conversations.map(c => peerOf(c, uid).uid));
  const term = search.trim().toLowerCase();
  const otherPlayers = players.filter(p =>
    p.uid !== uid && p.name && !conversationUids.has(p.uid)
    && (!term || p.name.toLowerCase().includes(term)));
  const shownConversations = conversations.filter(c =>
    !term || peerOf(c, uid).name.toLowerCase().includes(term));

  return (
    <aside className="panel chat">
      <h2>💬 CHAT</h2>
      <div className="chat-layout">
        <div className="chat-sidebar">
          <button
            className={`chat-contact${!peer ? ' active' : ''}`}
            onClick={() => onSelectPeer(null)}
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
            const other = peerOf(conv, uid);
            return (
              <button
                key={conv.id}
                className={`chat-contact${conv.id === activeChatId ? ' active' : ''}`}
                onClick={() => onSelectPeer(other)}
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
              onClick={() => onSelectPeer({ uid: p.uid, name: p.name })}
            >
              <span className="chat-contact-name">{p.name}</span>
            </button>
          ))}
          {shownConversations.length === 0 && otherPlayers.length === 0 && (
            <p className="leaderboard-empty">{term ? 'Niciun jucător găsit.' : 'Încă nu sunt alți jucători.'}</p>
          )}
        </div>
        <Conversation
          key={activeChatId || 'general'}
          uid={uid}
          name={name}
          peer={peer}
          onCall={onCall}
          callBusy={callBusy}
        />
      </div>
    </aside>
  );
}
