import { useEffect, useRef, useState } from 'react';
import { LEVELS, PROBLEME_LEVEL, AVANSATE_LEVEL } from '../data';
import {
  LEVEL_PATH, isLevelDone, isLevelUnlocked, levelStars, currentLevel, previousLevel,
} from '../mapProgress';

// Harta e desenată într-un sistem de coordonate 1000 × 600; nodurile HTML
// sunt poziționate în procente peste desen, ca să se scaleze împreună.
const W = 1000;
const H = 600;

// Etichetele insulelor stau sub insulă, iar nodurile pe partea de sus, ca să nu se suprapună.
const ISLANDS = [
  { key: 'start', cx: 175, cy: 482, rx: 128, ry: 60, label: 'Insula Startului', lx: 200, ly: 568,
    decor: [['🌴', 278, 470, 34], ['🐚', 250, 515, 18]] },
  { key: 'adventure', cx: 300, cy: 318, rx: 112, ry: 56, label: 'Insula Aventurii', lx: 348, ly: 398,
    decor: [['🏞️', 228, 304, 40], ['🌳', 388, 300, 32], ['🪨', 366, 340, 20]] },
  { key: 'camp', cx: 335, cy: 160, rx: 118, ry: 54, label: 'Câmpul Cifrelor', lx: 315, ly: 238,
    decor: [['⛺', 262, 150, 36], ['🔥', 300, 168, 22], ['🌳', 440, 148, 32], ['🌼', 285, 186, 16]] },
  { key: 'forest', cx: 630, cy: 162, rx: 130, ry: 58, label: 'Pădurea Înmulțirii', lx: 625, ly: 246,
    decor: [['🌲', 530, 146, 38], ['🌲', 556, 122, 30], ['🍄', 700, 180, 22], ['🌲', 718, 134, 36], ['🌲', 746, 156, 30]] },
  { key: 'mountains', cx: 862, cy: 140, rx: 122, ry: 68, label: 'Munții Geniului', lx: 848, ly: 236,
    decor: [['🏔️', 792, 108, 52], ['⛰️', 912, 100, 48], ['🌲', 940, 166, 26]] },
  { key: 'library', cx: 862, cy: 352, rx: 110, ry: 54, label: 'Biblioteca Problemelor', lx: 862, ly: 432,
    decor: [['🏛️', 928, 338, 36], ['📚', 790, 358, 26], ['🌳', 952, 372, 24]] },
  { key: 'volcano', cx: 712, cy: 488, rx: 122, ry: 58, label: 'Vulcanul Provocărilor', lx: 712, ly: 572,
    decor: [['🌋', 628, 474, 46], ['🌴', 810, 476, 32], ['💎', 780, 508, 18]] },
];

// Poziția fiecărui nod de nivel pe hartă (în coordonatele desenului).
const NODES = {
  1: { x: 210, y: 452 },
  2: { x: 318, y: 292 },
  3: { x: 392, y: 134 },
  4: { x: 630, y: 134 },
  5: { x: 856, y: 140 },
  [PROBLEME_LEVEL]: { x: 852, y: 322 },
  [AVANSATE_LEVEL]: { x: 718, y: 456 },
};

const NODE_COLORS = {
  1: '#5fc84a', 2: '#20a8e8', 3: '#f4a623', 4: '#9258d8', 5: '#e84d8d',
  [PROBLEME_LEVEL]: '#3d9b70', [AVANSATE_LEVEL]: '#e0632c',
  logica1: '#14a3a3', logica2: '#ef5da8', logica3: '#7c4dff', logica4: '#f08c00',
};

const NODE_LABELS = {
  1: '1', 2: '2', 3: '3', 4: '4', 5: '5', [PROBLEME_LEVEL]: '📖', [AVANSATE_LEVEL]: '🧠',
  logica1: '1', logica2: '2', logica3: '3', logica4: '4',
};

// Poteca dintre noduri: curbe line, ca un drum de nisip.
function pathThroughNodes() {
  const points = LEVEL_PATH.map(level => NODES[level]);
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    // Curbăm ușor spre exterior, alternând partea.
    const bend = i % 2 === 0 ? 40 : -40;
    d += ` Q ${mx + bend} ${my - bend / 2} ${b.x} ${b.y}`;
  }
  return d;
}

export function Island({ cx, cy, rx, ry }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + ry * 0.45} rx={rx * 1.12} ry={ry * 0.9} fill="#2ea7d8" opacity="0.55" />
      <ellipse cx={cx} cy={cy + ry * 0.28} rx={rx * 1.04} ry={ry * 0.92} fill="#f3d38b" />
      <ellipse cx={cx} cy={cy + ry * 0.22} rx={rx * 0.98} ry={ry * 0.8} fill="#b9773e" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry * 0.82} fill="#5fbf45" />
      <ellipse cx={cx - rx * 0.35} cy={cy - ry * 0.18} rx={rx * 0.5} ry={ry * 0.5} fill="#79d35a" />
      <ellipse cx={cx + rx * 0.4} cy={cy - ry * 0.05} rx={rx * 0.42} ry={ry * 0.45} fill="#6fcb50" />
      <ellipse cx={cx - rx * 0.1} cy={cy - ry * 0.35} rx={rx * 0.35} ry={ry * 0.25} fill="#8fe06c" opacity="0.8" />
    </g>
  );
}

