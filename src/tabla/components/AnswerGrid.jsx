import { tr } from '../i18n';
import ColumnAnswer from './ColumnAnswer';

export default function AnswerGrid({ current, answered, selected, onAnswer }) {
  // Scăderea în coloană: rezultatul se scrie de la tastatură, nu se alege din variante.
  if (current.visual?.type === 'column') {
    return <ColumnAnswer current={current} answered={answered} selected={selected} onAnswer={onAnswer} />;
  }
  return (
    <div className="answers">
      {current.answers.map((value) => {
        let className = typeof value === 'string' && value.length > 3 ? 'answer text' : 'answer';
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
            {typeof value === 'string' ? tr(value) : value}
          </button>
        );
      })}
    </div>
  );
}
