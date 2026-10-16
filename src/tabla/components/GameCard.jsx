import QuestionDisplay from './QuestionDisplay';
import HintPanel from './HintPanel';
import AnswerGrid from './AnswerGrid';
import FeedbackMessage from './FeedbackMessage';
import ProgressBar from './ProgressBar';
import GameControls from './GameControls';
import Toast from './Toast';

export default function GameCard({
  current, stats, questionsPerLevel, answered, selected, hintOpen, feedback, toast,
  onAnswer, onToggleHint, onNext, onRestart, isExam, onSkip, onGoToItem,
}) {
  return (
    <section className="game">
      <Toast text={toast} />
      {isExam ? (
        <>
          <div className="ribbon">{current.badge?.startsWith('✏️') ? 'EXERCIȚIUL' : 'ITEMUL'} <span>{current.examIndex + 1}</span> / {questionsPerLevel}</div>
          {/* Itemii nerezolvați: apeși pe oricare ca să te întorci la el. */}
          <div className="exam-pending">
            <span>✅ Rezolvați: <b>{stats.q}/{questionsPerLevel}</b> · Nerezolvați:</span>
            {[...stats.pending].sort((x, y) => x - y).map(i => (
              <button
                key={i}
                type="button"
                className={`exam-pending-item${!answered && i === current.examIndex ? ' active' : ''}`}
                onClick={() => onGoToItem(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="ribbon">ÎNTREBAREA <span>{Math.min(stats.q + 1, questionsPerLevel)}</span> / {questionsPerLevel}</div>
      )}
      <QuestionDisplay current={current} />
      <HintPanel current={current} hintOpen={hintOpen} onToggle={onToggleHint} />
      <AnswerGrid current={current} answered={answered} selected={selected} onAnswer={onAnswer} />
      <FeedbackMessage feedback={feedback} />
      <ProgressBar current={stats.q} total={questionsPerLevel} />
      <GameControls onNext={onNext} onRestart={onRestart} onSkip={isExam && !answered ? onSkip : null} />
    </section>
  );
}
