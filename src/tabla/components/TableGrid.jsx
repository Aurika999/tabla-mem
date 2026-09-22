import { tableSize } from '../data';

export default function TableGrid({ level }) {
  const n = tableSize(level);
  const rows = Array.from({ length: n }, (_, i) => {
    const idx = i + 1;
    return { left: idx, right: n, result: idx * n };
  });

  return (
    <div id="tableArea">
      <h2>📚 Tabla</h2>
      <div className="table-grid">
        {rows.map((row, i) => (
          <div key={i}>{row.left} × {row.right} = {row.result}</div>
        ))}
      </div>
    </div>
  );
}
