export default function Header({ points, lives, combo, time, playerName }) {
  return (
    <header>
      <div className="logo">⭐ TABLA ÎNMULȚIRII</div>
      <div className="badges">
        {playerName && <div className="badge player-badge">👤 {playerName}</div>}
        <div className="badge">⭐ Puncte: <span>{points}</span></div>
        <div className="badge">❤️ Vieți: <span>{lives}</span></div>
        <div className="badge">🔥 Combo: x<span>{combo}</span></div>
        <div className="badge">⏱️ <span className={time <= 7 ? 'timer low' : ''}>{time}</span>s</div>
      </div>
    </header>
  );
}