export function Waves() {
  const waves = [
    [460, 300], [560, 330], [420, 420], [600, 400], [250, 230], [760, 250], [80, 300],
    [950, 470], [540, 560], [330, 560], [960, 260], [690, 320], [40, 560], [250, 60], [740, 40],
  ];
  return waves.map(([x, y]) => (
    <path key={`${x}-${y}`} d={`M ${x} ${y} q 8 -7 16 0 t 16 0`} stroke="#ffffff" strokeWidth="3"
      fill="none" opacity="0.45" strokeLinecap="round" />
  ));
}

export function NodeButton({ level, scores, isCurrent, onSelect, style, buttonRef }) {
  // Nodurile altor hărți (ex. Insula Isteților) își dau poziția prin `style`.
  const pos = NODES[level] || { x: 0, y: 0 };
  const done = isLevelDone(scores, level);
  const unlocked = isLevelUnlocked(scores, level);
  const stars = levelStars(scores, level);
  const info = LEVELS[level];
  const name = info.label.replace(/^\d+\.\s*/, '').replace(/^[^\p{L}]+/u, '');
  return (
    <button
      className={`map-node${done ? ' done' : ''}${unlocked ? '' : ' locked'}${isCurrent ? ' current' : ''}`}
      ref={buttonRef}
      style={{
        left: `${(pos.x / W) * 100}%`, top: `${(pos.y / H) * 100}%`, ...style, '--node-color': NODE_COLORS[level],
      }}
      onClick={() => onSelect(level)}
      title={unlocked ? `${info.label} — ${info.hint}` : 'Nivel blocat'}
    >
      <span className="map-node-circle">{unlocked ? NODE_LABELS[level] : '🔒'}</span>
      {done && <span className="map-node-stars">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</span>}
      <span className="map-node-label">
        {name}
        <small>{info.hint}</small>
      </span>
      {isCurrent && <span className="map-node-here">Ești aici!</span>}
    </button>
  );
}


