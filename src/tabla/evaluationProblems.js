// „Evaluare” (Recapitulare): exerciții după pagina de recapitulare din manual.
// Problemele mai lungi se rezolvă pe pași: fiecare pas are întrebarea, răspunsul
// și variantele lui ({ text, steps: [{ question, answer, choices }], explanation }).
import { makeAnswers } from './data';

export const EVAL_LEVELS = ['eval1', 'eval2', 'eval3'];

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildChoices(correct, typicalMistakes) {
  const set = new Set([correct]);
  for (const v of typicalMistakes) {
    if (set.size >= 4) break;
    if (Number.isInteger(v) && v >= 0 && v !== correct) set.add(v);
  }
  for (const v of makeAnswers(correct)) {
    if (set.size >= 4) break;
    set.add(v);
  }
  return shuffle([...set]);
}

function problem(text, answer, explanation, mistakes) {
  return { text, answer, explanation, choices: buildChoices(answer, mistakes) };
}

// Problemă rezolvată pe pași; `steps` = [[întrebare, răspuns, greșeli tipice], …].
function stepped(text, steps, explanation) {
  return {
    text,
    explanation,
    steps: steps.map(([question, answer, mistakes]) => ({ question, answer, choices: buildChoices(answer, mistakes) })),
  };
}

// ---------- 1. Calcul: alege rezultatul, factorul lipsă, tabelul ----------
const CALC = [
  // Alege rezultatul corect.
  () => {
    const a = pick([2, 3, 4]); const b = randInt(3, 10);
    return problem(`Alege rezultatul corect: ${a} × ${b} = ?`, a * b,
      `${a} × ${b} = ${a * b}.`, [a * (b - 1), a + b, a * (b + 1)]);
  },
  // Completează înmulțirile cu factorul care lipsește.
  () => {
    const a = pick([2, 3, 4, 6, 9]); const x = randInt(2, 10);
    const eq = pick([`${a} × □ = ${a * x}`, `□ × ${a} = ${a * x}`]);
    return problem(`Completează cu factorul care lipsește: ${eq}`, x,
      `Căutăm numărul care înmulțit cu ${a} dă ${a * x}: ${a} × ${x} = ${a * x}.`, [x + 1, x - 1, a * x - a]);
  },
  // Tabelul: a × 2, a × 3, a × 4.
  () => {
    const a = pick([9, 4, 8, 7, 5, 6]); const k = pick([2, 3, 4]);
    return problem(`Dacă a = ${a}, cât este a × ${k}?`, a * k,
      `Înlocuim a cu ${a}: ${a} × ${k} = ${a * k}.`, [a + k, a * k + a, a * k - k]);
  },
  // Dublul / triplul unui număr.
  () => {
    const n = randInt(3, 10); const [word, k] = pick([['dublul', 2], ['triplul', 3]]);
    return problem(`Află ${word} numărului ${n}.`, k * n,
      `${word[0].toUpperCase() + word.slice(1)} înseamnă de ${k} ori mai mare: ${k} × ${n} = ${k * n}.`, [n + k, (k + 1) * n, k * n + k]);
  },
];

