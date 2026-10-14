import { LOGIC_PATH } from '../mapProgress';
import PathIslandMap from './PathIslandMap';

// Harta „Insulei Isteților”: paisprezece insule pe un drum în zigzag, de la ușor la avansat.
const ISLANDS = [
  ['ist1', 'Poiana Socotelilor', ['🍎', '🌳', '🎈']],
  ['ist2', 'Grădina Înmulțirilor', ['🌷', '🐝', '🌼']],
  ['ist3', 'Târgul cu Bani', ['🛒', '🪙', '🧸']],
  ['ist4', 'Pădurea Tablei', ['🌲', '🦊', '🍄']],
  ['ist5', 'Satul Problemelor', ['🏡', '🐄', '🌻']],
  ['ist6', 'Pădurea de Calcule', ['🌲', '✏️', '🍂']],
  ['ist7', 'Turnul Isteților', ['🏰', '🕐', '🚌']],
  ['ist8', 'Muntele lui 11 și 12', ['⛰️', '🧗', '🚩']],
  ['ist9', 'Școala din Nori', ['🏫', '📒', '✏️']],
  ['ist10', 'Scara cu Pași', ['🪜', '🐻', '🍯']],
  ['ist11', 'Planeta Roboților', ['🤖', '🚀', '🪐']],
  ['ist12', 'Vulcanul Înmulțirilor', ['🌋', '🔥', '💎']],
  ['ist13', 'Observatorul Campionilor', ['🔭', '🌙', '⭐']],
  ['ist14', 'Muntele Testului', ['🏔️', '🚩', '🏅']],
];

// Calculator: rânduri de câte patru insule, drumul șerpuind dintr-o parte în alta.
// Telefon: o insulă sub alta, alternând stânga–dreapta.
function buildLayouts() {
  const COLS = [165, 390, 615, 840];
  const desktopIslands = ISLANDS.map(([level, name, [a, b, c]], i) => {
    const row = Math.floor(i / 4); const col = i % 4;
    const cx = row % 2 ? COLS[3 - col] : COLS[col];
    const cy = 215 + row * 360 + ((col + row) % 2 ? 0 : 165);
    return { level, cx, cy, rx: 128, ry: 62, name,
      decor: [[a, cx - 85, cy - 8, 32], [b, cx + 85, cy - 18, 28], [c, cx + 67, cy + 24, 22]] };
  });
  // Jos lăsăm loc pentru numele ultimei insule și pentru butonul „Începe”.
  const deskH = Math.max(...desktopIslands.map(island => island.cy)) + 330;
  const phoneIslands = ISLANDS.map(([level, name, [a, b]], i) => {
    const cx = i % 2 ? 400 : 200; const cy = 260 + i * 260;
    return { level, cx, cy, rx: 170, ry: 78, name, decor: [[a, cx - 115, cy - 10, 40], [b, cx + 115, cy - 20, 36]] };
  });
  const phoneH = 260 + (ISLANDS.length - 1) * 260 + 230;
  return {
    desktop: {
      W: 1000,
      H: deskH,
      islands: desktopIslands,
      extras: [['⛵', 470, 110, 30], ['🐬', 500, 470, 40], ['🐳', 950, deskH - 50, 30], ['☁️', 960, 70, 26],
        ['🐠', 290, deskH - 60, 22], ['🦀', 60, deskH - 260, 26]],
    },
    phone: {
      W: 600,
      H: phoneH,
      islands: phoneIslands,
      extras: [['⛵', 520, 190, 34], ['🐬', 120, 540, 42], ['🐳', 520, phoneH - 40, 32], ['🐠', 90, phoneH / 2, 30]],
    },
  };
}

const LAYOUTS = buildLayouts();

export default function LogicMap(props) {
  return (
    <PathIslandMap
      {...props}
      mapKey="logic"
      title="🧩 INSULA ISTEȚILOR"
      path={LOGIC_PATH}
      layouts={LAYOUTS}
      ocean={['#3cc4c9', '#1b9bc0', '#11729c']}
      intro="Paisprezece insule, de la ușor la avansat! 🧩"
      doneText="Ești un adevărat istețel! 🏆"
    />
  );
}
