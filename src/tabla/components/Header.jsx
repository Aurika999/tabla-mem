import Flag from './Flag';

const ABACUS_ROWS = [
  { y: 22, color: '#e84d8d', beads: [0, 1, 2, 6, 7] },
  { y: 40, color: '#f4a623', beads: [0, 1, 5, 6, 7] },
  { y: 58, color: '#5fc84a', beads: [0, 1, 2, 3, 7] },
  { y: 76, color: '#20a8e8', beads: [0, 4, 5, 6, 7] },
];

function AbacusLogo() {
  return (
    <svg className="logo-abacus" viewBox="0 0 120 100" aria-hidden="true">
      <rect x="4" y="6" width="112" height="88" rx="10" fill="#a0612b" />
      <rect x="13" y="12" width="94" height="76" rx="5" fill="#fff6e6" />
      {ABACUS_ROWS.map(row => (
        <g key={row.y}>
          <line x1="13" x2="107" y1={row.y} y2={row.y} stroke="#7a4a20" strokeWidth="2.5" />
          {row.beads.map(slot => (
            <ellipse key={slot} cx={22 + slot * 10.9} cy={row.y} rx="5.4" ry="7" fill={row.color} stroke="#0003" strokeWidth="1" />
          ))}
        </g>
      ))}
    </svg>
  );
}

export default function Header({ points, lives, combo, time, playerName, playerCountry }) {
  return (
    <header>
      <div className="logo"><AbacusLogo /> TABLA ÎNMULȚIRII</div>
      <div className="badges">
        {playerName && <div className="badge player-badge">👤 {playerName} <Flag code={playerCountry} /></div>}
        <div className="badge">⭐ Puncte: <span>{points}</span></div>
        <div className="badge">❤️ Vieți: <span>{lives}</span></div>
        <div className="badge">🔥 Combo: x<span>{combo}</span></div>
        <div className="badge">⏱️ <span className={time <= 7 ? 'timer low' : ''}>{time}</span>s</div>
      </div>
    </header>
  );
}
