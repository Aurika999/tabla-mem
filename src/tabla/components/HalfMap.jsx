import { useState } from 'react';
import { HALF_PATH } from '../mapProgress';
import PathIslandMap from './PathIslandMap';

// Lecția „Împărțirea la 2”: jumătatea unui număr, tabla împărțirii la 2 și
// numerele pare, cu caseta „Reține” deschisă din colțul hărții.
const LAYOUTS = {
  desktop: {
    W: 1000,
    H: 610,
    islands: [
      { level: 'impd1', cx: 165, cy: 380, rx: 128, ry: 62, name: 'Petrecerea Iepuricăi',
        decor: [['🐰', 80, 372, 32], ['💐', 250, 352, 28], ['🔍', 232, 404, 22]] },
      { level: 'impd2', cx: 390, cy: 215, rx: 130, ry: 62, name: 'Pajiștea Fluturașilor',
        decor: [['🦋', 305, 205, 32], ['🌼', 470, 222, 26], ['🦋', 488, 190, 22]] },
      { level: 'impd3', cx: 615, cy: 380, rx: 128, ry: 62, name: 'Grădina cu Lalele',
        decor: [['🌷', 540, 362, 32], ['✏️', 700, 370, 26], ['🌷', 690, 404, 22]] },
      { level: 'impd4', cx: 840, cy: 215, rx: 130, ry: 62, name: 'Cuibul Berzelor',
        decor: [['🪺', 760, 200, 36], ['🥛', 925, 210, 26], ['🎀', 915, 245, 22]] },
    ],
    extras: [['⛵', 470, 110, 30], ['🐬', 500, 470, 40], ['🐳', 950, 560, 30], ['☁️', 960, 70, 26], ['🐠', 290, 560, 22]],
  },
  phone: {
    W: 600,
    H: 1230,
    islands: [
      { level: 'impd1', cx: 200, cy: 260, rx: 170, ry: 78, name: 'Petrecerea Iepuricăi',
        decor: [['🐰', 80, 250, 40], ['💐', 318, 230, 38]] },
      { level: 'impd2', cx: 400, cy: 520, rx: 170, ry: 78, name: 'Pajiștea Fluturașilor',
        decor: [['🦋', 285, 510, 40], ['🌼', 515, 500, 36]] },
      { level: 'impd3', cx: 200, cy: 780, rx: 170, ry: 78, name: 'Grădina cu Lalele',
        decor: [['🌷', 85, 760, 42], ['✏️', 320, 770, 34]] },
      { level: 'impd4', cx: 400, cy: 1040, rx: 170, ry: 78, name: 'Cuibul Berzelor',
        decor: [['🪺', 285, 1020, 44], ['🥛', 515, 1030, 34]] },
    ],
    extras: [['⛵', 520, 190, 34], ['🐬', 120, 540, 42], ['🐳', 520, 1190, 32]],
  },
};

const TABLE = Array.from({ length: 10 }, (_, i) => 2 * (i + 1));

// Caseta „Reține” din manual, într-o fereastră peste hartă.
function HalfLesson({ onClose }) {
  return (
    <div className="overlay lesson-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Reține">
      <div className="modal lesson-modal" onClick={e => e.stopPropagation()}>
        <button className="lesson-close" onClick={onClose} aria-label="Închide">✕</button>
        <h2>📖 REȚIN</h2>

        <p className="five-rule">
          Când împărțim un număr la <b>2</b>, obținem un număr <b>de două ori mai mic</b> sau <b>jumătatea</b> numărului.
        </p>
        <div className="five-example">
          <div className="five-stars" aria-hidden="true">
            <span>💐💐💐💐</span><span>💐💐💐💐</span>
          </div>
          <div className="five-example-text">
            <b>8 − 2 − 2 − 2 − 2 = 0</b>
            <span className="five-arrow">➜</span>
            <b>8 : 2 = 4</b> (coronițe pe o masă), deoarece <b>4 × 2 = 8</b>
          </div>
        </div>

        <div className="five-table" aria-label="Tabla împărțirii la 2">
          {TABLE.map(n => (
            <span key={n} className="five-cell">{n} : 2 = <b>{n / 2}</b></span>
          ))}
        </div>

        <p className="five-rule">
          Numerele care se împart exact la 2 sunt <b>numere pare</b>.
        </p>

        <ul className="five-tips">
          <li>🐰 Pe fiecare masă e <b>jumătate</b> din coronițe: jumătatea lui 8 este <b>4</b>.</li>
          <li>✅ Verifici cu înmulțirea: <b>10 : 2 = 5</b> pentru că <b>5 × 2 = 10</b>.</li>
          <li>⚠️ <b>„Cu 2 mai mic”</b> înseamnă − 2, iar <b>„de 2 ori mai mic”</b> înseamnă : 2 — 10 − 2 = 8, dar 10 : 2 = 5.</li>
        </ul>
        <button className="bigbtn lesson-ok" onClick={onClose}>👍 Am înțeles!</button>
      </div>
    </div>
  );
}

export default function HalfMap(props) {
  const [lessonOpen, setLessonOpen] = useState(false);
  return (
    <>
      <PathIslandMap
        {...props}
        mapKey="half"
        title="✌️ ÎMPĂRȚIREA LA 2"
        path={HALF_PATH}
        layouts={LAYOUTS}
        ocean={['#ffd8a8', '#ffa94d', '#f76707']}
        backLabel="← Tabla împărțirii"
        intro="Apasă pe „📖 Reține” din colț ca să afli ce este jumătatea, apoi descoperă, aplică, exersează și rezolvă! ✌️"
        doneText="Știi împărțirea la 2! 🏆"
        corner={(
          <button className="lesson-btn" onClick={() => setLessonOpen(true)} title="Lecția: împărțirea la 2">
            <span aria-hidden="true">📖</span>Reține
          </button>
        )}
      />
      {lessonOpen && <HalfLesson onClose={() => setLessonOpen(false)} />}
    </>
  );
}
