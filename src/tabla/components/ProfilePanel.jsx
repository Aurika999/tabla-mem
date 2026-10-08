import { useRef, useState } from 'react';
import { useGlobalLeaderboard, useMyScores } from '../useLeaderboard';
import { useContestHistory } from '../useContest';
import { LEVEL_ORDER, PROBLEME_LEVEL, AVANSATE_LEVEL } from '../data';
import { countryName, isValidCountry } from '../countries';
import { authErrorMessage, MIN_PASSWORD_LENGTH } from '../usePlayerProfile';
import { fileToAvatar } from '../avatarImage';
import { CountrySelect } from './AuthGate';
import Avatar from './Avatar';
import Flag from './Flag';

const ALL_LEVELS = [...LEVEL_ORDER, PROBLEME_LEVEL, AVANSATE_LEVEL];

function formatDate(date) {
  if (!date) return '—';
  return date.toLocaleString('ro-RO', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function daysSince(date) {
  if (!date) return null;
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="profile-info-row">
      <span className="profile-info-label">{icon} {label}</span>
      <span className="profile-info-value">{value}</span>
    </div>
  );
}

function AvatarEditor({ name, avatar, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      await onChange(await fileToAvatar(file));
    } catch (err) {
      console.error('Nu am putut salva avatarul', err);
      setError(err.message === 'not-image' ? 'Alege o poză (JPG, PNG…).'
        : err.message === 'too-big' ? 'Poza e prea mare. Alege alta.'
          : 'Nu am putut salva poza. Mai încearcă!');
    }
    setBusy(false);
  };

  const handleRemove = async () => {
    setBusy(true);
    setError('');
    try {
      await onChange(null);
    } catch (err) {
      console.error('Nu am putut șterge avatarul', err);
      setError('Nu am putut șterge poza. Mai încearcă!');
    }
    setBusy(false);
  };

  return (
    <div className="profile-avatar">
      <Avatar src={avatar} name={name} size={110} />
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
      <div className="profile-avatar-actions">
        <button className="chat-call-btn" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? 'Se salvează…' : avatar ? '📷 Schimbă poza' : '📷 Pune o poză'}
        </button>
        {avatar && (
          <button className="profile-link-btn" onClick={handleRemove} disabled={busy}>🗑️ Șterge poza</button>
        )}
      </div>
      {error && <p className="chat-error">{error}</p>}
    </div>
  );
}

function DetailsForm({ name, country, onSave }) {
  const [newName, setNewName] = useState(name);
  const [newCountry, setNewCountry] = useState(country);
  const [status, setStatus] = useState('');

  const changed = newName.trim() !== name || newCountry !== country;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return setStatus('Scrie un nume.');
    if (!isValidCountry(newCountry)) return setStatus('Alege țara.');
    await onSave(newName, newCountry);
    setStatus('✅ Salvat!');
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>Numele din joc
        <input className="name-input" maxLength={20} value={newName}
          onChange={e => { setNewName(e.target.value); setStatus(''); }} />
      </label>
      <CountrySelect value={newCountry} onChange={(c) => { setNewCountry(c); setStatus(''); }} />
      {status && <p className="auth-note">{status}</p>}
      <button className="bigbtn" type="submit" disabled={!changed}>💾 Salvează</button>
    </form>
  );
}

