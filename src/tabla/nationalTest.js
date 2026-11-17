import { tr } from './i18n';
import { buildFractionRound } from './fractionProblems';
// Exersările cu itemi în ordine, fără cronometru, din Insula Învățării: termenii necunoscuți,
// calculele în coloană și fracțiile. (Testele de Evaluare Națională sunt acum un proiect separat.)

const ROUND_LENGTH = 10;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Un pas al unui item rezolvat pe pași, cu variantele amestecate.
const step = (question, answer, choices) => ({ question, answer, choices: shuffle(choices) });

// ================= Exercițiul 46: „Află termenii necunoscuți” =================
// Itemi simpli: [ecuația, necunoscuta, răspunsul, greșeli tipice, regula].
// Itemi cu paranteză sau cu trei termeni: întâi calculăm ce se poate, apoi aflăm necunoscuta.
const SUM_RULE = 'Un termen necunoscut al adunării se află scăzând din sumă termenul cunoscut.';
const SUB_START_RULE = 'Descăzutul se află adunând diferența cu scăzătorul.';
const SUB_MINUS_RULE = 'Scăzătorul se află scăzând diferența din descăzut.';

const simple = (eq, x, answer, mistakes, rule, check) => ({
  points: 1,
  get text() { return tr('Află termenul necunoscut: {eq}. Cât este {x}?', { eq, x }); },
  answer,
  choices: shuffle([answer, ...mistakes]),
  get explanation() { return `${tr(rule)} ${tr(check)}`; },
});

const twoStep = (eq, first, firstAnswer, firstMistakes, second, answer, mistakes, rule, check) => ({
  points: 1,
  get text() { return tr('Află termenul necunoscut: {eq}', { eq }); },
  steps: [
    step(first, firstAnswer, [firstAnswer, ...firstMistakes]),
    step(second, answer, [answer, ...mistakes]),
  ],
  get explanation() { return `${tr(rule)} ${tr(check)}`; },
});

const ITEMS_TERMS = [
  simple('a + 34 = 62', 'a', 28, [96, 38, 18], SUM_RULE, 'a = 62 − 34 = 28. Verificare: 28 + 34 = 62.'),
  simple('b − 68 = 19', 'b', 87, [49, 77, 97], SUB_START_RULE, 'b = 19 + 68 = 87. Verificare: 87 − 68 = 19.'),
  simple('28 + c = 91', 'c', 63, [119, 73, 53], SUM_RULE, 'c = 91 − 28 = 63. Verificare: 28 + 63 = 91.'),
  simple('45 − d = 26', 'd', 19, [71, 29, 21], SUB_MINUS_RULE, 'd = 45 − 26 = 19. Verificare: 45 − 19 = 26.'),
  twoStep('x − (23 + 48) = 18', 'Calculează paranteza: 23 + 48 = ?', 71, [61, 25, 81],
    'Acum x − 71 = 18. x = ?', 89, [53, 79, 99], SUB_START_RULE, 'x = 18 + 71 = 89. Verificare: 89 − 71 = 18.'),
  twoStep('y − (78 − 64) = 47', 'Calculează paranteza: 78 − 64 = ?', 14, [24, 142, 16],
    'Acum y − 14 = 47. y = ?', 61, [33, 51, 71], SUB_START_RULE, 'y = 47 + 14 = 61. Verificare: 61 − 14 = 47.'),
  twoStep('m + (43 − 27) = 52', 'Calculează paranteza: 43 − 27 = ?', 16, [26, 70, 14],
    'Acum m + 16 = 52. m = ?', 36, [68, 46, 26], SUM_RULE, 'm = 52 − 16 = 36. Verificare: 36 + 16 = 52.'),
  twoStep('n − (56 − 25) = 59', 'Calculează paranteza: 56 − 25 = ?', 31, [81, 41, 21],
    'Acum n − 31 = 59. n = ?', 90, [28, 80, 100], SUB_START_RULE, 'n = 59 + 31 = 90. Verificare: 90 − 31 = 59.'),
  twoStep('63 − 49 + f = 71', 'Calculează întâi 63 − 49 = ?', 14, [24, 112, 16],
    'Acum 14 + f = 71. f = ?', 57, [85, 67, 47], SUM_RULE, 'f = 71 − 14 = 57. Verificare: 63 − 49 + 57 = 14 + 57 = 71.'),
  twoStep('91 − 36 − g = 27', 'Calculează întâi 91 − 36 = ?', 55, [65, 127, 45],
    'Acum 55 − g = 27. g = ?', 28, [82, 38, 18], SUB_MINUS_RULE, 'g = 55 − 27 = 28. Verificare: 91 − 36 − 28 = 55 − 28 = 27.'),
  twoStep('t − (28 − 9) = 16', 'Calculează paranteza: 28 − 9 = ?', 19, [37, 29, 21],
    'Acum t − 19 = 16. t = ?', 35, [3, 25, 45], SUB_START_RULE, 't = 16 + 19 = 35. Verificare: 35 − 19 = 16.'),
  simple('r − 37 = 26', 'r', 63, [11, 53, 73], SUB_START_RULE, 'r = 26 + 37 = 63. Verificare: 63 − 37 = 26.'),
];

