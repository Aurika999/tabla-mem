// Un întreg împărțit în părți, ca în manual, cu unele părți colorate.
// shape: circle (cerc), bar (dreptunghi lung), square (pătrat: 2 coloane sau 2 × 2),
//        squareH (pătrat tăiat orizontal), squareD (pătrat tăiat pe o diagonală),
//        squareX (pătrat tăiat pe ambele diagonale), tall (dreptunghi în picioare, tăiat orizontal).
// parts = în câte părți; filled = câte sunt colorate (primele); filledIdx = exact care părți sunt colorate;
// widths = părți inegale (doar la dreptunghiul lung).
const FILL = '#5cc9a7';
const EMPTY = '#ffffff';
const STROKE = '#2b6f5c';

function sector(cx, cy, r, from, to) {
  const point = a => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  const [x1, y1] = point(from);
  const [x2, y2] = point(to);
  const large = to - from > Math.PI ? 1 : 0;
  return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
}

const rect = (x, y, w, h) => `M${x},${y} H${x + w} V${y + h} H${x} Z`;
const poly = points => `M${points.map(p => p.join(',')).join(' L')} Z`;

// Părțile fiecărei forme, ca drumuri SVG, plus mărimea desenului.
function cellsOf(shape, parts, widths) {
  if (shape === 'circle') {
    return {
      view: [104, 104],
      cells: parts === 1
        ? ['M50,0 A50,50 0 1 1 49.99,0 Z']
        : Array.from({ length: parts }, (_, i) => sector(50, 50, 50, (2 * Math.PI * i) / parts, (2 * Math.PI * (i + 1)) / parts)),
    };
  }
  if (shape === 'square') {
    const cells = parts === 4
      ? [rect(0, 0, 50, 50), rect(50, 0, 50, 50), rect(0, 50, 50, 50), rect(50, 50, 50, 50)]
      : parts === 2 ? [rect(0, 0, 50, 100), rect(50, 0, 50, 100)] : [rect(0, 0, 100, 100)];
    return { view: [104, 104], cells };
  }
  if (shape === 'squareH') return { view: [104, 104], cells: [rect(0, 0, 100, 50), rect(0, 50, 100, 50)] };
  if (shape === 'squareD') {
    return { view: [104, 104], cells: [poly([[0, 0], [100, 0], [100, 100]]), poly([[0, 0], [0, 100], [100, 100]])] };
  }
  if (shape === 'squareX') {
    return {
      view: [104, 104],
      cells: [
        poly([[0, 0], [100, 0], [50, 50]]), poly([[100, 0], [100, 100], [50, 50]]),
        poly([[100, 100], [0, 100], [50, 50]]), poly([[0, 100], [0, 0], [50, 50]]),
      ],
    };
  }
  if (shape === 'tall') {
    const h = 130 / parts;
    return { view: [64, 134], cells: Array.from({ length: parts }, (_, i) => rect(0, i * h, 60, h)) };
  }
  // Dreptunghi lung, împărțit pe orizontală (părți egale sau, cu widths, inegale).
  const sizes = widths || Array(parts).fill(1);
  const total = sizes.reduce((a, b) => a + b, 0);
  let x = 0;
  const cells = sizes.map((w) => {
    const width = (180 * w) / total;
    const d = rect(x, 0, width, 50);
    x += width;
    return d;
  });
  return { view: [184, 54], cells };
}

export default function FractionShape({ shape = 'circle', parts, filled = 0, filledIdx, widths, size = 110 }) {
  const { view: [vw, vh], cells } = cellsOf(shape, parts, widths);
  const isFilled = i => (filledIdx ? filledIdx.includes(i) : i < filled);
  // Mărimea pe ecran: latura mai lungă a desenului are `size` (dreptunghiul lung, ceva mai mult).
  const scale = (shape === 'bar' ? size * 1.8 : size) / Math.max(vw, vh);
  return (
    <svg className="fraction-shape" width={vw * scale} height={vh * scale} viewBox={`-2 -2 ${vw} ${vh}`} aria-hidden="true">
      {cells.map((d, i) => (
        <path key={i} d={d} fill={isFilled(i) ? FILL : EMPTY} stroke={STROKE} strokeWidth="2.5" strokeLinejoin="round" />
      ))}
    </svg>
  );
}

// O fracție scrisă ca în carte: numărătorul deasupra liniei, numitorul dedesubt.
export function Frac({ n, d }) {
  return (
    <span className="frac" aria-label={`${n}/${d}`}>
      <span>{n}</span>
      <span className="frac-den">{d}</span>
    </span>
  );
}
