import { useCallback, useEffect, useRef, useState } from 'react';
import { FRUITS, LEVELS, PROBLEME_LEVEL, AVANSATE_LEVEL, makeAnswers, rangeForLevel } from './data';
import { buildWordProblem } from './multiplicationProblems';
import { buildAdvancedProblem } from './advancedProblems';
import { starsForCorrect, isLogicLevel, isFiveLevel, nextLevelInPath } from './mapProgress';
import { buildFiveProblem } from './fiveProblems';
import { buildLessonProblem, lessonFactorOf } from './lessonProblems';
import { buildLogicProblem } from './logicProblems';
import { buildSmartProblem, isSmartLevel, GRADED_SMART_LEVELS } from './smartProblems';
import { buildReviewProblem, isReviewLevel } from './reviewProblems';
import {
  buildNationalItem, isNationalLevel, questionCount, nationalMaxPoints, nationalYear, nationalTheme,
} from './nationalTest';
import { buildEvalProblem, isEvalLevel, gradeFor } from './evaluationProblems';
import { buildDivisionProblem, isDivisionLevel } from './divisionProblems';

export const START_LIVES = 3;
export const MAX_LIVES = 5;
// La fiecare atâtea răspunsuri corecte la rând, jucătorul primește o viață.
export const COMBO_FOR_LIFE = 5;
// Cât costă (din punctele totale) o viață când runda s-a terminat din lipsă de vieți.
export const REVIVE_COST = 30;
const QUESTION_TIME = 30;

export function generateQuestion(level, index = 0) {
  const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];

  // Evaluarea Națională: itemii testului, în ordine.
  if (isNationalLevel(level)) {
    const q = buildNationalItem(level, index);
    const base = {
      a: null, b: null, isWordProblem: true, isMultOp: false,
      problemText: q.text, explanation: q.explanation, fruit, badge: q.badge,
      picture: q.picture || null, visual: q.visual || null, examPoints: q.points, examIndex: index,
    };
    if (q.steps) {
      return { ...base, steps: q.steps, stepIndex: 0, correct: q.steps[0].answer, answers: q.steps[0].choices };
    }
    return { ...base, correct: q.answer, answers: q.choices };
  }

  // Insula Isteților: înmulțiri și probleme de aceeași dificultate.
  if (isSmartLevel(level)) {
    const q = buildSmartProblem(level);
    if (q.kind === 'mult') {
      return {
        a: q.a, b: q.b, isWordProblem: false, isMultOp: true, problemText: null, explanation: null,
        correct: q.a * q.b, answers: makeAnswers(q.a * q.b), fruit, badge: q.badge,
      };
    }
    // Problemele lungi (din recapitulare) se rezolvă pe pași.
    if (q.steps) {
      return {
        a: null, b: null, isWordProblem: true, isMultOp: false,
        problemText: q.text, explanation: q.explanation || null, fruit, badge: q.badge,
        steps: q.steps, stepIndex: 0, correct: q.steps[0].answer, answers: q.steps[0].choices,
      };
    }
    // Problemele cu înmulțire păstrează factorii, pentru explicația pe grupe.
    const [a, b] = q.factors || [null, null];
    return {
      a, b, isWordProblem: true, isMultOp: Boolean(q.factors),
      problemText: q.text, explanation: q.explanation || null,
      correct: q.answer, answers: q.choices, fruit, badge: q.badge,
    };
  }

  if (isEvalLevel(level) || isDivisionLevel(level) || isReviewLevel(level)) {
    const q = isEvalLevel(level) ? buildEvalProblem(level)
      : isReviewLevel(level) ? buildReviewProblem() : buildDivisionProblem(level);
    const base = {
      a: null, b: null, isWordProblem: true, isMultOp: false,
      problemText: q.text, explanation: q.explanation || null, fruit, badge: q.badge || '📝 Evaluare',
      picture: q.picture || null,
    };
    // Problemă pe pași: întrebarea curentă e pasul `stepIndex`.
    if (q.steps) {
      return { ...base, steps: q.steps, stepIndex: 0, correct: q.steps[0].answer, answers: q.steps[0].choices };
    }
    return { ...base, correct: q.answer, answers: q.choices };
  }

  if (isFiveLevel(level) || lessonFactorOf(level)) {
    const q = isFiveLevel(level) ? buildFiveProblem(level) : buildLessonProblem(level);
    if (q.kind === 'mult') {
      return {
        a: q.a, b: q.b, isWordProblem: false, isMultOp: true, problemText: null, explanation: null,
        correct: q.a * q.b, answers: makeAnswers(q.a * q.b), fruit, badge: q.badge,
      };
    }
    return {
      a: null, b: null, isWordProblem: true, isMultOp: false,
      problemText: q.text, explanation: q.explanation || null,
      correct: q.answer, answers: q.choices, fruit, badge: q.badge,
    };
  }

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

