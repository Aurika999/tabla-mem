export default function QuestionDisplay({ current }) {
  if (current.isWordProblem) {
    return (
      <div className="question-word">
        <span className="wp-badge">📖 Problemă</span>
        <br />
        {current.problemText}
      </div>
    );
  }
  return <div className="question">{current.a} × {current.b} = ?</div>;
}
