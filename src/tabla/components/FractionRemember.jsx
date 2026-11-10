import { tr } from '../i18n';
import FractionShape, { Frac } from './FractionShape';

// Caseta „Reține” de la lecția „Fracții”, ca în manual: întreg, jumătate (doime), sfert (pătrime).
export default function FractionRemember({ onClose }) {
  return (
    <div className="overlay lesson-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={tr('Reține')}>
      <div className="modal lesson-modal fraction-remember" onClick={e => e.stopPropagation()}>
        <button className="lesson-close" onClick={onClose} aria-label={tr('Închide')}>✕</button>
        <h2>{tr('📖 REȚIN: FRACȚII')}</h2>

        <div className="fraction-melons" aria-hidden="true">
          <span><b>🍉</b>{tr('întreg')}</span>
          <span><b>🌗</b>{tr('jumătate sau doime')}</span>
          <span><b>🍕</b>{tr('sfert sau pătrime')}</span>
        </div>

        <div className="fraction-rule">
          <p>
            {tr('Când împărțim un întreg în două părți egale, fiecare parte reprezintă o jumătate sau o doime')}
            {' '}(<Frac n={1} d={2} />).
          </p>
          <div className="fraction-pictures">
            <FractionShape shape="bar" parts={2} filled={1} size={70} />
            <FractionShape shape="circle" parts={2} filled={1} size={70} />
            <FractionShape shape="square" parts={2} filled={1} size={70} />
          </div>
        </div>

        <div className="fraction-rule">
          <p>
            {tr('Când împărțim un întreg în 4 părți egale, fiecare parte reprezintă un sfert sau o pătrime')}
            {' '}(<Frac n={1} d={4} />).
          </p>
          <div className="fraction-pictures">
            <FractionShape shape="bar" parts={4} filled={1} size={70} />
            <FractionShape shape="circle" parts={4} filled={1} size={70} />
            <FractionShape shape="square" parts={4} filled={1} size={70} />
          </div>
        </div>

        <div className="fraction-rule">
          <p>
            {tr('Două sferturi formează o jumătate.')} <Frac n={2} d={4} /> = <Frac n={1} d={2} />
          </p>
          <div className="fraction-pictures">
            <FractionShape shape="bar" parts={4} filled={2} size={70} />
            <FractionShape shape="bar" parts={2} filled={1} size={70} />
            <FractionShape shape="circle" parts={4} filled={2} size={70} />
            <FractionShape shape="circle" parts={2} filled={1} size={70} />
          </div>
        </div>

        <ul className="five-tips">
          <li>{tr('✂️ Părțile trebuie să fie egale! Altfel nu sunt nici jumătăți, nici sferturi.')}</li>
          <li>
            {tr('✏️ Cum scriem fracția: jos, în câte părți egale e împărțit întregul; sus, câte părți sunt colorate.')}
            {' '}<Frac n={3} d={4} /> <FractionShape shape="square" parts={4} filledIdx={[0, 1, 3]} size={34} />
          </li>
          <li>{tr('➗ Jumătatea unui număr: îl împărțim la 2. Jumătatea lui 8 este 8 : 2 = 4.')}</li>
          <li>{tr('➗ Sfertul unui număr: îl împărțim la 4. Sfertul lui 8 este 8 : 4 = 2.')}</li>
          <li>{tr('🔁 Sfertul este jumătatea jumătății: 16 : 2 = 8, 8 : 2 = 4, deci sfertul lui 16 este 4.')}</li>
        </ul>
        <button className="bigbtn lesson-ok" onClick={onClose}>{tr('👍 Am înțeles!')}</button>
      </div>
    </div>
  );
}
