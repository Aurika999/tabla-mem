import { Fragment } from 'react';
import { buildBreakdownText } from '../data';

function MultiplicationHint({ current, hintOpen, onToggle }) {
  const { a, b, fruit } = current;
  const canShowDots = hintOpen && !(a > 10 || b > 10 || a * b > 90);

  return (
    <>
      <button className="hint-toggle" onClick={onToggle}>
        {hintOpen ? '🙈 Ascunde explicația' : '👀 Arată explicația'}
      </button>
      {hintOpen && (
        <div className="breakdown">{a} × {b}  =  {buildBreakdownText(a, b)}</div>
      )}
      {canShowDots && (
        <div className="dot-groups">
          {Array.from({ length: a }, (_, i) => (
            <Fragment key={i}>
              {i > 0 && <div className="plus-sep">+</div>}
              <div className="dot-group" style={{ animationDelay: `${i * 0.06}s` }}>
                {Array.from({ length: b }, (_, j) => (
                  <span key={j} className="dot">{fruit}</span>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
}

function SolutionHint({ explanation, hintOpen, onToggle }) {
  return (
    <>
      <button className="hint-toggle" onClick={onToggle}>
        {hintOpen ? '🙈 Ascunde rezolvarea' : '💡 Cum se rezolvă?'}
      </button>
      {hintOpen && <div className="breakdown solution-text">{explanation}</div>}
    </>
  );
}

export default function HintPanel({ current, hintOpen, onToggle }) {
  if (current.isMultOp) {
    return <MultiplicationHint current={current} hintOpen={hintOpen} onToggle={onToggle} />;
  }
  if (current.explanation) {
    return <SolutionHint explanation={current.explanation} hintOpen={hintOpen} onToggle={onToggle} />;
  }
  return null;
}