// ---------- 2. Probleme în pași ----------
const STEPS = [
  // La dublul numărului 5 adaugă triplul numărului 10.
  () => {
    const a = randInt(3, 9); const b = randInt(4, 10);
    return stepped(`La dublul numărului ${a} adaugă triplul numărului ${b}.`, [
      [`Cât este dublul lui ${a}?`, 2 * a, [a + 2, 3 * a, a]],
      [`Cât este triplul lui ${b}?`, 3 * b, [b + 3, 2 * b, b]],
      [`Adaugă-le: ${2 * a} + ${3 * b} = ?`, 2 * a + 3 * b, [2 * a + b, a + 3 * b, 3 * b]],
    ], `Dublul lui ${a}: 2 × ${a} = ${2 * a}. Triplul lui ${b}: 3 × ${b} = ${3 * b}. Suma: ${2 * a} + ${3 * b} = ${2 * a + 3 * b}.`);
  },
  // Află produsul numerelor 4 și 6, apoi numărul cu 46 mai mare decât acesta.
  () => {
    const a = randInt(3, 6); const b = randInt(4, 9); const more = randInt(15, 50);
    const p = a * b;
    return stepped(`Află produsul numerelor ${a} și ${b}, apoi calculează numărul cu ${more} mai mare decât acesta.`, [
      [`Cât este produsul numerelor ${a} și ${b}?`, p, [a + b, p + a, p - b]],
      [`Ce număr este cu ${more} mai mare decât ${p}?`, p + more, [p * 2, p + more - 10, p - more >= 0 ? p - more : p + more + 10]],
    ], `Produsul: ${a} × ${b} = ${p}. Cu ${more} mai mare: ${p} + ${more} = ${p + more}.`);
  },
  // Calculează produsul numerelor 3 și 7, apoi află cu cât e mai mare decât triplul lui 3.
  () => {
    const b = randInt(5, 9); const t = randInt(2, 4);
    const p = 3 * b; const triple = 3 * t;
    return stepped(`Calculează produsul numerelor 3 și ${b}, apoi află cu cât este mai mare decât triplul lui ${t}.`, [
      [`Cât este produsul numerelor 3 și ${b}?`, p, [3 + b, p + 3, p - 3]],
      [`Cât este triplul lui ${t}?`, triple, [t + 3, 2 * t, triple + 3]],
      [`Cu cât este mai mare ${p} decât ${triple}?`, p - triple, [p + triple, p - triple + 1, triple]],
    ], `Produsul: 3 × ${b} = ${p}. Triplul lui ${t}: 3 × ${t} = ${triple}. Diferența: ${p} - ${triple} = ${p - triple}.`);
  },
  // Moș Martin nu a mai ieșit din bârlog de 3 săptămâni.
  () => {
    const w = randInt(2, 6);
    return stepped(`Moș Martin nu a mai ieșit din bârlog de ${w} săptămâni. De câte zile nu a mai ieșit el?`, [
      ['Câte zile are o săptămână?', 7, [5, 6, 10]],
      [`Câte zile sunt în ${w} săptămâni?`, 7 * w, [7 + w, 7 * w + 7, 7 * w - 7]],
    ], `O săptămână are 7 zile. ${w} săptămâni: ${w} × 7 = ${7 * w} zile.`);
  },
  // Un ceai costă 2 lei, un suc de 3 ori mai scump; două ceaiuri și două sucuri.
  () => {
    const tea = randInt(2, 5); const k = pick([2, 3]); const juice = tea * k; const n = 2;
    return stepped(`Dacă un ceai costă ${tea} lei, iar un suc de fructe e de ${k} ori mai scump, `
      + `află cât costă ${n} ceaiuri și ${n} sucuri de fructe.`, [
      [`Cât costă un suc de fructe?`, juice, [tea + k, juice + tea, tea]],
      [`Cât costă un ceai și un suc împreună?`, tea + juice, [juice, tea * juice, tea + juice + 2]],
      [`Cât costă ${n} ceaiuri și ${n} sucuri?`, n * (tea + juice), [tea + juice + n, n * juice, n * tea]],
    ], `Sucul: ${tea} × ${k} = ${juice} lei. Un ceai + un suc: ${tea} + ${juice} = ${tea + juice} lei. `
      + `De ${n} ori: ${n} × ${tea + juice} = ${n * (tea + juice)} lei.`);
  },
  // Cutii cu creioane: câte în total, apoi câte rămân după ce dăm.
  () => {
    const boxes = randInt(3, 6); const per = pick([2, 3, 4]); const given = randInt(2, boxes * per - 2);
    const total = boxes * per;
    return stepped(`Ana are ${boxes} cutii cu câte ${per} creioane. Dă ${given} creioane colegilor. Câte creioane îi rămân?`, [
      ['Câte creioane are Ana la început?', total, [boxes + per, total + per, total - per]],
      [`Câte creioane îi rămân după ce dă ${given}?`, total - given, [total + given, total, total - given + 1]],
    ], `La început: ${boxes} × ${per} = ${total} creioane. Rămân: ${total} - ${given} = ${total - given}.`);
  },
];

// ---------- 3. Test final: amestec din toată recapitularea ----------
const FINAL = [...CALC, ...STEPS, ...STEPS];

const BY_LEVEL = { eval1: CALC, eval2: STEPS, eval3: FINAL };

export function isEvalLevel(level) {
  return EVAL_LEVELS.includes(level);
}

export function buildEvalProblem(level) {
  return pick(BY_LEVEL[level])();
}

// Calificativul din școală, după răspunsurile corecte din 10.
export function gradeFor(correct) {
  if (correct >= 9) return { label: 'Foarte bine', short: 'FB', emoji: '🏆' };
  if (correct >= 7) return { label: 'Bine', short: 'B', emoji: '👍' };
  if (correct >= 5) return { label: 'Suficient', short: 'S', emoji: '🙂' };
  return { label: 'Insuficient', short: 'I', emoji: '💪' };
}
