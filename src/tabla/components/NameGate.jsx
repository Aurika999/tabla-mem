import { useState } from 'react';
import { FEATURED_COUNTRIES, OTHER_COUNTRIES } from '../countries';
import Flag from './Flag';

export default function NameGate({ initialName = '', initialCountry = '', onSubmit }) {
  const [value, setValue] = useState(initialName);
  const [country, setCountry] = useState(initialCountry);

  const canSubmit = Boolean(value.trim() && country);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSubmit) onSubmit(value, country);
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="reward">🙋</div>
        <h2>Cum te numești?</h2>
        <p>Alege un nume și țara ta ca să apari în clasament!</p>
        <form onSubmit={handleSubmit}>
          <input
            className="name-input"
            type="text"
            maxLength={20}
            autoFocus={!initialName}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Numele tău"
          />
          <div className="country-select">
            <Flag code={country} />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              aria-label="Țara ta"
            >
              <option value="" disabled>🌍 Alege țara ta</option>
              {FEATURED_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              <option disabled>──────────</option>
              {OTHER_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>
          <button className="bigbtn" type="submit" disabled={!canSubmit}>Start! 🚀</button>
        </form>
      </div>
    </div>
  );
}
