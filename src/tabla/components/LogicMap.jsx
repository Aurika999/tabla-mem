import { useState } from 'react';
import { LEVELS } from '../data';
import {
  LOGIC_PATH, isLevelDone, isLevelUnlocked, currentLevel, previousLevel,
} from '../mapProgress';
import { Island, Waves, NodeButton, useMediaQuery, PHONE_QUERY } from './MapHome';

// Harta „Insulei Isteților”: trei insule mici, câte una pentru fiecare nivel.
const LAYOUTS = {
  desktop: {
    W: 1000,
    H: 610,
    islands: [
      { level: 'logica1', cx: 165, cy: 380, rx: 128, ry: 62, name: 'Poiana Socotelilor',
        decor: [['🍎', 80, 372, 30], ['🌳', 250, 352, 36], ['🎈', 230, 400, 24]] },
      { level: 'logica2', cx: 390, cy: 215, rx: 130, ry: 62, name: 'Târgul cu Bani',
        decor: [['🛒', 305, 208, 34], ['🪙', 470, 228, 24], ['🧸', 488, 196, 28]] },
      { level: 'logica3', cx: 615, cy: 380, rx: 128, ry: 62, name: 'Turnul Isteților',
        decor: [['🏰', 545, 352, 40], ['🕐', 700, 372, 26], ['🚌', 688, 404, 22]] },
      { level: 'logica4', cx: 840, cy: 215, rx: 130, ry: 62, name: 'Observatorul Isteților',
        decor: [['🔭', 760, 200, 38], ['🌙', 920, 188, 26], ['⭐', 935, 232, 22], ['💐', 895, 250, 22]] },
    ],
    extras: [['⛵', 470, 110, 30], ['🐬', 500, 470, 40], ['🐳', 950, 560, 30], ['☁️', 960, 70, 26], ['🐠', 290, 560, 22]],
  },
  phone: {
    W: 600,
    H: 1160,
    islands: [
      { level: 'logica1', cx: 200, cy: 190, rx: 170, ry: 78, name: 'Poiana Socotelilor',
        decor: [['🍎', 80, 180, 38], ['🌳', 318, 160, 44]] },
      { level: 'logica2', cx: 400, cy: 450, rx: 170, ry: 78, name: 'Târgul cu Bani',
        decor: [['🛒', 285, 440, 40], ['🧸', 515, 430, 36]] },
      { level: 'logica3', cx: 200, cy: 710, rx: 170, ry: 78, name: 'Turnul Isteților',
        decor: [['🏰', 85, 690, 50], ['🕐', 320, 700, 34]] },
      { level: 'logica4', cx: 400, cy: 970, rx: 170, ry: 78, name: 'Observatorul Isteților',
        decor: [['🔭', 285, 955, 44], ['⭐', 515, 950, 34]] },
    ],
    extras: [['⛵', 520, 120, 34], ['🐬', 120, 470, 42], ['🐳', 520, 1120, 32]],
  },
};

function pct(value, total) {
  return `${(value / total) * 100}%`;
}

export default function LogicMap({ name, scores, onPlayLevel, onBack }) {
  const isPhone = useMediaQuery(PHONE_QUERY);
  const layout = isPhone ? LAYOUTS.phone : LAYOUTS.desktop;
  const { W, H, islands } = layout;
  const [owlMessage, setOwlMessage] = useState(null);
  const doneCount = LOGIC_PATH.filter(level => isLevelDone(scores, level)).length;
  const current = currentLevel(scores, LOGIC_PATH);

  const handleSelect = (level) => {
    if (!isLevelUnlocked(scores, level)) {
      const prev = LEVELS[previousLevel(level)].label.replace(/^[^\p{L}]+/u, '');
      setOwlMessage(`Termină întâi „${prev}” ca să deblochezi acest nivel! 🔒`);
      return;
    }
    onPlayLevel(level);
  };

  const greeting = owlMessage
    || (doneCount === LOGIC_PATH.length
      ? `Bravo${name ? `, ${name}` : ''}! Ești un adevărat istețel! 🏆`
      : 'Aici sunt probleme de gândire: adunări, scăderi și exerciții ca în manual. 🧩');

  // Poteca dintre noduri: curbe line între insule.
  const nodes = islands.map(island => ({ x: island.cx, y: island.cy - island.ry * 0.25 }));
  let d = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i += 1) {
    const a = nodes[i - 1];
    const b = nodes[i];
    d += ` Q ${(a.x + b.x) / 2} ${Math.min(a.y, b.y) - 40} ${b.x} ${b.y}`;
  }

  return (
    <section className="map-home logic-map">
      {isPhone && (
        <div className="map-mobile-owl">
          <span className="map-owl-emoji" aria-hidden="true">🦉</span>
          <div className="map-owl-bubble">{greeting}</div>
        </div>
      )}
      <div className="map-scroll home-frame logic-frame">
        <div className="map-canvas home-canvas" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg className="map-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <defs>
              <linearGradient id="logic-ocean" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#3cc4c9" />
                <stop offset="0.55" stopColor="#1b9bc0" />
                <stop offset="1" stopColor="#11729c" />
              </linearGradient>
            </defs>
            <rect width={W} height={H} fill="url(#logic-ocean)" />
            <Waves />
            {layout.extras.map(([emoji, x, y, size]) => (
              <text key={`${emoji}-${x}`} x={x} y={y} fontSize={size} textAnchor="middle" dominantBaseline="middle">{emoji}</text>
            ))}
            {islands.map(island => <Island key={island.level} {...island} />)}
            <path d={d} fill="none" stroke="#f7e3b0" strokeWidth="14" strokeLinecap="round" opacity="0.9" />
            <path d={d} fill="none" stroke="#c99a57" strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round" />
            {islands.flatMap(island => island.decor.map(([emoji, x, y, size]) => (
              <text key={`${island.level}-${emoji}-${x}`} x={x} y={y} fontSize={size} textAnchor="middle"
                dominantBaseline="middle">{emoji}</text>
            )))}
            {islands.map(island => (
              <text key={`label-${island.level}`} className="map-island-label" x={island.cx} y={island.cy + island.ry + 34}
                textAnchor="middle">{island.name.toUpperCase()}</text>
            ))}
          </svg>

          <button className="map-home-back logic-back" onClick={onBack}>← Prima pagină</button>
          <div className="logic-title">🧩 INSULA ISTEȚILOR</div>

          {islands.map((island, i) => (
            <NodeButton
              key={island.level}
              level={island.level}
              scores={scores}
              isCurrent={island.level === current}
              onSelect={handleSelect}
              style={{ left: pct(nodes[i].x, W), top: pct(nodes[i].y, H) }}
            />
          ))}

          {!isPhone && (
            <div className="map-owl logic-owl">
              <div className="map-owl-bubble">{greeting}</div>
              <span className="map-owl-emoji" aria-hidden="true">🦉</span>
            </div>
          )}

          {!isPhone && (
            <button className="map-start logic-start" onClick={() => onPlayLevel(current)}>
              {doneCount === 0 ? 'ÎNCEPE!' : 'CONTINUĂ!'}
              <small>{LEVELS[current].label.replace(/^[^\p{L}]+/u, '')}</small>
            </button>
          )}
        </div>
      </div>
      {isPhone && (
        <button className="map-start-mobile" onClick={() => onPlayLevel(current)}>
          {doneCount === 0 ? 'ÎNCEPE!' : 'CONTINUĂ!'}
          <small>{LEVELS[current].label.replace(/^[^\p{L}]+/u, '')}</small>
        </button>
      )}
    </section>
  );
}