// ================= Scăderi în coloană cu numere de 2 cifre =================
// Scăderea se scrie pe verticală, ca în caiet: unitățile sub unități, zecile sub zeci.
// Greșelile tipice: scazi cifra mică din cea mare fără să te împrumuți, sau uiți zecea împrumutată.
function columnItem(a, b, letter) {
  const answer = a - b;
  const [ta, ua, tb, ub] = [Math.floor(a / 10), a % 10, Math.floor(b / 10), b % 10];
  const borrow = ua < ub;
  const noBorrow = Math.abs(ta - tb) * 10 + Math.abs(ua - ub);
  const mistakes = [...new Set([noBorrow, answer + 10, answer - 10, answer + 1, answer - 1, answer + 2])]
    .filter(n => n > 0 && n !== answer && n < 100)
    .slice(0, 3);
  return {
    points: 1,
    get text() { return tr('Calculează în coloană: {a} − {b}', { a, b }); },
    visual: { type: 'column', a, b, op: '−', letter },
    answer,
    choices: shuffle([answer, ...mistakes]),
    get explanation() {
      const units = borrow
        ? tr('Unitățile: {ua} − {ub} nu se poate, așa că împrumutăm o zece: {ua10} − {ub} = {ru}.', { ua, ub, ua10: ua + 10, ru: ua + 10 - ub })
        : tr('Unitățile: {ua} − {ub} = {ru}.', { ua, ub, ru: ua - ub });
      const tens = borrow
        ? tr('Zecile: {ta} − 1 (zecea împrumutată) − {tb} = {rt}.', { ta, tb, rt: ta - 1 - tb })
        : tr('Zecile: {ta} − {tb} = {rt}.', { ta, tb, rt: ta - tb });
      return `${units} ${tens} ${tr('Rezultatul: {c}. Verificare: {c} + {b} = {a}.', { c: answer, a, b })}`;
    },
  };
}


// ================= Scăderi în coloană cu numere de 3 cifre („A. Calculează:”) =================
// Explicația merge pe coloane, de la unități spre sute, cu împrumutul de la coloana din stânga.
const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const PLACES = ['Unitățile', 'Zecile', 'Sutele'];
const FROM_PLACE = ['de la zeci', 'de la sute', 'de la mii'];

