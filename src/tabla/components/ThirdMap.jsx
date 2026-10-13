import { useState } from 'react';
import { THIRD_PATH } from '../mapProgress';
import PathIslandMap from './PathIslandMap';

// Lecția „Împărțirea la 3”: de 3 ori mai mic și tabla împărțirii la 3,
// cu caseta „Reține” deschisă din colțul hărții.
const LAYOUTS = {
  desktop: {
    W: 1000,
    H: 610,
    islands: [
      { level: 'impt1', cx: 165, cy: 380, rx: 128, ry: 62, name: 'Căsuțele Păsărelelor',
        decor: [['🏠', 80, 372, 32], ['🐦', 250, 352, 28], ['🔍', 232, 404, 22]] },
      { level: 'impt2', cx: 390, cy: 215, rx: 130, ry: 62, name: 'Afișele de Primăvară',
        decor: [['🖼️', 305, 205, 32], ['🎨', 470, 222, 26], ['🖼️', 488, 190, 22]] },
      { level: 'impt3', cx: 615, cy: 380, rx: 128, ry: 62, name: 'Cuibul Rândunelelor',
        decor: [['🐦', 540, 362, 32], ['✏️', 700, 370, 26], ['🐦', 690, 404, 22]] },
      { level: 'impt4', cx: 840, cy: 215, rx: 130, ry: 62, name: 'Curtea Bunicului',
        decor: [['🐥', 760, 200, 36], ['🍫', 925, 210, 26], ['🐣', 915, 245, 22]] },
    ],
    extras: [['⛵', 470, 110, 30], ['🐬', 500, 470, 40], ['🐳', 950, 560, 30], ['☁️', 960, 70, 26], ['🐠', 290, 560, 22]],
  },
  phone: {
    W: 600,
    H: 1230,
    islands: [
      { level: 'impt1', cx: 200, cy: 260, rx: 170, ry: 78, name: 'Căsuțele Păsărelelor',
        decor: [['🏠', 80, 250, 40], ['🐦', 318, 230, 38]] },
      { level: 'impt2', cx: 400, cy: 520, rx: 170, ry: 78, name: 'Afișele de Primăvară',
        decor: [['🖼️', 285, 510, 40], ['🎨', 515, 500, 36]] },
      { level: 'impt3', cx: 200, cy: 780, rx: 170, ry: 78, name: 'Cuibul Rândunelelor',
        decor: [['🐦', 85, 760, 42], ['✏️', 320, 770, 34]] },
      { level: 'impt4', cx: 400, cy: 1040, rx: 170, ry: 78, name: 'Curtea Bunicului',
        decor: [['🐥', 285, 1020, 44], ['🍫', 515, 1030, 34]] },
    ],
    extras: [['⛵', 520, 190, 34], ['🐬', 120, 540, 42], ['🐳', 520, 1190, 32]],
  },
};

const TABLE = Array.from({ length: 10 }, (_, i) => 3 * (i + 1));

// Caseta „Reține” din manual, într-o fereastră peste hartă.
function ThirdLesson({ onClose }) {
  return (
    <div className="overlay lesson-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Reține">
      <div className="modal lesson-modal" onClick={e => e.stopPropagation()}>
        <button className="lesson-close" onClick={onClose} aria-label="Închide">✕</button>
        <h2>📖 REȚIN</h2>

        <p className="five-rule">
          Când împărțim un număr la <b>3</b>, obținem un număr <b>de 3 ori mai mic</b> decât acesta.
        </p>
        <div className="five-example">
          <div className="five-stars" aria-hidden="true">
            <span>🏠🥢🥢🥢🥢</span><span>🏠🥢🥢🥢🥢</span><span>🏠🥢🥢🥢🥢</span>
          </div>
          <div className="five-example-text">
            <b>12 − 3 − 3 − 3 − 3 = 0</b>
            <span className="five-arrow">➜</span>
            <b>12 : 3 = 4</b> (bețișoare pe fiecare căsuță), deoarece <b>4 × 3 = 12</b>
          </div>
        </div>

        <div className="five-table" aria-label="Tabla împărțirii la 3">
          {TABLE.map(n => (
            <span key={n} className="five-cell">{n} : 3 = <b>{n / 3}</b></span>
          ))}
        </div>

        <ul className="five-tips">
          <li>🐦 3 căsuțe și 12 bețișoare: fiecare căsuță primește <b>12 : 3 = 4</b> bețișoare.</li>
          <li>✅ Verifici cu înmulțirea: <b>27 : 3 = 9</b> pentru că <b>9 × 3 = 27</b>.</li>
          <li>⚠️ <b>„Cu 3 mai mic”</b> înseamnă − 3, iar <b>„de 3 ori mai mic”</b> înseamnă : 3 — 15 − 3 = 12, dar 15 : 3 = 5.</li>
        </ul>
        <button className="bigbtn lesson-ok" onClick={onClose}>👍 Am înțeles!</button>
      </div>
    </div>
  );
}

export default function ThirdMap(props) {
  const [lessonOpen, setLessonOpen] = useState(false);
  return (
    <>
      <PathIslandMap
        {...props}
        mapKey="third"
        title="🐦 ÎMPĂRȚIREA LA 3"
        path={THIRD_PATH}
        layouts={LAYOUTS}
        ocean={['#a5d8ff', '#4dabf7', '#1971c2']}
        backLabel="← Tabla împărțirii"
        intro="Apasă pe „📖 Reține” din colț ca să afli cum împărțim la 3, apoi descoperă, aplică, exersează și rezolvă! 🐦"
        doneText="Știi împărțirea la 3! 🏆"
        corner={(
          <button className="lesson-btn" onClick={() => setLessonOpen(true)} title="Lecția: împărțirea la 3">
            <span aria-hidden="true">📖</span>Reține
          </button>
        )}
      />
      {lessonOpen && <ThirdLesson onClose={() => setLessonOpen(false)} />}
    </>
  );
}
