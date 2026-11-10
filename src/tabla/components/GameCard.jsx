import QuestionDisplay from './QuestionDisplay';
import HintPanel from './HintPanel';
import AnswerGrid from './AnswerGrid';
import FeedbackMessage from './FeedbackMessage';
import ProgressBar from './ProgressBar';
import GameControls from './GameControls';
import Toast from './Toast';
import { useState } from 'react';
import FractionRemember from './FractionRemember';
import { tr } from '../i18n';

// „Reține” la fracții se deschide singur o singură dată, la prima intrare din sesiune.
let fractionRememberShown = false;

export default function GameCard({
  current, stats, questionsPerLevel, answered, selected, hintOpen, feedback, toast,
  onAnswer, onToggleHint, onNext, onRestart, isExam, onSkip, onGoToItem,
}) {
  // Scăderea în coloană: rezultatul se scrie în căsuțe, nu se alege din variante.
  const isColumn = current.visual?.type === 'column';
  const isFractions = stats.level === 'fractii';
  const [rememberOpen, setRememberOpen] = useState(() => {
    if (!isFractions || fractionRememberShown) return false;
    fractionRememberShown = true;
    return true;
  });
  return (
    <section className="game">
      <Toast text={toast} />
      {isFractions && (
        <button type="button" className="lesson-btn game-remember" onClick={() => setRememberOpen(true)}>
          <span aria-hidden="true">📖</span>{tr('Reține')}
        </button>
      )}
      {rememberOpen && <FractionRemember onClose={() => setRememberOpen(false)} />}
      {isExam ? (
        <>
          <div className="ribbon">{current.badge?.startsWith('✏️') ? tr('EXERCIȚIUL') : tr('ITEMUL')} <span>{current.examIndex + 1}</span> / {questionsPerLevel}</div>
          {/* Itemii nerezolvați: apeși pe oricare ca să te întorci la el. */}
          <div className="exam-pending">
            {/* „exercițiile rezolvate”, dar „itemii rezolvați” */}
            <span>✅ {current.badge?.startsWith('✏️') ? tr('Rezolvate:') : tr('Rezolvați:')} <b>{stats.q}/{questionsPerLevel}</b></span>
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
        <div className="ribbon">{tr('ÎNTREBAREA')} <span>{Math.min(stats.q + 1, questionsPerLevel)}</span> / {questionsPerLevel}</div>
      )}
      <QuestionDisplay current={current} />
      {/* La scăderea în coloană, căsuțele pentru rezultat vin imediat sub exercițiu, apoi rezolvarea. */}
      {!isColumn && <HintPanel current={current} hintOpen={hintOpen} onToggle={onToggleHint} />}
      <AnswerGrid current={current} answered={answered} selected={selected} onAnswer={onAnswer} />
      {isColumn && <HintPanel current={current} hintOpen={hintOpen} onToggle={onToggleHint} />}
      <FeedbackMessage
        feedback={isColumn && feedback.text === 'Alege răspunsul corect! 😊'
          ? { ...feedback, text: 'Scrie rezultatul în căsuțe, apoi apasă „Verifică”! ✍️' }
          : feedback}
      />
      <ProgressBar current={stats.q} total={questionsPerLevel} />
      <GameControls onNext={onNext} onRestart={onRestart} onSkip={isExam && !answered ? onSkip : null} />
    </section>
  );
}
