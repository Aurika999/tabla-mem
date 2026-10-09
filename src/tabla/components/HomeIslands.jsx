import { LEVELS } from '../data';
import { LEVEL_PATH, isLevelDone, currentLevel } from '../mapProgress';
import { Island, Waves, useMediaQuery, PHONE_QUERY } from './MapHome';

// Prima pagină: două insule mari — Arena Concursului și insula „Învață”,
// care duce pe harta cu toate nivelurile.
const LAYOUTS = {
  desktop: {
    W: 1000,
    H: 600,
    islands: {
      arena: {
        cx: 280, cy: 300, rx: 195, ry: 92,
        decor: [['🏰', 262, 262, 112], ['🚩', 130, 280, 40], ['🚩', 410, 272, 40], ['🏆', 372, 330, 36], ['🌴', 160, 330, 34]],
      },
      learn: {
        cx: 720, cy: 300, rx: 205, ry: 95,
        decor: [['🏫', 712, 258, 108], ['📚', 572, 310, 44], ['🧮', 862, 306, 42], ['🌳', 608, 250, 40], ['🌳', 838, 248, 36], ['✏️', 790, 336, 28]],
      },
    },
    extras: [['⛵', 70, 110, 34], ['🐬', 500, 470, 50], ['🐟', 552, 512, 24], ['🐳', 935, 545, 34], ['☁️', 40, 40, 30], ['☁️', 470, 60, 26], ['🐠', 120, 540, 26]],
  },
  phone: {
    W: 600,
    H: 900,
    islands: {
      arena: {
        cx: 300, cy: 200, rx: 225, ry: 100,
        decor: [['🏰', 290, 160, 120], ['🚩', 130, 180, 44], ['🚩', 455, 172, 44], ['🏆', 410, 230, 40]],
      },
      learn: {
        cx: 300, cy: 600, rx: 235, ry: 105,
        decor: [['🏫', 300, 555, 118], ['📚', 140, 610, 46], ['🧮', 462, 606, 44], ['🌳', 175, 545, 40], ['✏️', 400, 640, 30]],
      },
    },
    extras: [['⛵', 40, 400, 34], ['🐬', 470, 420, 44], ['🐳', 520, 860, 32], ['☁️', 30, 40, 28]],
  },
};

function pct(value, total) {
  return `${(value / total) * 100}%`;
}

export default function HomeIslands({ name, scores, onOpenLearn, onOpenPanel, chatUnread }) {
  const isPhone = useMediaQuery(PHONE_QUERY);
  const layout = isPhone ? LAYOUTS.phone : LAYOUTS.desktop;
  const { W, H, islands } = layout;
  const doneCount = LEVEL_PATH.filter(level => isLevelDone(scores, level)).length;
  const current = currentLevel(scores);

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
                  <div className="home-island-title">{card.title}</div>
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
