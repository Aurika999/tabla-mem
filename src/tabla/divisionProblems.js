// „Împărțirea” — lecția din manual: împărțirea ca scădere repetată și
// împărțirea ca operație inversă înmulțirii. Patru secțiuni: Descopăr, Aplic,
// Exersez, Rezolv probleme. Unele exerciții se rezolvă pe pași (ca la Evaluare).
import { makeAnswers } from './data';

export const DIVISION_LEVELS = ['imp1', 'imp2', 'imp3', 'imp4'];
const BADGES = { imp1: '🔍 Descopăr', imp2: '✏️ Aplic', imp3: '⭐ Exersez', imp4: '🧩 Rezolv probleme' };
const GIRLS = ['Mara', 'Ioana', 'Sofia', 'Ana', 'Elena', 'Diana'];

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

function stepped(text, steps, explanation) {
  return {
    text,
    explanation,
    steps: steps.map(([question, answer, mistakes]) => ({ question, answer, choices: buildChoices(answer, mistakes) })),
  };
}

// O împărțire exactă: deîmpărțit = împărțitor × cât.
function division(minDivisor = 2, maxDivisor = 9, minQ = 2, maxQ = 9) {
  const divisor = randInt(minDivisor, maxDivisor);
  const quotient = randInt(minQ, maxQ);
  return { dividend: divisor * quotient, divisor, quotient };
}

// „20 de buburuze”, dar „12 buburuze”: în română „de” apare de la 20 în sus.
function count(n, word) {
  return `${n}${n >= 20 ? ' de' : ''} ${word}`;
}

function repeatedSubtraction(dividend, divisor) {
  return `${dividend} − ${Array(dividend / divisor).fill(divisor).join(' − ')} = 0`;
}

// ---------- 🔍 Descopăr ----------
const DISCOVER = [
  // Mara a cules 12 păpădii și le împarte în mod egal celor 3 prietene.
  () => {
    const { dividend, divisor, quotient } = division(2, 5, 2, 6);
    const girl = pick(GIRLS);
    return problem(`${girl} a cules ${count(dividend, 'păpădii')}. Ea vrea să le împartă, în mod egal, celor ${divisor} prietene ale sale. `
      + 'Câte păpădii va primi fiecare?', quotient,
      `Scădem câte ${divisor} până ajungem la 0: ${repeatedSubtraction(dividend, divisor)}. Am scăzut de ${quotient} ori, deci `
      + `${dividend} : ${divisor} = ${quotient}.`, [quotient + 1, quotient - 1, dividend - divisor]);
  },
  // Din 12 am scăzut de 4 ori câte 3 și am obținut 0.
  () => {
    const { dividend, divisor, quotient } = division(2, 5, 2, 6);
    return problem(`${repeatedSubtraction(dividend, divisor)}. De câte ori am scăzut ${divisor}?`, quotient,
      `Am scăzut ${divisor} de ${quotient} ori, deci ${dividend} : ${divisor} = ${quotient}.`, [quotient + 1, divisor, quotient - 1]);
  },
  // Pe fiecare din cele 6 flori s-au așezat câte doi gândăcei.
  () => {
    const flowers = randInt(3, 9); const per = randInt(2, 4);
    return problem(`Pe fiecare din cele ${flowers} flori s-au așezat câte ${per} gândăcei. Câți gândăcei sunt în total?`, flowers * per,
      `${flowers} × ${per} = ${flowers * per} gândăcei.`, [flowers + per, flowers * per + per, flowers * per - per]);
  },
  // Cei 12 gândăcei s-au împărțit în mod egal în 6 grupe.
  () => {
    const { dividend, divisor, quotient } = division(2, 6, 3, 6);
    return problem(`${count(dividend, 'gândăcei')} se împart în mod egal în ${divisor} grupe. Câți gândăcei vor fi în fiecare grupă?`, quotient,
      `Împărțim în mod egal: ${dividend} : ${divisor} = ${quotient}, pentru că ${divisor} × ${quotient} = ${dividend}.`,
      [quotient + 1, divisor, dividend - divisor]);
  },
  // Cei 12 gândăcei se grupează câte 2. Câte grupe se vor forma?
  () => {
    const { dividend, divisor, quotient } = division(2, 5, 2, 9);
    return problem(`${count(dividend, 'gândăcei')} se așază în grupe, câte ${divisor} gândăcei în fiecare grupă. `
      + 'Câte grupe se formează?', quotient,
      `Formăm grupe de câte ${divisor}: ${dividend} : ${divisor} = ${quotient} grupe.`, [quotient + 1, divisor, quotient - 1]);
  },
];