function columnSubItem(a, b) {
  const answer = a - b;
  return {
    points: 1,
    get text() { return tr('Calculează în coloană: {a} − {b}', { a, b }); },
    visual: { type: 'column', a, b, op: '−' },
    answer,
    choices: [answer],
    get explanation() {
      const steps = [];
      let borrowed = 0;
      for (let i = 0; i < String(a).length; i++) {
        const x = Math.floor(a / 10 ** i) % 10;
        const y = Math.floor(b / 10 ** i) % 10;
        const top = x - borrowed;
        const borrow = top < y;
        const vars = { place: PLACES[i], x, y, x1: top, x10: top + 10, r: (borrow ? top + 10 : top) - y, next: FROM_PLACE[i] };
        // Un 0 nu are ce da împrumut: se împrumută el însuși de la coloana din stânga (10 − 1 = 9).
        if (borrowed && x === 0) steps.push(tr('{place}: 0 nu poate da împrumut, așa că ne împrumutăm 1 {next}: 10 − 1 (dat împrumut) = 9; 9 − {y} = {r}.', vars));
        else if (borrowed && borrow) steps.push(tr('{place}: {x} − 1 (dat împrumut) = {x1}; {x1} − {y} nu se poate, așa că ne împrumutăm 1 {next}: {x10} − {y} = {r}.', vars));
        else if (borrowed) steps.push(tr('{place}: {x} − 1 (dat împrumut) − {y} = {r}.', vars));
        else if (borrow) steps.push(tr('{place}: {x} − {y} nu se poate, așa că ne împrumutăm 1 {next}: {x10} − {y} = {r}.', vars));
        else steps.push(tr('{place}: {x} − {y} = {r}.', vars));
        borrowed = borrow ? 1 : 0;
      }
      return `${steps.join(' ')} ${tr('Rezultatul: {c}. Verificare: {c} + {b} = {a}.', { c: answer, a, b })}`;
    },
  };
}

// La fiecare rundă: 10 scăderi noi, alese la întâmplare.
function randomSub3() {
  const a = randInt(200, 999);
  // Uneori scăzătorul are doar 2 cifre.
  const b = Math.random() < 0.25 ? randInt(11, 99) : randInt(100, a - 1);
  return [a, b];
}
function buildSub3Round() {
  const pairs = [];
  while (pairs.length < 10) {
    const [a, b] = randomSub3();
    if (!pairs.some(([x, y]) => x === a && y === b)) pairs.push([a, b]);
  }
  return pairs.map(([a, b]) => columnSubItem(a, b));
}
let ITEMS_SUB3 = buildSub3Round();

// ================= Adunări în coloană cu numere de 3 cifre („C. Efectuează:”) =================
// Pe coloane, de la unități spre sute: când suma unei coloane trece de 9, scriem unitățile ei
// și ținem minte 1 pentru coloana din stânga.
function columnAdd3Item(a, b) {
  const answer = a + b;
  return {
    points: 1,
    get text() { return tr('Calculează în coloană: {a} + {b}', { a, b }); },
    visual: { type: 'column', a, b, op: '+' },
    answer,
    choices: [answer],
    get explanation() {
      const steps = [];
      let carried = 0;
      for (let i = 0; i < String(answer).length && i < PLACES.length; i++) {
        const x = Math.floor(a / 10 ** i) % 10;
        const y = Math.floor(b / 10 ** i) % 10;
        const s = x + y + carried;
        const vars = { place: PLACES[i], x, y, s, u: s % 10 };
        if (carried && s >= 10) steps.push(tr('{place}: {x} + {y} + 1 (ținut minte) = {s}: scriem {u} și ținem minte 1.', vars));
        else if (carried) steps.push(tr('{place}: {x} + {y} + 1 (ținut minte) = {s}.', vars));
        else if (s >= 10) steps.push(tr('{place}: {x} + {y} = {s}: scriem {u} și ținem minte 1.', vars));
        else steps.push(tr('{place}: {x} + {y} = {s}.', vars));
        carried = s >= 10 ? 1 : 0;
      }
      return `${steps.join(' ')} ${tr('Rezultatul: {c}. Verificare: {c} − {b} = {a}.', { c: answer, a, b })}`;
    },
  };
}

