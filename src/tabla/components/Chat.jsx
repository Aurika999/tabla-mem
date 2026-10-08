import { useEffect, useRef, useState } from 'react';
import {
  useMessages, usePlayers, useSendMessage, privateChatId, peerOf, markChatRead, setChatTyping, formatCallDuration,
  MAX_MESSAGE_LENGTH, ONLINE_WINDOW_MS, TYPING_WINDOW_MS,
} from '../useChat';
import Avatar from './Avatar';
import Flag from './Flag';

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😂', '🤣', '😊', '🙂', '😉',
  '😍', '🥰', '😘', '😎', '🤩', '🥳', '😜', '🤪', '🤔', '🤗',
  '😮', '😢', '😭', '😡', '😴', '🙈', '👍', '👎', '👏', '🙌',
  '👋', '🤝', '💪', '❤️', '💜', '💙', '⭐', '🌟', '🔥', '🎉',
  '🏆', '🥇', '🎯', '🧠', '📚', '✏️', '🧮', '✅', '❌', '💯',
  '🐶', '🐱', '🦄', '🐼', '🍕', '🍦', '🍭', '⚽', '🎮', '🚀',
];

// Mesajele aceleiași persoane la mai puțin de atât unul de altul formează un grup.
const GROUP_GAP_MS = 5 * 60 * 1000;
// Cât de aproape de capăt trebuie să fii ca mesajele noi să te deruleze automat.
const NEAR_BOTTOM_PX = 120;
// Cât de des retrimitem semnalul „scrie…” în timp ce jucătorul tastează.
const TYPING_THROTTLE_MS = 3000;

function useNow(intervalMs) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function millis(timestamp) {
  return timestamp?.toMillis?.() ?? null;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatClock(date) {
  return date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
}

function dayLabel(date) {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 86400000);
  if (sameDay(date, today)) return 'Azi';
  if (sameDay(date, yesterday)) return 'Ieri';
  return date.toLocaleDateString('ro-RO', {
    day: 'numeric', month: 'long', ...(date.getFullYear() !== today.getFullYear() ? { year: 'numeric' } : {}),
  });
}

// Ora scurtă din lista de conversații: azi → 14:32, ieri → Ieri, altfel → 6.10
function shortTime(ms) {
  if (!ms) return '';
  const date = new Date(ms);
  const label = dayLabel(date);
  if (label === 'Azi') return formatClock(date);
  if (label === 'Ieri') return 'Ieri';
  return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'numeric' });
}

function lastSeenText(ms) {
  if (!ms) return '';
  const date = new Date(ms);
  const label = dayLabel(date);
  return `văzut ultima dată ${label === 'Azi' || label === 'Ieri' ? label.toLowerCase() : label} la ${formatClock(date)}`;
}

function isOnline(profile, now) {
  const seen = millis(profile?.lastSeenAt);
  return seen !== null && now - seen < ONLINE_WINDOW_MS;
}

function Ticks({ msg, peerReadAt, isPrivate }) {
  if (msg.pending) return <span className="chat-ticks" title="Se trimite">🕓</span>;
  const created = millis(msg.createdAt);
  if (isPrivate && created !== null && peerReadAt !== null && created <= peerReadAt) {
    return <span className="chat-ticks read" title="Citit">✓✓</span>;
  }
  return <span className="chat-ticks" title="Trimis">✓</span>;
}

