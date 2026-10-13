import { useState } from 'react';
import { DIVISION_PATH } from '../mapProgress';
import PathIslandMap from './PathIslandMap';

// Lecția „Împărțirea”: împărțirea ca scădere repetată și ca operație inversă
// înmulțirii, cu caseta „Reține” deschisă din colțul hărții.
const LAYOUTS = {
  desktop: {
    W: 1000,
    H: 610,
    islands: [
      { level: 'imp1', cx: 165, cy: 380, rx: 128, ry: 62, name: 'Poiana cu Păpădii',
        decor: [['🌼', 80, 372, 32], ['🔍', 250, 352, 28], ['🌼', 232, 404, 22]] },
      { level: 'imp2', cx: 390, cy: 215, rx: 130, ry: 62, name: 'Frunza Buburuzelor',
        decor: [['🐞', 305, 205, 32], ['🍃', 470, 222, 28], ['🐞', 488, 190, 22]] },
      { level: 'imp3', cx: 615, cy: 380, rx: 128, ry: 62, name: 'Grădina cu Gândăcei',
        decor: [['🐛', 540, 362, 32], ['🌸', 700, 370, 28], ['🐝', 690, 404, 22]] },
      { level: 'imp4', cx: 840, cy: 215, rx: 130, ry: 62, name: 'Cetatea Împărțirii',
        decor: [['🏰', 760, 196, 40], ['🧁', 925, 210, 28], ['🎁', 915, 245, 22]] },
    ],
    extras: [['⛵', 470, 110, 30], ['🐬', 500, 470, 40], ['🐳', 950, 560, 30], ['☁️', 960, 70, 26], ['🐠', 290, 560, 22]],
  },
  phone: {
    W: 600,
    H: 1230,
    islands: [
      { level: 'imp1', cx: 200, cy: 260, rx: 170, ry: 78, name: 'Poiana cu Păpădii',
        decor: [['🌼', 80, 250, 40], ['🔍', 318, 230, 38]] },
      { level: 'imp2', cx: 400, cy: 520, rx: 170, ry: 78, name: 'Frunza Buburuzelor',
        decor: [['🐞', 285, 510, 40], ['🍃', 515, 500, 38]] },
      { level: 'imp3', cx: 200, cy: 780, rx: 170, ry: 78, name: 'Grădina cu Gândăcei',
        decor: [['🐛', 85, 760, 42], ['🌸', 320, 770, 36]] },
      { level: 'imp4', cx: 400, cy: 1040, rx: 170, ry: 78, name: 'Cetatea Împărțirii',
        decor: [['🏰', 285, 1020, 46], ['🧁', 515, 1030, 36]] },
    ],
    extras: [['⛵', 520, 190, 34], ['🐬', 120, 540, 42], ['🐳', 520, 1190, 32]],
  },
};

const TABLE_EXAMPLES = [[6, 2], [7, 9], [4, 5], [8, 3]];

// Caseta „Reține” din manual, într-o fereastră peste hartă.
function DivisionLesson({ onClose }) {
  return (
    <div className="overlay lesson-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Reține">
      <div className="modal lesson-modal" onClick={e => e.stopPropagation()}>
        <button className="lesson-close" onClick={onClose} aria-label="Închide">✕</button>
        <h2>📖 REȚIN</h2>

        <p className="five-rule">
          Scăderea repetată a aceluiași termen corespunde operației de <b>împărțire</b>.
        </p>
        <div className="five-example">
          <div className="five-stars" aria-hidden="true">
            <span>🌼🌼🌼</span><span>🌼🌼🌼</span><span>🌼🌼🌼</span><span>🌼🌼🌼</span>
          </div>
          <div className="five-example-text">
            <b>12 − 3 − 3 − 3 − 3 = 0</b>
            <span className="five-arrow">➜</span>
            <b>12 : 3 = 4</b> (am scăzut de 4 ori câte 3)
          </div>
        </div>

        <div className="division-parts" aria-label="Termenii împărțirii">
          <div><b>12</b><span>deîmpărțit</span></div>
          <div className="division-sign">:</div>
          <div><b>3</b><span>împărțitor</span></div>
          <div className="division-sign">=</div>
          <div><b>4</b><span>cât</span></div>
        </div>

        <p className="five-rule">
          Împărțirea este <b>operația inversă înmulțirii</b>.
        </p>
        <div className="five-table division-inverse">
          {TABLE_EXAMPLES.map(([a, b]) => (
            <span key={`${a}-${b}`} className="five-cell">
              {a} × {b} = <b>{a * b}</b><br />
              {a * b} : {a} = <b>{b}</b><br />
              {a * b} : {b} = <b>{a}</b>
            </span>
          ))}
        </div>

        <ul className="five-tips">
          <li>🌼 <b>„În mod egal”</b>: 12 păpădii la 3 prietene → fiecare primește 12 : 3 = <b>4</b>.</li>
          <li>🐞 <b>„Câte grupe”</b>: 12 gândăcei grupați câte 2 → se formează 12 : 2 = <b>6</b> grupe.</li>
          <li>✅ Verifici împărțirea cu înmulțirea: <b>18 : 9 = 2</b> pentru că <b>2 × 9 = 18</b>.</li>
        </ul>
        <button className="bigbtn lesson-ok" onClick={onClose}>👍 Am înțeles!</button>
      </div>
    </div>
  );
}

export default function DivisionMap(props) {
  const [lessonOpen, setLessonOpen] = useState(false);
  return (
    <>
      <PathIslandMap
        {...props}
        mapKey="division"
        title="➗ ÎMPĂRȚIREA"
        path={DIVISION_PATH}
        layouts={LAYOUTS}
        ocean={['#96f2d7', '#38d9a9', '#0ca678']}
        backLabel="← Tabla împărțirii"
        intro="Apasă pe „📖 Reține” din colț ca să citești lecția despre împărțire, apoi descoperă, aplică, exersează și rezolvă! ➗"
        doneText="Știi ce este împărțirea! 🏆"
        corner={(
          <button className="lesson-btn" onClick={() => setLessonOpen(true)} title="Lecția: împărțirea">
            <span aria-hidden="true">📖</span>Reține
          </button>
        )}
      />
      {lessonOpen && <DivisionLesson onClose={() => setLessonOpen(false)} />}
    </>
  );
}
