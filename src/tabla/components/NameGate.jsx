import { useState } from 'react';

export default function NameGate({ onSubmit }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSubmit(value);
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="reward">🙋</div>
        <h2>Cum te numești?</h2>
        <p>Alege un nume ca să apari în clasament!</p>
        <form onSubmit={handleSubmit}>
          <input
            className="name-input"
            type="text"
            maxLength={20}
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Numele tău"
          />
          <button className="bigbtn" type="submit" disabled={!value.trim()}>Start! 🚀</button>
        </form>
      </div>
    </div>
  );
}
