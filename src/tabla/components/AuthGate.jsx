import { useState } from 'react';
import { FEATURED_COUNTRIES, OTHER_COUNTRIES } from '../countries';
import {
  authErrorMessage, normalizeEmail, EMAIL_PATTERN, MIN_PASSWORD_LENGTH,
} from '../usePlayerProfile';
import Flag from './Flag';

export function CountrySelect({ value, onChange }) {
  return (
    <div className="country-select">
      <Flag code={value} />
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Țara ta">
        <option value="" disabled>🌍 Alege țara ta</option>
        {FEATURED_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        <option disabled>──────────</option>
        {OTHER_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
      </select>
    </div>
  );
}

function RegisterForm({ initialName, initialCountry, onRegister }) {
  const [displayName, setDisplayName] = useState(initialName);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [country, setCountry] = useState(initialCountry);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = normalizeEmail(email);
    if (!displayName.trim()) return setError('Scrie numele care apare în joc.');
    if (!EMAIL_PATTERN.test(cleanEmail)) return setError('Scrie o adresă de email validă.');
    if (password.length < MIN_PASSWORD_LENGTH) {
      return setError(`Parola trebuie să aibă cel puțin ${MIN_PASSWORD_LENGTH} caractere.`);
    }
    if (password !== password2) return setError('Cele două parole nu sunt la fel.');
    if (!country) return setError('Alege țara ta.');
    setBusy(true);
    setError('');
    try {
      await onRegister({ displayName, email: cleanEmail, password, country });
    } catch (err) {
      console.error('Înregistrare eșuată', err);
      setError(authErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {initialName && (
        <p className="auth-note">Punctele și scorurile tale de pe acest dispozitiv se păstrează în cont. ⭐</p>
      )}
      <label>Numele din joc
        <input className="name-input" maxLength={20} value={displayName}
          onChange={e => setDisplayName(e.target.value)} placeholder="ex. Andrei" autoComplete="nickname" />
      </label>
      <label>Email (pentru logare și pentru resetarea parolei)
        <input className="name-input" type="email" value={email}
          onChange={e => setEmail(e.target.value)} placeholder="ex. parinte@gmail.com"
          autoComplete="email" autoCapitalize="none" spellCheck="false" />
      </label>
      <label>Parolă
        <input className="name-input" type="password" value={password}
          onChange={e => setPassword(e.target.value)} placeholder={`cel puțin ${MIN_PASSWORD_LENGTH} caractere`}
          autoComplete="new-password" />
      </label>
      <label>Repetă parola
        <input className="name-input" type="password" value={password2}
          onChange={e => setPassword2(e.target.value)} autoComplete="new-password" />
      </label>
      <CountrySelect value={country} onChange={setCountry} />
      {error && <p className="chat-error">{error}</p>}
      <button className="bigbtn" type="submit" disabled={busy}>{busy ? 'Se creează…' : 'Creează contul 🚀'}</button>
      <p className="auth-note">
        Cu emailul și parola intri în cont și de pe alt telefon sau calculator.
        Dacă uiți parola, primești pe email un link ca s-o schimbi.
      </p>
    </form>
  );
}

function LoginForm({ onLogin, onForgot }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return setError('Scrie emailul și parola.');
    setBusy(true);
    setError('');
    try {
      await onLogin({ email, password });
    } catch (err) {
      console.error('Logare eșuată', err);
      setError(authErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <label>Email
        <input className="name-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
          autoComplete="email" autoCapitalize="none" spellCheck="false" autoFocus />
      </label>
      <label>Parolă
        <input className="name-input" type="password" value={password}
          onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
      </label>
      {error && <p className="chat-error">{error}</p>}
      <button className="bigbtn" type="submit" disabled={busy}>{busy ? 'Se intră…' : 'Intră în cont 🔑'}</button>
      <button type="button" className="auth-link" onClick={() => onForgot(email)}>Am uitat parola</button>
    </form>
  );
}

function ForgotForm({ initialEmail, onResetPassword, onBack }) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = normalizeEmail(email);
    if (!EMAIL_PATTERN.test(cleanEmail)) return setError('Scrie o adresă de email validă.');
    setBusy(true);
    setError('');
    try {
      await onResetPassword(cleanEmail);
      setSent(true);
    } catch (err) {
      console.error('Resetare parolă eșuată', err);
      setError(authErrorMessage(err));
    }
    setBusy(false);
  };

  if (sent) {
    return (
      <div className="auth-form">
        <p className="auth-success">
          📧 Dacă există un cont cu <b>{normalizeEmail(email)}</b>, ți-am trimis un email cu un link
          pentru o parolă nouă. Verifică și folderul Spam.
        </p>
        <button className="bigbtn" onClick={onBack}>← Înapoi la logare</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <p className="auth-note">Scrie emailul contului și îți trimitem un link ca să-ți alegi o parolă nouă.</p>
      <label>Email
        <input className="name-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
          autoComplete="email" autoCapitalize="none" spellCheck="false" autoFocus />
      </label>
      {error && <p className="chat-error">{error}</p>}
      <button className="bigbtn" type="submit" disabled={busy}>{busy ? 'Se trimite…' : 'Trimite linkul 📧'}</button>
      <button type="button" className="auth-link" onClick={onBack}>← Înapoi la logare</button>
    </form>
  );
}

export default function AuthGate({
  initialName = '', initialCountry = '', onRegister, onLogin, onResetPassword,
}) {
  const [mode, setMode] = useState('register');
  const [forgotEmail, setForgotEmail] = useState('');

  const titles = { register: 'Creează-ți cont', login: 'Intră în cont', forgot: 'Am uitat parola' };

  return (
    <div className="overlay">
      <div className="modal auth-modal">
        <div className="reward">🙋</div>
        <h2>{titles[mode]}</h2>
        <div className="leaderboard-tabs">
          <button className={`leaderboard-tab${mode === 'register' ? ' active' : ''}`} onClick={() => setMode('register')}>
            ✨ Cont nou
          </button>
          <button className={`leaderboard-tab${mode !== 'register' ? ' active' : ''}`} onClick={() => setMode('login')}>
            🔑 Am deja cont
          </button>
        </div>
        {mode === 'register' && (
          <RegisterForm initialName={initialName} initialCountry={initialCountry} onRegister={onRegister} />
        )}
        {mode === 'login' && (
          <LoginForm onLogin={onLogin} onForgot={(email) => { setForgotEmail(email); setMode('forgot'); }} />
        )}
        {mode === 'forgot' && (
          <ForgotForm initialEmail={forgotEmail} onResetPassword={onResetPassword} onBack={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}
