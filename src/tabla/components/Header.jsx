import { START_LIVES, MAX_LIVES, COMBO_FOR_LIFE } from '../useTablaGame';
import Flag from './Flag';
import Avatar from './Avatar';

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

export default function Header({
  totalPoints, roundPoints, lives, combo, time, inGame,
  playerName, playerCountry, playerAvatar, accountEmail, onOpenProfile, profileOpen,
}) {
  return (
    <header>
      <div className="logo"><AbacusLogo /> TABLA ÎNMULȚIRII</div>
      <div className="badges">
        {playerName && (
          <button
            className={`badge player-badge${profileOpen ? ' active' : ''}`}
            onClick={onOpenProfile}
            title={accountEmail ? `Contul meu: ${accountEmail}` : 'Contul meu'}
          >
            <Avatar src={playerAvatar} name={playerName} size={28} /> {playerName} <Flag code={playerCountry} /> ⚙️
          </button>
        )}
        <div className="badge" title="Toate punctele tale, din toate jocurile">
          ⭐ Puncte: <span>{totalPoints}</span>
          {roundPoints > 0 && <small className="round-points"> (+{roundPoints} acum)</small>}
        </div>
        {inGame && (
          <>
            <div
              className="badge lives-badge"
              title={`Vieți: ${lives}. Un răspuns greșit sau expirat costă o viață; la 0 se termină runda. `
                + `${COMBO_FOR_LIFE} răspunsuri corecte la rând îți dau o viață (maximum ${MAX_LIVES}).`}
            >
              {'❤️'.repeat(Math.max(0, lives))}{'🤍'.repeat(Math.max(0, START_LIVES - lives))}
            </div>
            <div
              className={`badge combo-badge${combo >= 3 ? ' hot' : ''}`}
              title={`Răspunsuri corecte la rând. De la 3 la rând primești bonus +5 × combo la fiecare răspuns; `
                + `la fiecare ${COMBO_FOR_LIFE} la rând primești o viață.`}
            >
              🔥 x{combo}
              {combo >= 3 && <small className="combo-bonus"> +{5 * combo}</small>}
              {combo > 0 && combo % COMBO_FOR_LIFE !== 0 && (
                <small className="combo-next"> · ❤️ în {COMBO_FOR_LIFE - (combo % COMBO_FOR_LIFE)}</small>
              )}
            </div>
            <div className="badge">⏱️ <span className={time <= 7 ? 'timer low' : ''}>{time}</span>s</div>
          </>
        )}
      </div>
    </header>
  );
}
