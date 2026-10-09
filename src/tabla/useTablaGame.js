import { useCallback, useEffect, useRef, useState } from 'react';
import { FRUITS, LEVELS, PROBLEME_LEVEL, AVANSATE_LEVEL, makeAnswers, rangeForLevel } from './data';
import { buildWordProblem } from './multiplicationProblems';
import { buildAdvancedProblem } from './advancedProblems';
import { starsForCorrect, isLogicLevel, nextLevelInPath } from './mapProgress';
import { buildLogicProblem } from './logicProblems';

const QUESTIONS_PER_LEVEL = 10;
export const START_LIVES = 3;
export const MAX_LIVES = 5;
// La fiecare atâtea răspunsuri corecte la rând, jucătorul primește o viață.
export const COMBO_FOR_LIFE = 5;
// Cât costă (din punctele totale) o viață când runda s-a terminat din lipsă de vieți.
export const REVIVE_COST = 30;
const QUESTION_TIME = 30;

export function generateQuestion(level) {
  const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];

  if (level === AVANSATE_LEVEL || isLogicLevel(level)) {
    const problem = isLogicLevel(level) ? buildLogicProblem(level) : buildAdvancedProblem();
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
  // Toate problemele de pe acest drum sunt înmulțiri (adunările sunt pe Insula Isteților).
  const isMultOp = true;
  const explanation = null;
  let problemText = null;
  let wpAnswer = null;

  if (level === PROBLEME_LEVEL) {
    const wp = buildWordProblem();
    // Factorii problemei (grupe × câte în grupă) alimentează „Arată explicația”.
    [a, b] = wp.factors;
    isWordProblem = true;
    problemText = wp.text;
    wpAnswer = wp.answer;
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
  // roundId deosebește rundele, ca punctele unei runde să nu fie salvate de două ori.
  return {
    level, points: 0, lives: START_LIVES, combo: 0, bestCombo: 0, correct: 0, wrong: 0, q: 0,
    roundId: Date.now(),
  };
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
        const earnsLife = combo % COMBO_FOR_LIFE === 0;
        return {
          ...prev,
          correct: prev.correct + 1,
          combo,
          lives: earnsLife ? Math.min(MAX_LIVES, prev.lives + 1) : prev.lives,
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
      if (combo % COMBO_FOR_LIFE === 0) {
        showToast(stats.lives < MAX_LIVES
          ? `❤️ ${combo} la rând — ai câștigat o viață!`
          : `🔥 ${combo} la rând! Ai deja ${MAX_LIVES} vieți.`);
      } else if (combo === 3) {
        showToast('🔥 Ai primit bonus de combo!');
      }
    } else {
      setFeedback({ text: `💡 Răspunsul era ${current.correct}. Mai încearcă!`, color: '#dc263e' });
    }
  }, [answered, current, stats.combo, stats.lives, showToast]);

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
          outOfLives: true,
        });
      }, 400);
      return () => clearTimeout(id);
    }
    if (stats.q >= QUESTIONS_PER_LEVEL) {
      const id = setTimeout(() => {
        const pct = Math.round(stats.correct / QUESTIONS_PER_LEVEL * 100);
        // Aceleași stele ca pe harta nivelurilor (vezi mapProgress.js).
        const stars = starsForCorrect(stats.correct);
        const nextStarHint = stars < 3
          ? `<br><small>Pentru ${stars + 1} stele ai nevoie de cel puțin ${stars === 1 ? 6 : 9} răspunsuri corecte.</small>`
          : '';
        setModal({
          title: pct >= 80 ? '🌟 Extraordinar!' : pct >= 50 ? '👏 Bravo!' : '💪 Continuă să exersezi!',
          text: `Ai terminat <b>${LEVELS[stats.level].label.replace(/^\d+\.\s*/, '')}</b> cu <b>${stats.correct}/10</b> răspunsuri corecte și <b>${stats.points}</b> puncte.`
            + `<br><br><span class="modal-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</span>`
            + `<br>Ai câștigat <b>${stars} ${stars === 1 ? 'stea' : 'stele'}</b> la acest nivel, pe harta aventurii!`
            + '<br><small>Pe hartă rămâne cel mai bun rezultat al tău.</small>'
            + nextStarHint,
          showNext: Boolean(nextLevelInPath(stats.level)),
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

  // Continuă runda cu o viață (după ce jucătorul a plătit-o din puncte).
  const reviveWithLife = useCallback(() => {
    setStats(prev => ({ ...prev, lives: 1, combo: 0 }));
    setModal(null);
    if (stats.q < QUESTIONS_PER_LEVEL) nextQuestion();
  }, [stats.q, nextQuestion]);

  const selectLevel = useCallback((level) => startLevel(level), [startLevel]);
  const restartLevel = useCallback(() => startLevel(stats.level), [startLevel, stats.level]);
  const goToNextLevel = useCallback(() => {
    const next = nextLevelInPath(stats.level);
    if (next) startLevel(next);
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
    reviveWithLife,
    handleAnswer,
    toggleHint,
    goToNextQuestionOrFinish,
  };
}
