import QuestionDisplay from './QuestionDisplay';
import HintPanel from './HintPanel';
import AnswerGrid from './AnswerGrid';
import FeedbackMessage from './FeedbackMessage';
import ProgressBar from './ProgressBar';
import GameControls from './GameControls';
import Toast from './Toast';

export default function GameCard({
  current, stats, questionsPerLevel, answered, selected, hintOpen, feedback, toast,
  onAnswer, onToggleHint, onNext, onRestart,
}) {
  return (
    <section className="game">
      <Toast text={toast} />
      <div className="ribbon">ÎNTREBAREA <span>{Math.min(stats.q + 1, questionsPerLevel)}</span> / {questionsPerLevel}</div>
      <QuestionDisplay current={current} />
      <HintPanel current={current} hintOpen={hintOpen} onToggle={onToggleHint} />
      <AnswerGrid current={current} answered={answered} selected={selected} onAnswer={onAnswer} />
      <FeedbackMessage feedback={feedback} />
      <ProgressBar current={stats.q} total={questionsPerLevel} />
      <GameControls onNext={onNext} onRestart={onRestart} />
    </section>
  );
}