// La fiecare rundă: 10 adunări noi, alese la întâmplare.
// Suma rămâne cel mult 999, ca rezultatul să aibă tot 3 cifre.
function randomAdd3() {
  const a = randInt(100, 899);
  const r = Math.random();
  // Uneori al doilea număr are 2 cifre sau doar una.
  const b = r < 0.15 ? randInt(2, 9) : r < 0.35 ? randInt(11, 99) : randInt(100, 999 - a);
  return a + b <= 999 ? [a, b] : [a, 999 - a];
}
function buildAdd3Round() {
  const pairs = [];
  while (pairs.length < 10) {
    const [a, b] = randomAdd3();
    if (b >= 1 && !pairs.some(([x, y]) => x === a && y === b)) pairs.push([a, b]);
  }
  return pairs.map(([a, b]) => columnAdd3Item(a, b));
}
let ITEMS_ADD3 = buildAdd3Round();

// Fracții: la fiecare rundă, alte desene și alte numere.
let ITEMS_FRACTIONS = buildFractionRound();

// ================= Adunări în coloană cu numere de 2 cifre =================
// Fiecare adunare are o literă. La final, rezultatele puse în ordine dau numele unui animal.
function columnSumItem(a, b, letter) {
  const answer = a + b;
  const [ta, ua, tb, ub] = [Math.floor(a / 10), a % 10, Math.floor(b / 10), b % 10];
  const carry = ua + ub >= 10;
  return {
    points: 1,
    get text() { return tr('Calculează în coloană: {a} + {b}', { a, b }); },
    visual: { type: 'column', a, b, op: '+', letter },
    answer,
    choices: [answer],
    get explanation() {
      const units = carry
        ? tr('Unitățile: {ua} + {ub} = {su}: scriem {u} și ținem minte o zece.', { ua, ub, su: ua + ub, u: (ua + ub) % 10 })
        : tr('Unitățile: {ua} + {ub} = {su}.', { ua, ub, su: ua + ub });
      const tens = carry
        ? tr('Zecile: {ta} + {tb} + 1 (zecea ținută minte) = {st}.', { ta, tb, st: ta + tb + 1 })
        : tr('Zecile: {ta} + {tb} = {st}.', { ta, tb, st: ta + tb });
      return `${units} ${tens} ${tr('Rezultatul: {c}. Verificare: {c} − {b} = {a}.', { c: answer, a, b })}`;
    },
  };
}

// Animalele ascunse în ghicitori: numele se scrie la fel în română și în engleză,
// ca literele să se potrivească în ambele limbi. Numerele se aleg la întâmplare la fiecare rundă.
const SUM_PUZZLES = [
  { word: 'PELICAN', clue: 'o pasăre cu ciocul lung și o pungă sub el' },
  { word: 'LEOPARD', clue: 'o felină mare, cu blana pătată' },
  { word: 'HAMSTER', clue: 'un rozător mic, animal de companie' },
  { word: 'JAGUAR', clue: 'o felină mare din pădurile Americii' },
  { word: 'IGUANA', clue: 'o șopârlă mare și verde' },
  { word: 'FLAMINGO', clue: 'o pasăre roz care stă într-un picior' },
  { word: 'CONDOR', clue: 'o pasăre uriașă din munții Anzi' },
  { word: 'ZEBRA', clue: 'un animal cu dungi albe și negre' },
  { word: 'KOALA', clue: 'un animal din Australia care mănâncă frunze de eucalipt' },
  { word: 'PANDA', clue: 'un urs alb-negru care mănâncă bambus' },
  { word: 'PUMA', clue: 'o felină sălbatică din munții Americii' },
  { word: 'COBRA', clue: 'un șarpe veninos care își umflă gâtul' },
];