// ---------- ✏️ Aplic ----------
const APPLY = [
  // A. Asociază fiecărei scăderi repetate operația de împărțire potrivită.
  () => {
    const { dividend, divisor, quotient } = division(2, 4, 3, 5);
    const right = `${dividend} : ${divisor} = ${quotient}`;
    const wrong = new Set();
    while (wrong.size < 3) {
      const d = division(2, 4, 2, 6);
      const text = `${d.dividend} : ${d.divisor} = ${d.quotient}`;
      if (text !== right) wrong.add(text);
    }
    return {
      text: `Ce împărțire se potrivește cu scăderea repetată ${repeatedSubtraction(dividend, divisor)}?`,
      answer: right,
      explanation: `Am pornit de la ${dividend}, am scăzut câte ${divisor} și am scăzut de ${quotient} ori: ${right}.`,
      choices: shuffle([right, ...wrong]),
    };
  },
  // B. Află de câte ori se poate scădea 5 din 25.
  () => {
    const [divisor, dividend] = pick([[5, 25], [10, 60], [9, 36], [4, 28], [7, 21], [8, 40], [6, 30], [3, 27]]);
    const quotient = dividend / divisor;
    return problem(`De câte ori se poate scădea ${divisor} din ${dividend}?`, quotient,
      `${repeatedSubtraction(dividend, divisor)}. Am scăzut de ${quotient} ori, deci ${dividend} : ${divisor} = ${quotient}.`,
      [quotient + 1, quotient - 1, dividend - divisor]);
  },
  // C. Transformă împărțirile în scăderi repetate și află câtul.
  () => {
    const [dividend, divisor] = pick([[20, 5], [9, 3], [14, 2], [24, 6], [16, 8], [35, 7], [32, 4], [18, 3]]);
    const quotient = dividend / divisor;
    return problem(`Transformă în scăderi repetate și află câtul: ${dividend} : ${divisor} = ?`, quotient,
      `${repeatedSubtraction(dividend, divisor)}, deci ${dividend} : ${divisor} = ${quotient}.`, [quotient + 1, quotient - 1, divisor]);
  },
  // D. 40 de buburuze, câte 10 pe o frunză.
  () => {
    const per = pick([10, 5, 4, 2]); const leaves = randInt(2, per === 10 ? 6 : 8);
    return problem(`În poieniță au venit ${count(per * leaves, 'buburuze')}. Ele se așază câte ${per} pe o frunză. Pe câte frunze se așază toate buburuzele?`,
      leaves, `${per * leaves} : ${per} = ${leaves} frunze, pentru că ${leaves} × ${per} = ${per * leaves}.`, [leaves + 1, per, leaves - 1]);
  },
  // Provocare: 12 obiecte împărțite în grupe de câte 2, apoi 3, apoi 4.
  () => {
    const size = pick([2, 3, 4, 6]);
    return problem(`Ai 12 obiecte mici (bețișoare, dopuri, nasturi). Le împarți în grupe de câte ${size}. Câte grupe obții?`, 12 / size,
      `12 : ${size} = ${12 / size}, pentru că ${12 / size} × ${size} = 12.`, [12 / size + 1, size, 12 - size]);
  },
];

