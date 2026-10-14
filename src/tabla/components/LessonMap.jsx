import { useState } from 'react';
import { LESSON_PATHS } from '../mapProgress';
import PathIslandMap from './PathIslandMap';

// Insulele „Înmulțirea cu 5 / 6 / 7”: câte o insulă pentru fiecare secțiune a
// lecției din manual (Descopăr, Aplic, Exersez, Rezolv probleme) și caseta
// „Reține”, deschisă din colțul hărții.

// Așezarea celor 4 insule; diferă doar nivelurile, numele și decorurile.
function layoutsFor(names, decor, levels) {
  return {
    desktop: {
      W: 1000,
      H: 610,
      islands: [
        { cx: 165, cy: 380, rx: 128, ry: 62 },
        { cx: 390, cy: 215, rx: 130, ry: 62 },
        { cx: 615, cy: 380, rx: 128, ry: 62 },
        { cx: 840, cy: 215, rx: 130, ry: 62 },
      ].map((island, i) => ({
        ...island, level: levels[i], name: names[i],
        decor: decor[i].map(([emoji, dx, dy, size]) => [emoji, island.cx + dx, island.cy + dy, size]),
      })),
      extras: [['⛵', 470, 110, 30], ['🐬', 500, 470, 40], ['🐳', 950, 560, 30], ['☁️', 960, 70, 26], ['🐠', 290, 560, 22]],
    },
    phone: {
      W: 600,
      H: 1230,
      islands: [
        { cx: 200, cy: 260, rx: 170, ry: 78 },
        { cx: 400, cy: 520, rx: 170, ry: 78 },
        { cx: 200, cy: 780, rx: 170, ry: 78 },
        { cx: 400, cy: 1040, rx: 170, ry: 78 },
      ].map((island, i) => ({
        ...island, level: levels[i], name: names[i],
        decor: decor[i].slice(0, 2).map(([emoji, dx, dy, size]) => [emoji, island.cx + dx * 1.35, island.cy + dy, size * 1.25]),
      })),
      extras: [['⛵', 520, 190, 34], ['🐬', 120, 540, 42], ['🐳', 520, 1190, 32]],
    },
  };
}