// Ghicitoarea de la finalul rundei: rezultatele, ordonate crescător sau descrescător, dau numele animalului.
// entries: [a, b, literă]; value: rezultatul unei intrări.
function riddleItem(puzzle, entries, value, desc) {
  const order = [...entries].sort((x, y) => (desc ? value(y) - value(x) : value(x) - value(y)));
  const others = shuffle(SUM_PUZZLES.filter(p => p.word !== puzzle.word)).slice(0, 3).map(p => p.word);
  return {
    points: 1,
    get text() {
      return tr(desc
        ? 'Rezultatele tale: {list}. Ordonează-le descrescător și citește literele. Ce animal ai descoperit? Indiciu: {clue}.'
        : 'Rezultatele tale: {list}. Ordonează-le crescător și citește literele. Ce animal ai descoperit? Indiciu: {clue}.', {
        list: entries.map(e => `${e[2]} = ${value(e)}`).join(', '),
        clue: puzzle.clue,
      });
    },
    answer: puzzle.word,
    choices: shuffle([puzzle.word, ...others]),
    get explanation() {
      return tr(desc ? 'În ordine descrescătoare: {order}. Literele formează cuvântul {word}.'
        : 'În ordine crescătoare: {order}. Literele formează cuvântul {word}.', {
        order: order.map(e => `${value(e)} (${e[2]})`).join(desc ? ' > ' : ' < '),
        word: puzzle.word,
      });
    },
  };
}

// Rezultate diferite pentru literele cuvântului: crescător, a k-a literă primește al k-lea rezultat
// (descrescător, invers); apoi exercițiile se amestecă.
function lettersToResults(word, min, max, desc) {
  const results = new Set();
  while (results.size < word.length) results.add(randInt(min, max));
  const sorted = [...results].sort((x, y) => (desc ? y - x : x - y));
  return word.split('').map((letter, i) => [sorted[i], letter]);
}

// Două numere care adunate dau `sum`; de cele mai multe ori cu trecere peste zece.
function sumPair(sum) {
  const [t, u] = [Math.floor(sum / 10), sum % 10];
  for (let tries = 0; tries < 30; tries++) {
    const carry = u < 9 && Math.random() < 0.85;
    const ub = carry ? randInt(u + 1, 9) : randInt(0, u);
    const ua = carry ? u + 10 - ub : u - ub;
    const tens = carry ? t - 1 : t;
    const ta = randInt(0, tens);
    const [a, b] = [ta * 10 + ua, (tens - ta) * 10 + ub];
    if (a >= 2 && b >= 2) return Math.random() < 0.5 ? [a, b] : [b, a];
  }
  return [sum - 19, 19];
}

// O rundă: câte o adunare pentru fiecare literă a animalului, apoi ghicitoarea.
function buildSumRound(puzzle) {
  const entries = puzzle.pairs
    || shuffle(lettersToResults(puzzle.word, 25, 99, false).map(([sum, letter]) => [...sumPair(sum), letter]));
  return [
    ...entries.map(([a, b, letter]) => columnSumItem(a, b, letter)),
    riddleItem(puzzle, entries, ([a, b]) => a + b, false),
  ];
}

// ---------- Scăderi în coloană (2 cifre), tot cu ghicitoare ----------
// Animalul ghicitorii se alege la întâmplare; rezultatele, ordonate crescător sau descrescător, îi dau numele.
const randomPuzzle = (except) => {
  const choices = SUM_PUZZLES.filter(p => p.word !== except);
  return choices[Math.floor(Math.random() * choices.length)];
};

// Două numere de 2 cifre a căror diferență e `diff`; de cele mai multe ori cu împrumut.
function subPair(diff) {
  for (let tries = 0; tries < 40; tries++) {
    const b = randInt(11, 99 - diff);
    const a = diff + b;
    if (a % 10 < b % 10 || Math.random() < 0.15) return [a, b];
  }
  return [diff + 11, 11];
}

function buildSub2Round(puzzle, desc) {
  const entries = puzzle.pairs
    || shuffle(lettersToResults(puzzle.word, 5, 80, desc).map(([diff, letter]) => [...subPair(diff), letter]));
  return [
    ...entries.map(([a, b, letter]) => columnItem(a, b, letter)),
    riddleItem(puzzle, entries, ([a, b]) => a - b, desc),
  ];
}

