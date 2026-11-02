import { useState } from 'react';
import { featuredCountries, otherCountries } from '../countries';
import {
  authErrorMessage, normalizeEmail, EMAIL_PATTERN, MIN_PASSWORD_LENGTH,
} from '../usePlayerProfile';
import Flag from './Flag';
import { tr } from '../i18n';

export function CountrySelect({ value, onChange }) {
  return (
    <div className="country-select">
      <Flag code={value} />
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={tr('Țara ta')}>
        <option value="" disabled>{tr('🌍 Alege țara ta')}</option>
        {featuredCountries().map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        <option disabled>──────────</option>
        {otherCountries().map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
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
    if (!displayName.trim()) return setError(tr('Scrie numele care apare în joc.'));
    if (!EMAIL_PATTERN.test(cleanEmail)) return setError(tr('Scrie o adresă de email validă.'));
    if (password.length < MIN_PASSWORD_LENGTH) {
      return setError(tr('Parola trebuie să aibă cel puțin {n} caractere.', { n: MIN_PASSWORD_LENGTH }));
    }
    if (password !== password2) return setError(tr('Cele două parole nu sunt la fel.'));
    if (!country) return setError(tr('Alege țara ta.'));
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
        <p className="auth-note">{tr('Punctele și scorurile tale de pe acest dispozitiv se păstrează în cont. ⭐')}</p>
      )}
      <label>{tr('Numele din joc')}
        <input className="name-input" maxLength={20} value={displayName}
          onChange={e => setDisplayName(e.target.value)} placeholder={tr('ex. Andrei')} autoComplete="nickname" />
      </label>
      <label>{tr('Email (pentru logare și pentru resetarea parolei)')}
        <input className="name-input" type="email" value={email}
          onChange={e => setEmail(e.target.value)} placeholder={tr('ex. parinte@gmail.com')}
          autoComplete="email" autoCapitalize="none" spellCheck="false" />
      </label>
      <label>{tr('Parolă')}
        <input className="name-input" type="password" value={password}
          onChange={e => setPassword(e.target.value)} placeholder={tr('cel puțin {n} caractere', { n: MIN_PASSWORD_LENGTH })}
          autoComplete="new-password" />
      </label>
      <label>{tr('Repetă parola')}
        <input className="name-input" type="password" value={password2}
          onChange={e => setPassword2(e.target.value)} autoComplete="new-password" />
      </label>
      <CountrySelect value={country} onChange={setCountry} />
      {error && <p className="chat-error">{error}</p>}
      <button className="bigbtn" type="submit" disabled={busy}>{busy ? tr('Se creează…') : tr('Creează contul 🚀')}</button>
      <p className="auth-note">
        {tr('Cu emailul și parola intri în cont și de pe alt telefon sau calculator. Dacă uiți parola, primești pe email un link ca s-o schimbi.')}
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
    if (!email.trim() || !password) return setError(tr('Scrie emailul și parola.'));
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
      <label>{tr('Email')}
        <input className="name-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
          autoComplete="email" autoCapitalize="none" spellCheck="false" autoFocus />
      </label>
      <label>{tr('Parolă')}
        <input className="name-input" type="password" value={password}
          onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
      </label>
      {error && <p className="chat-error">{error}</p>}
      <button className="bigbtn" type="submit" disabled={busy}>{busy ? tr('Se intră…') : tr('Intră în cont 🔑')}</button>
      <button type="button" className="auth-link" onClick={() => onForgot(email)}>{tr('Am uitat parola')}</button>
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
    if (!EMAIL_PATTERN.test(cleanEmail)) return setError(tr('Scrie o adresă de email validă.'));
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
          {tr('📧 Dacă există un cont cu {email}, ți-am trimis un email cu un link pentru o parolă nouă. Verifică și folderul Spam.', { email: normalizeEmail(email) })}
        </p>
        <button className="bigbtn" onClick={onBack}>{tr('← Înapoi la logare')}</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <p className="auth-note">{tr('Scrie emailul contului și îți trimitem un link ca să-ți alegi o parolă nouă.')}</p>
      <label>{tr('Email')}
        <input className="name-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
          autoComplete="email" autoCapitalize="none" spellCheck="false" autoFocus />
      </label>
      {error && <p className="chat-error">{error}</p>}
      <button className="bigbtn" type="submit" disabled={busy}>{busy ? tr('Se trimite…') : tr('Trimite linkul 📧')}</button>
      <button type="button" className="auth-link" onClick={onBack}>{tr('← Înapoi la logare')}</button>
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
        <h2>{tr(titles[mode])}</h2>
        <div className="leaderboard-tabs">
          <button className={`leaderboard-tab${mode === 'register' ? ' active' : ''}`} onClick={() => setMode('register')}>
            {tr('✨ Cont nou')}
          </button>
          <button className={`leaderboard-tab${mode !== 'register' ? ' active' : ''}`} onClick={() => setMode('login')}>
            {tr('🔑 Am deja cont')}
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
