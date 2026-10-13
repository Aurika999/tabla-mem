// Imaginea unei întrebări: grupe egale de obiecte (ex. 18 flori în 3 grupe).
function Picture({ picture }) {
  const { icon, groups, per, holder } = picture;
  return (
    <div className="question-picture" aria-hidden="true">
      {Array.from({ length: groups }, (_, g) => (
        <div key={g} className="question-picture-group">
          <div className="question-picture-items" style={{ gridTemplateColumns: `repeat(${Math.min(per, 3)}, 1fr)` }}>
            {Array.from({ length: per }, (_, i) => <span key={i}>{icon}</span>)}
          </div>
          {holder && <div className="question-picture-holder">{holder}</div>}
        </div>
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

export default function QuestionDisplay({ current }) {
  if (current.steps) {
    return (
      <div className="question-word">
        <span className="wp-badge">{current.badge || '📖 Problemă'} · rezolvă pe pași</span>
        <br />
        {current.problemText}
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
        {current.picture && <Picture picture={current.picture} />}
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