let sub2Puzzle = randomPuzzle();
let ITEMS_COLUMN = buildSub2Round({ word: sub2Puzzle.word, clue: sub2Puzzle.clue }, Math.random() < 0.5);

let sumPuzzle = randomPuzzle();
let ITEMS_COLUMN_SUM = buildSumRound(sumPuzzle);

// La fiecare rundă nouă de „Adunări în coloană”: alt animal și alte adunări.
export function newNationalRound(level) {
  if (level === 'scaderi2') {
    // De fiecare dată alt animal, ordonat la întâmplare crescător sau descrescător.
    sub2Puzzle = randomPuzzle(sub2Puzzle.word);
    ITEMS_COLUMN = buildSub2Round({ word: sub2Puzzle.word, clue: sub2Puzzle.clue }, Math.random() < 0.5);
    return;
  }
  if (level === 'fractii') {
    ITEMS_FRACTIONS = buildFractionRound();
    return;
  }
  if (level === 'adunari3') {
    ITEMS_ADD3 = buildAdd3Round();
    return;
  }
  if (level === 'scaderi3') {
    ITEMS_SUB3 = buildSub3Round();
    return;
  }
  if (level !== 'adunari8') return;
  sumPuzzle = randomPuzzle(sumPuzzle.word);
  ITEMS_COLUMN_SUM = buildSumRound(sumPuzzle);
}

const TESTS = {
  // Exersări fără cronometru, cu itemi în ordine.
  termeni46: { practice: true, title: 'Află termenii necunoscuți', items: ITEMS_TERMS },
  scaderi2: { practice: true, title: 'Scăderi în coloană', get items() { return ITEMS_COLUMN; } },
  adunari8: { practice: true, title: 'Adunări în coloană', get items() { return ITEMS_COLUMN_SUM; } },
  scaderi3: { practice: true, title: 'Scăderi cu numere de 3 cifre', get items() { return ITEMS_SUB3; } },
  adunari3: { practice: true, title: 'Adunări cu numere de 3 cifre', get items() { return ITEMS_ADD3; } },
  fractii: { practice: true, title: 'Fracții', get items() { return ITEMS_FRACTIONS; } },
};

// Exercițiile fără cronometru, cu itemi în ordine (testele și exersările de pe prima pagină).
export const PRACTICE_LEVELS = ['termeni46'];
export const COLUMN_LEVELS = ['scaderi2'];
export const COLUMN_SUM_LEVELS = ['adunari8'];
export const COLUMN3_LEVELS = ['scaderi3'];
export const ADD3_LEVELS = ['adunari3'];
export const FRACTION_LEVELS = ['fractii'];

// Un nivel cu itemi ficși, fără cronometru, la care poți sări peste un item și reveni la el.
export function isNationalLevel(level) {
  return Boolean(TESTS[level]);
}

// Exersare (nu test de examen): fără punctaj din 100 la final.
export function isPracticeTest(level) {
  return Boolean(TESTS[level]?.practice);
}

export function practiceTitle(level) {
  return TESTS[level]?.title;
}

// Câte întrebări are o rundă: un test are toți itemii lui, celelalte niveluri câte 10.
export function questionCount(level) {
  return TESTS[level]?.items.length ?? ROUND_LENGTH;
}

// Itemul cu numărul `index` din testul nivelului, cu insigna lui.
export function buildNationalItem(level, index) {
  const { items } = TESTS[level];
  const item = items[Math.min(index, items.length - 1)];
  const badge = TESTS[level].practice
    ? tr('✏️ Exercițiul {i} din {n}', { i: index + 1, n: items.length })
    : tr('🎓 Itemul {i} din {n} · {p}p.', { i: index + 1, n: items.length, p: item.points });
  return { ...item, badge };
}
