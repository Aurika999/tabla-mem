import { useState } from 'react';
import { DIV6_PATH, DIV7_PATH, DIV8_PATH, DIV9_PATH } from '../mapProgress';
import PathIslandMap from './PathIslandMap';

// Lecțiile „Împărțirea la 6”, „la 7”, „la 8” și „la 9”: aceeași hartă, cu insulele și caseta
// „Reține” proprii fiecărui împărțitor.
function buildLayouts(levels, names, decor) {
  const desk = [[165, 380], [390, 215], [615, 380], [840, 215]];
  const phone = [[200, 260], [400, 520], [200, 780], [400, 1040]];
  return {
    desktop: {
      W: 1000,
      H: 610,
      islands: levels.map((level, i) => {
        const [cx, cy] = desk[i]; const [a, b, c] = decor[i];
        return { level, cx, cy, rx: 128, ry: 62, name: names[i],
          decor: [[a, cx - 85, cy - 8, 32], [b, cx + 85, cy - 18, 28], [c, cx + 67, cy + 24, 22]] };
      }),
      extras: [['⛵', 470, 110, 30], ['🐬', 500, 470, 40], ['🐳', 950, 560, 30], ['☁️', 960, 70, 26], ['🐠', 290, 560, 22]],
    },
    phone: {
      W: 600,
      H: 1230,
      islands: levels.map((level, i) => {
        const [cx, cy] = phone[i]; const [a, b] = decor[i];
        return { level, cx, cy, rx: 170, ry: 78, name: names[i], decor: [[a, cx - 115, cy - 10, 40], [b, cx + 115, cy - 20, 36]] };
      }),
      extras: [['⛵', 520, 190, 34], ['🐬', 120, 540, 42], ['🐳', 520, 1190, 32]],
    },
  };
}

const TABLE = Array.from({ length: 10 }, (_, i) => i + 1);

const LESSONS = {
  6: {
    mapKey: 'six',
    icon: '🍬',
    path: DIV6_PATH,
    ocean: ['#fcc2d7', '#f06595', '#c2255c'],
    layouts: buildLayouts(DIV6_PATH, ['Biblioteca Deliei', 'Cofetăria Andreei', 'Atelierul de Cuburi', 'Rafturile Mirunei'],
      [['📚', '🐱', '📖'], ['🍬', '🎁', '🍭'], ['🧸', '🎨', '🧩'], ['📚', '🗄️', '⭐']]),
    tips: [
      <li key="1">📚 Delia citește 42 de pagini în 6 zile: <b>42 : 6 = 7</b> pagini pe zi, pentru că <b>7 × 6 = 42</b>.</li>,
      <li key="2">🍬 54 de bomboane în 6 cutii: <b>54 : 6 = 9</b> bomboane într-o cutie.</li>,
      <li key="3">✅ Verifici prin operația inversă: <b>6 × 4 = 24</b>, deci <b>24 : 6 = 4</b>.</li>,
      <li key="4">⚠️ <b>„Cu 6 mai mic”</b> înseamnă − 6, iar <b>„de 6 ori mai mic”</b> înseamnă : 6.</li>,
    ],
  },
  7: {
    mapKey: 'seven',
    icon: '📅',
    path: DIV7_PATH,
    ocean: ['#c3fae8', '#63e6be', '#0ca678'],
    layouts: buildLayouts(DIV7_PATH, ['Camera lui Radu', 'Calendarul Săptămânii', 'Cutiile lui Mihnea', 'Curtea lui Dănuț'],
      [['🐶', '📖', '🎒'], ['📅', '☀️', '🌙'], ['🧸', '📦', '🧩'], ['🐔', '🦆', '🪿']]),
    tips: [
      <li key="1">📖 Radu citește 42 de pagini într-o săptămână (7 zile): <b>42 : 7 = 6</b> pagini pe zi, pentru că <b>6 × 7 = 42</b>.</li>,
      <li key="2">📅 O săptămână are 7 zile: 21 de zile înseamnă <b>21 : 7 = 3</b> săptămâni.</li>,
      <li key="3">✅ Verifici prin operația inversă: <b>7 × 4 = 28</b>, deci <b>28 : 7 = 4</b>.</li>,
      <li key="4">⚠️ <b>„Cu 7 mai puține”</b> înseamnă − 7, iar <b>„de 7 ori mai puține”</b> înseamnă : 7.</li>,
    ],
  },
  8: {
    mapKey: 'eight',
    icon: '🐙',
    path: DIV8_PATH,
    ocean: ['#bac8ff', '#748ffc', '#3b5bdb'],
    layouts: buildLayouts(DIV8_PATH, ['Albumul Ioanei', 'Acvariul Caracatițelor', 'Grădina cu Iepurași', 'Plicurile Oliviei'],
      [['🃏', '📒', '👧'], ['🐙', '🐠', '🫧'], ['🐰', '🥕', '🌷'], ['✉️', '🦉', '🌻']]),
    tips: [
      <li key="1">🃏 Ioana pune 72 de cartonașe pe 8 file: <b>72 : 8 = 9</b> cartonașe pe filă, pentru că <b>9 × 8 = 72</b>.</li>,
      <li key="2">🕷️ Un păianjen are 8 picioare: 40 de picioare înseamnă <b>40 : 8 = 5</b> păianjeni.</li>,
      <li key="3">✅ Verifici prin operația inversă: <b>8 × 7 = 56</b>, deci <b>56 : 8 = 7</b>.</li>,
      <li key="4">⚠️ <b>„Cu 8 mai mic”</b> înseamnă − 8, iar <b>„de 8 ori mai mic”</b> înseamnă : 8.</li>,
    ],
  },
  9: {
    mapKey: 'nine',
    icon: '🎯',
    path: DIV9_PATH,
    ocean: ['#ffec99', '#ffd43b', '#f08c00'],
    layouts: buildLayouts(DIV9_PATH, ['Albumul lui David', 'Livada cu Cireșe', 'Stadionul Echipelor', 'Florăria lui Pavel'],
      [['🃏', '📒', '👦'], ['🍒', '🌳', '🧺'], ['⚽', '🥅', '🏆'], ['🌹', '💐', '📿']]),
    tips: [
      <li key="1">🃏 David pune câte 9 cartonașe pe o filă: 72 de cartonașe ocupă <b>72 : 9 = 8</b> file, pentru că <b>8 × 9 = 72</b>.</li>,
      <li key="2">⚽ O echipă are 9 jucători: 27 de jucători formează <b>27 : 9 = 3</b> echipe.</li>,
      <li key="3">✅ Verifici prin operația inversă: <b>9 × 6 = 54</b>, deci <b>54 : 9 = 6</b>.</li>,
      <li key="4">⚠️ <b>„Cu 9 mai mic”</b> înseamnă − 9, iar <b>„de 9 ori mai mic”</b> înseamnă : 9.</li>,
    ],
  },
};

