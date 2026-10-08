import { useCallback, useEffect, useRef, useState } from 'react';
import { FRUITS, LEVELS, PROBLEME_LEVEL, AVANSATE_LEVEL, buildWordProblem, makeAnswers, rangeForLevel } from './data';
import { buildAdvancedProblem } from './advancedProblems';

const QUESTIONS_PER_LEVEL = 10;
const QUESTION_TIME = 30;

export function generateQuestion(level) {
  const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];

  if (level === AVANSATE_LEVEL) {
    const problem = buildAdvancedProblem();
    return {
      a: null, b: null, isWordProblem: true, isMultOp: false,
      problemText: problem.text,
      explanation: problem.explanation || null,
      correct: problem.answer,
      answers: problem.choices,
      fruit,
    };
  }

  const [amin, amax, bmin, bmax] = rangeForLevel(level);
  let a = amin + Math.floor(Math.random() * (amax - amin + 1));
  let b = bmin + Math.floor(Math.random() * (bmax - bmin + 1));
  if (level === 5 && Math.random() < 0.5) [a, b] = [b, a];

  let isWordProblem = false;
  let isMultOp = true;
  let problemText = null;
  let wpAnswer = null;
  let explanation = null;

  if (level === PROBLEME_LEVEL) {
    const wp = buildWordProblem(a, b);
    isWordProblem = true;
    isMultOp = wp.isMult;
    problemText = wp.text;
    wpAnswer = wp.answer;
    explanation = wp.explanation || null;
  }

  const correct = isWordProblem ? wpAnswer : a * b;

  return {
    a, b, isWordProblem, isMultOp, problemText, explanation,
    correct,
    answers: makeAnswers(correct),
    fruit,
  };
}

function createStats(level) {
  return { level, points: 0, lives: 3, combo: 0, bestCombo: 0, correct: 0, wrong: 0, q: 0 };
}

export function useTablaGame(initialLevel = 1, paused = false) {
  const [stats, setStats] = useState(() => createStats(initialLevel));
  const [current, setCurrent] = useState(() => generateQuestion(initialLevel));
  const [time, setTime] = useState(QUESTION_TIME);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [feedback, setFeedback] = useState({ text: 'Alege răspunsul corect! 😊', color: '' });
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const toastTimeoutRef = useRef(null);

  const startLevel = useCallback((level) => {
    setStats(createStats(level));
    setCurrent(generateQuestion(level));
    setTime(QUESTION_TIME);
    setAnswered(false);
    setSelected(null);
    setHintOpen(false);
    setFeedback({ text: 'Alege răspunsul corect! 😊', color: '' });
    setModal(null);
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrent(generateQuestion(stats.level));
    setTime(QUESTION_TIME);
    setAnswered(false);
    setSelected(null);
    setHintOpen(false);
    setFeedback({ text: 'Alege răspunsul corect! 😊', color: '' });
  }, [stats.level]);

  const toggleHint = useCallback(() => setHintOpen(v => !v), []);

  const showToast = useCallback((text) => {
    clearTimeout(toastTimeoutRef.current);
    setToast(text);
    toastTimeoutRef.current = setTimeout(() => setToast(''), 1300);
  }, []);

  const handleAnswer = useCallback((value) => {
    if (answered) return;
    setAnswered(true);
    setSelected(value);
    const isCorrect = value === current.correct;

    setStats(prev => {
      if (isCorrect) {
        const combo = prev.combo + 1;
        const gained = 10 + (combo >= 3 ? 5 * combo : 0);
        return {
          ...prev,
          correct: prev.correct + 1,
          combo,
          bestCombo: Math.max(prev.bestCombo, combo),
          points: prev.points + gained,
          q: prev.q + 1,
        };
      }
      return {
        ...prev,
        wrong: prev.wrong + 1,
        lives: prev.lives - 1,
        combo: 0,
        q: prev.q + 1,
      };
    });

    if (isCorrect) {
      const combo = stats.combo + 1;
      const gained = 10 + (combo >= 3 ? 5 * combo : 0);
      setFeedback({
        text: `🎉 Corect! +${gained} puncte! ${combo >= 3 ? '🔥 SUPER COMBO!' : ''}`,
        color: '#159632',
      });
      if (combo === 3) showToast('🔥 Ai primit bonus de combo!');
    } else {
      setFeedback({ text: `💡 Răspunsul era ${current.correct}. Mai încearcă!`, color: '#dc263e' });
    }
  }, [answered, current, stats.combo, showToast]);

  useEffect(() => {
    if (answered || paused) return;
    if (time <= 0) {
      handleAnswer(null);
      return;
    }
    const id = setTimeout(() => setTime(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [time, answered, paused, handleAnswer]);

  useEffect(() => {
    if (!answered) return;
    if (stats.lives <= 0) {
      const id = setTimeout(() => {
        setModal({
          title: '❤️ S-au terminat viețile!',
          text: `Ai obținut <b>${stats.points}</b> puncte. Nu-i nimic — mai încearcă! 😊`,
          showNext: false,
        });
      }, 400);
      return () => clearTimeout(id);
    }
    if (stats.q >= QUESTIONS_PER_LEVEL) {
      const id = setTimeout(() => {
        const pct = Math.round(stats.correct / QUESTIONS_PER_LEVEL * 100);
        setModal({
          title: pct >= 80 ? '🌟 Extraordinar!' : pct >= 50 ? '👏 Bravo!' : '💪 Continuă să exersezi!',
          text: `Ai terminat <b>${LEVELS[stats.level].label.replace(/^\d+\.\s*/, '')}</b> cu <b>${stats.correct}/10</b> răspunsuri corecte și <b>${stats.points}</b> puncte.<br><br>${pct >= 80 ? 'Ai câștigat o stea ⭐!' : ''}`,
          showNext: stats.level < 5,
        });
      }, 500);
      return () => clearTimeout(id);
    }
  }, [answered, stats.lives, stats.q, stats.correct, stats.points, stats.level]);

  const goToNextQuestionOrFinish = useCallback(() => {
    if (!answered) {
      showToast('Alege mai întâi un răspuns! 😊');
      return;
    }
    if (stats.q >= QUESTIONS_PER_LEVEL) return;
    nextQuestion();
  }, [answered, stats.q, nextQuestion, showToast]);

  const selectLevel = useCallback((level) => startLevel(level), [startLevel]);
  const restartLevel = useCallback(() => startLevel(stats.level), [startLevel, stats.level]);
  const goToNextLevel = useCallback(() => {
    if (stats.level < 5) startLevel(stats.level + 1);
  }, [startLevel, stats.level]);

  return {
    stats,
    current,
    time,
    answered,
    selected,
    hintOpen,
    feedback,
    modal,
    toast,
    questionsPerLevel: QUESTIONS_PER_LEVEL,
    selectLevel,
    restartLevel,
    goToNextLevel,
    handleAnswer,
    toggleHint,
    goToNextQuestionOrFinish,
  };
}
