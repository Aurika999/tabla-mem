import { EVAL_PATH } from '../mapProgress';
import PathIslandMap from './PathIslandMap';

// Insula „Evaluare”: recapitularea din manual, cu probleme rezolvate pe pași
// și un test final cu calificativ.
const LAYOUTS = {
  desktop: {
    W: 1000,
    H: 610,
    islands: [
      { level: 'eval1', cx: 200, cy: 380, rx: 140, ry: 64, name: 'Pădurea de Calcule',
        decor: [['🧮', 110, 372, 32], ['🌲', 290, 352, 34], ['❄️', 270, 404, 22]] },
      { level: 'eval2', cx: 500, cy: 215, rx: 145, ry: 64, name: 'Scara cu Pași',
        decor: [['🪜', 410, 205, 34], ['🐻', 595, 222, 30], ['🍵', 605, 190, 24]] },
      { level: 'eval3', cx: 800, cy: 380, rx: 140, ry: 64, name: 'Muntele Testului',
        decor: [['🏔️', 715, 350, 44], ['🏆', 890, 372, 30], ['⛷️', 880, 404, 24]] },
    ],
    extras: [['⛵', 470, 110, 30], ['🐬', 500, 470, 40], ['🐳', 950, 560, 30], ['☁️', 960, 70, 26], ['🐠', 290, 560, 22]],
  },
  phone: {
    W: 600,
    H: 970,
    islands: [
      { level: 'eval1', cx: 200, cy: 260, rx: 170, ry: 78, name: 'Pădurea de Calcule',
        decor: [['🧮', 80, 250, 40], ['🌲', 318, 230, 44]] },
      { level: 'eval2', cx: 400, cy: 520, rx: 170, ry: 78, name: 'Scara cu Pași',
        decor: [['🪜', 285, 510, 40], ['🐻', 515, 500, 38]] },
      { level: 'eval3', cx: 200, cy: 780, rx: 170, ry: 78, name: 'Muntele Testului',
        decor: [['🏔️', 85, 760, 50], ['🏆', 320, 770, 36]] },
    ],
    extras: [['⛵', 520, 190, 34], ['🐬', 120, 540, 42], ['🐳', 520, 930, 32]],
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
