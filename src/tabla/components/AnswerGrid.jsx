export default function AnswerGrid({ current, answered, selected, onAnswer }) {
  return (
    <div className="answers">
      {current.answers.map((value) => {
        let className = 'answer';
        if (answered && value === selected) {
          className += value === current.correct ? ' correct' : ' wrong';
        }
        return (
          <button
            key={value}
            className={className}
            disabled={answered}
            onClick={() => onAnswer(value)}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}