// Ce face o întrebare „aceeași”: aceeași socoteală, chiar dacă e scrisă altfel.
// 3 × 4 și 4 × 3 sunt aceeași întrebare; la fel „8 : 2”, „jumătatea lui 8” și
// „de 2 ori mai mic decât 8” (același rezultat, pornind de la același număr).
export function questionKey(q) {
  if (!q.problemText) return [q.a, q.b].sort((x, y) => x - y).join('×');
  const answer = q.steps ? q.steps[q.steps.length - 1].answer : q.correct;
  const numbers = (q.problemText.match(/\d+/g) || []).map(Number);
  return numbers.length ? `${answer}|${Math.max(...numbers)}` : q.problemText;
}

const MAX_TRIES = 120;

// O întrebare nouă care nu a mai apărut în `used` (cheile din runda curentă).
// Dacă nivelul are prea puține întrebări diferite, după MAX_TRIES acceptăm o repetare.
export function freshQuestion(level, used, index = 0) {
  // Testul are itemii lui, mereu în aceeași ordine.
  if (isNationalLevel(level)) return generateQuestion(level, index);
  let q = generateQuestion(level);
  for (let i = 0; i < MAX_TRIES && used.has(questionKey(q)); i += 1) q = generateQuestion(level);
  used.add(questionKey(q));
  return q;
}

function createStats(level) {
  // roundId deosebește rundele, ca punctele unei runde să nu fie salvate de două ori.
  return {
    level, points: 0, lives: START_LIVES, combo: 0, bestCombo: 0, correct: 0, wrong: 0, q: 0, examPoints: 0,
    // La Evaluarea Națională: itemii încă nerezolvați; cei săriți trec la coadă.
    pending: isNationalLevel(level) ? Array.from({ length: questionCount(level) }, (_, i) => i) : [],
    roundId: Date.now(),
  };
}