// ---------- ⭐ Exersez ----------
const PRACTICE = [
  // Află câtul și argumentează: 18 : 9 = 2 pentru că 2 × 9 = 18.
  () => {
    const { dividend, divisor, quotient } = division(2, 10, 2, 9);
    return problem(`Află câtul: ${dividend} : ${divisor} = ?`, quotient,
      `${dividend} : ${divisor} = ${quotient}, pentru că ${quotient} × ${divisor} = ${dividend}.`, [quotient + 1, quotient - 1, divisor]);
  },
  // Completează casetele: 6 × □ = 42, apoi 42 : 6 = □ (pe pași).
  () => {
    const { dividend, divisor, quotient } = division(3, 9, 2, 9);
    return stepped(`Completează casetele: ${divisor} × □ = ${dividend} și ${dividend} : ${divisor} = □`, [
      [`${divisor} × □ = ${dividend}`, quotient, [quotient + 1, quotient - 1, divisor]],
      [`${dividend} : ${divisor} = □`, quotient, [quotient + 1, divisor, quotient - 1]],
    ], `${divisor} × ${quotient} = ${dividend}, deci ${dividend} : ${divisor} = ${quotient}. Împărțirea e inversa înmulțirii!`);
  },
  // Operațiile cu numerele de pe flori: 7, 9, 63.
  () => {
    const a = randInt(3, 9); const b = randInt(3, 9); const p = a * b;
    const [text, answer, explanation] = pick([
      [`${a} × ${b} = ?`, p, `${a} × ${b} = ${p}.`],
      [`${b} × ${a} = ?`, p, `Ordinea factorilor nu contează: ${b} × ${a} = ${p}.`],
      [`${p} : ${b} = ?`, a, `${p} : ${b} = ${a}, pentru că ${a} × ${b} = ${p}.`],
      [`${p} : ${a} = ?`, b, `${p} : ${a} = ${b}, pentru că ${a} × ${b} = ${p}.`],
    ]);
    return problem(`Cu numerele de pe flori ${a}, ${b} și ${p}: ${text}`, answer, explanation, [answer + 1, answer - 1, p - answer]);
  },
  // Deîmpărțit, împărțitor, cât: cunoști doi termeni și îl afli pe al treilea.
  () => {
    // Împărțitorul diferit de cât, ca răspunsul să nu fie deja scris în întrebare (ex. 9 : 3 = 3).
    let d = division(2, 9, 2, 9);
    while (d.divisor === d.quotient) d = division(2, 9, 2, 9);
    const { dividend, divisor, quotient } = d;
    const kind = pick(['cat', 'deimpartit', 'impartitor']);
    if (kind === 'cat') {
      return problem(`Deîmpărțitul este ${dividend}, iar împărțitorul este ${divisor}. Care este câtul?`, quotient,
        `Câtul este rezultatul împărțirii: ${dividend} : ${divisor} = ${quotient}.`, [quotient + 1, quotient - 1, dividend - divisor]);
    }
    if (kind === 'deimpartit') {
      return problem(`Împărțitorul este ${divisor}, iar câtul este ${quotient}. Care este deîmpărțitul?`, dividend,
        `Deîmpărțitul se află prin înmulțire: ${quotient} × ${divisor} = ${dividend}. Verificare: ${dividend} : ${divisor} = ${quotient}.`,
        [divisor + quotient, dividend + divisor, dividend - quotient]);
    }
    return problem(`Deîmpărțitul este ${dividend}, iar câtul este ${quotient}. Care este împărțitorul?`, divisor,
      `Împărțitorul se află prin împărțire: ${dividend} : ${quotient} = ${divisor}. Verificare: ${dividend} : ${divisor} = ${quotient}.`,
      [divisor + 1, divisor - 1, dividend - quotient]);
  },
  // Factorul lipsă și împărțirea: □ × 5 = 50, 50 : 5 = □.
  () => {
    const { dividend, divisor, quotient } = division(2, 10, 2, 10);
    return problem(`Completează: □ × ${divisor} = ${dividend}`, quotient,
      `Căutăm numărul care înmulțit cu ${divisor} dă ${dividend}: ${dividend} : ${divisor} = ${quotient}.`, [quotient + 1, quotient - 1, divisor]);
  },
];

