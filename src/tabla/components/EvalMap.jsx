import { EVAL_PATH } from '../mapProgress';
import PathIslandMap from './PathIslandMap';

// Insula „Evaluare”: recapitularea din manual, cu probleme rezolvate pe pași
// și un test final cu calificativ.
const LAYOUTS = {
  desktop: {
    W: 1000,
    H: 610,
    islands: [
      { level: 'eval1', cx: 165, cy: 380, rx: 128, ry: 62, name: 'Pădurea de Calcule',
        decor: [['🧮', 80, 372, 30], ['🌲', 250, 352, 32], ['❄️', 232, 404, 22]] },
      { level: 'eval2', cx: 390, cy: 215, rx: 130, ry: 62, name: 'Scara cu Pași',
        decor: [['🪜', 305, 205, 32], ['🐻', 470, 222, 28], ['🍵', 488, 190, 24]] },
      { level: 'eval4', cx: 615, cy: 380, rx: 128, ry: 62, name: 'Planeta Roboților',
        decor: [['🤖', 540, 360, 34], ['🚀', 700, 370, 28], ['🪐', 690, 404, 22]] },
      { level: 'eval3', cx: 840, cy: 215, rx: 130, ry: 62, name: 'Muntele Testului',
        decor: [['🏔️', 760, 196, 42], ['🏆', 925, 210, 28], ['⛷️', 915, 245, 22]] },
    ],
    extras: [['⛵', 470, 110, 30], ['🐬', 500, 470, 40], ['🐳', 950, 560, 30], ['☁️', 960, 70, 26], ['🐠', 290, 560, 22]],
  },
  phone: {
    W: 600,
    H: 1230,
    islands: [
      { level: 'eval1', cx: 200, cy: 260, rx: 170, ry: 78, name: 'Pădurea de Calcule',
        decor: [['🧮', 80, 250, 40], ['🌲', 318, 230, 44]] },
      { level: 'eval2', cx: 400, cy: 520, rx: 170, ry: 78, name: 'Scara cu Pași',
        decor: [['🪜', 285, 510, 40], ['🐻', 515, 500, 38]] },
      { level: 'eval4', cx: 200, cy: 780, rx: 170, ry: 78, name: 'Planeta Roboților',
        decor: [['🤖', 85, 760, 46], ['🚀', 320, 770, 36]] },
      { level: 'eval3', cx: 400, cy: 1040, rx: 170, ry: 78, name: 'Muntele Testului',
        decor: [['🏔️', 285, 1020, 50], ['🏆', 515, 1030, 36]] },
    ],
    extras: [['⛵', 520, 190, 34], ['🐬', 120, 540, 42], ['🐳', 520, 1190, 32]],
  },
};

export default function EvalMap(props) {
  return (
    <PathIslandMap
      {...props}
      mapKey="eval"
      title="📝 EVALUARE"
      path={EVAL_PATH}
      layouts={LAYOUTS}
      ocean={['#ffd8a8', '#ffa94d', '#e8590c']}
      intro="Recapitulăm! Problemele mari le rezolvăm pas cu pas. La final primești calificativ. 📝"
      doneText="Ai luat evaluarea! 🏆"
    />
  );
}
