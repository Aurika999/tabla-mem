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
