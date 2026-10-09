import { LEVELS } from '../data';
import { LEVEL_PATH, LOGIC_PATH, isLevelDone, currentLevel } from '../mapProgress';
import { Island, Waves, useMediaQuery, PHONE_QUERY } from './MapHome';

// Prima pagină: două insule mari — Arena Concursului și insula „Învață”,
// care duce pe harta cu toate nivelurile.
const LAYOUTS = {
  desktop: {
    W: 1000,
    H: 600,
    islands: {
      arena: {
        cx: 175, cy: 300, rx: 150, ry: 78,
        decor: [['🏰', 165, 262, 88], ['🚩', 62, 285, 34], ['🚩', 282, 278, 34], ['🏆', 250, 330, 30]],
      },
      learn: {
        cx: 500, cy: 300, rx: 155, ry: 80,
        decor: [['🏫', 495, 260, 86], ['📚', 380, 312, 38], ['🧮', 615, 308, 36], ['🌳', 410, 255, 34], ['✏️', 568, 340, 24]],
      },
      logic: {
        cx: 825, cy: 300, rx: 150, ry: 78,
        decor: [['🧩', 815, 262, 80], ['🍬', 712, 300, 34], ['🎈', 925, 280, 36], ['🪙', 900, 335, 26], ['🍎', 740, 340, 26]],
      },
    },
    extras: [['⛵', 70, 110, 34], ['🐬', 340, 500, 42], ['🐟', 380, 535, 22], ['🐳', 940, 555, 32], ['☁️', 40, 40, 30], ['🐠', 660, 540, 24]],
  },
  phone: {
    W: 600,
    H: 1290,
    islands: {
      arena: {
        cx: 300, cy: 200, rx: 225, ry: 100,
        decor: [['🏰', 290, 160, 120], ['🚩', 130, 180, 44], ['🚩', 455, 172, 44], ['🏆', 410, 230, 40]],
      },
      learn: {
        cx: 300, cy: 610, rx: 235, ry: 105,
        decor: [['🏫', 300, 565, 118], ['📚', 140, 620, 46], ['🧮', 462, 616, 44], ['🌳', 175, 555, 40], ['✏️', 400, 650, 30]],
      },
      logic: {
        cx: 300, cy: 1020, rx: 230, ry: 102,
        decor: [['🧩', 300, 975, 110], ['🍬', 140, 1010, 44], ['🎈', 455, 985, 46], ['🪙', 430, 1050, 34]],
      },
    },
    extras: [['⛵', 40, 400, 34], ['🐬', 470, 420, 44], ['🐟', 90, 820, 28], ['🐳', 520, 1250, 32], ['☁️', 30, 40, 28]],
  },
};

function pct(value, total) {
  return `${(value / total) * 100}%`;
}

export default function HomeIslands({
  name, scores, onOpenLearn, onOpenLogic, onOpenPanel, chatUnread,
}) {
  const isPhone = useMediaQuery(PHONE_QUERY);
  const layout = isPhone ? LAYOUTS.phone : LAYOUTS.desktop;
  const { W, H, islands } = layout;
  const doneCount = LEVEL_PATH.filter(level => isLevelDone(scores, level)).length;
  const current = currentLevel(scores);
  const logicDone = LOGIC_PATH.filter(level => isLevelDone(scores, level)).length;

  const cards = [
    {
      key: 'arena',
      title: 'ARENA CONCURSULUI',
      subtitle: 'Concurează cu alți jucători',
      cta: '🏁 Intră în arenă',
      onClick: () => onOpenPanel('contest'),
    },
    {
      key: 'learn',
      title: 'ÎNVAȚĂ',
      subtitle: doneCount === LEVEL_PATH.length
        ? 'Ai terminat toate nivelurile! 🏆'
        : `⭐ ${doneCount} / ${LEVEL_PATH.length} niveluri · urmează ${LEVELS[current].label}`,
      cta: '📚 Hai să învățăm!',
      onClick: onOpenLearn,
    },
    {
      key: 'logic',
      title: 'INSULA ISTEȚILOR',
      subtitle: logicDone === LOGIC_PATH.length
        ? 'Ai terminat toate problemele! 🏆'
        : `🧩 ${logicDone} / ${LOGIC_PATH.length} niveluri · probleme de gândire`,
      cta: '🧩 Rezolvă probleme',
      onClick: onOpenLogic,
    },
  ];

  return (
    <section className="map-home home-islands">
      {isPhone && (
        <div className="map-mobile-owl">
          <span className="map-owl-emoji" aria-hidden="true">🦉</span>
          <div className="map-owl-bubble">Bine ai venit{name ? `, ${name}` : ''}! Alege o insulă! 🏝️</div>
        </div>
      )}
      <div className="map-scroll home-frame">
        <div className="map-canvas home-canvas" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg className="map-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <defs>
              <linearGradient id="home-ocean" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2fb6e4" />
                <stop offset="0.55" stopColor="#1b93cf" />
                <stop offset="1" stopColor="#0f6fa8" />
              </linearGradient>
            </defs>
            <rect width={W} height={H} fill="url(#home-ocean)" />
            <Waves />
            {layout.extras.map(([emoji, x, y, size]) => (
              <text key={`${emoji}-${x}`} x={x} y={y} fontSize={size} textAnchor="middle" dominantBaseline="middle">{emoji}</text>
            ))}
            {cards.map(card => <Island key={card.key} {...islands[card.key]} />)}
            {cards.flatMap(card => islands[card.key].decor.map(([emoji, x, y, size]) => (
              <text key={`${card.key}-${emoji}-${x}`} x={x} y={y} fontSize={size} textAnchor="middle"
                dominantBaseline="middle">{emoji}</text>
            )))}
          </svg>

          <nav className="map-side">
            <button onClick={() => onOpenPanel('leaderboard')}><span>🏆</span>Clasament</button>
            <button onClick={() => onOpenPanel('chat')}>
              <span>💬</span>Chat
              {chatUnread > 0 && <b className="level-badge">{chatUnread}</b>}
            </button>
          </nav>

          {cards.map(card => {
            const island = islands[card.key];
            return (
              <div key={card.key}>
                {/* Toată insula e clicabilă, nu doar butonul de sub ea. */}
                <button
                  className="home-island-hit"
                  style={{
                    left: pct(island.cx, W), top: pct(island.cy, H),
                    width: pct(island.rx * 2, W), height: pct(island.ry * 2.2, H),
                  }}
                  onClick={card.onClick}
                  aria-label={card.title}
                />
                <div className="home-island-sign" style={{ left: pct(island.cx, W), top: pct(island.cy + island.ry + 18, H) }}>
                  <div className={`home-island-title${card.title.length > 12 ? ' long' : ''}`}>{card.title}</div>
                  <div className="home-island-subtitle">{card.subtitle}</div>
                  <button className={`home-island-cta ${card.key}`} onClick={card.onClick}>{card.cta}</button>
                </div>
              </div>
            );
          })}

          {!isPhone && (
            <div className="map-owl home-owl">
              <div className="map-owl-bubble">Bine ai venit{name ? `, ${name}` : ''}! Alege o insulă! 🏝️</div>
              <span className="map-owl-emoji" aria-hidden="true">🦉</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