const LESSONS = {
  5: {
    title: '🖐️ ÎNMULȚIREA CU 5',
    ocean: ['#5fb8f0', '#2d8fd6', '#1a64a8'],
    names: ['Peștera Descoperirilor', 'Atelierul cu Steluțe', 'Poiana Exercițiilor', 'Castelul Problemelor'],
    decor: [
      [['🔍', -85, -8, 30], ['⭐', 85, -28, 30], ['🌟', 67, 24, 22]],
      [['✂️', -85, -7, 30], ['⭐', 80, 7, 26], ['📒', 98, -19, 26]],
      [['✏️', -70, -20, 32], ['🌼', 85, -8, 26], ['📐', 73, 24, 22]],
      [['🏰', -80, -19, 40], ['👟', 80, -19, 26], ['💐', 95, 21, 24]],
    ],
    story: { items: '⭐', text: 'steluțe' },
    tips: [
      <>🔢 Numără din 5 în 5: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50.</>,
      <>🔁 Ordinea factorilor nu contează: <b>5 × 3 = 3 × 5 = 15</b>.</>,
      <>🎯 Rezultatul înmulțirii cu 5 are cifra unităților <b>0</b> sau <b>5</b>.</>,
      <>➕ Fiecare rezultat e cu 5 mai mare decât cel dinainte: <b>6 × 5 = 5 × 5 + 5 = 30</b>.</>,
    ],
  },
  6: {
    title: '🔋 ÎNMULȚIREA CU 6',
    ocean: ['#66d9a8', '#22a87a', '#127a5a'],
    names: ['Depozitul de Baterii', 'Laboratorul cu 6', 'Pădurea Exercițiilor', 'Aprozarul Problemelor'],
    decor: [
      [['🔋', -85, -8, 32], ['🔍', 85, -28, 28], ['⚡', 67, 24, 22]],
      [['🧪', -85, -7, 30], ['🔋', 80, 7, 26], ['📒', 98, -19, 24]],
      [['✏️', -70, -20, 32], ['🌲', 85, -8, 28], ['🐝', 73, 24, 22]],
      [['🧅', -80, -19, 34], ['🍯', 80, -19, 28], ['🚀', 95, 21, 24]],
    ],
    story: { items: '🔋', text: 'baterii' },
    tips: [
      <>🔢 Numără din 6 în 6: 6, 12, 18, 24, 30, 36, 42, 48, 54, 60.</>,
      <>🔁 Ordinea factorilor nu contează: <b>6 × 4 = 4 × 6 = 24</b>.</>,
      <>🎯 Rezultatele înmulțirii cu 6 sunt mereu <b>numere pare</b>.</>,
      <>➕ Fiecare rezultat e cu 6 mai mare decât cel dinainte: <b>7 × 6 = 6 × 6 + 6 = 42</b>.</>,
    ],
  },
  7: {
    title: '🪙 ÎNMULȚIREA CU 7',
    ocean: ['#b197fc', '#7950f2', '#5235b8'],
    names: ['Comoara cu Monede', 'Atelierul cu 7', 'Grădina Exercițiilor', 'Clubul Rachetelor'],
    decor: [
      [['🪙', -85, -8, 32], ['🔍', 85, -28, 28], ['💰', 67, 24, 22]],
      [['🛠️', -85, -7, 30], ['🪙', 80, 7, 26], ['📒', 98, -19, 24]],
      [['✏️', -70, -20, 32], ['🌈', 85, -8, 28], ['🐞', 73, 24, 22]],
      [['🚀', -80, -19, 36], ['🛰️', 80, -19, 28], ['🪐', 95, 21, 24]],
    ],
    story: { items: '🪙', text: 'monede' },
    tips: [
      <>🔢 Numără din 7 în 7: 7, 14, 21, 28, 35, 42, 49, 56, 63, 70.</>,
      <>🔁 Ordinea factorilor nu contează: <b>7 × 3 = 3 × 7 = 21</b>.</>,
      <>📅 O săptămână are 7 zile: 2 săptămâni = <b>2 × 7 = 14</b> zile.</>,
      <>➕ Fiecare rezultat e cu 7 mai mare decât cel dinainte: <b>8 × 7 = 7 × 7 + 7 = 56</b>.</>,
    ],
  },
};

LESSONS[2] = {
  title: '🛷 ÎNMULȚIREA CU 2',
  ocean: ['#d0bfff', '#9775fa', '#7048e8'],
  names: ['Dealul cu Săniuțe', 'Atelierul cu 2', 'Pârtia Exercițiilor', 'Patinoarul Problemelor'],
  decor: [
    [['🛷', -85, -8, 32], ['🔍', 85, -28, 28], ['⛄', 67, 24, 24]],
    [['❄️', -85, -7, 30], ['🛷', 80, 7, 26], ['📒', 98, -19, 24]],
    [['✏️', -70, -20, 32], ['🎿', 85, -8, 28], ['🌲', 73, 24, 22]],
    [['⛸️', -80, -19, 34], ['🧤', 80, -19, 28], ['🍬', 95, 21, 24]],
  ],
  story: { items: '🧒', text: 'copii' },
  tips: [
    <>🔢 Numără din 2 în 2: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20.</>,
    <>🔁 Dacă schimbăm locul factorilor, produsul rămâne neschimbat: <b>6 × 2 = 2 × 6 = 12</b>.</>,
    <>2️⃣ Când înmulțim un număr cu 2 obținem <b>dublul</b> lui: 7 + 7 = 2 × 7 = <b>14</b>.</>,
    <>🎯 Rezultatul înmulțirii cu 2 este întotdeauna un <b>număr par</b>.</>,
  ],
};