export function useTablaGame(initialLevel = 1, paused = false) {
  const [stats, setStats] = useState(() => createStats(initialLevel));
  // Întrebările deja date în runda curentă, ca să nu se repete.
  const usedRef = useRef(null);
  if (usedRef.current === null) usedRef.current = new Set();
  const [current, setCurrent] = useState(() => freshQuestion(initialLevel, usedRef.current));
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
    usedRef.current = new Set();
    setCurrent(freshQuestion(level, usedRef.current));
    setTime(QUESTION_TIME);
    setAnswered(false);
    setSelected(null);
    setHintOpen(false);
    setFeedback({ text: 'Alege răspunsul corect! 😊', color: '' });
    setModal(null);
  }, []);

  const nextQuestion = useCallback(() => {
    const index = isNationalLevel(stats.level) ? (stats.pending[0] ?? 0) : stats.q;
    setCurrent(freshQuestion(stats.level, usedRef.current, index));
    setTime(QUESTION_TIME);
    setAnswered(false);
    setSelected(null);
    setHintOpen(false);
    setFeedback({ text: 'Alege răspunsul corect! 😊', color: '' });
  }, [stats.level, stats.q, stats.pending]);

  // Evaluarea Națională: deschide itemii în ordinea dată (primul e cel afișat acum).
  const showItems = useCallback((order) => {
    setStats(prev => ({ ...prev, pending: order }));
    setCurrent(generateQuestion(stats.level, order[0]));
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
    const isCorrect = value === current.correct;

    // Problemă pe pași: un pas corect (care nu e ultimul) duce la pasul următor,
    // fără puncte; punctele se dau doar când toată problema e rezolvată.
    if (current.steps && isCorrect && current.stepIndex < current.steps.length - 1) {
      const next = current.stepIndex + 1;
      setCurrent(prev => ({
        ...prev,
        stepIndex: next,
        correct: prev.steps[next].answer,
        answers: prev.steps[next].choices,
      }));
      setSelected(null);
      setTime(QUESTION_TIME);
      setFeedback({ text: `✅ Pasul ${next} e corect! Acum pasul ${next + 1}.`, color: '#159632' });
      return;
    }

    setAnswered(true);
    setSelected(value);

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
          examPoints: prev.examPoints + (current.examPoints || 0),
          pending: prev.pending.filter(i => i !== current.examIndex),
        };
      }
      return {
        ...prev,
        wrong: prev.wrong + 1,
        // La Evaluarea Națională nu se pierd vieți: testul se dă până la capăt.
        lives: isNationalLevel(prev.level) ? prev.lives : prev.lives - 1,
        combo: 0,
        q: prev.q + 1,
        pending: prev.pending.filter(i => i !== current.examIndex),
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
      setFeedback({
        text: current.steps
          ? `💡 La pasul ${current.stepIndex + 1} răspunsul era ${current.correct}. Deschide rezolvarea!`
          : `💡 Răspunsul era ${current.correct}. Mai încearcă!`,
        color: '#dc263e',
      });
    }
  }, [answered, current, stats.combo, stats.lives, showToast]);

  useEffect(() => {
    if (answered || paused || isNationalLevel(stats.level)) return;
    if (time <= 0) {
      handleAnswer(null);
      return;
    }
    const id = setTimeout(() => setTime(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [time, answered, paused, handleAnswer, stats.level]);

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
    const total = questionCount(stats.level);
    if (stats.q >= total && isNationalLevel(stats.level)) {
      const id = setTimeout(() => {
        const max = nationalMaxPoints(stats.level);
        const pct = stats.examPoints / max;
        setModal({
          title: pct >= 0.9 ? '🏆 Excelent!' : pct >= 0.7 ? '🌟 Foarte bine!' : pct >= 0.5 ? '👏 Bravo!' : '💪 Mai exersează!',
          text: `Ai terminat <b>Evaluarea Națională ${nationalYear(stats.level)} — „${nationalTheme(stats.level)}”</b>: <b>${stats.correct}/${total}</b> itemi rezolvați corect.`
            + `<br><br><span class="modal-grade">📝 Punctaj: <b>${stats.examPoints} din ${max} de puncte</b></span>`
            + `<br><br>Ai adunat și <b>${stats.points}</b> puncte în joc.`
            + '<br><small>Apasă „Cum se rezolvă?” la fiecare item, ca să vezi rezolvarea.</small>',
          showNext: false,
        });
      }, 500);
      return () => clearTimeout(id);
    }
    if (stats.q >= total) {
      const id = setTimeout(() => {
        const pct = Math.round(stats.correct / total * 100);
        // Aceleași stele ca pe harta nivelurilor (vezi mapProgress.js).
        const stars = starsForCorrect(stats.correct);
        // La evaluare arătăm și calificativul, ca la școală.
        const grade = isEvalLevel(stats.level) || GRADED_SMART_LEVELS.includes(stats.level) ? gradeFor(stats.correct) : null;
        const gradeLine = grade
          ? `<br><br><span class="modal-grade">${grade.emoji} Calificativ: <b>${grade.label} (${grade.short})</b></span>`
          : '';
        const nextStarHint = stars < 3
          ? `<br><small>Pentru ${stars + 1} stele ai nevoie de cel puțin ${stars === 1 ? 6 : 9} răspunsuri corecte.</small>`
          : '';
        setModal({
          title: pct >= 80 ? '🌟 Extraordinar!' : pct >= 50 ? '👏 Bravo!' : '💪 Continuă să exersezi!',
          text: `Ai terminat <b>${LEVELS[stats.level].label.replace(/^\d+\.\s*/, '')}</b> cu <b>${stats.correct}/${total}</b> răspunsuri corecte și <b>${stats.points}</b> puncte.`
            + `<br><br><span class="modal-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</span>`
            + `<br>Ai câștigat <b>${stars} ${stars === 1 ? 'stea' : 'stele'}</b> la acest nivel, pe harta aventurii!`
            + '<br><small>Pe hartă rămâne cel mai bun rezultat al tău.</small>'
            + nextStarHint
            + gradeLine,
          showNext: Boolean(nextLevelInPath(stats.level)),
        });
      }, 500);
      return () => clearTimeout(id);
    }
  }, [answered, stats.lives, stats.q, stats.correct, stats.points, stats.level, stats.examPoints]);

  const goToNextQuestionOrFinish = useCallback(() => {
    if (!answered) {
      showToast('Alege mai întâi un răspuns! 😊');
      return;
    }
    if (stats.q >= questionCount(stats.level)) return;
    nextQuestion();
  }, [answered, stats.q, stats.level, nextQuestion, showToast]);

  // Evaluarea Națională: sari peste itemul curent; revine la final.
  const skipItem = useCallback(() => {
    if (!isNationalLevel(stats.level)) return;
    if (answered) {
      if (stats.pending.length) nextQuestion();
      return;
    }
    const rest = stats.pending.filter(i => i !== current.examIndex);
    if (rest.length === 0) {
      showToast('E ultimul item rămas — încearcă-l! 😊');
      return;
    }
    showItems([...rest, current.examIndex]);
    showToast(`⏭ Revii la itemul ${current.examIndex + 1} mai târziu`);
  }, [answered, current, stats.level, stats.pending, nextQuestion, showItems, showToast]);

  // Evaluarea Națională: deschide direct un item nerezolvat.
  const goToItem = useCallback((index) => {
    if (!isNationalLevel(stats.level) || (!answered && index === current.examIndex)) return;
    showItems([index, ...stats.pending.filter(i => i !== index)]);
  }, [answered, current, stats.level, stats.pending, showItems]);

  // Continuă runda cu o viață (după ce jucătorul a plătit-o din puncte).
  const reviveWithLife = useCallback(() => {
    setStats(prev => ({ ...prev, lives: 1, combo: 0 }));
    setModal(null);
    if (stats.q < questionCount(stats.level)) nextQuestion();
  }, [stats.q, stats.level, nextQuestion]);

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
    questionsPerLevel: questionCount(stats.level),
    skipItem,
    goToItem,
    isExam: isNationalLevel(stats.level),
    selectLevel,
    restartLevel,
    goToNextLevel,
    reviveWithLife,
    handleAnswer,
    toggleHint,
    goToNextQuestionOrFinish,
  };
}