export function useMediaQuery(queryText) {
  const [matches, setMatches] = useState(() => window.matchMedia(queryText).matches);
  useEffect(() => {
    const mq = window.matchMedia(queryText);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [queryText]);
  return matches;
}

// Pe telefon harta e verticală: insulele vin una sub alta, în zigzag.
export const PHONE_QUERY = '(max-width: 700px)';
const ROW_H = 140;
const MOBILE_TOP = 20;
const LEVEL_ISLAND = {
  1: 'start', 2: 'adventure', 3: 'camp', 4: 'forest', 5: 'mountains',
  [PROBLEME_LEVEL]: 'library', [AVANSATE_LEVEL]: 'volcano',
};

function MobileMap({ scores, current, onSelect }) {
  const rows = LEVEL_PATH;
  const height = MOBILE_TOP + rows.length * ROW_H;
  const points = rows.map((_, i) => ({ x: i % 2 === 0 ? 30 : 70, y: MOBILE_TOP + i * ROW_H + ROW_H / 2 }));
  const currentRef = useRef(null);

  // Arătăm direct nivelul la care a rămas jucătorul.
  useEffect(() => {
    if (LEVEL_PATH.indexOf(current) > 1) currentRef.current?.scrollIntoView({ block: 'center' });
    // Doar la deschiderea hărții, nu la fiecare actualizare a scorurilor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    d += ` C ${a.x} ${a.y + ROW_H / 2} ${b.x} ${b.y - ROW_H / 2} ${b.x} ${b.y}`;
  }

  return (
    <div className="map-mobile" style={{ height }}>
      <svg className="map-mobile-path" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <path d={d} fill="none" stroke="#f7e3b0" strokeWidth="14" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path d={d} fill="none" stroke="#c99a57" strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round"
          vectorEffect="non-scaling-stroke" />
      </svg>
      {rows.map((row, i) => {
        const island = ISLANDS.find(item => item.key === LEVEL_ISLAND[row]);
        const p = points[i];
        const [first, second] = island.decor;
        return (
          <div key={row} className="map-mobile-island" style={{ left: `${p.x}%`, top: p.y }}>
            <span className="map-mobile-island-name">{island.label}</span>
            <svg viewBox="0 0 240 130" className="map-mobile-island-svg" aria-hidden="true">
              <Island cx={120} cy={62} rx={105} ry={50} />
              {first && <text x="38" y="52" fontSize="34" textAnchor="middle" dominantBaseline="middle">{first[0]}</text>}
              {second && <text x="204" y="58" fontSize="28" textAnchor="middle" dominantBaseline="middle">{second[0]}</text>}
            </svg>
          </div>
        );
      })}
      {LEVEL_PATH.map((level, i) => (
        <NodeButton
          key={level}
          level={level}
          scores={scores}
          isCurrent={level === current}
          onSelect={onSelect}
          buttonRef={level === current ? currentRef : undefined}
          style={{ left: `${points[i].x}%`, top: points[i].y + 6 }}
        />
      ))}
    </div>
  );
}

export default function MapHome({
  name, scores, onPlayLevel, onOpenPanel, chatUnread, onBack,
}) {
  const [owlMessage, setOwlMessage] = useState(null);
  const isPhone = useMediaQuery(PHONE_QUERY);
  const doneCount = LEVEL_PATH.filter(level => isLevelDone(scores, level)).length;
  const current = currentLevel(scores);

  const handleSelect = (level) => {
    if (!isLevelUnlocked(scores, level)) {
      const prev = LEVELS[previousLevel(level)];
      setOwlMessage(`Termină întâi „${prev.label.replace(/^\d+\.\s*/, '')}” ca să deblochezi acest nivel! 🔒`);
      return;
    }
    onPlayLevel(level);
  };

  const greeting = owlMessage
    || (doneCount === LEVEL_PATH.length
      ? `Bravo, ${name || 'campionule'}! Ai terminat toată harta! 🏆`
      : `Bine ai venit${name ? `, ${name}` : ''}! Hai la aventură! 🚀`);

  const backButton = (
    <button className="map-home-back" onClick={onBack}>← Prima pagină</button>
  );

  const sideButtons = (
    <nav className="map-side">
      {isPhone && backButton}
      <button onClick={() => onOpenPanel('leaderboard')}><span>🏆</span>Clasament</button>
      <button onClick={() => onOpenPanel('chat')}>
        <span>💬</span>Chat
        {chatUnread > 0 && <b className="level-badge">{chatUnread}</b>}
      </button>
    </nav>
  );

  return (
    <section className="map-home">
      {isPhone ? (
        <>
          <div className="map-mobile-owl">
            <span className="map-owl-emoji" aria-hidden="true">🦉</span>
            <div className="map-owl-bubble">{greeting}</div>
          </div>
          <div className="map-mobile-frame">
            {sideButtons}
            <MobileMap scores={scores} current={current} onSelect={handleSelect} />
          </div>
          <button className="map-start-mobile" onClick={() => onPlayLevel(current)}>
            {doneCount === 0 ? 'ÎNCEPE AVENTURA!' : 'CONTINUĂ AVENTURA!'}
            <small>{LEVELS[current].label}</small>
          </button>
        </>
      ) : (
      <div className="map-scroll">
        <div className="map-canvas">
          <svg className="map-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <defs>
              <linearGradient id="map-ocean" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2fb6e4" />
                <stop offset="0.55" stopColor="#1b93cf" />
                <stop offset="1" stopColor="#0f6fa8" />
              </linearGradient>
            </defs>
            <rect width={W} height={H} fill="url(#map-ocean)" />
            <Waves />
            <text x="40" y="250" fontSize="30">⛵</text>
            <text x="590" y="590" fontSize="26">🐠</text>
            <text x="525" y="345" fontSize="46" textAnchor="middle">🐬</text>
            <text x="585" y="395" fontSize="22" textAnchor="middle">🐟</text>
            <text x="955" y="560" fontSize="30">🐳</text>
            <text x="20" y="40" fontSize="26">☁️</text>
            {ISLANDS.map(island => <Island key={island.key} {...island} />)}
            <path d={pathThroughNodes()} fill="none" stroke="#f7e3b0" strokeWidth="14" strokeLinecap="round" opacity="0.9" />
            <path d={pathThroughNodes()} fill="none" stroke="#c99a57" strokeWidth="4" strokeDasharray="2 14"
              strokeLinecap="round" />
            {ISLANDS.flatMap(island => island.decor.map(([emoji, x, y, size]) => (
              <text key={`${island.key}-${emoji}-${x}`} x={x} y={y} fontSize={size} textAnchor="middle"
                dominantBaseline="middle">{emoji}</text>
            )))}
            {ISLANDS.map(island => (
              <text key={`label-${island.key}`} className="map-island-label" x={island.lx} y={island.ly}
                textAnchor="middle">{island.label.toUpperCase()}</text>
            ))}
          </svg>

          {sideButtons}
          {backButton}

          {LEVEL_PATH.map(level => (
            <NodeButton key={level} level={level} scores={scores} isCurrent={level === current} onSelect={handleSelect} />
          ))}

          <div className="map-owl">
            <div className="map-owl-bubble">{greeting}</div>
            <span className="map-owl-emoji" aria-hidden="true">🦉</span>
          </div>

          <button className="map-start" onClick={() => onPlayLevel(current)}>
            {doneCount === 0 ? 'ÎNCEPE AVENTURA!' : 'CONTINUĂ AVENTURA!'}
            <small>{LEVELS[current].label}</small>
          </button>
        </div>
      </div>
      )}

    </section>
  );
}
