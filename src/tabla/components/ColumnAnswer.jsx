import { useEffect, useRef, useState } from 'react';
import { tr } from '../i18n';

// Numele căsuțelor, de la dreapta la stânga (pentru cititoarele de ecran).
const PLACE_LABELS = ['Cifra unităților', 'Cifra zecilor', 'Cifra sutelor', 'Cifra miilor'];

// Scăderea sau adunarea în coloană, ca în caiet: copilul scrie singur cifrele rezultatului în căsuțe.
// Ca la socoteala pe hârtie, începe cu unitățile (căsuța din dreapta), apoi trece spre stânga.
export default function ColumnAnswer({ current, answered, selected, onAnswer }) {
  const { a, b, op, letter } = current.visual;
  // Câte coloane: cât are cel mai lung dintre numere (și rezultatul).
  const width = Math.max(String(a).length, String(b).length, String(current.correct).length);
  const [cells, setCells] = useState(() => Array(width).fill(''));
  const refs = useRef([]);

  // La fiecare exercițiu nou: căsuțele goale și cursorul la unități.
  useEffect(() => {
    setCells(Array(width).fill(''));
    refs.current[width - 1]?.focus();
  }, [current, width]);

  const digits = n => String(n).padStart(width, ' ').split('');
  const ready = cells[width - 1] !== '';
  const submit = () => {
    if (answered || !ready) return;
    onAnswer(Number(cells.map(c => c || '0').join('')));
  };

  const focus = i => refs.current[Math.max(0, Math.min(width - 1, i))]?.focus();
  const onDigit = (i, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setCells(prev => prev.map((c, j) => (j === i ? digit : c)));
    if (digit && i > 0) focus(i - 1);
  };
  const onKeyDown = (i, e) => {
    if (e.key === 'Enter') submit();
    else if (e.key === 'Backspace' && !e.currentTarget.value) focus(i + 1);
    else if (e.key === 'ArrowLeft') focus(i - 1);
    else if (e.key === 'ArrowRight') focus(i + 1);
  };

  let state = '';
  if (answered) state = selected === current.correct ? ' correct' : ' wrong';

  return (
    <div className="column-answer">
      <div
        className={`column-op${state}`}
        style={{ gridTemplateColumns: `repeat(${width}, 46px) 34px` }}
        aria-label={`${a} ${op} ${b}`}
      >
        {digits(a).map((d, i) => <span key={`a${i}`} className="column-digit">{d.trim()}</span>)}
        <span className="column-sign">{op}</span>
        {digits(b).map((d, i) => <span key={`b${i}`} className="column-digit">{d.trim()}</span>)}
        <span />
        <span className="column-line" style={{ gridColumn: `1 / ${width + 1}` }} />
        <span />
        {cells.map((cell, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            className="column-box"
            inputMode="numeric"
            autoComplete="off"
            aria-label={tr(PLACE_LABELS[width - 1 - i] || 'Cifra')}
            value={cell}
            disabled={answered}
            onChange={e => onDigit(i, e.target.value)}
            onKeyDown={e => onKeyDown(i, e)}
          />
        ))}
        <span />
        {/* Litera de sub rezultat, ca în carte (din litere se descoperă un cuvânt). */}
        {letter && <span className="column-letter" style={{ gridColumn: `1 / ${width + 1}` }}>{letter}</span>}
        {letter && <span />}
      </div>
      <button type="button" className="column-check" onClick={submit} disabled={answered || !ready}>
        {tr('✔️ Verifică')}
      </button>
    </div>
  );
}
