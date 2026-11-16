import { useState } from 'react';
import { featuredCountries, otherCountries } from '../countries';
import Flag from './Flag';
import { tr } from '../i18n';
import { hasBadWords } from '../chatSafety';

export default function NameGate({ initialName = '', initialCountry = '', onSubmit }) {
  const [value, setValue] = useState(initialName);
  const [country, setCountry] = useState(initialCountry);

  const badName = hasBadWords(value);
  const canSubmit = Boolean(value.trim() && country) && !badName;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSubmit) onSubmit(value, country);
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="reward">🙋</div>
        <h2>{tr('Cum te numești?')}</h2>
        <p>{tr('Alege un nume și țara ta ca să apari în clasament!')}</p>
        <form onSubmit={handleSubmit}>
          <input
            className="name-input"
            type="text"
            maxLength={20}
            autoFocus={!initialName}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={tr('Numele tău')}
          />
          <div className="country-select">
            <Flag code={country} />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              aria-label={tr('Țara ta')}
            >
              <option value="" disabled>{tr('🌍 Alege țara ta')}</option>
              {featuredCountries().map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              <option disabled>──────────</option>
              {otherCountries().map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>
          {badName && <p className="chat-error">{tr('Alege un alt nume, fără cuvinte urâte.')}</p>}
          <button className="bigbtn" type="submit" disabled={!canSubmit}>Start! 🚀</button>
        </form>
      </div>
    </div>
  );
}
