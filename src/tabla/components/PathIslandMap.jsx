import { useState } from 'react';
import { LEVELS } from '../data';
import { isLevelDone, isLevelUnlocked, currentLevel, previousLevel } from '../mapProgress';
import { Island, Waves, NodeButton, useMediaQuery, PHONE_QUERY } from './MapHome';

// Hartă cu câteva insule legate de o potecă, câte una pentru fiecare nivel
// (folosită de Insula Isteților și de Înmulțirea cu 5).
// layouts = { desktop: { W, H, islands, extras }, phone: { … } }; islands = [{ level, cx, cy, rx, ry, name, decor }].

function pct(value, total) {
  return `${(value / total) * 100}%`;
}

function levelName(level) {
  return LEVELS[level].label.replace(/^[^\p{L}]+/u, '');
}

export default function PathIslandMap({
  mapKey, title, path, layouts, ocean, intro, doneText, name, scores, onPlayLevel, onBack, corner, children,
  backLabel = "← Insula Învățării",
}) {
  const isPhone = useMediaQuery(PHONE_QUERY);
  const layout = isPhone ? layouts.phone : layouts.desktop;
  const { W, H, islands } = layout;
  const [owlMessage, setOwlMessage] = useState(null);
  const doneCount = path.filter(level => isLevelDone(scores, level)).length;
  const current = currentLevel(scores, path);

  const handleSelect = (level) => {
    if (!isLevelUnlocked(scores, level)) {
      setOwlMessage(`Termină întâi „${levelName(previousLevel(level))}” ca să deblochezi acest nivel! 🔒`);
      return;
    }
    onPlayLevel(level);
  };

  const greeting = owlMessage
    || (doneCount === path.length ? `Bravo${name ? `, ${name}` : ''}! ${doneText}` : intro);

  // Poteca dintre noduri: curbe line între insule.
  const nodes = islands.map(island => ({ x: island.cx, y: island.cy - island.ry * 0.25 }));
  let d = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i += 1) {
    const a = nodes[i - 1];
    const b = nodes[i];
    d += ` Q ${(a.x + b.x) / 2} ${Math.min(a.y, b.y) - 40} ${b.x} ${b.y}`;
  }

  const startButton = (className) => (
    <button className={className} onClick={() => onPlayLevel(current)}>
      {doneCount === 0 ? 'ÎNCEPE!' : 'CONTINUĂ!'}
      <small>{levelName(current)}</small>
    </button>
  );

  return (
    <section className={`map-home logic-map ${mapKey}-map`}>
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
              <linearGradient id={`${mapKey}-ocean`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={ocean[0]} />
                <stop offset="0.55" stopColor={ocean[1]} />
                <stop offset="1" stopColor={ocean[2]} />
              </linearGradient>
            </defs>
            <rect width={W} height={H} fill={`url(#${mapKey}-ocean)`} />
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

          <button className="map-home-back logic-back" onClick={onBack}>{backLabel}</button>
          <div className="logic-title">{title}</div>
          {corner && <div className="map-corner">{corner}</div>}

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

          {!isPhone && startButton('map-start logic-start')}
        </div>
      </div>
      {isPhone && startButton('map-start-mobile')}
      {children}
    </section>
  );
}
