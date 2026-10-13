import { useState } from 'react';
import { DIVISION_PATH } from '../mapProgress';
import PathIslandMap from './PathIslandMap';

// Lecția „Împărțirea”: împărțirea ca scădere repetată și ca operație inversă
// înmulțirii, cu caseta „Reține” deschisă din colțul hărții.
const LAYOUTS = {
  desktop: {
    W: 1000,
    H: 1050,
    islands: [
      { level: 'imp1', cx: 165, cy: 380, rx: 128, ry: 62, name: 'Poiana cu Păpădii',
        decor: [['🌼', 80, 372, 32], ['🔍', 250, 352, 28], ['🌼', 232, 404, 22]] },
      { level: 'imp2', cx: 390, cy: 215, rx: 130, ry: 62, name: 'Frunza Buburuzelor',
        decor: [['🐞', 305, 205, 32], ['🍃', 470, 222, 28], ['🐞', 488, 190, 22]] },
      { level: 'imp3', cx: 615, cy: 380, rx: 128, ry: 62, name: 'Grădina cu Gândăcei',
        decor: [['🐛', 540, 362, 32], ['🌸', 700, 370, 28], ['🐝', 690, 404, 22]] },
      { level: 'imp4', cx: 840, cy: 215, rx: 130, ry: 62, name: 'Cetatea Împărțirii',
        decor: [['🏰', 760, 196, 40], ['🧁', 925, 210, 28], ['🎁', 915, 245, 22]] },
      { level: 'imp5', cx: 840, cy: 560, rx: 130, ry: 62, name: 'Magazinul de Mingi',
        decor: [['⚽', 760, 548, 32], ['🔟', 925, 540, 28], ['🏀', 912, 590, 22]] },
      { level: 'imp6', cx: 615, cy: 740, rx: 128, ry: 62, name: 'Căsuța Piticilor',
        decor: [['👸', 540, 724, 32], ['🌰', 700, 728, 28], ['🎉', 690, 766, 22]] },
      { level: 'imp7', cx: 390, cy: 560, rx: 130, ry: 62, name: 'Cofetăria Teodorei',
        decor: [['🧁', 305, 548, 32], ['✅', 470, 540, 28], ['🧁', 488, 590, 22]] },
      { level: 'imp8', cx: 165, cy: 740, rx: 128, ry: 62, name: 'Pușculița lui Alex',
        decor: [['🐷', 80, 724, 32], ['🍒', 250, 712, 28], ['✏️', 232, 766, 22]] },
    ],
    extras: [['⛵', 470, 110, 30], ['🐬', 500, 420, 40], ['🐳', 950, 990, 30], ['☁️', 960, 70, 26], ['🐠', 290, 990, 22], ['🦀', 60, 470, 26]],
  },
  phone: {
    W: 600,
    H: 2270,
    islands: [
      { level: 'imp1', cx: 200, cy: 260, rx: 170, ry: 78, name: 'Poiana cu Păpădii',
        decor: [['🌼', 80, 250, 40], ['🔍', 318, 230, 38]] },
      { level: 'imp2', cx: 400, cy: 520, rx: 170, ry: 78, name: 'Frunza Buburuzelor',
        decor: [['🐞', 285, 510, 40], ['🍃', 515, 500, 38]] },
      { level: 'imp3', cx: 200, cy: 780, rx: 170, ry: 78, name: 'Grădina cu Gândăcei',
        decor: [['🐛', 85, 760, 42], ['🌸', 320, 770, 36]] },
      { level: 'imp4', cx: 400, cy: 1040, rx: 170, ry: 78, name: 'Cetatea Împărțirii',
        decor: [['🏰', 285, 1020, 46], ['🧁', 515, 1030, 36]] },
      { level: 'imp5', cx: 200, cy: 1300, rx: 170, ry: 78, name: 'Magazinul de Mingi',
        decor: [['⚽', 85, 1290, 40], ['🔟', 318, 1270, 36]] },
      { level: 'imp6', cx: 400, cy: 1560, rx: 170, ry: 78, name: 'Căsuța Piticilor',
        decor: [['👸', 285, 1550, 40], ['🌰', 515, 1540, 36]] },
      { level: 'imp7', cx: 200, cy: 1820, rx: 170, ry: 78, name: 'Cofetăria Teodorei',
        decor: [['🧁', 85, 1800, 42], ['✅', 320, 1810, 36]] },
      { level: 'imp8', cx: 400, cy: 2080, rx: 170, ry: 78, name: 'Pușculița lui Alex',
        decor: [['🐷', 285, 2060, 44], ['🍒', 515, 2070, 36]] },
    ],
    extras: [['⛵', 520, 190, 34], ['🐬', 120, 540, 42], ['🐳', 520, 1190, 32], ['🐠', 90, 1700, 32], ['🦀', 520, 2230, 30]],
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

        <h3 className="lesson-subtitle">🔟 Cazuri speciale de împărțire</h3>
        <p className="five-rule">
          Când împărțim un număr la <b>10</b>, obținem un număr <b>de 10 ori mai mic</b> decât acesta: 60 : 10 = 6.
          Numerele care se împart exact la 10 au <b>cifra unităților 0</b>.
        </p>
        <ul className="five-tips">
          <li>☝️ Dacă împărțim un număr <b>la el însuși</b>, obținem câtul <b>1</b>: 7 : 7 = 1.</li>
          <li>1️⃣ Când împărțim un număr <b>la 1</b>, obținem câtul egal cu acel număr: 5 : 1 = 5.</li>
          <li>0️⃣ <b>0 împărțit</b> la orice număr dă câtul <b>0</b>: 0 : 5 = 0. <b>Împărțirea la 0 nu are sens!</b> (5 : 0 ✖️)</li>
        </ul>

        <h3 className="lesson-subtitle">✅ Proba înmulțirii și a împărțirii</h3>
        <ul className="five-tips">
          <li>✖️ Proba înmulțirii se face prin <b>împărțire</b>: 8 × 7 = 56 → 56 : 7 = 8 sau 56 : 8 = 7.</li>
          <li>➗ Proba împărțirii se face prin <b>înmulțire</b>: 56 : 8 = 7 → 7 × 8 = 56.</li>
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
        intro="Apasă pe „📖 Reține” din colț ca să citești lecția despre împărțire, apoi descoperă, aplică, exersează și rezolvă! Mai jos te așteaptă cazurile speciale și proba. ➗"
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
