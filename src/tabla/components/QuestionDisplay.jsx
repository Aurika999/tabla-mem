import { useState } from 'react';
// Imaginea unei întrebări: grupe egale de obiecte (ex. 18 flori în 3 grupe).
function Picture({ picture }) {
  const { icon, groups, per, holder } = picture;
  return (
    <div className="question-picture" aria-hidden="true">
      {Array.from({ length: groups }, (_, g) => (
        <div key={g} className="question-picture-group">
          <div className="question-picture-items" style={{ gridTemplateColumns: `repeat(${per === 4 ? 2 : Math.min(per, 3)}, 1fr)` }}>
            {Array.from({ length: per }, (_, i) => <span key={i}>{icon}</span>)}
          </div>
          {holder && <div className="question-picture-holder">{holder}</div>}
        </div>
      ))}
    </div>
  );
}

// Imaginile din Evaluarea Națională: tabelul cu date, afișul și plăcuțele cu forme.
function Visual({ visual }) {
  if (visual.type === 'table') {
    return (
      <table className="exam-table">
        <caption>{visual.caption}</caption>
        <tbody>
          <tr>{visual.rows.map(([icon, name]) => <th key={name}><span aria-hidden="true">{icon}</span> {name}</th>)}</tr>
          <tr>{visual.rows.map(([, name, value]) => <td key={name}>{value}</td>)}</tr>
        </tbody>
      </table>
    );
  }
  if (visual.type === 'poster') {
    return (
      <div className={`exam-poster${visual.wide ? ' wide' : ''}`} aria-label="Imaginea din test">
        {visual.title && (
          <div className="exam-poster-title">{visual.title.map(line => <div key={line}>{line}</div>)}</div>
        )}
        <div className="exam-poster-grid" aria-hidden="true">{visual.cells.map((cell, i) => <span key={i}>{cell}</span>)}</div>
      </div>
    );
  }
  return (
    <div className="exam-shapes" aria-label="Formele din test">
      {visual.items.map(([shape, icon]) => (
        <span key={shape} className={`exam-shape ${shape}`}>{shape === 'triangle' ? <b>{icon}</b> : icon}</span>
      ))}
    </div>
  );
}

// Pașii unei probleme: cei rezolvați cu ✅, cel curent evidențiat, cei următori ascunși.
function Steps({ current }) {
  return (
    <ol className="question-steps">
      {current.steps.slice(0, current.stepIndex + 1).map((step, i) => (
        <li key={i} className={i < current.stepIndex ? 'done' : 'current'}>
          <b>Pasul {i + 1} din {current.steps.length}:</b> {step.question}
          {i < current.stepIndex && <span className="question-step-answer"> ✅ {step.answer}</span>}
        </li>
      ))}
    </ol>
  );
}

// Butonul „▶️ Vezi video”: învățătoarea rezolvă exercițiul la tablă.
function VideoButton({ src }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="video-btn" onClick={() => setOpen(true)}>▶️ Vezi cum se rezolvă (video)</button>
      {open && (
        <div className="overlay lesson-overlay" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Video">
          <div className="modal video-modal" onClick={e => e.stopPropagation()}>
            <button className="lesson-close" onClick={() => setOpen(false)} aria-label="Închide">✕</button>
            <video src={`${process.env.PUBLIC_URL}/video/${src}`} controls autoPlay playsInline />
          </div>
        </div>
      )}
    </>
  );
}

export default function QuestionDisplay({ current }) {
  if (current.steps) {
    return (
      <div className="question-word">
        <span className="wp-badge">{current.badge || '📖 Problemă'} · rezolvă pe pași</span>
        <br />
        {current.problemText}
        {current.visual && <Visual visual={current.visual} />}
        {current.picture && <Picture picture={current.picture} />}
        {current.video && <div><VideoButton src={current.video} /></div>}
        <Steps current={current} />
      </div>
    );
  }
  if (current.isWordProblem) {
    return (
      <div className="question-word">
        <span className="wp-badge">{current.badge || '📖 Problemă'}</span>
        <br />
        {current.problemText}
        {current.visual && <Visual visual={current.visual} />}
        {current.picture && <Picture picture={current.picture} />}
        {current.video && <div><VideoButton src={current.video} /></div>}
      </div>
    );
  }
  return (
    <>
      {current.badge && <div><span className="wp-badge">{current.badge}</span></div>}
      <div className="question">{current.a} × {current.b} = ?</div>
    </>
  );
}