// Caseta „Reține” din manual, într-o fereastră peste hartă.
function Lesson({ d, onClose }) {
  return (
    <div className="overlay lesson-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Reține">
      <div className="modal lesson-modal" onClick={e => e.stopPropagation()}>
        <button className="lesson-close" onClick={onClose} aria-label="Închide">✕</button>
        <h2>📖 REȚIN</h2>

        <p className="five-rule">
          Când împărțim un număr la <b>{d}</b>, obținem un număr <b>de {d} ori mai mic</b> decât acesta.
        </p>
        <div className="five-table" aria-label={`Tabla împărțirii la ${d}`}>
          {TABLE.map(n => (
            <span key={n} className="five-cell">{d * n} : {d} = <b>{n}</b></span>
          ))}
        </div>

        <ul className="five-tips">{LESSONS[d].tips}</ul>
        <button className="bigbtn lesson-ok" onClick={onClose}>👍 Am înțeles!</button>
      </div>
    </div>
  );
}

function DivisorMap({ d, ...props }) {
  const [lessonOpen, setLessonOpen] = useState(false);
  const lesson = LESSONS[d];
  return (
    <>
      <PathIslandMap
        {...props}
        mapKey={lesson.mapKey}
        title={`${lesson.icon} ÎMPĂRȚIREA LA ${d}`}
        path={lesson.path}
        layouts={lesson.layouts}
        ocean={lesson.ocean}
        backLabel="← Tabla împărțirii"
        intro={`Apasă pe „📖 Reține” din colț ca să afli cum împărțim la ${d}, apoi descoperă, aplică, exersează și rezolvă! ${lesson.icon}`}
        doneText={`Știi împărțirea la ${d}! 🏆`}
        corner={(
          <button className="lesson-btn" onClick={() => setLessonOpen(true)} title={`Lecția: împărțirea la ${d}`}>
            <span aria-hidden="true">📖</span>Reține
          </button>
        )}
      />
      {lessonOpen && <Lesson d={d} onClose={() => setLessonOpen(false)} />}
    </>
  );
}

export function SixMap(props) {
  return <DivisorMap d={6} {...props} />;
}

export function SevenMap(props) {
  return <DivisorMap d={7} {...props} />;
}

export function EightMap(props) {
  return <DivisorMap d={8} {...props} />;
}

export function NineMap(props) {
  return <DivisorMap d={9} {...props} />;
}