LESSONS[3] = {
  title: '⛄ ÎNMULȚIREA CU 3',
  ocean: ['#99e9f2', '#3bc9db', '#1098ad'],
  names: ['Dealul cu Bulgări', 'Atelierul cu 3', 'Ținta Exercițiilor', 'Petrecerea lui Mihai'],
  decor: [
    [['⛄', -85, -8, 32], ['🔍', 85, -28, 28], ['❄️', 67, 24, 22]],
    [['🎯', -85, -7, 30], ['⛄', 80, 7, 26], ['📒', 98, -19, 24]],
    [['✏️', -70, -20, 32], ['🎯', 85, -8, 28], ['🧣', 73, 24, 22]],
    [['🍕', -80, -19, 34], ['🐦', 80, -19, 28], ['✏️', 95, 21, 24]],
  ],
  story: { items: '⚪', text: 'bulgări' },
  tips: [
    <>🔢 Numără din 3 în 3: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30.</>,
    <>🎯 Ordinea factorilor nu contează: <b>3 × 5 = 5 × 3 = 15</b>.</>,
    <>3️⃣ Când înmulțim un număr cu 3 obținem <b>triplul</b> lui: triplul lui 4 este <b>12</b>.</>,
    <>⚠️ <b>„Cu 3 mai mare”</b> înseamnă + 3, iar <b>„de 3 ori mai mare”</b> înseamnă × 3: 7 + 3 = 10, dar 7 × 3 = 21.</>,
  ],
};

LESSONS[4] = {
  title: '🐻‍❄️ ÎNMULȚIREA CU 4',
  ocean: ['#a5d8ff', '#74b5e8', '#4a8cc4'],
  names: ['Banchiza Urșilor Polari', 'Atelierul cu 4', 'Ghețarul Exercițiilor', 'Cabana Problemelor'],
  decor: [
    [['🐻‍❄️', -85, -8, 32], ['🔍', 85, -28, 28], ['🐧', 67, 24, 24]],
    [['🐟', -85, -7, 30], ['🦉', 80, 7, 26], ['📒', 98, -19, 24]],
    [['✏️', -70, -20, 32], ['🧊', 85, -8, 28], ['❄️', 73, 24, 22]],
    [['🏠', -80, -19, 34], ['🚗', 80, -19, 28], ['📖', 95, 21, 24]],
  ],
  story: { items: '🐾', text: 'picioare de urs' },
  tips: [
    <>🔢 Numără din 4 în 4: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40.</>,
    <>🐧 Ordinea factorilor nu contează: <b>4 × 6 = 6 × 4 = 24</b>.</>,
    <>⚠️ <b>„Cu 4 mai mare”</b> înseamnă + 4, iar <b>„de 4 ori mai mare”</b> înseamnă × 4: 5 + 4 = 9, dar 5 × 4 = 20.</>,
    <>➕ Fiecare rezultat e cu 4 mai mare decât cel dinainte: <b>4 × 4 = 3 × 4 + 4 = 16</b>.</>,
  ],
};

LESSONS[8] = {
  title: '🐙 ÎNMULȚIREA CU 8',
  ocean: ['#74c0fc', '#3b8fd6', '#1f5fa8'],
  names: ['Recifurile Caracatițelor', 'Atelierul cu 8', 'Laguna Exercițiilor', 'Petrecerea lui Habarnam'],
  decor: [
    [['🐙', -85, -8, 32], ['🔍', 85, -28, 28], ['🐚', 67, 24, 22]],
    [['🧰', -85, -7, 30], ['🐙', 80, 7, 26], ['📒', 98, -19, 24]],
    [['✏️', -70, -20, 32], ['🪸', 85, -8, 28], ['🐠', 73, 24, 22]],
    [['🎂', -80, -19, 34], ['🎁', 80, -19, 28], ['💧', 95, 21, 24]],
  ],
  story: { items: '🐙', text: 'brațe de caracatiță' },
  tips: [
    <>🔢 Numără din 8 în 8: 8, 16, 24, 32, 40, 48, 56, 64, 72, 80.</>,
    <>🔁 Ordinea factorilor nu contează: <b>8 × 3 = 3 × 8 = 24</b>.</>,
    <>🧩 Dacă grupăm diferit factorii, produsul nu se schimbă: <b>4 × 2 × 5 = 8 × 5 = 4 × 10 = 40</b>.</>,
    <>➕ Fiecare rezultat e cu 8 mai mare decât cel dinainte: <b>8 × 8 = 7 × 8 + 8 = 64</b>.</>,
  ],
};

