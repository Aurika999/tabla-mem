import { LOGIC_PATH } from '../mapProgress';
import PathIslandMap from './PathIslandMap';

// Harta „Insulei Isteților”: câte o insulă mică pentru fiecare nivel.
const LAYOUTS = {
  desktop: {
    W: 1000,
    H: 610,
    islands: [
      { level: 'logica1', cx: 165, cy: 380, rx: 128, ry: 62, name: 'Poiana Socotelilor',
        decor: [['🍎', 80, 372, 30], ['🌳', 250, 352, 36], ['🎈', 230, 400, 24]] },
      { level: 'logica2', cx: 390, cy: 215, rx: 130, ry: 62, name: 'Târgul cu Bani',
        decor: [['🛒', 305, 208, 34], ['🪙', 470, 228, 24], ['🧸', 488, 196, 28]] },
      { level: 'logica3', cx: 615, cy: 380, rx: 128, ry: 62, name: 'Turnul Isteților',
        decor: [['🏰', 545, 352, 40], ['🕐', 700, 372, 26], ['🚌', 688, 404, 22]] },
      { level: 'logica4', cx: 840, cy: 215, rx: 130, ry: 62, name: 'Observatorul Isteților',
        decor: [['🔭', 760, 200, 38], ['🌙', 920, 188, 26], ['⭐', 935, 232, 22], ['💐', 895, 250, 22]] },
    ],
    extras: [['⛵', 470, 110, 30], ['🐬', 500, 470, 40], ['🐳', 950, 560, 30], ['☁️', 960, 70, 26], ['🐠', 290, 560, 22]],
  },
  phone: {
    W: 600,
    H: 1230,
    islands: [
      { level: 'logica1', cx: 200, cy: 260, rx: 170, ry: 78, name: 'Poiana Socotelilor',
        decor: [['🍎', 80, 250, 38], ['🌳', 318, 230, 44]] },
      { level: 'logica2', cx: 400, cy: 520, rx: 170, ry: 78, name: 'Târgul cu Bani',
        decor: [['🛒', 285, 510, 40], ['🧸', 515, 500, 36]] },
      { level: 'logica3', cx: 200, cy: 780, rx: 170, ry: 78, name: 'Turnul Isteților',
        decor: [['🏰', 85, 760, 50], ['🕐', 320, 770, 34]] },
      { level: 'logica4', cx: 400, cy: 1040, rx: 170, ry: 78, name: 'Observatorul Isteților',
        decor: [['🔭', 285, 1025, 44], ['⭐', 515, 1020, 34]] },
    ],
    extras: [['⛵', 520, 190, 34], ['🐬', 120, 540, 42], ['🐳', 520, 1190, 32]],
  },
};

export default function LogicMap(props) {
  return (
    <PathIslandMap
      {...props}
      mapKey="logic"
      title="🧩 INSULA ISTEȚILOR"
      path={LOGIC_PATH}
      layouts={LAYOUTS}
      ocean={['#3cc4c9', '#1b9bc0', '#11729c']}
      intro="Aici sunt probleme de gândire: adunări, scăderi și exerciții ca în manual. 🧩"
      doneText="Ești un adevărat istețel! 🏆"
    />
  );
}
