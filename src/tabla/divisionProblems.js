// „Împărțirea” — lecția din manual: împărțirea ca scădere repetată și
// împărțirea ca operație inversă înmulțirii. Patru secțiuni: Descopăr, Aplic,
// Exersez, Rezolv probleme. Unele exerciții se rezolvă pe pași (ca la Evaluare).
import { makeAnswers } from './data';

// Lecțiile din „Tabla împărțirii”: „Împărțirea” (imp1–4) și „Împărțirea la 2” (impd1–4).
export const DIVISION_LEVELS = ['imp1', 'imp2', 'imp3', 'imp4'];
export const HALF_LEVELS = ['impd1', 'impd2', 'impd3', 'impd4'];
export const THIRD_LEVELS = ['impt1', 'impt2', 'impt3', 'impt4'];
export const QUARTER_LEVELS = ['impq1', 'impq2', 'impq3', 'impq4'];
export const FIFTH_LEVELS = ['impc1', 'impc2', 'impc3', 'impc4'];
const BADGES = {
  imp1: '🔍 Descopăr', imp2: '✏️ Aplic', imp3: '⭐ Exersez', imp4: '🧩 Rezolv probleme',
  impd1: '🔍 Descopăr', impd2: '✏️ Aplic', impd3: '⭐ Exersez', impd4: '🧩 Rezolv probleme',
  impt1: '🔍 Descopăr', impt2: '✏️ Aplic', impt3: '⭐ Exersez', impt4: '🧩 Rezolv probleme',
  impq1: '🔍 Descopăr', impq2: '✏️ Aplic', impq3: '⭐ Exersez', impq4: '🧩 Rezolv probleme',
  impc1: '🔍 Descopăr', impc2: '✏️ Aplic', impc3: '⭐ Exersez', impc4: '🧩 Rezolv probleme',
};
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
// În loc de căsuța goală, numărul lipsă e ascuns sub o floare, o minge sau un fruct.
const HIDERS = ['🌸', '🌼', '⚽', '🏀', '🍎', '🍐', '🍓', '🍊'];

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
  // Numărul ascuns: 6 × 🍎 = 42, apoi 42 : 6 = 🍎 (pe pași).
  () => {
    const { dividend, divisor, quotient } = division(3, 9, 2, 9); const box = pick(HIDERS);
    return stepped(`Ce număr se ascunde sub ${box}? ${divisor} × ${box} = ${dividend} și ${dividend} : ${divisor} = ${box}`, [
      [`${divisor} × ${box} = ${dividend}`, quotient, [quotient + 1, quotient - 1, divisor]],
      [`${dividend} : ${divisor} = ${box}`, quotient, [quotient + 1, divisor, quotient - 1]],
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
  // Factorul lipsă ascuns: 🍎 × 5 = 50.
  () => {
    const { dividend, divisor, quotient } = division(2, 10, 2, 10); const box = pick(HIDERS);
    return problem(`Ce număr se ascunde sub ${box}? ${box} × ${divisor} = ${dividend}`, quotient,
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

// ================= „Împărțirea la 2” =================
const EVEN_TO_20 = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

const HALF_DISCOVER = [
  // Iepurica a pregătit 8 coronițe, împărțite în mod egal pe cele două mese.
  () => {
    const n = pick([6, 8, 10, 12, 14, 16]);
    return problem(`Pentru petrecerea de primăvară, Iepurica a pregătit ${count(n, 'coronițe')} de flori. `
      + 'Ele au fost împărțite în mod egal pe cele două mese. Câte coronițe sunt pe o masă?', n / 2,
      `${repeatedSubtraction(n, 2)}, deci ${n} : 2 = ${n / 2}, deoarece ${n / 2} × 2 = ${n}. Pe fiecare masă e jumătate din coronițe.`,
      [n / 2 + 1, n - 2, n / 2 - 1]);
  },
  // Cele 10 berze s-au așezat câte 2 într-un cuib.
  () => {
    const n = pick([6, 8, 10, 12, 14, 16, 18]);
    return problem(`Cele ${count(n, 'berze')} s-au așezat câte 2 într-un cuib. În câte cuiburi s-au așezat toate berzele?`, n / 2,
      `${repeatedSubtraction(n, 2)}, deci ${n} : 2 = ${n / 2} cuiburi, pentru că ${n / 2} × 2 = ${n}.`, [n / 2 + 1, n - 2, n / 2 - 1]);
  },
  // Verificarea: 8 : 2 = 4 pentru că 4 × 2 = 8.
  () => {
    const n = pick(EVEN_TO_20);
    return problem(`${n} : 2 = ?  (Gândește-te: ce număr înmulțit cu 2 dă ${n}?)`, n / 2,
      `${n} : 2 = ${n / 2}, deoarece ${n / 2} × 2 = ${n}.`, [n / 2 + 1, n - 2, n / 2 - 1]);
  },
  // Jumătatea numărului.
  () => {
    const n = pick(EVEN_TO_20);
    return problem(`Care este jumătatea numărului ${n}?`, n / 2,
      `Jumătatea înseamnă împărțirea la 2: ${n} : 2 = ${n / 2}.`, [n / 2 + 1, n * 2, n - 2]);
  },
];

// Inversul: ce număr, împărțit la 2, dă k? (verificare prin înmulțire)
const HALF_INVERSE = [
  () => {
    const k = randInt(2, 10);
    return problem(`Ce număr, împărțit la 2, dă ${k}?`, 2 * k,
      `Verificăm cu înmulțirea: ${k} × 2 = ${2 * k}, deci ${2 * k} : 2 = ${k}.`, [k + 2, k, 2 * k + 2]);
  },
  () => {
    const k = randInt(2, 10);
    return problem(`Află numărul a cărui jumătate este ${k}.`, 2 * k,
      `Dacă jumătatea este ${k}, numărul este de 2 ori mai mare: ${k} × 2 = ${2 * k}.`, [k + 2, k, 2 * k + 2]);
  },
];
HALF_DISCOVER.push(HALF_INVERSE[0]);

const HALF_APPLY = [
  // A. Ce număr ascunde fluturașul: 2 × 🦋 = 6 și 6 : 2 = 🦋 (pe pași).
  () => {
    const k = randInt(1, 10);
    return stepped(`Află ce număr ascunde fluturașul: 2 × 🦋 = ${2 * k}, apoi ${2 * k} : 2 = 🦋`, [
      [`2 × 🦋 = ${2 * k}`, k, [k + 1, 2 * k, k - 1 >= 0 ? k - 1 : k + 2]],
      [`${2 * k} : 2 = 🦋`, k, [k + 1, 2 * k, k + 2]],
    ], `2 × ${k} = ${2 * k}, deci ${2 * k} : 2 = ${k}. Împărțirea e inversa înmulțirii!`);
  },
  // B. Află numerele de 2 ori mai mici decât 14, 20, 16, 8, 10, 4, 6, 18.
  () => {
    const n = pick([14, 20, 16, 8, 10, 4, 6, 18]);
    return problem(`Află numărul de 2 ori mai mic decât ${n}.`, n / 2,
      `„De 2 ori mai mic” înseamnă împărțire la 2: ${n} : 2 = ${n / 2}.`, [n - 2, n * 2, n / 2 + 1]);
  },
  // C. Tabelul cu jumătatea numărului.
  () => {
    const n = pick([6, 16, 12, 18, 2, 8, 10, 14]);
    return problem(`Care este jumătatea numărului ${n}?`, n / 2,
      `Jumătatea lui ${n} este ${n} : 2 = ${n / 2}.`, [n - 2, n / 2 + 1, n * 2]);
  },
];

HALF_APPLY.push(HALF_INVERSE[1]);

const HALF_PRACTICE = [
  // Află câtul împărțirilor.
  () => {
    const n = pick(EVEN_TO_20);
    return problem(`Află câtul: ${n} : 2 = ?`, n / 2, `${n} : 2 = ${n / 2}, pentru că ${n / 2} × 2 = ${n}.`, [n / 2 + 1, n / 2 - 1, n - 2]);
  },
  // Micșorează de 2 ori numerele pare de două cifre, mai mici decât 20.
  () => {
    const n = pick([10, 12, 14, 16, 18]);
    return problem(`Micșorează de 2 ori numărul ${n}.`, n / 2, `„Micșorează de 2 ori” înseamnă ${n} : 2 = ${n / 2}.`, [n - 2, n / 2 + 1, n * 2]);
  },
  // Completează împărțirile cu numerele ascunse sub lalele: 🌷 : 2 = 5.
  () => {
    const k = randInt(1, 10);
    return problem(`Ce număr se ascunde sub lalea? 🌷 : 2 = ${k}`, 2 * k,
      `Căutăm numărul care împărțit la 2 dă ${k}: ${k} × 2 = ${2 * k}, deci ${2 * k} : 2 = ${k}.`, [k + 2, k, 2 * k + 2]);
  },
  // Află numerele a căror jumătate este 3, 4, 7…
  () => {
    const k = pick([3, 4, 7, 6, 10, 5, 8, 2]);
    return problem(`Află numărul a cărui jumătate este ${k}.`, 2 * k,
      `Dacă jumătatea este ${k}, numărul este de 2 ori mai mare: ${k} × 2 = ${2 * k}.`, [k / 2 | 0 || k + 1, k + 2, 2 * k + 2]);
  },
  // Numerele care se împart exact la 2 sunt pare.
  () => {
    const even = 2 * randInt(2, 10);
    const odd = new Set();
    while (odd.size < 3) odd.add(2 * randInt(2, 9) + 1);
    return {
      text: 'Care dintre aceste numere se împarte exact la 2?',
      answer: even,
      explanation: `Numerele care se împart exact la 2 sunt numerele pare. Doar ${even} este par: ${even} : 2 = ${even / 2}.`,
      choices: shuffle([even, ...odd]),
    };
  },
];

const HALF_SOLVE = [
  // Două caiete de același fel costă 8 lei. Cât costă un caiet?
  () => {
    const n = pick([6, 8, 10, 12, 14, 16, 18]);
    const [item, items] = pick([['caiet', 'caiete'], ['creion', 'creioane'], ['suc', 'sucuri']]);
    return problem(`Două ${items} de același fel costă ${n} lei. Cât costă un ${item}?`, n / 2,
      `Prețul unui ${item} e jumătate: ${n} : 2 = ${n / 2} lei.`, [n - 2, n * 2, n / 2 + 1]);
  },
  // Miruna are 14 lalele. Jumătate dăruiește mamei, restul bunicii (pe pași).
  () => {
    const n = pick([8, 10, 12, 14, 16, 18, 20]);
    return stepped(`Miruna are ${count(n, 'lalele')}. Jumătate dintre ele le dăruiește mamei, iar restul le dăruiește bunicii. `
      + 'Câte lalele primește bunica?', [
      [`Câte lalele primește mama? (jumătate din ${n})`, n / 2, [n - 2, n / 2 + 1, n * 2]],
      [`Câte lalele rămân pentru bunica? ${n} - ${n / 2} = ?`, n / 2, [n, n / 2 + 1, n - 2]],
    ], `Mama primește ${n} : 2 = ${n / 2}. Bunica primește restul: ${n} - ${n / 2} = ${n / 2} (tot jumătate!).`);
  },
  // Câte sticle de 2 litri se pot umple cu 12 litri de lapte? Dar cu 18?
  () => {
    const l = pick([8, 10, 12, 14, 16, 18, 20]);
    return problem(`Câte sticle de 2 litri se pot umple cu ${l} litri de lapte?`, l / 2,
      `Fiecare sticlă ia 2 litri: ${l} : 2 = ${l / 2} sticle.`, [l - 2, l / 2 + 1, l * 2]);
  },
  // Adina are 14 cercei roz și 10 albaștri. Câte perechi în total? (pe pași)
  () => {
    const pink = pick([8, 10, 12, 14, 16]); const blue = pick([6, 8, 10, 12]);
    return stepped(`Adina are ${count(pink, 'cercei')} roz și ${count(blue, 'cercei')} albaștri. Câte perechi de cercei are în total?`, [
      [`Câte perechi de cercei roz are? ${pink} : 2 = ?`, pink / 2, [pink - 2, pink / 2 + 1, pink * 2]],
      [`Câte perechi de cercei albaștri are? ${blue} : 2 = ?`, blue / 2, [blue - 2, blue / 2 + 1, blue * 2]],
      [`Câte perechi are în total? ${pink / 2} + ${blue / 2} = ?`, (pink + blue) / 2, [pink + blue, pink / 2, (pink + blue) / 2 + 1]],
    ], `Roz: ${pink} : 2 = ${pink / 2} perechi. Albaștri: ${blue} : 2 = ${blue / 2} perechi. Total: ${pink / 2} + ${blue / 2} = ${(pink + blue) / 2}.`);
  },
  // Berzele și cuiburile, iepurica și mesele (variante noi).
  () => {
    const n = pick([12, 14, 16, 18, 20]);
    const [what, where] = pick([['pantofi', 'perechi'], ['mănuși', 'perechi'], ['șosete', 'perechi']]);
    return problem(`În dulap sunt ${count(n, what)}. Câte ${where} de ${what} sunt?`, n / 2,
      `O pereche are 2 bucăți: ${n} : 2 = ${n / 2} perechi.`, [n - 2, n / 2 + 1, n * 2]);
  },
];

// ================= „Împărțirea la 3” =================
const OPERATIONS = ['+', '−', '×', ':'];
const SIGNS = ['<', '>', '='];

const THIRD_DISCOVER = [
  // Carla și Răzvan au 3 căsuțe pentru păsărele și 12 bețișoare colorate.
  () => {
    const k = randInt(2, 8); const n = 3 * k;
    return problem(`Carla și Răzvan au făcut 3 căsuțe identice pentru păsărele. Vor folosi pentru decor ${count(n, 'bețișoare')} colorate. `
      + 'Câte bețișoare va avea fiecare căsuță?', k,
      `${n} : 3 = ${k} bețișoare, deoarece ${k} × 3 = ${n}.`, [k + 1, n - 3, k - 1]);
  },
  // Echipa Mariei a adus 9 ilustrații; pentru fiecare afiș trebuie 3.
  () => {
    const k = randInt(2, 9); const n = 3 * k;
    return problem(`Echipa Mariei a adus ${count(n, 'ilustrații')}. Pentru fiecare afiș are nevoie de câte 3 ilustrații. `
      + 'Pentru câte afișe vor ajunge?', k,
      `${n} : 3 = ${k} afișe, deoarece ${k} × 3 = ${n}.`, [k + 1, n - 3, k - 1]);
  },
  () => {
    const k = randInt(1, 10); const n = 3 * k;
    return problem(`${n} : 3 = ?  (Gândește-te: ce număr înmulțit cu 3 dă ${n}?)`, k,
      `${n} : 3 = ${k}, deoarece ${k} × 3 = ${n}.`, [k + 1, n - 3, k + 3]);
  },
  () => {
    const k = randInt(2, 10);
    return problem(`Ce număr, împărțit la 3, dă ${k}?`, 3 * k,
      `Verificăm cu înmulțirea: ${k} × 3 = ${3 * k}, deci ${3 * k} : 3 = ${k}.`, [k + 3, 2 * k, 3 * k + 3]);
  },
];

const THIRD_APPLY = [
  // A. Scrie împărțirile corespunzătoare imaginilor.
  () => {
    const [n, thing] = pick([[6, 'trifoi'], [12, 'flori'], [9, 'trifoi'], [15, 'flori'], [18, 'flori']]);
    return {
      ...problem(`În imagine sunt ${n} ${thing}, așezate în 3 grupe egale. Câte ${thing} sunt într-o grupă? (${n} : 3 = ?)`, n / 3,
        `${n} : 3 = ${n / 3}, pentru că ${n / 3} × 3 = ${n}.`, [n / 3 + 1, n - 3, 3]),
      picture: { icon: thing === 'trifoi' ? '☘️' : '🌸', groups: 3, per: n / 3 },
    };
  },
  // B. Află numerele care lipsesc (ascunse sub o floare, minge sau fruct): 3 × 🌸 = 6, apoi 6 : 3 = 🌸 (pe pași).
  () => {
    const k = randInt(1, 10); const box = pick(HIDERS);
    return stepped(`Ce număr se ascunde sub ${box}? 3 × ${box} = ${3 * k}, apoi ${3 * k} : 3 = ${box}`, [
      [`3 × ${box} = ${3 * k}`, k, [k + 1, 3 * k, k + 3]],
      [`${3 * k} : 3 = ${box}`, k, [k + 1, 3 * k, k + 3]],
    ], `3 × ${k} = ${3 * k}, deci ${3 * k} : 3 = ${k}. Împărțirea e inversa înmulțirii!`);
  },
  // C. Află numerele de 3 ori mai mici decât 9, 21, 15, 27, 30, 3.
  () => {
    const n = pick([9, 21, 15, 27, 30, 3, 12, 24]);
    return problem(`Află numărul de 3 ori mai mic decât ${n}.`, n / 3,
      `„De 3 ori mai mic” înseamnă împărțire la 3: ${n} : 3 = ${n / 3}.`, [n - 3, n / 3 + 1, n * 3]);
  },
  // D. De 2 ori mai mici / de 3 ori mai mici decât 6, 12, 18.
  () => {
    const n = pick([6, 12, 18]); const d = pick([2, 3]);
    return problem(`Care este numărul de ${d} ori mai mic decât ${n}?`, n / d,
      `${n} : ${d} = ${n / d}.`, [n / (5 - d), n - d, n / d + 1]);
  },
];

const THIRD_PRACTICE = [
  // Află câtul împărțirilor.
  () => {
    const k = randInt(4, 10); const n = 3 * k;
    return problem(`Află câtul: ${n} : 3 = ?`, k, `${n} : 3 = ${k}, pentru că ${k} × 3 = ${n}.`, [k + 1, k - 1, n - 3]);
  },
  // Micșorează de 3 ori suma perechilor de numere (pe pași).
  () => {
    const [a, b] = pick([[8, 7], [13, 14], [16, 5], [19, 11], [10, 8], [12, 9]]);
    const sum = a + b;
    return stepped(`Micșorează de 3 ori suma numerelor ${a} și ${b}.`, [
      [`Cât este suma ${a} + ${b}?`, sum, [a * b > 99 ? sum + 10 : a * b, sum + 1, sum - 1]],
      [`Micșorează de 3 ori: ${sum} : 3 = ?`, sum / 3, [sum - 3, sum / 3 + 1, sum * 3 > 99 ? sum / 3 + 3 : sum * 3]],
    ], `Suma: ${a} + ${b} = ${sum}. De 3 ori mai mic: ${sum} : 3 = ${sum / 3}.`);
  },
  // Calculează și compară: 24 : 3 ○ 9.
  () => {
    const [left, lv, right, rv] = pick([
      ['24 : 3', 8, '9', 9], ['12 : 3', 4, '8 : 2', 4], ['9 : 3', 3, '2', 2], ['3 : 3', 1, '3 − 3', 0],
      ['15 : 3', 5, '30 : 3', 10], ['9', 9, '18 : 3', 6], ['27 : 3', 9, '21 : 3', 7],
      ['18 : 3', 6, '12 : 2', 6], ['30 : 3', 10, '9', 9],
    ]);
    const sign = lv < rv ? '<' : lv > rv ? '>' : '=';
    return {
      text: `Calculează și compară: ${left} ○ ${right}`,
      answer: sign,
      explanation: `${left} = ${lv} și ${right} = ${rv}, deci ${lv} ${sign} ${rv}.`,
      choices: SIGNS,
    };
  },
  // Ce numere se ascund în spatele rândunelelor? 🐦 : 3 = 5.
  () => {
    const k = randInt(1, 10);
    return problem(`Ce număr se ascunde în spatele rândunelei? 🐦 : 3 = ${k}`, 3 * k,
      `Căutăm numărul care împărțit la 3 dă ${k}: ${k} × 3 = ${3 * k}.`, [k + 3, k, 3 * k + 3]);
  },
  // Rezolvă după model: 24 : 3 : 2 = 8 : 2 = 4 (pe pași).
  () => {
    const [n, d2] = pick([[30, 2], [27, 3], [9, 3], [12, 2], [18, 3], [18, 2], [6, 2], [24, 2]]);
    const first = n / 3;
    return stepped(`Rezolvă după model (24 : 3 : 2 = 8 : 2 = 4): ${n} : 3 : ${d2} = ?`, [
      [`${n} : 3 = ?`, first, [first + 1, n - 3, first - 1]],
      [`${first} : ${d2} = ?`, first / d2, [first / d2 + 1, first - d2, first]],
    ], `Întâi ${n} : 3 = ${first}, apoi ${first} : ${d2} = ${first / d2}.`);
  },
  // Află câtul numerelor 27 și 3, apoi mărește-l de 6 ori (pe pași).
  () => {
    const n = pick([27, 24, 21, 18, 15, 12]); const k = pick([2, 4, 6]);
    return stepped(`Află câtul numerelor ${n} și 3, apoi mărește-l de ${k} ori.`, [
      [`Cât este câtul ${n} : 3?`, n / 3, [n / 3 + 1, n - 3, n / 3 - 1]],
      [`Mărește de ${k} ori: ${n / 3} × ${k} = ?`, (n / 3) * k, [n / 3 + k, (n / 3) * k + k, (n / 3) * (k + 1)]],
    ], `Câtul: ${n} : 3 = ${n / 3}. Mărit de ${k} ori: ${n / 3} × ${k} = ${(n / 3) * k}.`);
  },
  // Completează casetele cu semnele +, −, × sau : ca egalitatea să fie adevărată.
  () => {
    const [left, right, answer] = pick([
      ['6 ☐ 3', '3', '−'], ['6 ☐ 3', '2', ':'], ['6 ☐ 3', '9', '+'], ['6 ☐ 3', '18', '×'],
      ['30 ☐ 3', '10', ':'], ['21 ☐ 3', '7', ':'], ['9 ☐ 3', '27', '×'],
    ]);
    return {
      text: `Ce semn pui în căsuță ca egalitatea să fie adevărată? ${left} = ${right}`,
      answer,
      explanation: `Încearcă fiecare semn: doar cu „${answer}” egalitatea ${left.replace('☐', answer)} = ${right.replace('☐', answer)} este adevărată.`,
      choices: OPERATIONS,
    };
  },
];

const THIRD_SOLVE = [
  // Află cât costă o ciocolată, dacă 3 ciocolate de același fel costă 21 de lei.
  () => {
    const k = randInt(3, 9); const total = 3 * k;
    const [item, items] = pick([['ciocolată', 'ciocolate'], ['carte', 'cărți'], ['minge', 'mingi']]);
    return problem(`Află cât costă o ${item}, dacă 3 ${items} de același fel costă ${count(total, 'lei')}.`, k,
      `${total} : 3 = ${k} lei.`, [k + 3, total - 3, k + 1]);
  },
  // Într-o bancă se pot așeza 3 copii. Câte bănci sunt necesare pentru 24 de copii?
  () => {
    const k = randInt(3, 10); const kids = 3 * k;
    return problem(`Într-o bancă se pot așeza 3 copii. Câte bănci sunt necesare pentru ${count(kids, 'copii')}?`, k,
      `${kids} : 3 = ${k} bănci.`, [k + 1, kids - 3, k - 1]);
  },
  // Bunicul are 18 puișori galbeni, iar negri de 3 ori mai puțini. Câți în total? (pe pași)
  () => {
    const black = randInt(2, 7); const yellow = 3 * black;
    return stepped(`Bunicul are ${count(yellow, 'puișori')} galbeni, iar negri de 3 ori mai puțini. Câți puișori are în total?`, [
      [`Câți puișori negri are? ${yellow} : 3 = ?`, black, [yellow - 3, black + 1, yellow * 3 > 99 ? black + 3 : yellow * 3]],
      [`Câți puișori are în total? ${yellow} + ${black} = ?`, yellow + black, [yellow, yellow + black + 1, yellow - black]],
    ], `Negri: ${yellow} : 3 = ${black}. În total: ${yellow} + ${black} = ${yellow + black}.`);
  },
  // Rareș: 20 de curiozități, 12 despre berze, despre rândunele de 3 ori mai puține. (pe pași)
  () => {
    const storks = pick([9, 12, 15]); const swallows = storks / 3; const total = storks + swallows + randInt(2, 6);
    return stepped(`Rareș trebuie să scrie ${count(total, 'curiozități')} despre păsări. Până acum a scris ${storks} curiozități despre berze `
      + 'și de 3 ori mai puține despre rândunele. Câte curiozități mai are de scris?', [
      [`Câte curiozități a scris despre rândunele? ${storks} : 3 = ?`, swallows, [storks - 3, swallows + 1, storks]],
      [`Câte a scris în total până acum? ${storks} + ${swallows} = ?`, storks + swallows, [storks, storks + swallows + 1, storks - swallows]],
      [`Câte mai are de scris? ${total} - ${storks + swallows} = ?`, total - storks - swallows, [total - storks, total - swallows, total - storks - swallows + 1]],
    ], `Rândunele: ${storks} : 3 = ${swallows}. Scrise: ${storks} + ${swallows} = ${storks + swallows}. Mai are: ${total} - ${storks + swallows} = ${total - storks - swallows}.`);
  },
  // Împărțire în 3 grupe egale.
  () => {
    const k = randInt(3, 10); const n = 3 * k;
    const [things, who] = pick([['mere', 'coșuri'], ['creioane', 'penare'], ['bomboane', 'prieteni']]);
    return problem(`${count(n, things)} se împart în mod egal în 3 ${who}. Câte ${things} sunt în fiecare?`, k,
      `${n} : 3 = ${k}, pentru că ${k} × 3 = ${n}.`, [k + 1, n - 3, k + 3]);
  },
];

// ================= „Împărțirea la 4” =================
const QUARTER_DISCOVER = [
  // Pentru câte mașinuțe îi vor ajunge lui Petrișor cele 20 de roți?
  () => {
    const k = randInt(2, 9); const n = 4 * k;
    return problem(`Petrișor are ${count(n, 'roți')}. Pune câte 4 roți la o mașinuță. Pentru câte mașinuțe îi ajung roțile?`, k,
      `${n} : 4 = ${k} mașinuțe, deoarece ${k} × 4 = ${n}.`, [k + 1, n - 4, k - 1]);
  },
  // Cele 16 păsări se așază în mod egal pe 4 crengi.
  () => {
    const k = randInt(2, 9); const n = 4 * k;
    return problem(`Cele ${count(n, 'păsări')} vor să se așeze pe 4 crengi, același număr pe fiecare creangă. Câte păsări vor fi pe o creangă?`, k,
      `${n} : 4 = ${k} păsări, deoarece ${k} × 4 = ${n}.`, [k + 1, n - 4, k - 1]);
  },
  () => {
    const k = randInt(1, 10); const n = 4 * k;
    return problem(`${n} : 4 = ?  (Gândește-te: ce număr înmulțit cu 4 dă ${n}?)`, k,
      `${n} : 4 = ${k}, deoarece ${k} × 4 = ${n}.`, [k + 1, n - 4, k + 4]);
  },
  () => {
    const k = randInt(2, 10);
    return problem(`Ce număr, împărțit la 4, dă ${k}?`, 4 * k,
      `Verificăm cu înmulțirea: ${k} × 4 = ${4 * k}, deci ${4 * k} : 4 = ${k}.`, [k + 4, 2 * k, 4 * k + 4]);
  },
];

const QUARTER_APPLY = [
  // A. Scrie împărțirile corespunzătoare imaginilor.
  () => {
    const [n, things, groups] = pick([[8, 'puișori', 'cuiburi'], [12, 'flori', 'vaze'], [16, 'puișori', 'cuiburi'], [20, 'flori', 'vaze']]);
    return {
      ...problem(`În imagine sunt ${count(n, things)}, așezați în mod egal în 4 ${groups}. Câți sunt într-unul? (${n} : 4 = ?)`
        .replace('așezați', things === 'flori' ? 'așezate' : 'așezați').replace('Câți sunt într-unul', things === 'flori' ? 'Câte sunt într-una' : 'Câți sunt într-unul'), n / 4,
        `${n} : 4 = ${n / 4}, pentru că ${n / 4} × 4 = ${n}.`, [n / 4 + 1, n - 4, 4]),
      picture: things === 'flori'
        ? { icon: '🌼', groups: 4, per: n / 4, holder: '🏺' }
        : { icon: '🐥', groups: 4, per: n / 4, holder: '🪺' },
    };
  },
  // B. Află ce numere ascund florile: 🌼 × 4 = 24, apoi 24 : 4 = 🌼 (pe pași).
  () => {
    const k = randInt(1, 10);
    return stepped(`Află ce numere ascund florile: 🌼 × 4 = ${4 * k}, apoi ${4 * k} : 4 = 🌼`, [
      [`🌼 × 4 = ${4 * k}`, k, [k + 1, 4 * k, k + 4]],
      [`${4 * k} : 4 = 🌼`, k, [k + 1, 4 * k, k + 4]],
    ], `${k} × 4 = ${4 * k}, deci ${4 * k} : 4 = ${k}. Împărțirea e inversa înmulțirii!`);
  },
  // C. Află numerele de 4 ori mai mici decât 40, 36, 16, 24, 32, 8, 12, 28.
  () => {
    const n = pick([40, 36, 16, 24, 32, 8, 12, 28, 20]);
    return problem(`Află numărul de 4 ori mai mic decât ${n}.`, n / 4,
      `„De 4 ori mai mic” înseamnă împărțire la 4: ${n} : 4 = ${n / 4}.`, [n - 4, n / 4 + 1, n / 2]);
  },
  // D. Află sfertul numerelor 8, 20, 16, 4.
  () => {
    const n = pick([8, 20, 16, 4, 12, 24]);
    return problem(`Care este sfertul numărului ${n}?`, n / 4, `Sfertul înseamnă împărțire la 4: ${n} : 4 = ${n / 4}.`, [n / 2, n - 4, n / 4 + 1]);
  },  // Numărul care, împărțit la 4, dă un număr dat.
  () => {
    const k = randInt(2, 10);
    return problem(`Un număr împărțit la 4 dă ${k}. Care este numărul?`, 4 * k,
      `Verificăm cu înmulțirea: ${k} × 4 = ${4 * k}, deci ${4 * k} : 4 = ${k}.`, [k + 4, 2 * k, 4 * k + 4]);
  },
];

const QUARTER_PRACTICE = [
  // Află câtul împărțirilor (la 2, la 3 și la 4).
  () => {
    const [n, d] = pick([[12, 2], [12, 3], [12, 4], [18, 2], [24, 3], [24, 4], [20, 2], [21, 3], [20, 4], [36, 4], [28, 4], [32, 4], [40, 4]]);
    return problem(`Află câtul: ${n} : ${d} = ?`, n / d, `${n} : ${d} = ${n / d}, pentru că ${n / d} × ${d} = ${n}.`, [n / d + 1, n / d - 1, n - d]);
  },
  // Calculează și compară: 16 : 2 ○ 32 : 4.
  () => {
    const [left, right] = pick([
      ['16 : 2', '32 : 4'], ['15 : 3', '28 : 4'], ['24 : 4', '24 : 3'], ['32 : 4', '27 : 3'],
      ['30 : 3', '36 : 4'], ['20 : 2', '40 : 4'], ['12 : 4', '8 : 2'], ['36 : 4', '18 : 2'],
    ]);
    const val = e => { const [a, b] = e.split(' : ').map(Number); return a / b; };
    const lv = val(left); const rv = val(right);
    const sign = lv < rv ? '<' : lv > rv ? '>' : '=';
    return {
      text: `Calculează și compară: ${left} ○ ${right}`,
      answer: sign,
      explanation: `${left} = ${lv} și ${right} = ${rv}, deci ${lv} ${sign} ${rv}.`,
      choices: SIGNS,
    };
  },
  // Află sfertul numerelor 40, 12, 32, 28, 36, 24.
  () => {
    const n = pick([40, 12, 32, 28, 36, 24]);
    return problem(`Află sfertul numărului ${n}.`, n / 4, `Sfertul = împărțire la 4: ${n} : 4 = ${n / 4}.`, [n / 2, n - 4, n / 4 + 1]);
  },
  // Completează tabelul: deîmpărțit, împărțitor, cât.
  () => {
    const type = pick(['cat', 'deimpartit', 'impartitor']);
    if (type === 'cat') {
      const k = randInt(2, 10); const n = 4 * k;
      return problem(`Deîmpărțitul este ${n}, împărțitorul este 4. Care este câtul?`, k, `${n} : 4 = ${k}.`, [k + 1, n - 4, k - 1]);
    }
    if (type === 'deimpartit') {
      const k = randInt(2, 10);
      return problem(`Împărțitorul este 4, iar câtul este ${k}. Care este deîmpărțitul?`, 4 * k,
        `Deîmpărțitul = cât × împărțitor: ${k} × 4 = ${4 * k}. Verificare: ${4 * k} : 4 = ${k}.`, [k + 4, 4 * k + 4, 4 * k - 4]);
    }
    const [n, d] = pick([[24, 3], [20, 2], [18, 2], [32, 4], [36, 4], [27, 3], [16, 2]]);
    return problem(`Deîmpărțitul este ${n}, iar câtul este ${n / d}. Care este împărțitorul?`, d,
      `Căutăm numărul la care împărțim ${n} ca să obținem ${n / d}: ${n} : ${d} = ${n / d}.`, [d + 1, d + 2, d - 1]);
  },
  // Află numerele care se ascund în spatele albinelor: 🐝 : 4 = 5.
  () => {
    const d = pick([2, 3, 4, 4]); const k = pick([5, 7, 9]);
    return problem(`Ce număr se ascunde în spatele albinei? 🐝 : ${d} = ${k}`, d * k,
      `Căutăm numărul care împărțit la ${d} dă ${k}: ${k} × ${d} = ${d * k}.`, [k + d, d * k + d, d * k - d]);
  },
  // Află numărul când îi știi sfertul.
  () => {
    const k = randInt(2, 10);
    return problem(`Sfertul unui număr este ${k}. Care este numărul?`, 4 * k,
      `Numărul este de 4 ori mai mare decât sfertul lui: ${k} × 4 = ${4 * k}. Verificare: ${4 * k} : 4 = ${k}.`, [k + 4, 2 * k, 4 * k + 4]);
  },
  // Matei află de câte ori este mai mare fiecare număr decât 4.
  () => {
    const n = pick([32, 36, 16, 28, 20, 24, 40]);
    return problem(`De câte ori este mai mare ${n} decât 4?`, n / 4,
      `„De câte ori mai mare” se află prin împărțire: ${n} : 4 = ${n / 4}. (Atenție: „cu cât mai mare” ar fi ${n} − 4 = ${n - 4}.)`, [n - 4, n / 4 + 1, n / 2]);
  },
];

const QUARTER_SOLVE = [
  // Numărul fetelor este un sfert din cel al băieților; băieți au fost 20. (pe pași)
  () => {
    const girls = randInt(3, 9); const boys = 4 * girls;
    return stepped(`La un concurs, numărul fetelor este un sfert din cel al băieților. Câți copii au participat la concurs, dacă băieți au fost ${boys}?`, [
      [`Câte fete au fost? ${boys} : 4 = ?`, girls, [boys - 4, girls + 1, boys / 2]],
      [`Câți copii în total? ${boys} + ${girls} = ?`, boys + girls, [boys, boys + girls + 1, boys - girls]],
    ], `Fete: ${boys} : 4 = ${girls}. În total: ${boys} + ${girls} = ${boys + girls} copii.`);
  },
  // Bunica are 16 mere și 24 de pere; le împarte în mod egal celor 4 nepoți. (pe pași)
  () => {
    const [a, b] = pick([[16, 24], [12, 20], [8, 16], [20, 12], [12, 16]]);
    return stepped(`Bunica are într-un coș ${a} mere și ${count(b, 'pere')}. Ea le împarte în mod egal celor 4 nepoți ai ei. Câte fructe primește fiecare?`, [
      [`Câte mere primește un nepot? ${a} : 4 = ?`, a / 4, [a / 4 + 1, a - 4, b / 4]],
      [`Câte pere primește un nepot? ${b} : 4 = ?`, b / 4, [b / 4 + 1, b - 4, a / 4]],
      [`Câte fructe primește fiecare? ${a / 4} + ${b / 4} = ?`, (a + b) / 4, [(a + b) / 4 + 1, a + b, (a + b) / 2]],
    ], `Mere: ${a} : 4 = ${a / 4}, pere: ${b} : 4 = ${b / 4}, în total ${(a + b) / 4} fructe. Al doilea mod: (${a} + ${b}) : 4 = ${a + b} : 4 = ${(a + b) / 4}.`);
  },
  // 24 de albine: un sfert pe salcâm, jumătate din cele rămase pe păpădii. (pe pași)
  () => {
    const total = pick([24, 16, 32, 40]); const quarter = total / 4; const rest = total - quarter;
    return stepped(`${count(total, 'albine')} zumzăie prin grădină. Un sfert din ele s-au așezat pe florile de salcâm, iar jumătate din cele rămase s-au așezat pe păpădii. Câte albine sunt pe păpădii?`, [
      [`Câte albine sunt pe salcâm? ${total} : 4 = ?`, quarter, [total / 2, quarter + 1, total - 4]],
      [`Câte albine au rămas? ${total} - ${quarter} = ?`, rest, [rest + 1, total, rest - 2]],
      [`Câte sunt pe păpădii? ${rest} : 2 = ?`, rest / 2, [rest / 2 + 1, rest - 2, quarter]],
    ], `Pe salcâm: ${total} : 4 = ${quarter}. Rămase: ${total} - ${quarter} = ${rest}. Pe păpădii: ${rest} : 2 = ${rest / 2}.`);
  },
  // Problemă cu o împărțire (ghiocei: 32 și 4).
  () => {
    const k = randInt(4, 10); const n = 4 * k;
    return problem(`Maria a cules ${count(n, 'ghiocei')} și face buchețele de câte 4 ghiocei. Câte buchețele face?`, k,
      `${n} : 4 = ${k} buchețele.`, [k + 1, n - 4, k - 1]);
  },
  // Problemă cu o împărțire și o adunare (ghiocei: 28 și 4). (pe pași)
  () => {
    const k = randInt(3, 9); const n = 4 * k;
    return stepped(`În grădină sunt ${count(n, 'ghiocei')} albi, iar brândușe sunt de 4 ori mai puține. Câte flori sunt în total?`, [
      [`Câte brândușe sunt? ${n} : 4 = ?`, k, [n - 4, k + 1, n / 2]],
      [`Câte flori în total? ${n} + ${k} = ?`, n + k, [n, n + k + 1, n - k]],
    ], `Brândușe: ${n} : 4 = ${k}. În total: ${n} + ${k} = ${n + k} flori.`);
  },
  // Află cât costă un obiect, dacă 4 obiecte la fel costă ...
  () => {
    const k = randInt(3, 10); const total = 4 * k;
    return problem(`4 caiete de același fel costă ${count(total, 'lei')}. Cât costă un caiet?`, k,
      `${total} : 4 = ${k} lei.`, [k + 4, total - 4, k + 1]);
  },
];

// ================= „Împărțirea la 5” =================
const FIFTH_DISCOVER = [
  // 5 grupuri de copii au lansat 20 de lampioane.
  () => {
    const k = randInt(2, 6); const n = 5 * k;
    return {
      ...problem(`La lăsarea serii, 5 grupuri de copii au lansat ${count(n, 'lampioane')}. Dacă fiecare grup a lansat același număr de lampioane, câte lampioane a lansat un grup?`, k,
        `${n} : 5 = ${k} lampioane. Verificare: ${k} × 5 = ${n}.`, [k + 1, n - 5, k - 1]),
      picture: { icon: '🏮', groups: 5, per: k },
    };
  },
  // Pippi Șosețica are 35 de lalele și face buchete de câte 5.
  () => {
    const k = randInt(2, 7); const n = 5 * k;
    return {
      ...problem(`Pippi Șosețica are ${count(n, 'lalele')}. Ea vrea să facă buchete de câte 5. Pentru câte buchete îi ajung lalelele?`, k,
        `${n} : 5 = ${k} buchete. Verificare: ${k} × 5 = ${n}.`, [k + 1, n - 5, k - 1]),
      picture: { icon: '🌷', groups: k, per: 5 },
    };
  },
  () => {
    const k = randInt(1, 10); const n = 5 * k;
    return problem(`${n} : 5 = ?  (Gândește-te: ce număr înmulțit cu 5 dă ${n}?)`, k,
      `${n} : 5 = ${k}, deoarece ${k} × 5 = ${n}.`, [k + 1, n - 5, k + 5]);
  },
  () => {
    const k = randInt(2, 10);
    return problem(`Ce număr, împărțit la 5, dă ${k}?`, 5 * k,
      `Verificăm cu înmulțirea: ${k} × 5 = ${5 * k}, deci ${5 * k} : 5 = ${k}.`, [k + 5, 2 * k, 5 * k + 5]);
  },
];

const FIFTH_APPLY = [
  // A. Scrie împărțirile corespunzătoare imaginilor (cireșe, fundițe).
  () => {
    const [n, icon, word] = pick([[10, '🍒', 'cireșe'], [15, '🎀', 'fundițe'], [20, '🍒', 'cireșe'], [25, '🎀', 'fundițe']]);
    return {
      ...problem(`În imagine sunt ${count(n, word)}, așezate în mod egal în 5 căsuțe. Câte ${word} sunt într-o căsuță? (${n} : 5 = ?)`, n / 5,
        `${n} : 5 = ${n / 5}, pentru că ${n / 5} × 5 = ${n}.`, [n / 5 + 1, n - 5, 5]),
      picture: { icon, groups: 5, per: n / 5 },
    };
  },
  // B. Ce numere ascund baloanele? 5 × 🎈 = 30, apoi 30 : 5 = 🎈 (pe pași).
  () => {
    const k = randInt(1, 10);
    return stepped(`Ce număr ascunde balonul? 5 × 🎈 = ${5 * k}, apoi ${5 * k} : 5 = 🎈`, [
      [`5 × 🎈 = ${5 * k}`, k, [k + 1, 5 * k, k + 5]],
      [`${5 * k} : 5 = 🎈`, k, [k + 1, 5 * k, k + 5]],
    ], `5 × ${k} = ${5 * k}, deci ${5 * k} : 5 = ${k}. Împărțirea e inversa înmulțirii!`);
  },
  // C. Află numerele de 5 ori mai mici decât 10, 40, 25, 15, 45, 30, 20, 5.
  () => {
    const n = pick([10, 40, 25, 15, 45, 30, 20, 5, 35, 50]);
    return problem(`Află numărul de 5 ori mai mic decât ${n}.`, n / 5,
      `„De 5 ori mai mic” înseamnă împărțire la 5: ${n} : 5 = ${n / 5}.`, [n - 5, n / 5 + 1, n / 5 + 5]);
  },
  // D. Încercuiește numerele care se împart exact la 5.
  () => {
    const answer = pick([30, 15, 20, 10, 45, 50, 5, 25, 35, 40]);
    const others = shuffle([17, 32, 22, 13, 28, 44, 36, 21, 19, 48]).slice(0, 3);
    return {
      text: 'Care dintre aceste numere se împarte exact la 5?',
      answer,
      explanation: `${answer} : 5 = ${answer / 5}. Numerele care se împart exact la 5 au cifra unităților 0 sau 5.`,
      choices: shuffle([answer, ...others]),
    };
  },
];

const FIFTH_PRACTICE = [
  // Află câtul împărțirilor.
  () => {
    const [n, d] = pick([[10, 5], [15, 5], [20, 5], [20, 4], [10, 2], [15, 3], [12, 3], [12, 4], [25, 5], [35, 5], [40, 5], [45, 5], [50, 5]]);
    return problem(`Află câtul: ${n} : ${d} = ?`, n / d, `${n} : ${d} = ${n / d}, pentru că ${n / d} × ${d} = ${n}.`, [n / d + 1, n / d - 1, n - d]);
  },
  // Calculează și compară: 18 : 2 ○ 40 : 5.
  () => {
    const [left, right] = pick([
      ['18 : 2', '40 : 5'], ['15 : 5', '15 : 3'], ['20 : 5', '30 : 5'], ['32 : 8', '25 : 5'], ['27 : 3', '45 : 5'],
      ['35 : 5', '28 : 4'], ['50 : 5', '45 : 5'],
    ]);
    const val = e => { const [a, b] = e.split(' : ').map(Number); return a / b; };
    const lv = val(left); const rv = val(right);
    const sign = lv < rv ? '<' : lv > rv ? '>' : '=';
    return {
      text: `Calculează și compară: ${left} ○ ${right}`,
      answer: sign,
      explanation: `${left} = ${lv} și ${right} = ${rv}, deci ${lv} ${sign} ${rv}.`,
      choices: SIGNS,
    };
  },
  // Ce numere se ascund sub lampioane? 🏮 : 5 = 6.
  () => {
    const d = pick([3, 4, 5, 5]); const k = pick([6, 7, 8]);
    return problem(`Ce număr se ascunde sub lampion? 🏮 : ${d} = ${k}`, d * k,
      `Căutăm numărul care împărțit la ${d} dă ${k}: ${k} × ${d} = ${d * k}.`, [k + d, d * k + d, d * k - d]);
  },
  // Completează casetele pentru a obține egalități: 24 : 3 = 40 : 🍎.
  () => {
    const [left, lv, right, answer] = pick([
      ['24 : 3', 8, '40 : ☐', 5], ['10 : 5', 2, '8 : ☐', 4], ['14 : 2', 7, '35 : ☐', 5], ['18 : 3', 6, '24 : ☐', 4],
      ['3 × 3', 9, '45 : ☐', 5], ['2 × 4', 8, '32 : ☐', 4], ['20 : 4', 5, '5 × ☐', 1], ['16 : 4', 4, '20 : ☐', 5],
    ]);
    const box = pick(HIDERS); const r = right.replace('☐', box);
    return problem(`Ce număr se ascunde sub ${box}, ca egalitatea să fie adevărată? ${left} = ${r}`, answer,
      `${left} = ${lv}, deci și ${r} trebuie să fie ${lv}: ${right.replace('☐', answer)} = ${lv}.`, [answer + 1, lv, answer + 2]);
  },
  // Rezolvă operațiile în ordinea în care sunt date (pe pași).
  () => {
    const [a, op1, b, op2, c] = pick([
      [20, ':', 4, ':', 5], [6, '×', 5, ':', 3], [4, '×', 10, ':', 5], [45, ':', 5, ':', 3], [35, ':', 5, '×', 7], [30, ':', 5, '×', 6],
      [50, ':', 5, ':', 2], [8, '×', 5, ':', 4],
    ]);
    const calc = (x, op, y) => (op === ':' ? x / y : x * y);
    const first = calc(a, op1, b); const result = calc(first, op2, c);
    return stepped(`Rezolvă operațiile în ordinea în care sunt date: ${a} ${op1} ${b} ${op2} ${c} = ?`, [
      [`${a} ${op1} ${b} = ?`, first, [first + 1, first - 1, a]],
      [`${first} ${op2} ${c} = ?`, result, [result + 1, result - 1, first]],
    ], `Întâi ${a} ${op1} ${b} = ${first}, apoi ${first} ${op2} ${c} = ${result}.`);
  },
  // Află numărul de 5 ori mai mic decât suma numerelor 28 și 17 (pe pași).
  () => {
    const [a, b] = pick([[28, 17], [12, 13], [16, 14], [21, 19], [33, 7], [26, 9]]);
    const sum = a + b;
    return stepped(`Află numărul de 5 ori mai mic decât suma numerelor ${a} și ${b}.`, [
      [`Cât este suma? ${a} + ${b} = ?`, sum, [sum + 1, sum - 1, sum + 10]],
      [`De 5 ori mai mic: ${sum} : 5 = ?`, sum / 5, [sum - 5, sum / 5 + 1, sum / 5 - 1]],
    ], `Suma: ${a} + ${b} = ${sum}. De 5 ori mai mic: ${sum} : 5 = ${sum / 5}.`);
  },
  // De câte ori este mai mare diferența numerelor 52 și 27 decât numărul 5? (pe pași)
  () => {
    const [a, b] = pick([[52, 27], [48, 18], [60, 25], [43, 23], [57, 22], [39, 19]]);
    const diff = a - b;
    return stepped(`De câte ori este mai mare diferența numerelor ${a} și ${b} decât numărul 5?`, [
      [`Cât este diferența? ${a} - ${b} = ?`, diff, [diff + 1, diff - 1, diff + 10]],
      [`De câte ori este mai mare decât 5? ${diff} : 5 = ?`, diff / 5, [diff - 5, diff / 5 + 1, diff / 5 - 1]],
    ], `Diferența: ${a} - ${b} = ${diff}. „De câte ori mai mare” se află prin împărțire: ${diff} : 5 = ${diff / 5}.`);
  },
];

const FIFTH_SOLVE = [
  // Un kilogram de portocale costă 5 lei. Câte kilograme cumpără Laura cu 25 de lei?
  () => {
    const k = randInt(2, 9); const money = 5 * k;
    return problem(`Un kilogram de portocale costă 5 lei. Câte kilograme de portocale poate cumpăra Laura, dacă are ${count(money, 'lei')}?`, k,
      `${money} : 5 = ${k} kilograme.`, [k + 1, money - 5, k - 1]);
  },
  // Toma are nevoie de 40 de baloane: pungi cu 5 baloane, apoi cu 4 baloane (pe pași).
  () => {
    const n = pick([20, 40]);
    return stepped(`Toma are nevoie de ${count(n, 'baloane')}. Câte pungi cu baloane trebuie să cumpere, dacă într-o pungă sunt 5 baloane? Dar dacă într-o pungă sunt 4 baloane?`, [
      [`Pungi cu câte 5 baloane: ${n} : 5 = ?`, n / 5, [n / 4, n / 5 + 1, n - 5]],
      [`Pungi cu câte 4 baloane: ${n} : 4 = ?`, n / 4, [n / 5, n / 4 + 1, n - 4]],
    ], `${n} : 5 = ${n / 5} pungi, iar ${n} : 4 = ${n / 4} pungi.`);
  },
  // Ana are 20 de creioane colorate. În câte grupe le poate repartiza în mod egal?
  () => {
    const per = pick([2, 4, 5, 10]);
    return problem(`Ana are 20 de creioane colorate. Le pune în grupe de câte ${per}. Câte grupe face?`, 20 / per,
      `20 : ${per} = ${20 / per} grupe.`, [20 / per + 1, 20 - per, per]);
  },
  // Matei: 43 de cărți, 8 pe primul raft, restul în mod egal pe 5 rafturi (pe pași).
  () => {
    const [total, first] = pick([[43, 8], [38, 3], [47, 7], [29, 4], [36, 6]]);
    const rest = total - first;
    return stepped(`Matei își aranjează cele ${count(total, 'cărți')} în bibliotecă. El așază ${count(first, 'cărți')} pe primul raft, iar cărțile rămase le împarte în mod egal pe 5 rafturi. Câte cărți vor fi pe ultimul raft?`, [
      [`Câte cărți au rămas? ${total} - ${first} = ?`, rest, [rest + 1, rest - 1, total]],
      [`Câte cărți pe un raft? ${rest} : 5 = ?`, rest / 5, [rest / 5 + 1, rest - 5, rest / 5 - 1]],
    ], `Rămase: ${total} - ${first} = ${rest}. Pe fiecare raft (deci și pe ultimul): ${rest} : 5 = ${rest / 5} cărți.`);
  },
  // Lampioanele din magazin: 9 cutii cu câte 6, 3 zile câte 8, restul în 5 zile (pe pași).
  () => {
    const total = 54; const sold = 24; const rest = total - sold;
    return stepped('La un magazin au fost aduse 9 cutii cu câte 6 lampioane fiecare. În primele 3 zile s-au vândut câte 8 lampioane pe zi. '
      + 'Restul au fost vândute în mod egal în următoarele 5 zile. Câte lampioane s-au vândut în ultima zi?', [
      ['Câte lampioane au fost aduse? 9 × 6 = ?', total, [56, 45, 48]],
      ['Câte s-au vândut în primele 3 zile? 3 × 8 = ?', sold, [21, 32, 11]],
      [`Câte au rămas? ${total} - ${sold} = ?`, rest, [32, 20, 28]],
      [`Câte pe zi în următoarele 5 zile? ${rest} : 5 = ?`, rest / 5, [5, 7, 25]],
    ], `Aduse: 9 × 6 = 54. Vândute în 3 zile: 3 × 8 = 24. Rămase: 54 - 24 = 30. În ultima zi: 30 : 5 = 6 lampioane.`);
  },
  // Problemă cu prețuri: 5 obiecte la fel.
  () => {
    const k = randInt(2, 9); const total = 5 * k;
    const [item, items] = pick([['caiet', 'caiete'], ['pix', 'pixuri'], ['balon', 'baloane']]);
    return problem(`5 ${items} de același fel costă ${count(total, 'lei')}. Cât costă un ${item}?`, k,
      `${total} : 5 = ${k} lei.`, [k + 5, total - 5, k + 1]);
  },
];

const BY_LEVEL = {
  imp1: DISCOVER, imp2: APPLY, imp3: PRACTICE, imp4: SOLVE,
  impd1: HALF_DISCOVER, impd2: HALF_APPLY, impd3: HALF_PRACTICE, impd4: HALF_SOLVE,
  impt1: THIRD_DISCOVER, impt2: THIRD_APPLY, impt3: THIRD_PRACTICE, impt4: THIRD_SOLVE,
  impq1: QUARTER_DISCOVER, impq2: QUARTER_APPLY, impq3: QUARTER_PRACTICE, impq4: QUARTER_SOLVE,
  impc1: FIFTH_DISCOVER, impc2: FIFTH_APPLY, impc3: FIFTH_PRACTICE, impc4: FIFTH_SOLVE,
};

export function isDivisionLevel(level) {
  return DIVISION_LEVELS.includes(level) || HALF_LEVELS.includes(level) || THIRD_LEVELS.includes(level)
    || QUARTER_LEVELS.includes(level) || FIFTH_LEVELS.includes(level);
}

export function buildDivisionProblem(level) {
  return { ...pick(BY_LEVEL[level])(), badge: BADGES[level] };
}