LESSONS[9] = {
  title: '🎈 ÎNMULȚIREA CU 9',
  ocean: ['#ffa8a8', '#f06595', '#c2255c'],
  names: ['Târgul cu Baloane', 'Atelierul cu 9', 'Parcul Exercițiilor', 'Casa Spiridușilor'],
  decor: [
    [['🎈', -85, -8, 32], ['🔍', 85, -28, 28], ['🎉', 67, 24, 22]],
    [['🛠️', -85, -7, 30], ['🎈', 80, 7, 26], ['📒', 98, -19, 24]],
    [['✏️', -70, -20, 32], ['🎠', 85, -8, 28], ['🌷', 73, 24, 22]],
    [['🏠', -80, -19, 34], ['🍞', 80, -19, 28], ['⭐', 95, 21, 24]],
  ],
  story: { items: '🎈', text: 'baloane' },
  tips: [
    <>🔢 Numără din 9 în 9: 9, 18, 27, 36, 45, 54, 63, 72, 81, 90.</>,
    <>🔁 Ordinea factorilor nu contează: <b>9 × 4 = 4 × 9 = 36</b>.</>,
    <>✋ Truc: la rezultatele cu 9, cifrele adunate dau 9: <b>27 → 2 + 7 = 9</b>, <b>63 → 6 + 3 = 9</b>.</>,
    <>➕ Fiecare rezultat e cu 9 mai mare decât cel dinainte: <b>10 × 9 = 9 × 9 + 9 = 90</b>.</>,
  ],
};

const TABLE = Array.from({ length: 10 }, (_, i) => i + 1);

// Caseta „Reține” din manual, într-o fereastră peste hartă.
function Lesson({ factor, onClose }) {
  const lesson = LESSONS[factor];
  const { items, text } = lesson.story;
  return (
    <div className="overlay lesson-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Reține">
      <div className="modal lesson-modal" onClick={e => e.stopPropagation()}>
        <button className="lesson-close" onClick={onClose} aria-label="Închide">✕</button>
        <h2>📖 REȚIN</h2>
        <p className="five-rule">
          Când înmulțim un număr cu <b>{factor}</b>, obținem un număr <b>de {factor} ori mai mare</b>.
        </p>
        <div className="five-example">
          <div className="five-stars" style={{ gridTemplateColumns: `repeat(${factor}, auto)` }} aria-hidden="true">
            {Array.from({ length: factor }, (_, i) => <span key={i}>{items.repeat(factor)}</span>)}
          </div>
          <div className="five-example-text">
            <b>{Array(factor).fill(factor).join(' + ')} = {factor * factor}</b>
            <span className="five-arrow">➜</span>
            <b>{factor} × {factor} = {factor * factor}</b> {text}
          </div>
        </div>
        <div className="five-table" aria-label={`Tabla înmulțirii cu ${factor}`}>
          {TABLE.map(n => (
            <span key={n} className="five-cell">{n} × {factor} = <b>{n * factor}</b></span>
          ))}
        </div>
        <ul className="five-tips">
          {lesson.tips.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
        <button className="bigbtn lesson-ok" onClick={onClose}>👍 Am înțeles!</button>
      </div>
    </div>
  );
}

export default function LessonMap({ factor, ...props }) {
  const [lessonOpen, setLessonOpen] = useState(false);
  const lesson = LESSONS[factor];
  return (
    <>
      <PathIslandMap
        {...props}
        mapKey={`lesson${factor}`}
        backLabel="← Tabla înmulțirii"
        title={lesson.title}
        path={LESSON_PATHS[factor]}
        layouts={layoutsFor(lesson.names, lesson.decor, LESSON_PATHS[factor])}
        ocean={lesson.ocean}
        intro={`Apasă pe „📖 Reține” din colț ca să citești lecția, apoi descoperă, aplică, exersează și rezolvă! ${lesson.title.split(' ')[0]}`}
        doneText={`Știi înmulțirea cu ${factor}! 🏆`}
        corner={(
          <button className="lesson-btn" onClick={() => setLessonOpen(true)} title={`Lecția: înmulțirea cu ${factor}`}>
            <span aria-hidden="true">📖</span>Reține
          </button>
        )}
      />
      {lessonOpen && <Lesson factor={factor} onClose={() => setLessonOpen(false)} />}
    </>
  );
}