// Mesajul lăsat de un apel: pentru cine a sunat și pentru cine a fost sunat textul diferă.
function CallLogBubble({ msg, mine, date, peer, canCall, onCall }) {
  const { callStatus, durationSec = 0 } = msg;
  let icon = mine ? '↗' : '↙';
  let title;
  let detail = '';
  let missedForMe = false;
  if (callStatus === 'completed') {
    title = 'Apel vocal';
    detail = formatCallDuration(durationSec);
  } else if (mine) {
    title = { missed: 'Apel fără răspuns', declined: 'Apel refuzat', busy: 'Ocupat — era în alt apel', failed: 'Apel nereușit' }[callStatus]
      || 'Apel';
  } else {
    missedForMe = callStatus === 'missed' || callStatus === 'busy';
    title = { missed: 'Apel pierdut', declined: 'Ai refuzat apelul', busy: 'Apel pierdut (erai în alt apel)', failed: 'Apel nereușit' }[callStatus]
      || 'Apel';
    if (missedForMe) icon = '📵';
  }
  return (
    <div className={`chat-bubble chat-call-log${mine ? ' me' : ''}${missedForMe ? ' missed' : ''}`}>
      <span className="chat-call-log-icon">{callStatus === 'completed' || !missedForMe ? '📞' : icon}</span>
      <span className="chat-call-log-body">
        <b>{title}</b>
        <small>
          {callStatus === 'completed' ? `${icon} ${detail}` : icon !== '📵' ? icon : ''}
          {' · '}{formatClock(date)}
        </small>
      </span>
      {missedForMe && peer && (
        <button className="chat-call-back" onClick={() => onCall(peer)} disabled={!canCall}>Sună înapoi</button>
      )}
    </div>
  );
}