// ---------- 🧩 Rezolv probleme ----------
const SOLVE = [
  // Împărțire în mod egal.
  () => {
    const { dividend, divisor, quotient } = division(2, 8, 2, 9);
    const [things, who] = pick([['creioane', 'copii'], ['bomboane', 'prieteni'], ['mere', 'coșuri'], ['cărți', 'rafturi']]);
    return problem(`${count(dividend, things)} se împart în mod egal la ${divisor} ${who}. Câte ${things} revin fiecăruia?`, quotient,
      `${dividend} : ${divisor} = ${quotient}, pentru că ${quotient} × ${divisor} = ${dividend}.`, [quotient + 1, divisor, dividend - divisor]);
  },
  // Împărțire prin cuprindere: câte grupe de câte…
  () => {
    const { dividend, divisor, quotient } = division(2, 9, 2, 8);
    const [things, bag] = pick([['ouă', 'cofraje'], ['flori', 'buchete'], ['nasturi', 'cutiuțe'], ['biluțe', 'pungi']]);
    return problem(`${count(dividend, things)} se pun câte ${divisor} în ${bag}. Câte ${bag} se umplu?`, quotient,
      `${dividend} : ${divisor} = ${quotient} ${bag}.`, [quotient + 1, divisor, quotient - 1]);
  },
  // Pe pași: are niște obiecte, mai primește, apoi împarte.
  () => {
    const divisor = randInt(2, 6); const quotient = randInt(3, 8); const total = divisor * quotient;
    const had = randInt(5, total - 3); const got = total - had;
    const girl = pick(GIRLS);
    return stepped(`${girl} are ${count(had, 'abțibilduri')} și mai primește ${got}. Le împarte în mod egal celor ${divisor} prietene. Câte primește fiecare?`, [
      ['Câte abțibilduri are în total?', total, [had, total + divisor, total - 1]],
      [`Câte primește fiecare prietenă? ${total} : ${divisor} = ?`, quotient, [quotient + 1, divisor, total - divisor]],
    ], `În total: ${had} + ${got} = ${total}. Fiecare primește ${total} : ${divisor} = ${quotient}.`);
  },
  // Pe pași: înmulțire, apoi împărțire (operații inverse).
  () => {
    // Alegem întâi câți copii sunt, ca prăjiturile să se împartă exact.
    const kids = pick([2, 3, 4]); const per = kids * randInt(1, 2); const boxes = randInt(2, 5); const total = boxes * per;
    return stepped(`Sunt ${boxes} cutii cu câte ${per} prăjituri. Toate prăjiturile se împart în mod egal la ${kids} copii. Câte prăjituri primește fiecare copil?`, [
      ['Câte prăjituri sunt în total?', total, [boxes + per, total + per, total - per]],
      [`Câte primește fiecare copil? ${total} : ${kids} = ?`, total / kids, [total / kids + 1, kids, total - kids]],
    ], `Prăjituri: ${boxes} × ${per} = ${total}. Fiecare copil: ${total} : ${kids} = ${total / kids}.`);
  },
  // În poieniță au venit 40 de buburuze. Ele se așază câte 10 pe o frunză.
  () => {
    const per = pick([10, 5, 4, 3, 2]); const leaves = randInt(3, per === 10 ? 9 : 8);
    const total = per * leaves;
    return problem(`În poieniță au venit ${count(total, 'buburuze')}. Ele se așază câte ${per} pe o frunză. `
      + 'Pe câte frunze se așază toate buburuzele?', leaves,
      `${total} : ${per} = ${leaves} frunze, pentru că ${leaves} × ${per} = ${total}.`, [leaves + 1, leaves - 1, total - per]);
  },
];

const BY_LEVEL = { imp1: DISCOVER, imp2: APPLY, imp3: PRACTICE, imp4: SOLVE };

export function isDivisionLevel(level) {
  return DIVISION_LEVELS.includes(level);
}

export function buildDivisionProblem(level) {
  return { ...pick(BY_LEVEL[level])(), badge: BADGES[level] };
}
