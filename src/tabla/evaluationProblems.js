// „Evaluare” (Recapitulare): exerciții după pagina de recapitulare din manual.
// Problemele mai lungi se rezolvă pe pași: fiecare pas are întrebarea, răspunsul
// și variantele lui ({ text, steps: [{ question, answer, choices }], explanation }).
import { makeAnswers } from './data';

// eval4 (Exersez și rezolv) stă înaintea testului final.
export const EVAL_LEVELS = ['eval1', 'eval2', 'eval4', 'eval3'];

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

// ---------- 3. Exersez și rezolv (a doua pagină de recapitulare) ----------
const MORE = [
  // Completează produsele cu factorul care lipsește (doi sau trei factori).
  () => {
    const [text, answer, explanation] = pick([
      ...[[8, 7], [5, 7], [3, 6], [9, 4], [9, 8], [4, 6]].map(([a, x]) => [`${a} × □ = ${a * x}`, x, `${a} × ${x} = ${a * x}.`]),
      ['2 × 4 × □ = 40', 5, '2 × 4 = 8, iar 8 × 5 = 40.'],
      ['□ × 3 × 3 = 81', 9, '3 × 3 = 9, iar 9 × 9 = 81.'],
      ['4 × 2 × □ = 24', 3, '4 × 2 = 8, iar 8 × 3 = 24.'],
      ['3 × 2 × □ = 30', 5, '3 × 2 = 6, iar 6 × 5 = 30.'],
    ]);
    return problem(`Completează cu factorul care lipsește: ${text}`, answer, explanation, [answer + 1, answer - 1, answer * 2]);
  },
  // Scrie numerele ca produse de doi factori.
  () => {
    const [n, a] = pick([[42, 6], [54, 6], [49, 7], [27, 3], [80, 8], [45, 5], [7, 7], [36, 4], [63, 9]]);
    return problem(`Scrie numărul ${n} ca produs de doi factori: ${n} = ${a} × □`, n / a,
      `${a} × ${n / a} = ${n}.`, [n / a + 1, n / a - 1, n - a]);
  },
  // Află suma dintre dublul și triplul numărului.
  () => {
    const n = pick([8, 4, 5, 7, 3, 10]);
    return stepped(`Află suma dintre dublul și triplul numărului ${n}.`, [
      [`Cât este dublul lui ${n}?`, 2 * n, [n + 2, 3 * n, n]],
      [`Cât este triplul lui ${n}?`, 3 * n, [n + 3, 2 * n, 4 * n]],
      [`Adună-le: ${2 * n} + ${3 * n} = ?`, 5 * n, [6 * n, 5 * n + 1, 3 * n]],
    ], `Dublul: 2 × ${n} = ${2 * n}. Triplul: 3 × ${n} = ${3 * n}. Suma: ${2 * n} + ${3 * n} = ${5 * n}.`);
  },
  // Mărește de 5 ori diferența numerelor 62 și 58.
  () => {
    const b = randInt(30, 80); const d = randInt(2, 9); const a = b + d; const k = pick([3, 4, 5]);
    return stepped(`Mărește de ${k} ori diferența numerelor ${a} și ${b}.`, [
      [`Cât este diferența ${a} - ${b}?`, d, [a + b, d + 1, d - 1]],
      [`Mărește de ${k} ori: ${d} × ${k} = ?`, d * k, [d + k, d * k + k, d * (k + 1)]],
    ], `Diferența: ${a} - ${b} = ${d}. De ${k} ori mai mare: ${d} × ${k} = ${d * k}.`);
  },
  // Cu cât este mai mare produsul numerelor 9 și 9 decât suma lor?
  () => {
    const a = randInt(5, 9); const b = randInt(5, 9);
    return stepped(`Cu cât este mai mare produsul numerelor ${a} și ${b} decât suma lor?`, [
      [`Cât este produsul ${a} × ${b}?`, a * b, [a + b, a * b + a, a * b - b]],
      [`Cât este suma ${a} + ${b}?`, a + b, [a * b, a + b + 1, a + b - 1]],
      [`Cu cât este mai mare ${a * b} decât ${a + b}?`, a * b - (a + b), [a * b + a + b, a * b - (a + b) + 1, a * b]],
    ], `Produsul: ${a * b}. Suma: ${a + b}. Diferența: ${a * b} - ${a + b} = ${a * b - (a + b)}.`);
  },
  // Suma a două numere este 90. Primul este produsul numerelor 4 și 7.
  () => {
    const a = randInt(3, 9); const b = randInt(4, 9);
    const first = a * b;
    // Suma e un număr „rotund” mai mare decât primul termen, ca al doilea să fie pozitiv.
    const sum = pick([90, 80, 100, 70].filter(v => v > first + 5));
    return stepped(`Suma a două numere este ${sum}. Primul termen este egal cu produsul numerelor ${a} și ${b}. Care este al doilea termen?`, [
      [`Cât este primul termen (${a} × ${b})?`, first, [a + b, first + a, first - b]],
      [`Cât este al doilea termen? ${sum} - ${first} = ?`, sum - first, [sum + first, sum - first + 10, first]],
    ], `Primul termen: ${a} × ${b} = ${first}. Al doilea: ${sum} - ${first} = ${sum - first}.`);
  },
  // Într-o cutie sunt 4 roboți, unul costă 10 lei; o cutie, apoi două cutii.
  () => {
    const per = randInt(3, 5); const price = pick([5, 10, 4, 6]);
    const box = per * price;
    return stepped(`Într-o cutie sunt ${per} roboți. Dacă prețul unui robot este de ${price} lei, cât costă roboții din două cutii?`, [
      [`Cât costă roboții dintr-o cutie?`, box, [per + price, box + price, box - price]],
      [`Cât costă roboții din două cutii?`, 2 * box, [box + 2, box, 3 * box]],
    ], `O cutie: ${per} × ${price} = ${box} lei. Două cutii: 2 × ${box} = ${2 * box} lei.`);
  },
  // Racheta: 6 becuri; roboțelul de 3 ori mai multe. Câte în total?
  () => {
    const bulbs = randInt(4, 8); const k = pick([2, 3]);
    return stepped(`Pentru racheta de jucărie, Edi are nevoie de ${bulbs} becuri, iar pentru roboțel de ${k} ori mai multe. `
      + 'De câte becuri are nevoie băiețelul în total?', [
      [`De câte becuri e nevoie pentru roboțel?`, bulbs * k, [bulbs + k, bulbs * k + bulbs, bulbs]],
      [`Câte becuri în total? ${bulbs} + ${bulbs * k} = ?`, bulbs + bulbs * k, [bulbs * k, bulbs + k, bulbs * (k + 2)]],
    ], `Roboțel: ${bulbs} × ${k} = ${bulbs * k}. În total: ${bulbs} + ${bulbs * k} = ${bulbs + bulbs * k} becuri.`);
  },
  // Concursul de alergare: 6 puncte pentru un steag albastru, 8 pentru unul roșu.
  () => {
    const blue = 6; const red = 8;
    let ca; let cr; let ba; let br; let c; let b;
    do {
      ca = randInt(3, 9); cr = randInt(3, 9); ba = randInt(3, 9); br = randInt(3, 9);
      c = ca * blue + cr * red; b = ba * blue + br * red;
    } while (c === b);
    const winner = c > b ? 'Casandra' : 'Bogdan';
    return stepped(`La un concurs de alergare, concurenții primesc ${blue} puncte dacă ocolesc un steag albastru și ${red} puncte dacă ocolesc unul roșu. `
      + `Casandra a ocolit ${ca} albastre și ${cr} roșii, iar Bogdan ${ba} albastre și ${br} roșii. Cine a obținut mai multe puncte și cu cât?`, [
      [`Câte puncte a obținut Casandra? (${ca} × ${blue} + ${cr} × ${red})`, c, [ca * blue, cr * red, c + 2]],
      [`Câte puncte a obținut Bogdan? (${ba} × ${blue} + ${br} × ${red})`, b, [ba * blue, br * red, b + 2]],
      [`Cu câte puncte mai mult a obținut ${winner}?`, Math.abs(c - b), [c + b, Math.abs(c - b) + 2, Math.max(c, b)]],
    ], `Casandra: ${ca} × ${blue} + ${cr} × ${red} = ${ca * blue} + ${cr * red} = ${c}. `
      + `Bogdan: ${ba} × ${blue} + ${br} × ${red} = ${ba * blue} + ${br * red} = ${b}. `
      + `${winner} a câștigat cu ${Math.max(c, b)} - ${Math.min(c, b)} = ${Math.abs(c - b)} puncte.`);
  },
];

// ---------- 4. Test final: amestec din toată recapitularea ----------
const FINAL = [...CALC, ...STEPS, ...MORE];

const BY_LEVEL = { eval1: CALC, eval2: STEPS, eval4: MORE, eval3: FINAL };

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