function PasswordForm({ onChangePassword }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [next2, setNext2] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (next.length < MIN_PASSWORD_LENGTH) return setError(`Parola nouă trebuie să aibă cel puțin ${MIN_PASSWORD_LENGTH} caractere.`);
    if (next !== next2) return setError('Cele două parole noi nu sunt la fel.');
    setBusy(true);
    setError('');
    try {
      await onChangePassword(current, next);
      setDone(true);
      setCurrent('');
      setNext('');
      setNext2('');
    } catch (err) {
      console.error('Schimbare parolă eșuată', err);
      setError(err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password'
        ? 'Parola actuală e greșită.'
        : authErrorMessage(err));
    }
    setBusy(false);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>Parola actuală
        <input className="name-input" type="password" value={current}
          onChange={e => { setCurrent(e.target.value); setDone(false); }} autoComplete="current-password" />
      </label>
      <label>Parola nouă
        <input className="name-input" type="password" value={next}
          onChange={e => setNext(e.target.value)} autoComplete="new-password" />
      </label>
      <label>Repetă parola nouă
        <input className="name-input" type="password" value={next2}
          onChange={e => setNext2(e.target.value)} autoComplete="new-password" />
      </label>
      {error && <p className="chat-error">{error}</p>}
      {done && <p className="auth-success">✅ Parola a fost schimbată.</p>}
      <button className="bigbtn" type="submit" disabled={busy || !current || !next}>
        {busy ? 'Se schimbă…' : '🔒 Schimbă parola'}
      </button>
    </form>
  );
}

export default function ProfilePanel({
  uid, name, country, email, isAnonymous, avatar, account,
  onSaveDetails, onUpdateAvatar, onChangePassword, onLogout,
}) {
  const { entries } = useGlobalLeaderboard();
  const { scores } = useMyScores(uid);
  const { contests } = useContestHistory(uid);

  const rankIndex = entries.findIndex(e => e.id === uid);
  const totalPoints = rankIndex >= 0 ? entries[rankIndex].totalPoints : 0;
  const levelsDone = ALL_LEVELS.filter(key => scores[key]).length;
  const wins = contests.filter(c => c.ranking?.[0]?.uid === uid).length;
  const days = daysSince(account.createdAt);

  return (
    <aside className="panel profile">
      <h2>⚙️ CONTUL MEU</h2>

      <div className="profile-top">
        <AvatarEditor name={name} avatar={avatar} onChange={onUpdateAvatar} />
        <div className="profile-identity">
          <div className="profile-name">{name} <Flag code={country} /></div>
          {email && <div className="profile-email">📧 {email}</div>}
          {isValidCountry(country) && <div className="profile-email">🌍 {countryName(country)}</div>}
        </div>
      </div>

      <h3 className="contest-subtitle">📋 Informații</h3>
      <div className="profile-info">
        <InfoRow icon="📅" label="Cont creat" value={
          <>{formatDate(account.createdAt)}{days !== null && <small> ({days === 0 ? 'azi' : `acum ${days} ${days === 1 ? 'zi' : 'zile'}`})</small>}</>
        } />
        <InfoRow icon="🔑" label="Ultima logare" value={formatDate(account.lastLoginAt)} />
        <InfoRow icon="👤" label="Tip cont" value={isAnonymous ? 'Fără parolă (doar pe acest dispozitiv)' : 'Cont cu email și parolă'} />
        <InfoRow icon="⭐" label="Puncte totale" value={`${totalPoints} pct`} />
        <InfoRow icon="🏅" label="Locul în clasament" value={rankIndex >= 0 ? `${rankIndex + 1} din ${entries.length}` : '—'} />
        <InfoRow icon="🎯" label="Niveluri terminate" value={`${levelsDone} din ${ALL_LEVELS.length}`} />
        <InfoRow icon="🏁" label="Concursuri" value={`${contests.length} jucate · 🥇 ${wins} ${wins === 1 ? 'victorie' : 'victorii'}`} />
      </div>

      <h3 className="contest-subtitle">✏️ Modifică profilul</h3>
      <DetailsForm key={`${name}|${country}`} name={name} country={country} onSave={onSaveDetails} />

      {!isAnonymous && (
        <>
          <h3 className="contest-subtitle">🔒 Schimbă parola</h3>
          <PasswordForm onChangePassword={onChangePassword} />
        </>
      )}

      {onLogout && (
        <button className="bigbtn blue profile-logout" onClick={onLogout}>🚪 Ieși din cont</button>
      )}
    </aside>
  );
}
