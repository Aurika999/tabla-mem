import { useState } from 'react';
import { FIFTH_PATH } from '../mapProgress';
import PathIslandMap from './PathIslandMap';

// Lecția „Împărțirea la 5”: de 5 ori mai mic și tabla împărțirii la 5,
// cu caseta „Reține” deschisă din colțul hărții.
const LAYOUTS = {
  desktop: {
    W: 1000,
    H: 610,
    islands: [
      { level: 'impc1', cx: 165, cy: 380, rx: 128, ry: 62, name: 'Cerul cu Lampioane',
        decor: [['🏮', 80, 372, 32], ['🌙', 250, 352, 28], ['🔍', 232, 404, 22]] },
      { level: 'impc2', cx: 390, cy: 215, rx: 130, ry: 62, name: 'Buchetele lui Pippi',
        decor: [['🌷', 305, 205, 32], ['💐', 470, 222, 26], ['🌷', 488, 190, 22]] },
      { level: 'impc3', cx: 615, cy: 380, rx: 128, ry: 62, name: 'Târgul de Baloane',
        decor: [['🌙', 540, 362, 32], ['✏️', 700, 370, 26], ['🌙', 690, 404, 22]] },
      { level: 'impc4', cx: 840, cy: 215, rx: 130, ry: 62, name: 'Biblioteca lui Matei',
        decor: [['🎈', 760, 200, 36], ['📚', 925, 210, 26], ['🍊', 915, 245, 22]] },
    ],
    extras: [['⛵', 470, 110, 30], ['🐬', 500, 470, 40], ['🐳', 950, 560, 30], ['☁️', 960, 70, 26], ['🐠', 290, 560, 22]],
  },
  phone: {
    W: 600,
    H: 1230,
    islands: [
      { level: 'impc1', cx: 200, cy: 260, rx: 170, ry: 78, name: 'Cerul cu Lampioane',
        decor: [['🏮', 80, 250, 40], ['🌙', 318, 230, 38]] },
      { level: 'impc2', cx: 400, cy: 520, rx: 170, ry: 78, name: 'Buchetele lui Pippi',
        decor: [['🌷', 285, 510, 40], ['💐', 515, 500, 36]] },
      { level: 'impc3', cx: 200, cy: 780, rx: 170, ry: 78, name: 'Târgul de Baloane',
        decor: [['🌙', 85, 760, 42], ['✏️', 320, 770, 34]] },
      { level: 'impc4', cx: 400, cy: 1040, rx: 170, ry: 78, name: 'Biblioteca lui Matei',
        decor: [['🎈', 285, 1020, 44], ['📚', 515, 1030, 34]] },
    ],
    extras: [['⛵', 520, 190, 34], ['🐬', 120, 540, 42], ['🐳', 520, 1190, 32]],
  },
};

const TABLE = Array.from({ length: 10 }, (_, i) => 5 * (i + 1));

// Caseta „Reține” din manual, într-o fereastră peste hartă.
function FifthLesson({ onClose }) {
  return (
    <div className="overlay lesson-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Reține">
      <div className="modal lesson-modal" onClick={e => e.stopPropagation()}>
        <button className="lesson-close" onClick={onClose} aria-label="Închide">✕</button>
        <h2>📖 REȚIN</h2>

        <p className="five-rule">
          Când împărțim un număr la <b>5</b>, obținem un număr <b>de 5 ori mai mic</b> decât acesta.
        </p>
        <div className="five-example">
          <div className="five-stars" aria-hidden="true">
            <span>🏮🏮🏮🏮</span><span>🏮🏮🏮🏮</span><span>🏮🏮🏮🏮</span><span>🏮🏮🏮🏮</span><span>🏮🏮🏮🏮</span>
          </div>
          <div className="five-example-text">
            <b>20 − 5 − 5 − 5 − 5 = 0</b>
            <span className="five-arrow">➜</span>
            <b>20 : 5 = 4</b> (lampioane), verificare: <b>4 × 5 = 20</b>
          </div>
        </div>

        <div className="five-table" aria-label="Tabla împărțirii la 5">
          {TABLE.map(n => (
            <span key={n} className="five-cell">{n} : 5 = <b>{n / 5}</b></span>
          ))}
        </div>

        <ul className="five-tips">
          <li>🔎 Numerele care se împart exact la 5 au <b>cifra unităților 0 sau 5</b>: 10, 15, 20, 25…</li>
          <li>✅ Verifici cu înmulțirea: <b>35 : 5 = 7</b> pentru că <b>7 × 5 = 35</b>.</li>
          <li>⚠️ <b>„Cu 5 mai mic”</b> înseamnă − 5, iar <b>„de 5 ori mai mic”</b> înseamnă : 5 — 25 − 5 = 20, dar 25 : 5 = 5.</li>
        </ul>
        <button className="bigbtn lesson-ok" onClick={onClose}>👍 Am înțeles!</button>
      </div>
    </div>
  );
}

export default function FifthMap(props) {
  const [lessonOpen, setLessonOpen] = useState(false);
  return (
    <>
      <PathIslandMap
        {...props}
        mapKey="fifth"
        title="🏮 ÎMPĂRȚIREA LA 5"
        path={FIFTH_PATH}
        layouts={LAYOUTS}
        ocean={['#ffc9c9', '#ff8787', '#e03131']}
        backLabel="← Tabla împărțirii"
        intro="Apasă pe „📖 Reține” din colț ca să afli cum împărțim la 5, apoi descoperă, aplică, exersează și rezolvă! 🏮"
        doneText="Știi împărțirea la 5! 🏆"
        corner={(
          <button className="lesson-btn" onClick={() => setLessonOpen(true)} title="Lecția: împărțirea la 5">
            <span aria-hidden="true">📖</span>Reține
          </button>
        )}
      />
      {lessonOpen && <FifthLesson onClose={() => setLessonOpen(false)} />}
    </>
  );
}