function Conversation({
  uid, name, peer, profiles, conversation, playersCount, onCall, callBusy, onBack,
}) {
  const chatId = peer ? privateChatId(uid, peer.uid) : null;
  const { messages, loading } = useMessages(chatId);
  const sendMessage = useSendMessage();
  const now = useNow(5000);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [nearBottom, setNearBottom] = useState(true);
  const [newCount, setNewCount] = useState(0);
  const [highlightId, setHighlightId] = useState(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const lastTypingSentRef = useRef(0);
  const prevCountRef = useRef(0);

  const isPrivate = Boolean(peer);
  const conversationExists = Boolean(conversation);
  const peerProfile = peer ? profiles[peer.uid] : null;
  const peerReadAt = peer ? millis(conversation?.readAt?.[peer.uid]) : null;
  const myReadAt = millis(conversation?.readAt?.[uid]) ?? 0;
  const peerTypingAt = peer ? millis(conversation?.typing?.[peer.uid]) : null;
  const peerTyping = peerTypingAt !== null && now - peerTypingAt < TYPING_WINDOW_MS;

  const scrollToBottom = (smooth) => {
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    setNewCount(0);
  };

  // Mesaje noi: derulăm doar dacă jucătorul e deja jos sau dacă a scris chiar el.
  useEffect(() => {
    const added = messages.length - prevCountRef.current;
    const firstLoad = prevCountRef.current === 0;
    prevCountRef.current = messages.length;
    if (added <= 0) return;
    const last = messages[messages.length - 1];
    if (firstLoad || nearBottom || last?.uid === uid) scrollToBottom(!firstLoad);
    else setNewCount(n => n + added);
    // nearBottom e citit intenționat doar la sosirea mesajelor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, uid]);

  // Bifele albastre: marcăm conversația ca citită când vedem mesaje noi de la celălalt.
  useEffect(() => {
    if (!chatId || !conversationExists || document.visibilityState !== 'visible') return;
    const lastFromPeer = [...messages].reverse().find(m => m.uid !== uid);
    const lastMs = millis(lastFromPeer?.createdAt);
    if (lastMs !== null && lastMs > myReadAt) {
      markChatRead(chatId, uid).catch(err => console.error('Nu am putut marca drept citit', err));
    }
  }, [chatId, conversationExists, messages, uid, myReadAt]);

  // Oprim „scrie…” când jucătorul iese din conversație.
  useEffect(() => () => {
    if (chatId && lastTypingSentRef.current) setChatTyping(chatId, uid, false).catch(() => {});
  }, [chatId, uid]);

  const handleScroll = () => {
    const list = listRef.current;
    const isNear = list.scrollHeight - list.scrollTop - list.clientHeight < NEAR_BOTTOM_PX;
    setNearBottom(isNear);
    if (isNear) setNewCount(0);
  };

  const updateTyping = (value) => {
    if (!chatId || !conversationExists) return;
    const t = Date.now();
    if (value.trim() && t - lastTypingSentRef.current > TYPING_THROTTLE_MS) {
      lastTypingSentRef.current = t;
      setChatTyping(chatId, uid, true).catch(() => {});
    } else if (!value.trim() && lastTypingSentRef.current) {
      lastTypingSentRef.current = 0;
      setChatTyping(chatId, uid, false).catch(() => {});
    }
  };

  const handleChange = (value) => {
    setText(value);
    updateTyping(value);
  };

  const insertEmoji = (emoji) => {
    const input = inputRef.current;
    const start = input?.selectionStart ?? text.length;
    const end = input?.selectionEnd ?? text.length;
    const next = (text.slice(0, start) + emoji + text.slice(end)).slice(0, MAX_MESSAGE_LENGTH);
    handleChange(next);
    requestAnimationFrame(() => {
      if (!input) return;
      input.focus();
      const caret = Math.min(start + emoji.length, next.length);
      input.setSelectionRange(caret, caret);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    // Golim imediat câmpul, ca în WhatsApp; mesajul apare cu 🕓 până ajunge.
    const sentText = text;
    const sentReply = replyTo;
    setText('');
    setReplyTo(null);
    setShowEmojis(false);
    setError('');
    if (chatId && lastTypingSentRef.current) {
      lastTypingSentRef.current = 0;
      setChatTyping(chatId, uid, false).catch(() => {});
    }
    const ok = await sendMessage({ uid, name, text: sentText, peer, replyTo: sentReply });
    if (!ok) {
      setText(sentText);
      setReplyTo(sentReply);
      setError('Mesajul nu a putut fi trimis. Mai încearcă!');
    }
  };

  const startReply = (msg) => {
    setReplyTo({ id: msg.id, uid: msg.uid, name: msg.name, text: msg.text });
    inputRef.current?.focus();
  };

  const jumpTo = (messageId) => {
    const el = listRef.current?.querySelector(`[data-mid="${messageId}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightId(messageId);
    setTimeout(() => setHighlightId(null), 1500);
  };

  const canWrite = Boolean(name && uid);
  const emptyText = peer ? `Scrie-i primul mesaj lui ${peer.name}! 👋` : 'Niciun mesaj încă. Spune salut! 👋';

  let status;
  if (!peer) status = `${playersCount} ${playersCount === 1 ? 'jucător' : 'jucători'}`;
  else if (peerTyping) status = <span className="chat-status-typing">scrie…</span>;
  else if (isOnline(peerProfile, now)) status = <span className="chat-status-online">online</span>;
  else status = lastSeenText(millis(peerProfile?.lastSeenAt));

  // Construim lista cu separatoare de zi și grupare pe expeditor.
  const rows = [];
  let prev = null;
  messages.forEach(msg => {
    const date = new Date(millis(msg.createdAt) ?? Date.now());
    if (!prev || !sameDay(prev.date, date)) rows.push({ type: 'day', key: `day-${msg.id}`, label: dayLabel(date) });
    const firstInGroup = !prev || prev.msg.uid !== msg.uid || !sameDay(prev.date, date)
      || date.getTime() - prev.date.getTime() > GROUP_GAP_MS;
    rows.push({ type: 'msg', key: msg.id, msg, date, firstInGroup });
    prev = { msg, date };
  });

  return (
    <div className="chat-conversation">
      <div className="chat-header">
        <button className="chat-back" onClick={onBack} aria-label="Înapoi la conversații">←</button>
        {peer ? (
          <Avatar src={peerProfile?.avatar} name={peer.name} size={40} />
        ) : (
          <span className="chat-header-icon">🌍</span>
        )}
        <div className="chat-header-info">
          <div className="chat-header-name">
            {peer ? <>{peer.name} <Flag code={peerProfile?.country} /></> : 'General — toți jucătorii'}
          </div>
          <div className="chat-header-status">{status}</div>
        </div>
        {peer && (
          <button
            className="chat-header-call"
            onClick={() => onCall(peer)}
            disabled={!canWrite || callBusy}
            title={callBusy ? 'Ești deja într-un apel' : `Sună-l pe ${peer.name}`}
          >
            📞
          </button>
        )}
      </div>

      <div className="chat-wallpaper">
        <div className="chat-messages" ref={listRef} onScroll={handleScroll}>
          {loading && <p className="chat-system">Se încarcă…</p>}
          {!loading && messages.length === 0 && <p className="chat-system">{emptyText}</p>}
          {rows.map(row => {
            if (row.type === 'day') return <div key={row.key} className="chat-day"><span>{row.label}</span></div>;
            const { msg, date, firstInGroup } = row;
            const mine = msg.uid === uid;
            const author = profiles[msg.uid];
            const showAuthor = !isPrivate && !mine;
            if (msg.type === 'call') {
              return (
                <div key={row.key} data-mid={msg.id} className={`chat-row first${mine ? ' me' : ''}`}>
                  <CallLogBubble
                    msg={msg}
                    mine={mine}
                    date={date}
                    peer={peer}
                    canCall={canWrite && !callBusy}
                    onCall={onCall}
                  />
                </div>
              );
            }
            return (
              <div
                key={row.key}
                data-mid={msg.id}
                className={`chat-row${mine ? ' me' : ''}${firstInGroup ? ' first' : ''}${highlightId === msg.id ? ' highlight' : ''}`}
              >
                {showAuthor && (
                  firstInGroup
                    ? <Avatar src={author?.avatar} name={msg.name} size={30} />
                    : <span className="chat-avatar-space" />
                )}
                <div className={`chat-bubble${mine ? ' me' : ''}${firstInGroup ? ' tail' : ''}`}>
                  {showAuthor && firstInGroup && (
                    <div className="chat-author">{msg.name} <Flag code={author?.country} /></div>
                  )}
                  {msg.replyTo && (
                    <button className="chat-quote" onClick={() => jumpTo(msg.replyTo.id)}>
                      <b>{msg.replyTo.uid === uid ? 'Tu' : msg.replyTo.name}</b>
                      <span>{msg.replyTo.text}</span>
                    </button>
                  )}
                  <span className="chat-text">{msg.text}</span>
                  <span className="chat-time">
                    {formatClock(date)}
                    {mine && <Ticks msg={msg} peerReadAt={peerReadAt} isPrivate={isPrivate} />}
                  </span>
                </div>
                {canWrite && (
                  <button className="chat-reply-btn" onClick={() => startReply(msg)} title="Răspunde" aria-label="Răspunde">
                    ↩
                  </button>
                )}
              </div>
            );
          })}
          {peerTyping && (
            <div className="chat-row first">
              <div className="chat-bubble tail chat-typing-bubble"><span /><span /><span /></div>
            </div>
          )}
        </div>
        {!nearBottom && (
          <button className="chat-jump" onClick={() => scrollToBottom(true)} aria-label="Mergi la ultimele mesaje">
            {newCount > 0 && <span className="chat-jump-count">{newCount}</span>}⌄
          </button>
        )}
      </div>

      {showEmojis && canWrite && (
        <div className="chat-emoji-picker">
          {EMOJIS.map(emoji => (
            <button key={emoji} type="button" onClick={() => insertEmoji(emoji)}>{emoji}</button>
          ))}
        </div>
      )}
      {replyTo && (
        <div className="chat-reply-preview">
          <div className="chat-quote">
            <b>{replyTo.uid === uid ? 'Tu' : replyTo.name}</b>
            <span>{replyTo.text}</span>
          </div>
          <button onClick={() => setReplyTo(null)} aria-label="Anulează răspunsul">✕</button>
        </div>
      )}
      <form className="chat-input-bar" onSubmit={handleSubmit}>
        <div className="chat-input-pill">
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
            onChange={e => handleChange(e.target.value)}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder={name ? 'Mesaj' : 'Alege-ți un nume ca să scrii'}
            disabled={!canWrite}
          />
        </div>
        <button type="submit" className="chat-send" disabled={!canWrite || !text.trim()} aria-label="Trimite">➤</button>
      </form>
      {error && <p className="chat-error">{error}</p>}
    </div>
  );
}

export default function Chat({
  uid, name, firebaseEnabled, peer, onSelectPeer, conversations, isUnread, onCall, callBusy,
}) {
  const players = usePlayers();
  const now = useNow(30000);
  const [search, setSearch] = useState('');
  // Pe telefon arătăm fie lista, fie conversația (ca în WhatsApp).
  const [mobileView, setMobileView] = useState('list');
  // Avatar, țară și ultima activitate pentru fiecare jucător, după uid.
  const profiles = Object.fromEntries(players.map(p => [p.uid, p]));

  if (!firebaseEnabled) {
    return (
      <aside className="panel chat">
        <h2>💬 CHAT</h2>
        <p className="leaderboard-empty">Chatul are nevoie de Firebase configurat.</p>
      </aside>
    );
  }

  const select = (target) => {
    onSelectPeer(target);
    setMobileView('conversation');
  };

  const activeChatId = peer && uid ? privateChatId(uid, peer.uid) : null;
  const conversationUids = new Set(conversations.map(c => peerOf(c, uid).uid));
  const term = search.trim().toLowerCase();
  const otherPlayers = players.filter(p =>
    p.uid !== uid && p.name && !conversationUids.has(p.uid)
    && (!term || p.name.toLowerCase().includes(term)));
  const shownConversations = conversations.filter(c =>
    !term || peerOf(c, uid).name.toLowerCase().includes(term));
  const playersCount = players.filter(p => p.name).length;

  return (
    <aside className="panel chat">
      <h2>💬 CHAT</h2>
      <div className={`chat-layout view-${mobileView}`}>
        <div className="chat-sidebar">
          <input
            className="chat-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Caută un jucător"
          />
          <button className={`chat-contact${!peer ? ' active' : ''}`} onClick={() => select(null)}>
            <span className="chat-header-icon small">🌍</span>
            <span className="chat-contact-body">
              <span className="chat-contact-name">General</span>
              <small>Camera tuturor jucătorilor</small>
            </span>
          </button>
          {shownConversations.length > 0 && <div className="chat-section">Conversațiile mele</div>}
          {shownConversations.map(conv => {
            const other = peerOf(conv, uid);
            const profile = profiles[other.uid];
            const unread = isUnread(conv);
            const typing = millis(conv.typing?.[other.uid]);
            const isTyping = typing !== null && now - typing < TYPING_WINDOW_MS;
            return (
              <button
                key={conv.id}
                className={`chat-contact${conv.id === activeChatId ? ' active' : ''}${unread ? ' unread' : ''}`}
                onClick={() => select(other)}
              >
                <span className="chat-avatar-wrap">
                  <Avatar src={profile?.avatar} name={other.name} size={40} />
                  {isOnline(profile, now) && <span className="chat-online-dot" />}
                </span>
                <span className="chat-contact-body">
                  <span className="chat-contact-top">
                    <span className="chat-contact-name">{other.name} <Flag code={profile?.country} /></span>
                    <span className="chat-contact-time">{shortTime(millis(conv.updatedAt))}</span>
                  </span>
                  <span className="chat-contact-bottom">
                    <small className={isTyping ? 'chat-status-typing' : ''}>
                      {isTyping ? 'scrie…' : `${conv.lastSender === uid ? 'Tu: ' : ''}${conv.lastMessage || ''}`}
                    </small>
                    {unread && <span className="chat-unread" title="Mesaj nou" />}
                  </span>
                </span>
              </button>
            );
          })}
          {otherPlayers.length > 0 && <div className="chat-section">Jucători</div>}
          {otherPlayers.map(p => (
            <button
              key={p.uid}
              className={`chat-contact${peer?.uid === p.uid ? ' active' : ''}`}
              onClick={() => select({ uid: p.uid, name: p.name })}
            >
              <span className="chat-avatar-wrap">
                <Avatar src={p.avatar} name={p.name} size={40} />
                {isOnline(p, now) && <span className="chat-online-dot" />}
              </span>
              <span className="chat-contact-body">
                <span className="chat-contact-name">{p.name} <Flag code={p.country} /></span>
                <small>{isOnline(p, now) ? 'online' : 'Apasă ca să-i scrii'}</small>
              </span>
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
          profiles={profiles}
          conversation={conversations.find(c => c.id === activeChatId)}
          playersCount={playersCount}
          onCall={onCall}
          callBusy={callBusy}
          onBack={() => setMobileView('list')}
        />
      </div>
    </aside>
  );
}
