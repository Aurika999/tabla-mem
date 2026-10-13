import { useState } from 'react';
import { QUARTER_PATH } from '../mapProgress';
import PathIslandMap from './PathIslandMap';

// Lecția „Împărțirea la 4”: de 4 ori mai mic, sfertul și tabla împărțirii la 4,
// cu caseta „Reține” deschisă din colțul hărții.
const LAYOUTS = {
  desktop: {
    W: 1000,
    H: 610,
    islands: [
      { level: 'impq1', cx: 165, cy: 380, rx: 128, ry: 62, name: 'Garajul lui Petrișor',
        decor: [['🚗', 80, 372, 32], ['🍀', 250, 352, 28], ['🔍', 232, 404, 22]] },
      { level: 'impq2', cx: 390, cy: 215, rx: 130, ry: 62, name: 'Creanga cu Păsări',
        decor: [['🌳', 305, 205, 32], ['🕊️', 470, 222, 26], ['🌳', 488, 190, 22]] },
      { level: 'impq3', cx: 615, cy: 380, rx: 128, ry: 62, name: 'Stupul Albinelor',
        decor: [['🍀', 540, 362, 32], ['✏️', 700, 370, 26], ['🍀', 690, 404, 22]] },
      { level: 'impq4', cx: 840, cy: 215, rx: 130, ry: 62, name: 'Coșul Bunicii',
        decor: [['🐝', 760, 200, 36], ['🧺', 925, 210, 26], ['🍎', 915, 245, 22]] },
    ],
    extras: [['⛵', 470, 110, 30], ['🐬', 500, 470, 40], ['🐳', 950, 560, 30], ['☁️', 960, 70, 26], ['🐠', 290, 560, 22]],
  },
  phone: {
    W: 600,
    H: 1230,
    islands: [
      { level: 'impq1', cx: 200, cy: 260, rx: 170, ry: 78, name: 'Garajul lui Petrișor',
        decor: [['🚗', 80, 250, 40], ['🍀', 318, 230, 38]] },
      { level: 'impq2', cx: 400, cy: 520, rx: 170, ry: 78, name: 'Creanga cu Păsări',
        decor: [['🌳', 285, 510, 40], ['🕊️', 515, 500, 36]] },
      { level: 'impq3', cx: 200, cy: 780, rx: 170, ry: 78, name: 'Stupul Albinelor',
        decor: [['🍀', 85, 760, 42], ['✏️', 320, 770, 34]] },
      { level: 'impq4', cx: 400, cy: 1040, rx: 170, ry: 78, name: 'Coșul Bunicii',
        decor: [['🐝', 285, 1020, 44], ['🧺', 515, 1030, 34]] },
    ],
    extras: [['⛵', 520, 190, 34], ['🐬', 120, 540, 42], ['🐳', 520, 1190, 32]],
  },
};

const TABLE = Array.from({ length: 10 }, (_, i) => 4 * (i + 1));

// Caseta „Reține” din manual, într-o fereastră peste hartă.
function QuarterLesson({ onClose }) {
  return (
    <div className="overlay lesson-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Reține">
      <div className="modal lesson-modal" onClick={e => e.stopPropagation()}>
        <button className="lesson-close" onClick={onClose} aria-label="Închide">✕</button>
        <h2>📖 REȚIN</h2>

        <p className="five-rule">
          Când împărțim un număr la <b>4</b>, obținem un număr <b>de 4 ori mai mic</b> decât acesta
          sau <b>sfertul</b> numărului.
        </p>
        <div className="five-example">
          <div className="five-stars" aria-hidden="true">
            <span>🛞🛞🛞🛞</span><span>🛞🛞🛞🛞</span><span>🛞🛞🛞🛞</span><span>🛞🛞🛞🛞</span><span>🛞🛞🛞🛞</span>
          </div>
          <div className="five-example-text">
            <b>20 − 4 − 4 − 4 − 4 − 4 = 0</b>
            <span className="five-arrow">➜</span>
            <b>20 : 4 = 5</b> (mașinuțe), deoarece <b>5 × 4 = 20</b>
          </div>
        </div>

        <div className="five-table" aria-label="Tabla împărțirii la 4">
          {TABLE.map(n => (
            <span key={n} className="five-cell">{n} : 4 = <b>{n / 4}</b></span>
          ))}
        </div>

        <ul className="five-tips">
          <li>🍀 <b>Sfertul</b> unui număr înseamnă împărțire la 4: sfertul lui 16 este <b>16 : 4 = 4</b>.</li>
          <li>✌️ <b>Jumătatea</b> înseamnă împărțire la 2: jumătatea lui 16 este <b>8</b>.</li>
          <li>✅ Verifici cu înmulțirea: <b>32 : 4 = 8</b> pentru că <b>8 × 4 = 32</b>.</li>
          <li>⚠️ <b>„Cu cât este mai mare”</b> se află prin scădere (32 − 4 = 28), iar <b>„de câte ori este mai mare”</b> prin împărțire (32 : 4 = 8).</li>
        </ul>
        <button className="bigbtn lesson-ok" onClick={onClose}>👍 Am înțeles!</button>
      </div>
    </div>
  );
}

export default function QuarterMap(props) {
  const [lessonOpen, setLessonOpen] = useState(false);
  return (
    <>
      <PathIslandMap
        {...props}
        mapKey="quarter"
        title="🍀 ÎMPĂRȚIREA LA 4"
        path={QUARTER_PATH}
        layouts={LAYOUTS}
        ocean={['#d0bfff', '#9775fa', '#6741d9']}
        backLabel="← Tabla împărțirii"
        intro="Apasă pe „📖 Reține” din colț ca să afli ce este sfertul, apoi descoperă, aplică, exersează și rezolvă! 🍀"
        doneText="Știi împărțirea la 4! 🏆"
        corner={(
          <button className="lesson-btn" onClick={() => setLessonOpen(true)} title="Lecția: împărțirea la 4">
            <span aria-hidden="true">📖</span>Reține
          </button>
        )}
      />
      {lessonOpen && <QuarterLesson onClose={() => setLessonOpen(false)} />}
    </>
  );
}
