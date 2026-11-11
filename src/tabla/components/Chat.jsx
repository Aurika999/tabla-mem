import { useEffect, useRef, useState } from 'react';
import {
  useMessages, usePlayers, useSendMessage, privateChatId, peerOf, markChatRead, setChatTyping, formatCallDuration,
  MAX_MESSAGE_LENGTH, ONLINE_WINDOW_MS, TYPING_WINDOW_MS,
} from '../useChat';
import Avatar from './Avatar';
import Flag from './Flag';
import ChatText from './ChatText';
import { tr, getLang } from '../i18n';

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

// Datele și orele, în formatul limbii alese.
function locale() {
  return getLang() === 'en' ? 'en-GB' : 'ro-RO';
}

function formatClock(date) {
  return date.toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' });
}

function isToday(date) {
  return sameDay(date, new Date());
}

function isYesterday(date) {
  return sameDay(date, new Date(Date.now() - 86400000));
}

function dayLabel(date) {
  if (isToday(date)) return tr('Azi');
  if (isYesterday(date)) return tr('Ieri');
  return date.toLocaleDateString(locale(), {
    day: 'numeric', month: 'long', ...(date.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' } : {}),
  });
}

// Ora scurtă din lista de conversații: azi → 14:32, ieri → Ieri, altfel → 6.10
function shortTime(ms) {
  if (!ms) return '';
  const date = new Date(ms);
  if (isToday(date)) return formatClock(date);
  if (isYesterday(date)) return tr('Ieri');
  return date.toLocaleDateString(locale(), { day: 'numeric', month: 'numeric' });
}

function lastSeenText(ms) {
  if (!ms) return '';
  const date = new Date(ms);
  const when = isToday(date) ? tr('azi') : isYesterday(date) ? tr('ieri') : dayLabel(date);
  return tr('văzut ultima dată {when} la {time}', { when, time: formatClock(date) });
}

function isOnline(profile, now) {
  const seen = millis(profile?.lastSeenAt);
  return seen !== null && now - seen < ONLINE_WINDOW_MS;
}

function Ticks({ msg, peerReadAt, isPrivate }) {
  if (msg.pending) return <span className="chat-ticks" title={tr('Se trimite')}>🕓</span>;
  const created = millis(msg.createdAt);
  if (isPrivate && created !== null && peerReadAt !== null && created <= peerReadAt) {
    return <span className="chat-ticks read" title={tr('Citit')}>✓✓</span>;
  }
  return <span className="chat-ticks" title={tr('Trimis')}>✓</span>;
}

// Mesajul lăsat de un apel: pentru cine a sunat și pentru cine a fost sunat textul diferă.
// Ultimul mesaj din listă: rezumatul unui apel („📞 Apel vocal · 9 s”) se traduce; mesajele scrise, nu.
function lastMessageText(text) {
  if (!text) return '';
  return /^(📞|📹) Apel/.test(text) ? tr(text) : text;
}

function CallLogBubble({ msg, mine, date, peer, canCall, onCall }) {
  const { callStatus, durationSec = 0 } = msg;
  let icon = mine ? '↗' : '↙';
  let title;
  let detail = '';
  let missedForMe = false;
  if (callStatus === 'completed') {
    title = tr(msg.video ? 'Apel video' : 'Apel vocal');
    detail = formatCallDuration(durationSec);
  } else if (mine) {
    title = tr({ missed: 'Apel fără răspuns', declined: 'Apel refuzat', busy: 'Ocupat — era în alt apel', failed: 'Apel nereușit' }[callStatus]
      || 'Apel');
  } else {
    missedForMe = callStatus === 'missed' || callStatus === 'busy';
    title = tr({ missed: 'Apel pierdut', declined: 'Ai refuzat apelul', busy: 'Apel pierdut (erai în alt apel)', failed: 'Apel nereușit' }[callStatus]
      || 'Apel');
    if (missedForMe) icon = '📵';
  }
  return (
    <div className={`chat-bubble chat-call-log${mine ? ' me' : ''}${missedForMe ? ' missed' : ''}`}>
      <span className="chat-call-log-icon">{callStatus === 'completed' || !missedForMe ? (msg.video ? '📹' : '📞') : icon}</span>
      <span className="chat-call-log-body">
        <b>{title}</b>
        <small>
          {callStatus === 'completed' ? `${icon} ${detail}` : icon !== '📵' ? icon : ''}
          {' · '}{formatClock(date)}
        </small>
      </span>
      {missedForMe && peer && (
        <button className="chat-call-back" onClick={() => onCall(peer, { video: Boolean(msg.video) })} disabled={!canCall}>{tr('Sună înapoi')}</button>
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
      setError(tr('Mesajul nu a putut fi trimis. Mai încearcă!'));
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
  const emptyText = peer ? tr('Scrie-i primul mesaj lui {name}! 👋', { name: peer.name }) : tr('Niciun mesaj încă. Spune salut! 👋');

  let status;
  if (!peer) status = `${playersCount} ${playersCount === 1 ? tr('jucător') : tr('jucători')}`;
  else if (peerTyping) status = <span className="chat-status-typing">{tr('scrie…')}</span>;
  else if (isOnline(peerProfile, now)) status = <span className="chat-status-online">{tr('online')}</span>;
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
        <button className="chat-back" onClick={onBack} aria-label={tr('Înapoi la conversații')}>←</button>
        {peer ? (
          <Avatar src={peerProfile?.avatar} name={peer.name} size={40} />
        ) : (
          <span className="chat-header-icon">🌍</span>
        )}
        <div className="chat-header-info">
          <div className="chat-header-name">
            {peer ? <>{peer.name} <Flag code={peerProfile?.country} /></> : tr('General — toți jucătorii')}
          </div>
          <div className="chat-header-status">{status}</div>
        </div>
        {peer && (
          <button
            className="chat-header-call"
            onClick={() => onCall(peer, { video: true })}
            disabled={!canWrite || callBusy}
            title={callBusy ? tr('Ești deja într-un apel') : tr('Apel video cu {name}', { name: peer.name })}
            aria-label={tr('Apel video cu {name}', { name: peer.name })}
          >
            📹
          </button>
        )}
        {peer && (
          <button
            className="chat-header-call"
            onClick={() => onCall(peer)}
            disabled={!canWrite || callBusy}
            title={callBusy ? tr('Ești deja într-un apel') : tr('Sună-l pe {name}', { name: peer.name })}
            aria-label={tr('Sună-l pe {name}', { name: peer.name })}
          >
            📞
          </button>
        )}
      </div>

      <div className="chat-wallpaper">
        <div className="chat-messages" ref={listRef} onScroll={handleScroll}>
          {loading && <p className="chat-system">{tr('Se încarcă…')}</p>}
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
                      <b>{msg.replyTo.uid === uid ? tr('Tu') : msg.replyTo.name}</b>
                      <span>{msg.replyTo.text}</span>
                    </button>
                  )}
                  <ChatText text={msg.text} />
                  <span className="chat-time">
                    {formatClock(date)}
                    {mine && <Ticks msg={msg} peerReadAt={peerReadAt} isPrivate={isPrivate} />}
                  </span>
                </div>
                {canWrite && (
                  <button className="chat-reply-btn" onClick={() => startReply(msg)} title={tr('Răspunde')} aria-label={tr('Răspunde')}>
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
          <button className="chat-jump" onClick={() => scrollToBottom(true)} aria-label={tr('Mergi la ultimele mesaje')}>
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
          <button onClick={() => setReplyTo(null)} aria-label={tr('Anulează răspunsul')}>✕</button>
        </div>
      )}
      <form className="chat-input-bar" onSubmit={handleSubmit}>
        <div className="chat-input-pill">
          <button
            type="button"
            className={`chat-emoji-toggle${showEmojis ? ' active' : ''}`}
            onClick={() => setShowEmojis(v => !v)}
            disabled={!canWrite}
            title={tr('Emoticoane')}
          >
            😊
          </button>
          <input
            ref={inputRef}
            value={text}
            onChange={e => handleChange(e.target.value)}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder={name ? tr('Mesaj') : tr('Alege-ți un nume ca să scrii')}
            disabled={!canWrite}
          />
        </div>
        <button type="submit" className="chat-send" disabled={!canWrite || !text.trim()} aria-label={tr('Trimite')}>➤</button>
      </form>
      {error && <p className="chat-error">{error}</p>}
    </div>
  );
}

const MIN_SEARCH_LETTERS = 2;
const MAX_SEARCH_RESULTS = 8;

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
        <h2>{tr('💬 CHAT')}</h2>
        <p className="leaderboard-empty">{tr('Chatul are nevoie de Firebase configurat.')}</p>
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
  // Ceilalți jucători nu apar toți în listă: îi găsești doar căutându-i după nume
  // (cel puțin 2 litere), ca să vorbești doar cu cine cunoști.
  const searching = term.length >= MIN_SEARCH_LETTERS;
  const otherPlayers = searching
    ? players.filter(p =>
      p.uid !== uid && p.name && !conversationUids.has(p.uid) && p.name.toLowerCase().includes(term))
      .slice(0, MAX_SEARCH_RESULTS)
    : [];
  const shownConversations = conversations.filter(c =>
    !term || peerOf(c, uid).name.toLowerCase().includes(term));
  const playersCount = players.filter(p => p.name).length;

  return (
    <aside className="panel chat">
      <h2>{tr('💬 CHAT')}</h2>
      <div className={`chat-layout view-${mobileView}`}>
        <div className="chat-sidebar">
          <input
            className="chat-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={tr('🔍 Caută un jucător după nume')}
          />
          {!term && (
            <p className="chat-search-hint">{tr('Scrie numele cuiva pe care îl cunoști ca să-i trimiți un mesaj.')}</p>
          )}
          <button className={`chat-contact${!peer ? ' active' : ''}`} onClick={() => select(null)}>
            <span className="chat-header-icon small">🌍</span>
            <span className="chat-contact-body">
              <span className="chat-contact-name">{tr('General')}</span>
              <small>{tr('Camera tuturor jucătorilor')}</small>
            </span>
          </button>
          {shownConversations.length > 0 && <div className="chat-section">{tr('Conversațiile mele')}</div>}
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
                      {isTyping ? tr('scrie…') : `${conv.lastSender === uid ? `${tr('Tu')}: ` : ''}${lastMessageText(conv.lastMessage)}`}
                    </small>
                    {unread && <span className="chat-unread" title={tr('Mesaj nou')} />}
                  </span>
                </span>
              </button>
            );
          })}
          {otherPlayers.length > 0 && <div className="chat-section">{tr('Rezultatele căutării')}</div>}
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
                <small>{isOnline(p, now) ? tr('online') : tr('Apasă ca să-i scrii')}</small>
              </span>
            </button>
          ))}
          {term && !searching && (
            <p className="leaderboard-empty">{tr('Mai scrie cel puțin o literă…')}</p>
          )}
          {searching && shownConversations.length === 0 && otherPlayers.length === 0 && (
            <p className="leaderboard-empty">{tr('Niciun jucător găsit.')}</p>
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
