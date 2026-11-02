// „Împărțirea” — lecția din manual: împărțirea ca scădere repetată și
// împărțirea ca operație inversă înmulțirii. Patru secțiuni: Descopăr, Aplic,
// Exersez, Rezolv probleme. Unele exerciții se rezolvă pe pași (ca la Evaluare).
import { makeAnswers } from './data';
import { tr, getLang } from './i18n';

// Lecțiile din „Tabla împărțirii”: „Împărțirea” (imp1–4) și „Împărțirea la 2” (impd1–4).
export const DIVISION_LEVELS = ['imp1', 'imp2', 'imp3', 'imp4', 'imp5', 'imp6', 'imp7', 'imp8'];
export const HALF_LEVELS = ['impd1', 'impd2', 'impd3', 'impd4'];
export const THIRD_LEVELS = ['impt1', 'impt2', 'impt3', 'impt4'];
export const QUARTER_LEVELS = ['impq1', 'impq2', 'impq3', 'impq4'];
export const FIFTH_LEVELS = ['impc1', 'impc2', 'impc3', 'impc4'];
export const DIV6_LEVELS = ['impsa1', 'impsa2', 'impsa3', 'impsa4'];
export const DIV7_LEVELS = ['impse1', 'impse2', 'impse3', 'impse4'];
export const DIV8_LEVELS = ['impo1', 'impo2', 'impo3', 'impo4'];
export const DIV9_LEVELS = ['impn1', 'impn2', 'impn3', 'impn4'];
const BADGES = {
  imp1: '🔍 Descopăr', imp2: '✏️ Aplic', imp3: '⭐ Exersez', imp4: '🧩 Rezolv probleme',
  imp5: '🔟 Împărțirea la 10', imp6: '☝️ Cazuri speciale', imp7: '✅ Proba', imp8: '🧩 Rezolv și verific',
  impd1: '🔍 Descopăr', impd2: '✏️ Aplic', impd3: '⭐ Exersez', impd4: '🧩 Rezolv probleme',
  impt1: '🔍 Descopăr', impt2: '✏️ Aplic', impt3: '⭐ Exersez', impt4: '🧩 Rezolv probleme',
  impq1: '🔍 Descopăr', impq2: '✏️ Aplic', impq3: '⭐ Exersez', impq4: '🧩 Rezolv probleme',
  impc1: '🔍 Descopăr', impc2: '✏️ Aplic', impc3: '⭐ Exersez', impc4: '🧩 Rezolv probleme',
  impsa1: '🔍 Descopăr', impsa2: '✏️ Aplic', impsa3: '⭐ Exersez', impsa4: '🧩 Rezolv probleme',
  impse1: '🔍 Descopăr', impse2: '✏️ Aplic', impse3: '⭐ Exersez', impse4: '🧩 Rezolv probleme',
  impo1: '🔍 Descopăr', impo2: '✏️ Aplic', impo3: '⭐ Exersez', impo4: '🧩 Rezolv probleme',
  impn1: '🔍 Descopăr', impn2: '✏️ Aplic', impn3: '⭐ Exersez', impn4: '🧩 Rezolv probleme',
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
  if (getLang() === 'en') return `${n} ${tr(word)}`;
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
    return problem(tr('{girl} a cules {v0}. Ea vrea să le împartă, în mod egal, celor {divisor} prietene ale sale. ', { girl, v0: count(dividend, 'păpădii'), divisor })
      + tr('Câte păpădii va primi fiecare?'), quotient,
      tr('Scădem câte {divisor} până ajungem la 0: {v0}. Am scăzut de {quotient} ori, deci ', { divisor, v0: repeatedSubtraction(dividend, divisor), quotient })
      + `${dividend} : ${divisor} = ${quotient}.`, [quotient + 1, quotient - 1, dividend - divisor]);
  },
  // Din 12 am scăzut de 4 ori câte 3 și am obținut 0.
  () => {
    const { dividend, divisor, quotient } = division(2, 5, 2, 6);
    return problem(tr('{v0}. De câte ori am scăzut {divisor}?', { v0: repeatedSubtraction(dividend, divisor), divisor }), quotient,
      tr('Am scăzut {divisor} de {quotient} ori, deci {dividend} : {v0} = {v1}.', { divisor, quotient, dividend, v0: divisor, v1: quotient }), [quotient + 1, divisor, quotient - 1]);
  },
  // Pe fiecare din cele 6 flori s-au așezat câte doi gândăcei.
  () => {
    const flowers = randInt(3, 9); const per = randInt(2, 4);
    return problem(tr('Pe fiecare din cele {flowers} flori s-au așezat câte {per} gândăcei. Câți gândăcei sunt în total?', { flowers, per }), flowers * per,
      tr('{flowers} × {per} = {v0} gândăcei.', { flowers, per, v0: flowers * per }), [flowers + per, flowers * per + per, flowers * per - per]);
  },
  // Cei 12 gândăcei s-au împărțit în mod egal în 6 grupe.
  () => {
    const { dividend, divisor, quotient } = division(2, 6, 3, 6);
    return problem(tr('{v0} se împart în mod egal în {divisor} grupe. Câți gândăcei vor fi în fiecare grupă?', { v0: count(dividend, 'gândăcei'), divisor }), quotient,
      tr('Împărțim în mod egal: {dividend} : {divisor} = {quotient}, pentru că {v0} × {v1} = {v2}.', { dividend, divisor, quotient, v0: divisor, v1: quotient, v2: dividend }),
      [quotient + 1, divisor, dividend - divisor]);
  },
  // Cei 12 gândăcei se grupează câte 2. Câte grupe se vor forma?
  () => {
    const { dividend, divisor, quotient } = division(2, 5, 2, 9);
    return problem(tr('{v0} se așază în grupe, câte {divisor} gândăcei în fiecare grupă. ', { v0: count(dividend, 'gândăcei'), divisor })
      + tr('Câte grupe se formează?'), quotient,
      tr('Formăm grupe de câte {divisor}: {dividend} : {v0} = {quotient} grupe.', { divisor, dividend, v0: divisor, quotient }), [quotient + 1, divisor, quotient - 1]);
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
      text: tr('Ce împărțire se potrivește cu scăderea repetată {v0}?', { v0: repeatedSubtraction(dividend, divisor) }),
      answer: right,
      explanation: tr('Am pornit de la {dividend}, am scăzut câte {divisor} și am scăzut de {quotient} ori: {right}.', { dividend, divisor, quotient, right }),
      choices: shuffle([right, ...wrong]),
    };
  },
  // B. Află de câte ori se poate scădea 5 din 25.
  () => {
    const [divisor, dividend] = pick([[5, 25], [10, 60], [9, 36], [4, 28], [7, 21], [8, 40], [6, 30], [3, 27]]);
    const quotient = dividend / divisor;
    return problem(tr('De câte ori se poate scădea {divisor} din {dividend}?', { divisor, dividend }), quotient,
      tr('{v0}. Am scăzut de {quotient} ori, deci {dividend} : {divisor} = {v1}.', { v0: repeatedSubtraction(dividend, divisor), quotient, dividend, divisor, v1: quotient }),
      [quotient + 1, quotient - 1, dividend - divisor]);
  },
  // C. Transformă împărțirile în scăderi repetate și află câtul.
  () => {
    const [dividend, divisor] = pick([[20, 5], [9, 3], [14, 2], [24, 6], [16, 8], [35, 7], [32, 4], [18, 3]]);
    const quotient = dividend / divisor;
    return problem(tr('Transformă în scăderi repetate și află câtul: {dividend} : {divisor} = ?', { dividend, divisor }), quotient,
      tr('{v0}, deci {dividend} : {divisor} = {quotient}.', { v0: repeatedSubtraction(dividend, divisor), dividend, divisor, quotient }), [quotient + 1, quotient - 1, divisor]);
  },
  // D. 40 de buburuze, câte 10 pe o frunză.
  () => {
    const per = pick([10, 5, 4, 2]); const leaves = randInt(2, per === 10 ? 6 : 8);
    return problem(tr('În poieniță au venit {v0}. Ele se așază câte {per} pe o frunză. Pe câte frunze se așază toate buburuzele?', { v0: count(per * leaves, 'buburuze'), per }),
      leaves, tr('{v0} : {per} = {leaves} frunze, pentru că {v1} × {v2} = {v3}.', { v0: per * leaves, per, leaves, v1: leaves, v2: per, v3: per * leaves }), [leaves + 1, per, leaves - 1]);
  },
  // Provocare: 12 obiecte împărțite în grupe de câte 2, apoi 3, apoi 4.
  () => {
    const size = pick([2, 3, 4, 6]);
    return problem(tr('Ai 12 obiecte mici (bețișoare, dopuri, nasturi). Le împarți în grupe de câte {size}. Câte grupe obții?', { size }), 12 / size,
      tr('12 : {size} = {v0}, pentru că {v1} × {v2} = 12.', { size, v0: 12 / size, v1: 12 / size, v2: size }), [12 / size + 1, size, 12 - size]);
  },
];

// ---------- ⭐ Exersez ----------
const PRACTICE = [
  // Află câtul și argumentează: 18 : 9 = 2 pentru că 2 × 9 = 18.
  () => {
    const { dividend, divisor, quotient } = division(2, 10, 2, 9);
    return problem(tr('Află câtul: {dividend} : {divisor} = ?', { dividend, divisor }), quotient,
      tr('{dividend} : {divisor} = {quotient}, pentru că {v0} × {v1} = {v2}.', { dividend, divisor, quotient, v0: quotient, v1: divisor, v2: dividend }), [quotient + 1, quotient - 1, divisor]);
  },
  // Numărul ascuns: 6 × 🍎 = 42, apoi 42 : 6 = 🍎 (pe pași).
  () => {
    const { dividend, divisor, quotient } = division(3, 9, 2, 9); const box = pick(HIDERS);
    return stepped(tr('Ce număr se ascunde sub {box}? {divisor} × {v0} = {dividend} și {v1} : {v2} = {v3}', { box, divisor, v0: box, dividend, v1: dividend, v2: divisor, v3: box }), [
      [`${divisor} × ${box} = ${dividend}`, quotient, [quotient + 1, quotient - 1, divisor]],
      [`${dividend} : ${divisor} = ${box}`, quotient, [quotient + 1, divisor, quotient - 1]],
    ], tr('{divisor} × {quotient} = {dividend}, deci {v0} : {v1} = {v2}. Împărțirea e inversa înmulțirii!', { divisor, quotient, dividend, v0: dividend, v1: divisor, v2: quotient }));
  },
  // Operațiile cu numerele de pe flori: 7, 9, 63.
  () => {
    const a = randInt(3, 9); const b = randInt(3, 9); const p = a * b;
    const [text, answer, explanation] = pick([
      [`${a} × ${b} = ?`, p, `${a} × ${b} = ${p}.`],
      [`${b} × ${a} = ?`, p, tr('Ordinea factorilor nu contează: {b} × {a} = {p}.', { b, a, p })],
      [`${p} : ${b} = ?`, a, tr('{p} : {b} = {a}, pentru că {v0} × {v1} = {v2}.', { p, b, a, v0: a, v1: b, v2: p })],
      [`${p} : ${a} = ?`, b, tr('{p} : {a} = {b}, pentru că {v0} × {v1} = {v2}.', { p, a, b, v0: a, v1: b, v2: p })],
    ]);
    return problem(tr('Cu numerele de pe flori {a}, {b} și {p}: {text}', { a, b, p, text }), answer, explanation, [answer + 1, answer - 1, p - answer]);
  },
  // Deîmpărțit, împărțitor, cât: cunoști doi termeni și îl afli pe al treilea.
  () => {
    // Împărțitorul diferit de cât, ca răspunsul să nu fie deja scris în întrebare (ex. 9 : 3 = 3).
    let d = division(2, 9, 2, 9);
    while (d.divisor === d.quotient) d = division(2, 9, 2, 9);
    const { dividend, divisor, quotient } = d;
    const kind = pick(['cat', 'deimpartit', 'impartitor']);
    if (kind === 'cat') {
      return problem(tr('Deîmpărțitul este {dividend}, iar împărțitorul este {divisor}. Care este câtul?', { dividend, divisor }), quotient,
        tr('Câtul este rezultatul împărțirii: {dividend} : {divisor} = {quotient}.', { dividend, divisor, quotient }), [quotient + 1, quotient - 1, dividend - divisor]);
    }
    if (kind === 'deimpartit') {
      return problem(tr('Împărțitorul este {divisor}, iar câtul este {quotient}. Care este deîmpărțitul?', { divisor, quotient }), dividend,
        tr('Deîmpărțitul se află prin înmulțire: {quotient} × {divisor} = {dividend}. Verificare: {v0} : {v1} = {v2}.', { quotient, divisor, dividend, v0: dividend, v1: divisor, v2: quotient }),
        [divisor + quotient, dividend + divisor, dividend - quotient]);
    }
    return problem(tr('Deîmpărțitul este {dividend}, iar câtul este {quotient}. Care este împărțitorul?', { dividend, quotient }), divisor,
      tr('Împărțitorul se află prin împărțire: {dividend} : {quotient} = {divisor}. Verificare: {v0} : {v1} = {v2}.', { dividend, quotient, divisor, v0: dividend, v1: divisor, v2: quotient }),
      [divisor + 1, divisor - 1, dividend - quotient]);
  },
  // Factorul lipsă ascuns: 🍎 × 5 = 50.
  () => {
    const { dividend, divisor, quotient } = division(2, 10, 2, 10); const box = pick(HIDERS);
    return problem(tr('Ce număr se ascunde sub {box}? {v0} × {divisor} = {dividend}', { box, v0: box, divisor, dividend }), quotient,
      tr('Căutăm numărul care înmulțit cu {divisor} dă {dividend}: {v0} : {v1} = {quotient}.', { divisor, dividend, v0: dividend, v1: divisor, quotient }), [quotient + 1, quotient - 1, divisor]);
  },
];

// ---------- 🧩 Rezolv probleme ----------
const SOLVE = [
  // Împărțire în mod egal.
  () => {
    const { dividend, divisor, quotient } = division(2, 8, 2, 9);
    const [things, who] = pick([['creioane', 'copii'], ['bomboane', 'prieteni'], ['mere', 'coșuri'], ['cărți', 'rafturi']]);
    return problem(tr('{v0} se împart în mod egal la {divisor} {who}. Câte {things} revin fiecăruia?', { v0: count(dividend, things), divisor, who, things }), quotient,
      tr('{dividend} : {divisor} = {quotient}, pentru că {v0} × {v1} = {v2}.', { dividend, divisor, quotient, v0: quotient, v1: divisor, v2: dividend }), [quotient + 1, divisor, dividend - divisor]);
  },
  // Împărțire prin cuprindere: câte grupe de câte…
  () => {
    const { dividend, divisor, quotient } = division(2, 9, 2, 8);
    const [things, bag] = pick([['ouă', 'cofraje'], ['flori', 'buchete'], ['nasturi', 'cutiuțe'], ['biluțe', 'pungi']]);
    return problem(tr('{v0} se pun câte {divisor} în {bag}. Câte {v1} se umplu?', { v0: count(dividend, things), divisor, bag, v1: bag }), quotient,
      `${dividend} : ${divisor} = ${quotient} ${tr(bag)}.`, [quotient + 1, divisor, quotient - 1]);
  },
  // Pe pași: are niște obiecte, mai primește, apoi împarte.
  () => {
    const divisor = randInt(2, 6); const quotient = randInt(3, 8); const total = divisor * quotient;
    const had = randInt(5, total - 3); const got = total - had;
    const girl = pick(GIRLS);
    return stepped(tr('{girl} are {v0} și mai primește {got}. Le împarte în mod egal celor {divisor} prietene. Câte primește fiecare?', { girl, v0: count(had, 'abțibilduri'), got, divisor }), [
      ['Câte abțibilduri are în total?', total, [had, total + divisor, total - 1]],
      [tr('Câte primește fiecare prietenă? {total} : {divisor} = ?', { total, divisor }), quotient, [quotient + 1, divisor, total - divisor]],
    ], tr('În total: {had} + {got} = {total}. Fiecare primește {v0} : {divisor} = {quotient}.', { had, got, total, v0: total, divisor, quotient }));
  },
  // Pe pași: înmulțire, apoi împărțire (operații inverse).
  () => {
    // Alegem întâi câți copii sunt, ca prăjiturile să se împartă exact.
    const kids = pick([2, 3, 4]); const per = kids * randInt(1, 2); const boxes = randInt(2, 5); const total = boxes * per;
    return stepped(tr('Sunt {boxes} cutii cu câte {per} prăjituri. Toate prăjiturile se împart în mod egal la {kids} copii. Câte prăjituri primește fiecare copil?', { boxes, per, kids }), [
      ['Câte prăjituri sunt în total?', total, [boxes + per, total + per, total - per]],
      [tr('Câte primește fiecare copil? {total} : {kids} = ?', { total, kids }), total / kids, [total / kids + 1, kids, total - kids]],
    ], tr('Prăjituri: {boxes} × {per} = {total}. Fiecare copil: {v0} : {kids} = {v1}.', { boxes, per, total, v0: total, kids, v1: total / kids }));
  },
  // În poieniță au venit 40 de buburuze. Ele se așază câte 10 pe o frunză.
  () => {
    const per = pick([10, 5, 4, 3, 2]); const leaves = randInt(3, per === 10 ? 9 : 8);
    const total = per * leaves;
    return problem(tr('În poieniță au venit {v0}. Ele se așază câte {per} pe o frunză. ', { v0: count(total, 'buburuze'), per })
      + tr('Pe câte frunze se așază toate buburuzele?'), leaves,
      tr('{total} : {per} = {leaves} frunze, pentru că {v0} × {v1} = {v2}.', { total, per, leaves, v0: leaves, v1: per, v2: total }), [leaves + 1, leaves - 1, total - per]);
  },
];

// ================= „Împărțirea la 2” =================
const EVEN_TO_20 = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

const HALF_DISCOVER = [
  // Iepurica a pregătit 8 coronițe, împărțite în mod egal pe cele două mese.
  () => {
    const n = pick([6, 8, 10, 12, 14, 16]);
    return problem(tr('Pentru petrecerea de primăvară, Iepurica a pregătit {v0} de flori. ', { v0: count(n, 'coronițe') })
      + tr('Ele au fost împărțite în mod egal pe cele două mese. Câte coronițe sunt pe o masă?'), n / 2,
      tr('{v0}, deci {n} : 2 = {v1}, deoarece {v2} × 2 = {v3}. Pe fiecare masă e jumătate din coronițe.', { v0: repeatedSubtraction(n, 2), n, v1: n / 2, v2: n / 2, v3: n }),
      [n / 2 + 1, n - 2, n / 2 - 1]);
  },
  // Cele 10 berze s-au așezat câte 2 într-un cuib.
  () => {
    const n = pick([6, 8, 10, 12, 14, 16, 18]);
    return problem(tr('Cele {v0} s-au așezat câte 2 într-un cuib. În câte cuiburi s-au așezat toate berzele?', { v0: count(n, 'berze') }), n / 2,
      tr('{v0}, deci {n} : 2 = {v1} cuiburi, pentru că {v2} × 2 = {v3}.', { v0: repeatedSubtraction(n, 2), n, v1: n / 2, v2: n / 2, v3: n }), [n / 2 + 1, n - 2, n / 2 - 1]);
  },
  // Verificarea: 8 : 2 = 4 pentru că 4 × 2 = 8.
  () => {
    const n = pick(EVEN_TO_20);
    return problem(tr('{n} : 2 = ?  (Gândește-te: ce număr înmulțit cu 2 dă {v0}?)', { n, v0: n }), n / 2,
      tr('{n} : 2 = {v0}, deoarece {v1} × 2 = {v2}.', { n, v0: n / 2, v1: n / 2, v2: n }), [n / 2 + 1, n - 2, n / 2 - 1]);
  },
  // Jumătatea numărului.
  () => {
    const n = pick(EVEN_TO_20);
    return problem(tr('Care este jumătatea numărului {n}?', { n }), n / 2,
      tr('Jumătatea înseamnă împărțirea la 2: {n} : 2 = {v0}.', { n, v0: n / 2 }), [n / 2 + 1, n * 2, n - 2]);
  },
];

// Inversul: ce număr, împărțit la 2, dă k? (verificare prin înmulțire)
const HALF_INVERSE = [
  () => {
    const k = randInt(2, 10);
    return problem(tr('Ce număr, împărțit la 2, dă {k}?', { k }), 2 * k,
      tr('Verificăm cu înmulțirea: {k} × 2 = {v0}, deci {v1} : 2 = {v2}.', { k, v0: 2 * k, v1: 2 * k, v2: k }), [k + 2, k, 2 * k + 2]);
  },
  () => {
    const k = randInt(2, 10);
    return problem(tr('Află numărul a cărui jumătate este {k}.', { k }), 2 * k,
      tr('Dacă jumătatea este {k}, numărul este de 2 ori mai mare: {v0} × 2 = {v1}.', { k, v0: k, v1: 2 * k }), [k + 2, k, 2 * k + 2]);
  },
];
HALF_DISCOVER.push(HALF_INVERSE[0]);

const HALF_APPLY = [
  // A. Ce număr ascunde fluturașul: 2 × 🦋 = 6 și 6 : 2 = 🦋 (pe pași).
  () => {
    const k = randInt(1, 10);
    return stepped(tr('Află ce număr ascunde fluturașul: 2 × 🦋 = {v0}, apoi {v1} : 2 = 🦋', { v0: 2 * k, v1: 2 * k }), [
      [`2 × 🦋 = ${2 * k}`, k, [k + 1, 2 * k, k - 1 >= 0 ? k - 1 : k + 2]],
      [`${2 * k} : 2 = 🦋`, k, [k + 1, 2 * k, k + 2]],
    ], tr('2 × {k} = {v0}, deci {v1} : 2 = {v2}. Împărțirea e inversa înmulțirii!', { k, v0: 2 * k, v1: 2 * k, v2: k }));
  },
  // B. Află numerele de 2 ori mai mici decât 14, 20, 16, 8, 10, 4, 6, 18.
  () => {
    const n = pick([14, 20, 16, 8, 10, 4, 6, 18]);
    return problem(tr('Află numărul de 2 ori mai mic decât {n}.', { n }), n / 2,
      tr('„De 2 ori mai mic” înseamnă împărțire la 2: {n} : 2 = {v0}.', { n, v0: n / 2 }), [n - 2, n * 2, n / 2 + 1]);
  },
  // C. Tabelul cu jumătatea numărului.
  () => {
    const n = pick([6, 16, 12, 18, 2, 8, 10, 14]);
    return problem(tr('Care este jumătatea numărului {n}?', { n }), n / 2,
      tr('Jumătatea lui {n} este {v0} : 2 = {v1}.', { n, v0: n, v1: n / 2 }), [n - 2, n / 2 + 1, n * 2]);
  },
];

HALF_APPLY.push(HALF_INVERSE[1]);

const HALF_PRACTICE = [
  // Află câtul împărțirilor.
  () => {
    const n = pick(EVEN_TO_20);
    return problem(tr('Află câtul: {n} : 2 = ?', { n }), n / 2, tr('{n} : 2 = {v0}, pentru că {v1} × 2 = {v2}.', { n, v0: n / 2, v1: n / 2, v2: n }), [n / 2 + 1, n / 2 - 1, n - 2]);
  },
  // Micșorează de 2 ori numerele pare de două cifre, mai mici decât 20.
  () => {
    const n = pick([10, 12, 14, 16, 18]);
    return problem(tr('Micșorează de 2 ori numărul {n}.', { n }), n / 2, tr('„Micșorează de 2 ori” înseamnă {n} : 2 = {v0}.', { n, v0: n / 2 }), [n - 2, n / 2 + 1, n * 2]);
  },
  // Completează împărțirile cu numerele ascunse sub lalele: 🌷 : 2 = 5.
  () => {
    const k = randInt(1, 10);
    return problem(tr('Ce număr se ascunde sub lalea? 🌷 : 2 = {k}', { k }), 2 * k,
      tr('Căutăm numărul care împărțit la 2 dă {k}: {v0} × 2 = {v1}, deci {v2} : 2 = {v3}.', { k, v0: k, v1: 2 * k, v2: 2 * k, v3: k }), [k + 2, k, 2 * k + 2]);
  },
  // Află numerele a căror jumătate este 3, 4, 7…
  () => {
    const k = pick([3, 4, 7, 6, 10, 5, 8, 2]);
    return problem(tr('Află numărul a cărui jumătate este {k}.', { k }), 2 * k,
      tr('Dacă jumătatea este {k}, numărul este de 2 ori mai mare: {v0} × 2 = {v1}.', { k, v0: k, v1: 2 * k }), [k / 2 | 0 || k + 1, k + 2, 2 * k + 2]);
  },
  // Numerele care se împart exact la 2 sunt pare.
  () => {
    const even = 2 * randInt(2, 10);
    const odd = new Set();
    while (odd.size < 3) odd.add(2 * randInt(2, 9) + 1);
    return {
      text: 'Care dintre aceste numere se împarte exact la 2?',
      answer: even,
      explanation: tr('Numerele care se împart exact la 2 sunt numerele pare. Doar {even} este par: {v0} : 2 = {v1}.', { even, v0: even, v1: even / 2 }),
      choices: shuffle([even, ...odd]),
    };
  },
];

const HALF_SOLVE = [
  // Două caiete de același fel costă 8 lei. Cât costă un caiet?
  () => {
    const n = pick([6, 8, 10, 12, 14, 16, 18]);
    const [item, items] = pick([['caiet', 'caiete'], ['creion', 'creioane'], ['suc', 'sucuri']]);
    return problem(tr('Două {items} de același fel costă {n} lei. Cât costă un {item}?', { items, n, item }), n / 2,
      tr('Prețul unui {item} e jumătate: {n} : 2 = {v0} lei.', { item, n, v0: n / 2 }), [n - 2, n * 2, n / 2 + 1]);
  },
  // Miruna are 14 lalele. Jumătate dăruiește mamei, restul bunicii (pe pași).
  () => {
    const n = pick([8, 10, 12, 14, 16, 18, 20]);
    return stepped(tr('Miruna are {v0}. Jumătate dintre ele le dăruiește mamei, iar restul le dăruiește bunicii. ', { v0: count(n, 'lalele') })
      + tr('Câte lalele primește bunica?'), [
      [tr('Câte lalele primește mama? (jumătate din {n})', { n }), n / 2, [n - 2, n / 2 + 1, n * 2]],
      [tr('Câte lalele rămân pentru bunica? {n} - {v0} = ?', { n, v0: n / 2 }), n / 2, [n, n / 2 + 1, n - 2]],
    ], tr('Mama primește {n} : 2 = {v0}. Bunica primește restul: {v1} - {v2} = {v3} (tot jumătate!).', { n, v0: n / 2, v1: n, v2: n / 2, v3: n / 2 }));
  },
  // Câte sticle de 2 litri se pot umple cu 12 litri de lapte? Dar cu 18?
  () => {
    const l = pick([8, 10, 12, 14, 16, 18, 20]);
    return problem(tr('Câte sticle de 2 litri se pot umple cu {l} litri de lapte?', { l }), l / 2,
      tr('Fiecare sticlă ia 2 litri: {l} : 2 = {v0} sticle.', { l, v0: l / 2 }), [l - 2, l / 2 + 1, l * 2]);
  },
  // Adina are 14 cercei roz și 10 albaștri. Câte perechi în total? (pe pași)
  () => {
    const pink = pick([8, 10, 12, 14, 16]); const blue = pick([6, 8, 10, 12]);
    return stepped(tr('Adina are {v0} roz și {v1} albaștri. Câte perechi de cercei are în total?', { v0: count(pink, 'cercei'), v1: count(blue, 'cercei') }), [
      [tr('Câte perechi de cercei roz are? {pink} : 2 = ?', { pink }), pink / 2, [pink - 2, pink / 2 + 1, pink * 2]],
      [tr('Câte perechi de cercei albaștri are? {blue} : 2 = ?', { blue }), blue / 2, [blue - 2, blue / 2 + 1, blue * 2]],
      [tr('Câte perechi are în total? {v0} + {v1} = ?', { v0: pink / 2, v1: blue / 2 }), (pink + blue) / 2, [pink + blue, pink / 2, (pink + blue) / 2 + 1]],
    ], tr('Roz: {pink} : 2 = {v0} perechi. Albaștri: {blue} : 2 = {v1} perechi. Total: {v2} + {v3} = {v4}.', { pink, v0: pink / 2, blue, v1: blue / 2, v2: pink / 2, v3: blue / 2, v4: (pink + blue) / 2 }));
  },
  // Berzele și cuiburile, iepurica și mesele (variante noi).
  () => {
    const n = pick([12, 14, 16, 18, 20]);
    const [what, where] = pick([['pantofi', 'perechi'], ['mănuși', 'perechi'], ['șosete', 'perechi']]);
    return problem(tr('În dulap sunt {v0}. Câte {where} de {what} sunt?', { v0: count(n, what), where, what }), n / 2,
      tr('O pereche are 2 bucăți: {n} : 2 = {v0} perechi.', { n, v0: n / 2 }), [n - 2, n / 2 + 1, n * 2]);
  },
];

// ================= „Împărțirea la 3” =================
const OPERATIONS = ['+', '−', '×', ':'];
const SIGNS = ['<', '>', '='];

const THIRD_DISCOVER = [
  // Carla și Răzvan au 3 căsuțe pentru păsărele și 12 bețișoare colorate.
  () => {
    const k = randInt(2, 8); const n = 3 * k;
    return problem(tr('Carla și Răzvan au făcut 3 căsuțe identice pentru păsărele. Vor folosi pentru decor {v0} colorate. ', { v0: count(n, 'bețișoare') })
      + tr('Câte bețișoare va avea fiecare căsuță?'), k,
      tr('{n} : 3 = {k} bețișoare, deoarece {v0} × 3 = {v1}.', { n, k, v0: k, v1: n }), [k + 1, n - 3, k - 1]);
  },
  // Echipa Mariei a adus 9 ilustrații; pentru fiecare afiș trebuie 3.
  () => {
    const k = randInt(2, 9); const n = 3 * k;
    return problem(tr('Echipa Mariei a adus {v0}. Pentru fiecare afiș are nevoie de câte 3 ilustrații. ', { v0: count(n, 'ilustrații') })
      + tr('Pentru câte afișe vor ajunge?'), k,
      tr('{n} : 3 = {k} afișe, deoarece {v0} × 3 = {v1}.', { n, k, v0: k, v1: n }), [k + 1, n - 3, k - 1]);
  },
  () => {
    const k = randInt(1, 10); const n = 3 * k;
    return problem(tr('{n} : 3 = ?  (Gândește-te: ce număr înmulțit cu 3 dă {v0}?)', { n, v0: n }), k,
      tr('{n} : 3 = {k}, deoarece {v0} × 3 = {v1}.', { n, k, v0: k, v1: n }), [k + 1, n - 3, k + 3]);
  },
  () => {
    const k = randInt(2, 10);
    return problem(tr('Ce număr, împărțit la 3, dă {k}?', { k }), 3 * k,
      tr('Verificăm cu înmulțirea: {k} × 3 = {v0}, deci {v1} : 3 = {v2}.', { k, v0: 3 * k, v1: 3 * k, v2: k }), [k + 3, 2 * k, 3 * k + 3]);
  },
];

const THIRD_APPLY = [
  // A. Scrie împărțirile corespunzătoare imaginilor.
  () => {
    const [n, thing] = pick([[6, 'trifoi'], [12, 'flori'], [9, 'trifoi'], [15, 'flori'], [18, 'flori']]);
    return {
      ...problem(tr('În imagine sunt {n} {thing}, așezate în 3 grupe egale. Câte {v0} sunt într-o grupă? ({v1} : 3 = ?)', { n, thing, v0: thing, v1: n }), n / 3,
        tr('{n} : 3 = {v0}, pentru că {v1} × 3 = {v2}.', { n, v0: n / 3, v1: n / 3, v2: n }), [n / 3 + 1, n - 3, 3]),
      picture: { icon: thing === 'trifoi' ? '☘️' : '🌸', groups: 3, per: n / 3 },
    };
  },
  // B. Află numerele care lipsesc (ascunse sub o floare, minge sau fruct): 3 × 🌸 = 6, apoi 6 : 3 = 🌸 (pe pași).
  () => {
    const k = randInt(1, 10); const box = pick(HIDERS);
    return stepped(tr('Ce număr se ascunde sub {box}? 3 × {v0} = {v1}, apoi {v2} : 3 = {v3}', { box, v0: box, v1: 3 * k, v2: 3 * k, v3: box }), [
      [`3 × ${box} = ${3 * k}`, k, [k + 1, 3 * k, k + 3]],
      [`${3 * k} : 3 = ${box}`, k, [k + 1, 3 * k, k + 3]],
    ], tr('3 × {k} = {v0}, deci {v1} : 3 = {v2}. Împărțirea e inversa înmulțirii!', { k, v0: 3 * k, v1: 3 * k, v2: k }));
  },
  // C. Află numerele de 3 ori mai mici decât 9, 21, 15, 27, 30, 3.
  () => {
    const n = pick([9, 21, 15, 27, 30, 3, 12, 24]);
    return problem(tr('Află numărul de 3 ori mai mic decât {n}.', { n }), n / 3,
      tr('„De 3 ori mai mic” înseamnă împărțire la 3: {n} : 3 = {v0}.', { n, v0: n / 3 }), [n - 3, n / 3 + 1, n * 3]);
  },
  // D. De 2 ori mai mici / de 3 ori mai mici decât 6, 12, 18.
  () => {
    const n = pick([6, 12, 18]); const d = pick([2, 3]);
    return problem(tr('Care este numărul de {d} ori mai mic decât {n}?', { d, n }), n / d,
      `${n} : ${d} = ${n / d}.`, [n / (5 - d), n - d, n / d + 1]);
  },
];

const THIRD_PRACTICE = [
  // Află câtul împărțirilor.
  () => {
    const k = randInt(4, 10); const n = 3 * k;
    return problem(tr('Află câtul: {n} : 3 = ?', { n }), k, tr('{n} : 3 = {k}, pentru că {v0} × 3 = {v1}.', { n, k, v0: k, v1: n }), [k + 1, k - 1, n - 3]);
  },
  // Micșorează de 3 ori suma perechilor de numere (pe pași).
  () => {
    const [a, b] = pick([[8, 7], [13, 14], [16, 5], [19, 11], [10, 8], [12, 9]]);
    const sum = a + b;
    return stepped(tr('Micșorează de 3 ori suma numerelor {a} și {b}.', { a, b }), [
      [tr('Cât este suma {a} + {b}?', { a, b }), sum, [a * b > 99 ? sum + 10 : a * b, sum + 1, sum - 1]],
      [tr('Micșorează de 3 ori: {sum} : 3 = ?', { sum }), sum / 3, [sum - 3, sum / 3 + 1, sum * 3 > 99 ? sum / 3 + 3 : sum * 3]],
    ], tr('Suma: {a} + {b} = {sum}. De 3 ori mai mic: {v0} : 3 = {v1}.', { a, b, sum, v0: sum, v1: sum / 3 }));
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
      text: tr('Calculează și compară: {left} ○ {right}', { left, right }),
      answer: sign,
      explanation: tr('{left} = {lv} și {right} = {rv}, deci {v0} {sign} {v1}.', { left, lv, right, rv, v0: lv, sign, v1: rv }),
      choices: SIGNS,
    };
  },
  // Ce numere se ascund în spatele rândunelelor? 🐦 : 3 = 5.
  () => {
    const k = randInt(1, 10);
    return problem(tr('Ce număr se ascunde în spatele rândunelei? 🐦 : 3 = {k}', { k }), 3 * k,
      tr('Căutăm numărul care împărțit la 3 dă {k}: {v0} × 3 = {v1}.', { k, v0: k, v1: 3 * k }), [k + 3, k, 3 * k + 3]);
  },
  // Rezolvă după model: 24 : 3 : 2 = 8 : 2 = 4 (pe pași).
  () => {
    const [n, d2] = pick([[30, 2], [27, 3], [9, 3], [12, 2], [18, 3], [18, 2], [6, 2], [24, 2]]);
    const first = n / 3;
    return stepped(tr('Rezolvă după model (24 : 3 : 2 = 8 : 2 = 4): {n} : 3 : {d2} = ?', { n, d2 }), [
      [`${n} : 3 = ?`, first, [first + 1, n - 3, first - 1]],
      [`${first} : ${d2} = ?`, first / d2, [first / d2 + 1, first - d2, first]],
    ], tr('Întâi {n} : 3 = {first}, apoi {v0} : {d2} = {v1}.', { n, first, v0: first, d2, v1: first / d2 }));
  },
  // Află câtul numerelor 27 și 3, apoi mărește-l de 6 ori (pe pași).
  () => {
    const n = pick([27, 24, 21, 18, 15, 12]); const k = pick([2, 4, 6]);
    return stepped(tr('Află câtul numerelor {n} și 3, apoi mărește-l de {k} ori.', { n, k }), [
      [tr('Cât este câtul {n} : 3?', { n }), n / 3, [n / 3 + 1, n - 3, n / 3 - 1]],
      [tr('Mărește de {k} ori: {v0} × {v1} = ?', { k, v0: n / 3, v1: k }), (n / 3) * k, [n / 3 + k, (n / 3) * k + k, (n / 3) * (k + 1)]],
    ], tr('Câtul: {n} : 3 = {v0}. Mărit de {k} ori: {v1} × {v2} = {v3}.', { n, v0: n / 3, k, v1: n / 3, v2: k, v3: (n / 3) * k }));
  },
  // Completează casetele cu semnele +, −, × sau : ca egalitatea să fie adevărată.
  () => {
    const [left, right, answer] = pick([
      ['6 ☐ 3', '3', '−'], ['6 ☐ 3', '2', ':'], ['6 ☐ 3', '9', '+'], ['6 ☐ 3', '18', '×'],
      ['30 ☐ 3', '10', ':'], ['21 ☐ 3', '7', ':'], ['9 ☐ 3', '27', '×'],
    ]);
    return {
      text: tr('Ce semn pui în căsuță ca egalitatea să fie adevărată? {left} = {right}', { left, right }),
      answer,
      explanation: tr('Încearcă fiecare semn: doar cu „{answer}” egalitatea {v0} = {v1} este adevărată.', { answer, v0: left.replace('☐', answer), v1: right.replace('☐', answer) }),
      choices: OPERATIONS,
    };
  },
];

const THIRD_SOLVE = [
  // Află cât costă o ciocolată, dacă 3 ciocolate de același fel costă 21 de lei.
  () => {
    const k = randInt(3, 9); const total = 3 * k;
    const [item, items] = pick([['ciocolată', 'ciocolate'], ['carte', 'cărți'], ['minge', 'mingi']]);
    return problem(tr('Află cât costă o {item}, dacă 3 {items} de același fel costă {v0}.', { item, items, v0: count(total, 'lei') }), k,
      tr('{total} : 3 = {k} lei.', { total, k }), [k + 3, total - 3, k + 1]);
  },
  // Într-o bancă se pot așeza 3 copii. Câte bănci sunt necesare pentru 24 de copii?
  () => {
    const k = randInt(3, 10); const kids = 3 * k;
    return problem(tr('Într-o bancă se pot așeza 3 copii. Câte bănci sunt necesare pentru {v0}?', { v0: count(kids, 'copii') }), k,
      tr('{kids} : 3 = {k} bănci.', { kids, k }), [k + 1, kids - 3, k - 1]);
  },
  // Bunicul are 18 puișori galbeni, iar negri de 3 ori mai puțini. Câți în total? (pe pași)
  () => {
    const black = randInt(2, 7); const yellow = 3 * black;
    return stepped(tr('Bunicul are {v0} galbeni, iar negri de 3 ori mai puțini. Câți puișori are în total?', { v0: count(yellow, 'puișori') }), [
      [tr('Câți puișori negri are? {yellow} : 3 = ?', { yellow }), black, [yellow - 3, black + 1, yellow * 3 > 99 ? black + 3 : yellow * 3]],
      [tr('Câți puișori are în total? {yellow} + {black} = ?', { yellow, black }), yellow + black, [yellow, yellow + black + 1, yellow - black]],
    ], tr('Negri: {yellow} : 3 = {black}. În total: {v0} + {v1} = {v2}.', { yellow, black, v0: yellow, v1: black, v2: yellow + black }));
  },
  // Rareș: 20 de curiozități, 12 despre berze, despre rândunele de 3 ori mai puține. (pe pași)
  () => {
    const storks = pick([9, 12, 15]); const swallows = storks / 3; const total = storks + swallows + randInt(2, 6);
    return stepped(tr('Rareș trebuie să scrie {v0} despre păsări. Până acum a scris {storks} curiozități despre berze ', { v0: count(total, 'curiozități'), storks })
      + tr('și de 3 ori mai puține despre rândunele. Câte curiozități mai are de scris?'), [
      [tr('Câte curiozități a scris despre rândunele? {storks} : 3 = ?', { storks }), swallows, [storks - 3, swallows + 1, storks]],
      [tr('Câte a scris în total până acum? {storks} + {swallows} = ?', { storks, swallows }), storks + swallows, [storks, storks + swallows + 1, storks - swallows]],
      [tr('Câte mai are de scris? {total} - {v0} = ?', { total, v0: storks + swallows }), total - storks - swallows, [total - storks, total - swallows, total - storks - swallows + 1]],
    ], tr('Rândunele: {storks} : 3 = {swallows}. Scrise: {v0} + {v1} = {v2}. Mai are: {total} - {v3} = {v4}.', { storks, swallows, v0: storks, v1: swallows, v2: storks + swallows, total, v3: storks + swallows, v4: total - storks - swallows }));
  },
  // Împărțire în 3 grupe egale.
  () => {
    const k = randInt(3, 10); const n = 3 * k;
    const [things, who] = pick([['mere', 'coșuri'], ['creioane', 'penare'], ['bomboane', 'prieteni']]);
    return problem(tr('{v0} se împart în mod egal în 3 {who}. Câte {things} sunt în fiecare?', { v0: count(n, things), who, things }), k,
      tr('{n} : 3 = {k}, pentru că {v0} × 3 = {v1}.', { n, k, v0: k, v1: n }), [k + 1, n - 3, k + 3]);
  },
];

// ================= „Împărțirea la 4” =================
const QUARTER_DISCOVER = [
  // Pentru câte mașinuțe îi vor ajunge lui Petrișor cele 20 de roți?
  () => {
    const k = randInt(2, 9); const n = 4 * k;
    return problem(tr('Petrișor are {v0}. Pune câte 4 roți la o mașinuță. Pentru câte mașinuțe îi ajung roțile?', { v0: count(n, 'roți') }), k,
      tr('{n} : 4 = {k} mașinuțe, deoarece {v0} × 4 = {v1}.', { n, k, v0: k, v1: n }), [k + 1, n - 4, k - 1]);
  },
  // Cele 16 păsări se așază în mod egal pe 4 crengi.
  () => {
    const k = randInt(2, 9); const n = 4 * k;
    return problem(tr('Cele {v0} vor să se așeze pe 4 crengi, același număr pe fiecare creangă. Câte păsări vor fi pe o creangă?', { v0: count(n, 'păsări') }), k,
      tr('{n} : 4 = {k} păsări, deoarece {v0} × 4 = {v1}.', { n, k, v0: k, v1: n }), [k + 1, n - 4, k - 1]);
  },
  () => {
    const k = randInt(1, 10); const n = 4 * k;
    return problem(tr('{n} : 4 = ?  (Gândește-te: ce număr înmulțit cu 4 dă {v0}?)', { n, v0: n }), k,
      tr('{n} : 4 = {k}, deoarece {v0} × 4 = {v1}.', { n, k, v0: k, v1: n }), [k + 1, n - 4, k + 4]);
  },
  () => {
    const k = randInt(2, 10);
    return problem(tr('Ce număr, împărțit la 4, dă {k}?', { k }), 4 * k,
      tr('Verificăm cu înmulțirea: {k} × 4 = {v0}, deci {v1} : 4 = {v2}.', { k, v0: 4 * k, v1: 4 * k, v2: k }), [k + 4, 2 * k, 4 * k + 4]);
  },
];

const QUARTER_APPLY = [
  // A. Scrie împărțirile corespunzătoare imaginilor.
  () => {
    const [n, things, groups] = pick([[8, 'puișori', 'cuiburi'], [12, 'flori', 'vaze'], [16, 'puișori', 'cuiburi'], [20, 'flori', 'vaze']]);
    return {
      ...problem(tr('În imagine sunt {v0}, așezați în mod egal în 4 {groups}. Câți sunt într-unul? ({n} : 4 = ?)', { v0: count(n, things), groups, n })
        .replace('așezați', things === 'flori' ? 'așezate' : 'așezați').replace('Câți sunt într-unul', things === 'flori' ? 'Câte sunt într-una' : 'Câți sunt într-unul'), n / 4,
        tr('{n} : 4 = {v0}, pentru că {v1} × 4 = {v2}.', { n, v0: n / 4, v1: n / 4, v2: n }), [n / 4 + 1, n - 4, 4]),
      picture: things === 'flori'
        ? { icon: '🌼', groups: 4, per: n / 4, holder: '🏺' }
        : { icon: '🐥', groups: 4, per: n / 4, holder: '🪺' },
    };
  },
  // B. Află ce numere ascund florile: 🌼 × 4 = 24, apoi 24 : 4 = 🌼 (pe pași).
  () => {
    const k = randInt(1, 10);
    return stepped(tr('Află ce numere ascund florile: 🌼 × 4 = {v0}, apoi {v1} : 4 = 🌼', { v0: 4 * k, v1: 4 * k }), [
      [`🌼 × 4 = ${4 * k}`, k, [k + 1, 4 * k, k + 4]],
      [`${4 * k} : 4 = 🌼`, k, [k + 1, 4 * k, k + 4]],
    ], tr('{k} × 4 = {v0}, deci {v1} : 4 = {v2}. Împărțirea e inversa înmulțirii!', { k, v0: 4 * k, v1: 4 * k, v2: k }));
  },
  // C. Află numerele de 4 ori mai mici decât 40, 36, 16, 24, 32, 8, 12, 28.
  () => {
    const n = pick([40, 36, 16, 24, 32, 8, 12, 28, 20]);
    return problem(tr('Află numărul de 4 ori mai mic decât {n}.', { n }), n / 4,
      tr('„De 4 ori mai mic” înseamnă împărțire la 4: {n} : 4 = {v0}.', { n, v0: n / 4 }), [n - 4, n / 4 + 1, n / 2]);
  },
  // D. Află sfertul numerelor 8, 20, 16, 4.
  () => {
    const n = pick([8, 20, 16, 4, 12, 24]);
    return problem(tr('Care este sfertul numărului {n}?', { n }), n / 4, tr('Sfertul înseamnă împărțire la 4: {n} : 4 = {v0}.', { n, v0: n / 4 }), [n / 2, n - 4, n / 4 + 1]);
  },  // Numărul care, împărțit la 4, dă un număr dat.
  () => {
    const k = randInt(2, 10);
    return problem(tr('Un număr împărțit la 4 dă {k}. Care este numărul?', { k }), 4 * k,
      tr('Verificăm cu înmulțirea: {k} × 4 = {v0}, deci {v1} : 4 = {v2}.', { k, v0: 4 * k, v1: 4 * k, v2: k }), [k + 4, 2 * k, 4 * k + 4]);
  },
];

const QUARTER_PRACTICE = [
  // Află câtul împărțirilor (la 2, la 3 și la 4).
  () => {
    const [n, d] = pick([[12, 2], [12, 3], [12, 4], [18, 2], [24, 3], [24, 4], [20, 2], [21, 3], [20, 4], [36, 4], [28, 4], [32, 4], [40, 4]]);
    return problem(tr('Află câtul: {n} : {d} = ?', { n, d }), n / d, tr('{n} : {d} = {v0}, pentru că {v1} × {v2} = {v3}.', { n, d, v0: n / d, v1: n / d, v2: d, v3: n }), [n / d + 1, n / d - 1, n - d]);
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
      text: tr('Calculează și compară: {left} ○ {right}', { left, right }),
      answer: sign,
      explanation: tr('{left} = {lv} și {right} = {rv}, deci {v0} {sign} {v1}.', { left, lv, right, rv, v0: lv, sign, v1: rv }),
      choices: SIGNS,
    };
  },
  // Află sfertul numerelor 40, 12, 32, 28, 36, 24.
  () => {
    const n = pick([40, 12, 32, 28, 36, 24]);
    return problem(tr('Află sfertul numărului {n}.', { n }), n / 4, tr('Sfertul = împărțire la 4: {n} : 4 = {v0}.', { n, v0: n / 4 }), [n / 2, n - 4, n / 4 + 1]);
  },
  // Completează tabelul: deîmpărțit, împărțitor, cât.
  () => {
    const type = pick(['cat', 'deimpartit', 'impartitor']);
    if (type === 'cat') {
      const k = randInt(2, 10); const n = 4 * k;
      return problem(tr('Deîmpărțitul este {n}, împărțitorul este 4. Care este câtul?', { n }), k, `${n} : 4 = ${k}.`, [k + 1, n - 4, k - 1]);
    }
    if (type === 'deimpartit') {
      const k = randInt(2, 10);
      return problem(tr('Împărțitorul este 4, iar câtul este {k}. Care este deîmpărțitul?', { k }), 4 * k,
        tr('Deîmpărțitul = cât × împărțitor: {k} × 4 = {v0}. Verificare: {v1} : 4 = {v2}.', { k, v0: 4 * k, v1: 4 * k, v2: k }), [k + 4, 4 * k + 4, 4 * k - 4]);
    }
    const [n, d] = pick([[24, 3], [20, 2], [18, 2], [32, 4], [36, 4], [27, 3], [16, 2]]);
    return problem(tr('Deîmpărțitul este {n}, iar câtul este {v0}. Care este împărțitorul?', { n, v0: n / d }), d,
      tr('Căutăm numărul la care împărțim {n} ca să obținem {v0}: {v1} : {d} = {v2}.', { n, v0: n / d, v1: n, d, v2: n / d }), [d + 1, d + 2, d - 1]);
  },
  // Află numerele care se ascund în spatele albinelor: 🐝 : 4 = 5.
  () => {
    const d = pick([2, 3, 4, 4]); const k = pick([5, 7, 9]);
    return problem(tr('Ce număr se ascunde în spatele albinei? 🐝 : {d} = {k}', { d, k }), d * k,
      tr('Căutăm numărul care împărțit la {d} dă {k}: {v0} × {v1} = {v2}.', { d, k, v0: k, v1: d, v2: d * k }), [k + d, d * k + d, d * k - d]);
  },
  // Află numărul când îi știi sfertul.
  () => {
    const k = randInt(2, 10);
    return problem(tr('Sfertul unui număr este {k}. Care este numărul?', { k }), 4 * k,
      tr('Numărul este de 4 ori mai mare decât sfertul lui: {k} × 4 = {v0}. Verificare: {v1} : 4 = {v2}.', { k, v0: 4 * k, v1: 4 * k, v2: k }), [k + 4, 2 * k, 4 * k + 4]);
  },
  // Matei află de câte ori este mai mare fiecare număr decât 4.
  () => {
    const n = pick([32, 36, 16, 28, 20, 24, 40]);
    return problem(tr('De câte ori este mai mare {n} decât 4?', { n }), n / 4,
      tr('„De câte ori mai mare” se află prin împărțire: {n} : 4 = {v0}. (Atenție: „cu cât mai mare” ar fi {v1} − 4 = {v2}.)', { n, v0: n / 4, v1: n, v2: n - 4 }), [n - 4, n / 4 + 1, n / 2]);
  },
];

const QUARTER_SOLVE = [
  // Numărul fetelor este un sfert din cel al băieților; băieți au fost 20. (pe pași)
  () => {
    const girls = randInt(3, 9); const boys = 4 * girls;
    return stepped(tr('La un concurs, numărul fetelor este un sfert din cel al băieților. Câți copii au participat la concurs, dacă băieți au fost {boys}?', { boys }), [
      [tr('Câte fete au fost? {boys} : 4 = ?', { boys }), girls, [boys - 4, girls + 1, boys / 2]],
      [tr('Câți copii în total? {boys} + {girls} = ?', { boys, girls }), boys + girls, [boys, boys + girls + 1, boys - girls]],
    ], tr('Fete: {boys} : 4 = {girls}. În total: {v0} + {v1} = {v2} copii.', { boys, girls, v0: boys, v1: girls, v2: boys + girls }));
  },
  // Bunica are 16 mere și 24 de pere; le împarte în mod egal celor 4 nepoți. (pe pași)
  () => {
    const [a, b] = pick([[16, 24], [12, 20], [8, 16], [20, 12], [12, 16]]);
    return stepped(tr('Bunica are într-un coș {a} mere și {v0}. Ea le împarte în mod egal celor 4 nepoți ai ei. Câte fructe primește fiecare?', { a, v0: count(b, 'pere') }), [
      [tr('Câte mere primește un nepot? {a} : 4 = ?', { a }), a / 4, [a / 4 + 1, a - 4, b / 4]],
      [tr('Câte pere primește un nepot? {b} : 4 = ?', { b }), b / 4, [b / 4 + 1, b - 4, a / 4]],
      [tr('Câte fructe primește fiecare? {v0} + {v1} = ?', { v0: a / 4, v1: b / 4 }), (a + b) / 4, [(a + b) / 4 + 1, a + b, (a + b) / 2]],
    ], tr('Mere: {a} : 4 = {v0}, pere: {b} : 4 = {v1}, în total {v2} fructe. Al doilea mod: ({v3} + {v4}) : 4 = {v5} : 4 = {v6}.', { a, v0: a / 4, b, v1: b / 4, v2: (a + b) / 4, v3: a, v4: b, v5: a + b, v6: (a + b) / 4 }));
  },
  // 24 de albine: un sfert pe salcâm, jumătate din cele rămase pe păpădii. (pe pași)
  () => {
    const total = pick([24, 16, 32, 40]); const quarter = total / 4; const rest = total - quarter;
    return stepped(tr('{v0} zumzăie prin grădină. Un sfert din ele s-au așezat pe florile de salcâm, iar jumătate din cele rămase s-au așezat pe păpădii. Câte albine sunt pe păpădii?', { v0: count(total, 'albine') }), [
      [tr('Câte albine sunt pe salcâm? {total} : 4 = ?', { total }), quarter, [total / 2, quarter + 1, total - 4]],
      [tr('Câte albine au rămas? {total} - {quarter} = ?', { total, quarter }), rest, [rest + 1, total, rest - 2]],
      [tr('Câte sunt pe păpădii? {rest} : 2 = ?', { rest }), rest / 2, [rest / 2 + 1, rest - 2, quarter]],
    ], tr('Pe salcâm: {total} : 4 = {quarter}. Rămase: {v0} - {v1} = {rest}. Pe păpădii: {v2} : 2 = {v3}.', { total, quarter, v0: total, v1: quarter, rest, v2: rest, v3: rest / 2 }));
  },
  // Problemă cu o împărțire (ghiocei: 32 și 4).
  () => {
    const k = randInt(4, 10); const n = 4 * k;
    return problem(tr('Maria a cules {v0} și face buchețele de câte 4 ghiocei. Câte buchețele face?', { v0: count(n, 'ghiocei') }), k,
      tr('{n} : 4 = {k} buchețele.', { n, k }), [k + 1, n - 4, k - 1]);
  },
  // Problemă cu o împărțire și o adunare (ghiocei: 28 și 4). (pe pași)
  () => {
    const k = randInt(3, 9); const n = 4 * k;
    return stepped(tr('În grădină sunt {v0} albi, iar brândușe sunt de 4 ori mai puține. Câte flori sunt în total?', { v0: count(n, 'ghiocei') }), [
      [tr('Câte brândușe sunt? {n} : 4 = ?', { n }), k, [n - 4, k + 1, n / 2]],
      [tr('Câte flori în total? {n} + {k} = ?', { n, k }), n + k, [n, n + k + 1, n - k]],
    ], tr('Brândușe: {n} : 4 = {k}. În total: {v0} + {v1} = {v2} flori.', { n, k, v0: n, v1: k, v2: n + k }));
  },
  // Află cât costă un obiect, dacă 4 obiecte la fel costă ...
  () => {
    const k = randInt(3, 10); const total = 4 * k;
    return problem(tr('4 caiete de același fel costă {v0}. Cât costă un caiet?', { v0: count(total, 'lei') }), k,
      tr('{total} : 4 = {k} lei.', { total, k }), [k + 4, total - 4, k + 1]);
  },
];

// ================= „Împărțirea la 5” =================
const FIFTH_DISCOVER = [
  // 5 grupuri de copii au lansat 20 de lampioane.
  () => {
    const k = randInt(2, 6); const n = 5 * k;
    return {
      ...problem(tr('La lăsarea serii, 5 grupuri de copii au lansat {v0}. Dacă fiecare grup a lansat același număr de lampioane, câte lampioane a lansat un grup?', { v0: count(n, 'lampioane') }), k,
        tr('{n} : 5 = {k} lampioane. Verificare: {v0} × 5 = {v1}.', { n, k, v0: k, v1: n }), [k + 1, n - 5, k - 1]),
      picture: { icon: '🏮', groups: 5, per: k },
    };
  },
  // Pippi Șosețica are 35 de lalele și face buchete de câte 5.
  () => {
    const k = randInt(2, 7); const n = 5 * k;
    return {
      ...problem(tr('Pippi Șosețica are {v0}. Ea vrea să facă buchete de câte 5. Pentru câte buchete îi ajung lalelele?', { v0: count(n, 'lalele') }), k,
        tr('{n} : 5 = {k} buchete. Verificare: {v0} × 5 = {v1}.', { n, k, v0: k, v1: n }), [k + 1, n - 5, k - 1]),
      picture: { icon: '🌷', groups: k, per: 5 },
    };
  },
  () => {
    const k = randInt(1, 10); const n = 5 * k;
    return problem(tr('{n} : 5 = ?  (Gândește-te: ce număr înmulțit cu 5 dă {v0}?)', { n, v0: n }), k,
      tr('{n} : 5 = {k}, deoarece {v0} × 5 = {v1}.', { n, k, v0: k, v1: n }), [k + 1, n - 5, k + 5]);
  },
  () => {
    const k = randInt(2, 10);
    return problem(tr('Ce număr, împărțit la 5, dă {k}?', { k }), 5 * k,
      tr('Verificăm cu înmulțirea: {k} × 5 = {v0}, deci {v1} : 5 = {v2}.', { k, v0: 5 * k, v1: 5 * k, v2: k }), [k + 5, 2 * k, 5 * k + 5]);
  },
];

const FIFTH_APPLY = [
  // A. Scrie împărțirile corespunzătoare imaginilor (cireșe, fundițe).
  () => {
    const [n, icon, word] = pick([[10, '🍒', 'cireșe'], [15, '🎀', 'fundițe'], [20, '🍒', 'cireșe'], [25, '🎀', 'fundițe']]);
    return {
      ...problem(tr('În imagine sunt {v0}, așezate în mod egal în 5 căsuțe. Câte {word} sunt într-o căsuță? ({n} : 5 = ?)', { v0: count(n, word), word, n }), n / 5,
        tr('{n} : 5 = {v0}, pentru că {v1} × 5 = {v2}.', { n, v0: n / 5, v1: n / 5, v2: n }), [n / 5 + 1, n - 5, 5]),
      picture: { icon, groups: 5, per: n / 5 },
    };
  },
  // B. Ce numere ascund baloanele? 5 × 🎈 = 30, apoi 30 : 5 = 🎈 (pe pași).
  () => {
    const k = randInt(1, 10);
    return stepped(tr('Ce număr ascunde balonul? 5 × 🎈 = {v0}, apoi {v1} : 5 = 🎈', { v0: 5 * k, v1: 5 * k }), [
      [`5 × 🎈 = ${5 * k}`, k, [k + 1, 5 * k, k + 5]],
      [`${5 * k} : 5 = 🎈`, k, [k + 1, 5 * k, k + 5]],
    ], tr('5 × {k} = {v0}, deci {v1} : 5 = {v2}. Împărțirea e inversa înmulțirii!', { k, v0: 5 * k, v1: 5 * k, v2: k }));
  },
  // C. Află numerele de 5 ori mai mici decât 10, 40, 25, 15, 45, 30, 20, 5.
  () => {
    const n = pick([10, 40, 25, 15, 45, 30, 20, 5, 35, 50]);
    return problem(tr('Află numărul de 5 ori mai mic decât {n}.', { n }), n / 5,
      tr('„De 5 ori mai mic” înseamnă împărțire la 5: {n} : 5 = {v0}.', { n, v0: n / 5 }), [n - 5, n / 5 + 1, n / 5 + 5]);
  },
  // D. Încercuiește numerele care se împart exact la 5.
  () => {
    const answer = pick([30, 15, 20, 10, 45, 50, 5, 25, 35, 40]);
    const others = shuffle([17, 32, 22, 13, 28, 44, 36, 21, 19, 48]).slice(0, 3);
    return {
      text: 'Care dintre aceste numere se împarte exact la 5?',
      answer,
      explanation: tr('{answer} : 5 = {v0}. Numerele care se împart exact la 5 au cifra unităților 0 sau 5.', { answer, v0: answer / 5 }),
      choices: shuffle([answer, ...others]),
    };
  },
];

const FIFTH_PRACTICE = [
  // Află câtul împărțirilor.
  () => {
    const [n, d] = pick([[10, 5], [15, 5], [20, 5], [20, 4], [10, 2], [15, 3], [12, 3], [12, 4], [25, 5], [35, 5], [40, 5], [45, 5], [50, 5]]);
    return problem(tr('Află câtul: {n} : {d} = ?', { n, d }), n / d, tr('{n} : {d} = {v0}, pentru că {v1} × {v2} = {v3}.', { n, d, v0: n / d, v1: n / d, v2: d, v3: n }), [n / d + 1, n / d - 1, n - d]);
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
      text: tr('Calculează și compară: {left} ○ {right}', { left, right }),
      answer: sign,
      explanation: tr('{left} = {lv} și {right} = {rv}, deci {v0} {sign} {v1}.', { left, lv, right, rv, v0: lv, sign, v1: rv }),
      choices: SIGNS,
    };
  },
  // Ce numere se ascund sub lampioane? 🏮 : 5 = 6.
  () => {
    const d = pick([3, 4, 5, 5]); const k = pick([6, 7, 8]);
    return problem(tr('Ce număr se ascunde sub lampion? 🏮 : {d} = {k}', { d, k }), d * k,
      tr('Căutăm numărul care împărțit la {d} dă {k}: {v0} × {v1} = {v2}.', { d, k, v0: k, v1: d, v2: d * k }), [k + d, d * k + d, d * k - d]);
  },
  // Completează casetele pentru a obține egalități: 24 : 3 = 40 : 🍎.
  () => {
    const [left, lv, right, answer] = pick([
      ['24 : 3', 8, '40 : ☐', 5], ['10 : 5', 2, '8 : ☐', 4], ['14 : 2', 7, '35 : ☐', 5], ['18 : 3', 6, '24 : ☐', 4],
      ['3 × 3', 9, '45 : ☐', 5], ['2 × 4', 8, '32 : ☐', 4], ['20 : 4', 5, '5 × ☐', 1], ['16 : 4', 4, '20 : ☐', 5],
    ]);
    const box = pick(HIDERS); const r = right.replace('☐', box);
    return problem(tr('Ce număr se ascunde sub {box}, ca egalitatea să fie adevărată? {left} = {r}', { box, left, r }), answer,
      tr('{left} = {lv}, deci și {r} trebuie să fie {v0}: {v1} = {v2}.', { left, lv, r, v0: lv, v1: right.replace('☐', answer), v2: lv }), [answer + 1, lv, answer + 2]);
  },
  // Rezolvă operațiile în ordinea în care sunt date (pe pași).
  () => {
    const [a, op1, b, op2, c] = pick([
      [20, ':', 4, ':', 5], [6, '×', 5, ':', 3], [4, '×', 10, ':', 5], [45, ':', 5, ':', 3], [35, ':', 5, '×', 7], [30, ':', 5, '×', 6],
      [50, ':', 5, ':', 2], [8, '×', 5, ':', 4],
    ]);
    const calc = (x, op, y) => (op === ':' ? x / y : x * y);
    const first = calc(a, op1, b); const result = calc(first, op2, c);
    return stepped(tr('Rezolvă operațiile în ordinea în care sunt date: {a} {op1} {b} {op2} {c} = ?', { a, op1, b, op2, c }), [
      [`${a} ${op1} ${b} = ?`, first, [first + 1, first - 1, a]],
      [`${first} ${op2} ${c} = ?`, result, [result + 1, result - 1, first]],
    ], tr('Întâi {a} {op1} {b} = {first}, apoi {v0} {op2} {c} = {result}.', { a, op1, b, first, v0: first, op2, c, result }));
  },
  // Află numărul de 5 ori mai mic decât suma numerelor 28 și 17 (pe pași).
  () => {
    const [a, b] = pick([[28, 17], [12, 13], [16, 14], [21, 19], [33, 7], [26, 9]]);
    const sum = a + b;
    return stepped(tr('Află numărul de 5 ori mai mic decât suma numerelor {a} și {b}.', { a, b }), [
      [tr('Cât este suma? {a} + {b} = ?', { a, b }), sum, [sum + 1, sum - 1, sum + 10]],
      [tr('De 5 ori mai mic: {sum} : 5 = ?', { sum }), sum / 5, [sum - 5, sum / 5 + 1, sum / 5 - 1]],
    ], tr('Suma: {a} + {b} = {sum}. De 5 ori mai mic: {v0} : 5 = {v1}.', { a, b, sum, v0: sum, v1: sum / 5 }));
  },
  // De câte ori este mai mare diferența numerelor 52 și 27 decât numărul 5? (pe pași)
  () => {
    const [a, b] = pick([[52, 27], [48, 18], [60, 25], [43, 23], [57, 22], [39, 19]]);
    const diff = a - b;
    return stepped(tr('De câte ori este mai mare diferența numerelor {a} și {b} decât numărul 5?', { a, b }), [
      [tr('Cât este diferența? {a} - {b} = ?', { a, b }), diff, [diff + 1, diff - 1, diff + 10]],
      [tr('De câte ori este mai mare decât 5? {diff} : 5 = ?', { diff }), diff / 5, [diff - 5, diff / 5 + 1, diff / 5 - 1]],
    ], tr('Diferența: {a} - {b} = {diff}. „De câte ori mai mare” se află prin împărțire: {v0} : 5 = {v1}.', { a, b, diff, v0: diff, v1: diff / 5 }));
  },
];

const FIFTH_SOLVE = [
  // Un kilogram de portocale costă 5 lei. Câte kilograme cumpără Laura cu 25 de lei?
  () => {
    const k = randInt(2, 9); const money = 5 * k;
    return problem(tr('Un kilogram de portocale costă 5 lei. Câte kilograme de portocale poate cumpăra Laura, dacă are {v0}?', { v0: count(money, 'lei') }), k,
      tr('{money} : 5 = {k} kilograme.', { money, k }), [k + 1, money - 5, k - 1]);
  },
  // Toma are nevoie de 40 de baloane: pungi cu 5 baloane, apoi cu 4 baloane (pe pași).
  () => {
    const n = pick([20, 40]);
    return stepped(tr('Toma are nevoie de {v0}. Câte pungi cu baloane trebuie să cumpere, dacă într-o pungă sunt 5 baloane? Dar dacă într-o pungă sunt 4 baloane?', { v0: count(n, 'baloane') }), [
      [tr('Pungi cu câte 5 baloane: {n} : 5 = ?', { n }), n / 5, [n / 4, n / 5 + 1, n - 5]],
      [tr('Pungi cu câte 4 baloane: {n} : 4 = ?', { n }), n / 4, [n / 5, n / 4 + 1, n - 4]],
    ], tr('{n} : 5 = {v0} pungi, iar {v1} : 4 = {v2} pungi.', { n, v0: n / 5, v1: n, v2: n / 4 }));
  },
  // Ana are 20 de creioane colorate. În câte grupe le poate repartiza în mod egal?
  () => {
    const per = pick([2, 4, 5, 10]);
    return problem(tr('Ana are 20 de creioane colorate. Le pune în grupe de câte {per}. Câte grupe face?', { per }), 20 / per,
      tr('20 : {per} = {v0} grupe.', { per, v0: 20 / per }), [20 / per + 1, 20 - per, per]);
  },
  // Matei: 43 de cărți, 8 pe primul raft, restul în mod egal pe 5 rafturi (pe pași).
  () => {
    const [total, first] = pick([[43, 8], [38, 3], [47, 7], [29, 4], [36, 6]]);
    const rest = total - first;
    return stepped(tr('Matei își aranjează cele {v0} în bibliotecă. El așază {v1} pe primul raft, iar cărțile rămase le împarte în mod egal pe 5 rafturi. Câte cărți vor fi pe ultimul raft?', { v0: count(total, 'cărți'), v1: count(first, 'cărți') }), [
      [tr('Câte cărți au rămas? {total} - {first} = ?', { total, first }), rest, [rest + 1, rest - 1, total]],
      [tr('Câte cărți pe un raft? {rest} : 5 = ?', { rest }), rest / 5, [rest / 5 + 1, rest - 5, rest / 5 - 1]],
    ], tr('Rămase: {total} - {first} = {rest}. Pe fiecare raft (deci și pe ultimul): {v0} : 5 = {v1} cărți.', { total, first, rest, v0: rest, v1: rest / 5 }));
  },
  // Lampioanele din magazin: 9 cutii cu câte 6, 3 zile câte 8, restul în 5 zile (pe pași).
  () => {
    const total = 54; const sold = 24; const rest = total - sold;
    return stepped(tr('La un magazin au fost aduse 9 cutii cu câte 6 lampioane fiecare. În primele 3 zile s-au vândut câte 8 lampioane pe zi. ')
      + tr('Restul au fost vândute în mod egal în următoarele 5 zile. Câte lampioane s-au vândut în ultima zi?'), [
      ['Câte lampioane au fost aduse? 9 × 6 = ?', total, [56, 45, 48]],
      ['Câte s-au vândut în primele 3 zile? 3 × 8 = ?', sold, [21, 32, 11]],
      [tr('Câte au rămas? {total} - {sold} = ?', { total, sold }), rest, [32, 20, 28]],
      [tr('Câte pe zi în următoarele 5 zile? {rest} : 5 = ?', { rest }), rest / 5, [5, 7, 25]],
    ], tr('Aduse: 9 × 6 = 54. Vândute în 3 zile: 3 × 8 = 24. Rămase: 54 - 24 = 30. În ultima zi: 30 : 5 = 6 lampioane.'));
  },
  // Problemă cu prețuri: 5 obiecte la fel.
  () => {
    const k = randInt(2, 9); const total = 5 * k;
    const [item, items] = pick([['caiet', 'caiete'], ['pix', 'pixuri'], ['balon', 'baloane']]);
    return problem(tr('5 {items} de același fel costă {v0}. Cât costă un {item}?', { items, v0: count(total, 'lei'), item }), k,
      tr('{total} : 5 = {k} lei.', { total, k }), [k + 5, total - 5, k + 1]);
  },
];

// ================= „Împărțirea la 6”, „la 7”, „la 8” și „la 9” =================
// Datele din manual, separate pe împărțitor: fiecare insulă folosește doar „: 6” sau doar „: 7”.
const BY_DIVISOR = {
  6: {
    stories: [
      k => [tr('Delia vrea să citească o carte cu {v0} în 6 zile, același număr de pagini în fiecare zi. Câte pagini trebuie să citească în fiecare zi?', { v0: count(6 * k, 'pagini') }), 'pagini'],
      k => [tr('În 6 cutii identice sunt {v0}. Câte bomboane sunt într-o cutie?', { v0: count(6 * k, 'bomboane') }), 'bomboane'],
    ],
    model: [[42, 7], [48, 8], [54, 9], [36, 6].slice(0, 0), [30, 5], [24, 4], [18, 3]].filter(x => x.length),
    smaller: [36, 54, 48, 6, 60, 42, 24, 30],
    verify: [[6, 4], [3, 6], [6, 7], [6, 8], [5, 6], [6, 9], [2, 6]],
    compare: [['54 : 6', 9, '8', 8], ['42 : 6', 7, '7', 7], ['6', 6, '36 : 6', 6], ['30 : 6', 5, '4', 4],
      ['48 : 6', 8, '60 : 6', 10], ['18 : 6', 3, '24 : 6', 4], ['12 : 6', 2, '3', 3]],
    hidden: [['3 × 3 = 📖 : 6', 54], ['2 × 4 = 📖 : 6', 48], ['2 × 3 = 📖 : 6', 36], ['5 + 2 = 📖 : 6', 42], ['10 - 5 = 📖 : 6', 30]],
    order: [[9, '×', 4, ':', 6], [3, '×', 8, ':', 6], [42, ':', 6, '×', 5], [36, ':', 6, '×', 7], [5, '×', 6, ':', 6], [54, ':', 6, '×', 2]],
    sums: [[25, 23], [30, 12], [17, 19], [40, 14], [22, 8], [35, 25]],
    shelves: [[80, 4, 8], [70, 4, 7], [60, 3, 8], [90, 6, 6]],
  },
  7: {
    stories: [
      k => [tr('Radu vrea să citească într-o săptămână o carte cu {v0}. El va citi în fiecare zi același număr de pagini. Câte pagini va citi într-o zi?', { v0: count(7 * k, 'pagini') }), 'pagini'],
      k => [tr('Mihnea vrea să-și aranjeze cele {v0} în 7 cutii, punând același număr de cuburi în fiecare cutie. Câte cuburi pune într-o cutie?', { v0: count(7 * k, 'cuburi') }), 'cuburi'],
    ],
    model: [[56, 8], [63, 9], [42, 6], [28, 4], [35, 5], [21, 3]],
    smaller: [28, 56, 21, 63, 70, 49, 35, 42],
    verify: [[7, 4], [5, 7], [2, 7], [7, 3], [7, 9], [7, 8], [6, 7]],
    compare: [['14 : 7', 2, '3', 3], ['9', 9, '49 : 7', 7], ['4', 4, '21 : 7', 3], ['63 : 7', 9, '8', 8],
      ['35 : 7', 5, '28 : 7', 4], ['70 : 7', 10, '9', 9], ['56 : 7', 8, '8', 8]],
    hidden: [['2 × 4 = 📖 : 7', 56], ['3 × 3 = 📖 : 7', 63], ['2 × 3 = 📖 : 7', 42], ['2 × 2 = 📖 : 7', 28], ['10 - 5 = 📖 : 7', 35]],
    order: [[49, ':', 7, ':', 7], [21, ':', 7, '×', 9], [7, '×', 6, ':', 7], [56, ':', 7, '×', 3], [35, ':', 7, '×', 8], [3, '×', 7, ':', 7]],
    sums: [[24, 25], [30, 12], [16, 19], [40, 16], [33, 30], [20, 8]],
    shelves: [[70, 4, 7], [90, 6, 8], [80, 4, 6]],
  },
  8: {
    stories: [
      k => [tr('Ioana are {v0} cu personaje din povești. Vrea să le așeze într-un album cu 8 file, punând pe fiecare filă același număr de cartonașe. Câte cartonașe va avea pe fiecare filă?', { v0: count(8 * k, 'cartonașe') }), 'cartonașe'],
      k => [tr('Caracatițele din acvariu au în total {v0}. O caracatiță are 8 brațe. Câte caracatițe sunt în acvariu?', { v0: count(8 * k, 'brațe') }), 'caracatițe'],
    ],
    model: [[24, 3], [32, 4], [40, 5], [48, 6], [56, 7], [72, 9], [16, 2]],
    smaller: [64, 56, 48, 16, 72, 80, 24, 40],
    verify: [[8, 4], [8, 7], [3, 8], [8, 6], [8, 9], [5, 8]],
    compare: [['24 : 8', 3, '4', 4], ['9', 9, '72 : 8', 9], ['40 : 8', 5, '6', 6], ['64 : 8', 8, '56 : 8', 7],
      ['80 : 8', 10, '9', 9], ['16 : 8', 2, '2', 2], ['48 : 8', 6, '32 : 8', 4]],
    hidden: [['2 × 4 = 🐰 : 8', 32], ['3 × 3 = 🐰 : 8', 72], ['2 × 3 = 🐰 : 8', 48], ['10 - 5 = 🐰 : 8', 40], ['2 + 5 = 🐰 : 8', 56]],
    order: [[64, ':', 8, ':', 2], [24, ':', 8, '×', 9], [8, '×', 5, ':', 8], [72, ':', 8, '×', 3], [6, '×', 4, ':', 8], [40, ':', 8, '×', 7]],
    sums: [[24, 16], [30, 18], [25, 15], [40, 16], [33, 31], [50, 22]],
    divisors: [[16, 2], [64, 8], [72, 9], [32, 4], [48, 6], [24, 3], [40, 5]],
    table: [[40, 5], [64, 8], [24, 3], [56, 7], [72, 9]],
    chains: [[48, ':', 8, '×', 4, '+', 8, ':', 8], [32, ':', 8, '×', 6, '+', 8, ':', 8], [16, ':', 8, '×', 9, '+', 6, ':', 8]],
    shelves: [[80, 4, 4], [90, 5, 2], [70, 3, 2], [60, 2, 6]],
  },
  9: {
    stories: [
      k => [tr('David are {v0} cu personaje din povești. Vrea să așeze câte 9 cartonașe pe fiecare filă a unui album. Pentru câte file îi vor ajunge cartonașele?', { v0: count(9 * k, 'cartonașe') }), 'file'],
      k => [tr('9 copii împart în mod egal {v0}. Câte cireșe primește fiecare copil?', { v0: count(9 * k, 'cireșe') }), 'cireșe'],
    ],
    model: [[27, 3], [36, 4], [45, 5], [54, 6], [63, 7], [72, 8], [18, 2]],
    smaller: [27, 54, 36, 63, 9, 81, 45, 72],
    verify: [[6, 9], [5, 9], [9, 4], [9, 3], [9, 8], [7, 9]],
    compare: [['27 : 9', 3, '4', 4], ['8', 8, '72 : 9', 8], ['45 : 9', 5, '6', 6], ['81 : 9', 9, '63 : 9', 7],
      ['90 : 9', 10, '9', 9], ['18 : 9', 2, '2', 2], ['54 : 9', 6, '36 : 9', 4]],
    hidden: [['2 × 4 = 🐰 : 9', 72], ['3 × 3 = 🐰 : 9', 81], ['2 × 3 = 🐰 : 9', 54], ['10 - 5 = 🐰 : 9', 45], ['2 + 5 = 🐰 : 9', 63]],
    divisors: [[54, 6], [90, 10], [18, 2], [63, 7], [45, 5], [27, 3], [36, 4]],
    table: [[45, 5], [27, 3], [63, 7], [36, 4], [81, 9]],
    chains: [[63, ':', 9, '×', 6, '+', 3, ':', 9], [54, ':', 9, '×', 4, '+', 12, ':', 9], [27, ':', 9, '×', 8, '+', 3, ':', 9]],
    order: [[81, ':', 9, ':', 3], [27, ':', 9, '×', 8], [9, '×', 5, ':', 9], [72, ':', 9, '×', 3], [6, '×', 3, ':', 9], [45, ':', 9, '×', 7]],
    sums: [[20, 16], [30, 15], [25, 29], [40, 23], [33, 39], [50, 31]],
    shelves: [[80, 4, 2], [90, 3, 3], [70, 2, 8], [60, 3, 5]],
  },
};

function divisorLesson(d) {
  const data = BY_DIVISOR[d];
  const discover = [
    ...data.stories.map(story => () => {
      const k = randInt(3, 9); const n = d * k; const [text, unit] = story(k);
      return problem(text, k, tr('{n} : {d} = {k} {unit}, pentru că {v0} × {v1} = {v2}.', { n, d, k, unit, v0: k, v1: d, v2: n }), [k + 1, n - d, k - 1]);
    }),
    () => {
      const k = randInt(1, 10); const n = d * k;
      return problem(tr('{n} : {d} = ?  (Gândește-te: ce număr înmulțit cu {v0} dă {v1}?)', { n, d, v0: d, v1: n }), k,
        tr('{n} : {d} = {k}, deoarece {v0} × {v1} = {v2}.', { n, d, k, v0: k, v1: d, v2: n }), [k + 1, n - d, k + d]);
    },
    () => {
      const k = randInt(2, 10);
      return problem(tr('Ce număr, împărțit la {d}, dă {k}?', { d, k }), d * k,
        tr('Verificăm cu înmulțirea: {k} × {d} = {v0}, deci {v1} : {v2} = {v3}.', { k, d, v0: d * k, v1: d * k, v2: d, v3: k }), [k + d, 2 * k, d * k + d]);
    },
  ];

  const apply = [
    // A. Calculează, apoi află numărul ascuns: 42 : 7 = 6, deci 42 : 🍎 = 7 (pe pași).
    () => {
      const [n, other] = pick(data.model); const q = n / d; const box = pick(HIDERS);
      return stepped(tr('Calculează {n} : {d}, apoi află numărul ascuns: {v0} : {box} = {v1}', { n, d, v0: n, box, v1: d }), [
        [`${n} : ${d} = ?`, q, [q + 1, q - 1, n - d]],
        [`${n} : ${box} = ${d}`, other, [other + 1, d, other - 1]],
      ], tr('{n} : {d} = {q}, deci și {v0} : {v1} = {v2}, pentru că {v3} × {v4} = {v5}.', { n, d, q, v0: n, v1: q, v2: d, v3: q, v4: d, v5: n }));
    },
    // B. Află numerele de d ori mai mici.
    () => {
      const n = pick(data.smaller);
      return problem(tr('Află numărul de {d} ori mai mic decât {n}.', { d, n }), n / d,
        tr('„De {d} ori mai mic” înseamnă împărțire la {v0}: {n} : {v1} = {v2}.', { d, v0: d, n, v1: d, v2: n / d }), [n - d, n / d + 1, n / d - 1]);
    },
    // C. Micșorează de d ori.
    () => {
      const n = pick(data.smaller);
      return problem(tr('Micșorează de {d} ori numărul {n}.', { d, n }), n / d,
        tr('A micșora de {d} ori înseamnă a împărți la {v0}: {n} : {v1} = {v2}.', { d, v0: d, n, v1: d, v2: n / d }), [n - d, n / d + 1, n / d - 1]);
    },
    // D. Calculează și verifică prin operația inversă (pe pași).
    () => {
      const [a, b] = pick(data.verify); const p = a * b; const other = a === d ? b : a;
      return stepped(tr('Calculează și verifică prin împărțire (model: {d} × 4 = {v0}, deci {v1} : {v2} = 4): {a} × {b} = ?', { d, v0: d * 4, v1: d * 4, v2: d, a, b }), [
        [`${a} × ${b} = ?`, p, [p + 1, p - 1, a + b]],
        [tr('Verificare: {p} : {d} = ?', { p, d }), other, [other + 1, d === other ? other + 2 : d, other - 1]],
      ], tr('{a} × {b} = {p}. Verificăm: {v0} : {d} = {other}.', { a, b, p, v0: p, d, other }));
    },
  ];

  const practice = [
    // 1. Calculează.
    () => {
      const k = randInt(2, 10); const n = d * k;
      return problem(tr('Calculează: {n} : {d} = ?', { n, d }), k, tr('{n} : {d} = {k}, pentru că {v0} × {v1} = {v2}.', { n, d, k, v0: k, v1: d, v2: n }), [k + 1, k - 1, n - d]);
    },
    // 2. Calculează și compară.
    () => {
      const [left, lv, right, rv] = pick(data.compare);
      const sign = lv < rv ? '<' : lv > rv ? '>' : '=';
      return {
        text: tr('Calculează și compară: {left} ○ {right}', { left, right }),
        answer: sign,
        explanation: tr('{left} = {lv} și {right} = {rv}, deci {v0} {sign} {v1}.', { left, lv, right, rv, v0: lv, sign, v1: rv }),
        choices: SIGNS,
      };
    },
    // 3. Ce număr se ascunde sub carte? 3 × 3 = 📖 : 6.
    () => {
      const [text, answer] = pick(data.hidden);
      return problem(tr('Ce număr se ascunde sub {v0}? {text}', { v0: text.includes('🐰') ? 'iepuraș' : 'carte', text }), answer,
        tr('Partea din stânga dă {v0}, deci căutăm numărul care împărțit la {d} dă {v1}: {v2} × {v3} = {answer}.', { v0: answer / d, d, v1: answer / d, v2: answer / d, v3: d, answer }),
        [answer + d, answer - d, answer / d]);
    },
    // 4. Calculează, efectuând operațiile în ordinea în care sunt date (pe pași).
    () => {
      const [a, op1, b, op2, c] = pick(data.order);
      const calc = (x, op, y) => (op === ':' ? x / y : x * y);
      const first = calc(a, op1, b); const result = calc(first, op2, c);
      return stepped(tr('Calculează, efectuând operațiile în ordinea în care sunt date: {a} {op1} {b} {op2} {c} = ?', { a, op1, b, op2, c }), [
        [`${a} ${op1} ${b} = ?`, first, [first + 1, first - 1, a]],
        [`${first} ${op2} ${c} = ?`, result, [result + 1, result - 1, first]],
      ], tr('Întâi {a} {op1} {b} = {first}, apoi {v0} {op2} {c} = {result}.', { a, op1, b, first, v0: first, op2, c, result }));
    },
    // 5. Află de câte ori este mai mare.
    () => {
      const k = randInt(4, 10); const n = d * k;
      return problem(tr('De câte ori este mai mare {n} decât {d}?', { n, d }), k,
        tr('„De câte ori mai mare” se află prin împărțire: {n} : {d} = {k}.', { n, d, k }), [n - d, k + 1, k - 1]);
    },
    // 6. Micșorează de d ori suma a două numere (pe pași).
    () => {
      const [a, b] = pick(data.sums); const sum = a + b;
      return stepped(tr('Micșorează de {d} ori suma numerelor {a} și {b}.', { d, a, b }), [
        [tr('Cât este suma? {a} + {b} = ?', { a, b }), sum, [sum + 1, sum - 1, sum + 10]],
        [tr('Micșorează de {d} ori: {sum} : {v0} = ?', { d, sum, v0: d }), sum / d, [sum - d, sum / d + 1, sum / d - 1]],
      ], tr('Suma: {a} + {b} = {sum}. De {d} ori mai mic: {v0} : {v1} = {v2}.', { a, b, sum, d, v0: sum, v1: d, v2: sum / d }));
    },
  ];

  // Scrie împărțitorul: 72 : 🍎 = 9.
  if (data.divisors) {
    practice.push(() => {
      const [n, q] = pick(data.divisors); const box = pick(HIDERS);
      return problem(tr('Scrie împărțitorul: {n} : {box} = {q}', { n, box, q }), d,
        tr('Împărțitorul se află prin împărțire: {n} : {q} = {d}. Verificare: {v0} : {v1} = {v2}.', { n, q, d, v0: n, v1: d, v2: q }), [d + 1, d - 1, q]);
    });
  }
  // Tabelul cu a, b și a : b: află numărul care lipsește.
  if (data.table) {
    practice.push(() => {
      const [a, q] = pick(data.table);
      return Math.random() < 0.5
        ? problem(tr('În tabel: a = {a}, b = {d}. Cât este a : b?', { a, d }), q, `${a} : ${d} = ${q}.`, [q + 1, q - 1, a - d])
        : problem(tr('În tabel: b = {d}, iar a : b = {q}. Cât este a?', { d, q }), a, tr('a = {q} × {d} = {a}. Verificare: {v0} : {v1} = {v2}.', { q, d, a, v0: a, v1: d, v2: q }), [a + d, a - d, q + d]);
    });
  }
  // Schițe: 48 → : 8 → × 4 → + 8 → : 8 (pe pași).
  if (data.chains) {
    practice.push(() => {
      const [start, ...ops] = pick(data.chains);
      const calc = (x, op, y) => (op === ':' ? x / y : op === '×' ? x * y : x + y);
      const steps = []; let v = start; let chain = `${start}`;
      for (let i = 0; i < ops.length; i += 2) {
        const next = calc(v, ops[i], ops[i + 1]);
        steps.push([`${v} ${ops[i]} ${ops[i + 1]} = ?`, next, [next + 1, next - 1, next + 2]]);
        chain += ` → ${ops[i]} ${ops[i + 1]}`;
        v = next;
      }
      return stepped(tr('Completează schița, căsuță cu căsuță: {chain}', { chain }), steps,
        tr('Pornim de la {start}: {v0}.', { start, v0: steps.map(([q, a]) => q.replace('?', a)).join(', ') }));
    });
  }

  const solve = [
    // Rafturile Mirunei: primele rafturi câte ..., restul în mod egal pe d rafturi (pe pași).
    () => {
      const [total, shelves, per] = pick(data.shelves); const first = shelves * per; const rest = total - first;
      return stepped(tr('Miruna are în bibliotecă {v0}. Ea așază pe primele {shelves} rafturi câte {per} cărți, iar restul, în mod egal, pe {d} rafturi. Câte cărți vor fi pe fiecare din cele {v1} rafturi?', { v0: count(total, 'cărți'), shelves, per, d, v1: d }), [
        [tr('Câte cărți pe primele {shelves} rafturi? {v0} × {per} = ?', { shelves, v0: shelves, per }), first, [first + per, first - 1, shelves + per]],
        [tr('Câte cărți au rămas? {total} - {first} = ?', { total, first }), rest, [rest + 1, rest - 10, total]],
        [tr('Câte pe un raft? {rest} : {d} = ?', { rest, d }), rest / d, [rest / d + 1, rest - d, rest / d - 1]],
      ], tr('{shelves} × {per} = {first}. Rămase: {total} - {v0} = {rest}. Pe fiecare raft: {v1} : {d} = {v2} cărți.', { shelves, per, first, total, v0: first, rest, v1: rest, d, v2: rest / d }));
    },
    // d obiecte de același fel costă ... lei.
    () => {
      const k = randInt(2, 9); const total = d * k;
      const [item, items] = pick([['caiet', 'caiete'], ['pix', 'pixuri'], ['bilet', 'bilete']]);
      return problem(tr('{d} {items} de același fel costă {v0}. Cât costă un {item}?', { d, items, v0: count(total, 'lei'), item }), k,
        tr('{total} : {d} = {k} lei.', { total, d, k }), [k + d, total - d, k + 1]);
    },
  ];

  if (d === 6) {
    solve.push(
      // În 6 cutii identice sunt 54 de bomboane: câte într-o cutie? Dar în 3 cutii? (pe pași)
      () => {
        const k = pick([7, 8, 9]); const n = 6 * k;
        return stepped(tr('În 6 cutii identice sunt {v0}. Câte bomboane sunt într-o cutie? Dar în 3 cutii?', { v0: count(n, 'bomboane') }), [
          [tr('Într-o cutie: {n} : 6 = ?', { n }), k, [k + 1, n - 6, k - 1]],
          [tr('În 3 cutii: {k} × 3 = ?', { k }), 3 * k, [3 * k + 3, 3 * k + 1, 3 * k - 1]],
        ], tr('Într-o cutie: {n} : 6 = {k}. În 3 cutii: {v0} × 3 = {v1} bomboane.', { n, k, v0: k, v1: 3 * k }));
      },
      // Andreea a avut 5 cutii și dăruiește 2 bunicilor (pe pași).
      () => {
        const k = pick([6, 7, 8, 9]); const n = 6 * k;
        return stepped(tr('În 6 cutii identice sunt {v0}. Andreea a avut 5 astfel de cutii și dăruiește celor doi bunici câte o cutie. Câte bomboane i-au rămas?', { v0: count(n, 'bomboane') }), [
          [tr('Câte bomboane sunt într-o cutie? {n} : 6 = ?', { n }), k, [k + 1, n - 6, k - 1]],
          ['Câte cutii i-au rămas? 5 - 2 = ?', 3, [2, 4, 7]],
          [tr('Câte bomboane i-au rămas? 3 × {k} = ?', { k }), 3 * k, [3 * k + 3, 5 * k, 3 * k - 1]],
        ], tr('Într-o cutie: {n} : 6 = {k}. Cutii rămase: 5 - 2 = 3. Bomboane rămase: 3 × {v0} = {v1}. Al doilea mod: {v2} - {v3} = {v4}.', { n, k, v0: k, v1: 3 * k, v2: 5 * k, v3: 2 * k, v4: 3 * k }));
      },
      // Echipe egale de copii.
      () => {
        const k = randInt(3, 9); const n = 6 * k;
        return problem(tr('La serbare, {v0} formează 6 echipe cu același număr de copii. Câți copii are fiecare echipă?', { v0: count(n, 'copii') }), k,
          tr('{n} : 6 = {k} copii.', { n, k }), [k + 1, n - 6, k - 1]);
      },
    );
  } else if (d === 7) {
    solve.push(
      // Dănuț: găini, rațe cu 7 mai puține, gâște de 7 ori mai puține (pe pași).
      () => {
        const hens = pick([21, 28, 35, 42, 49]); const ducks = hens - 7; const geese = hens / 7;
        return stepped(tr('Dănuț are {v0}, cu 7 mai puține rațe, iar gâște de 7 ori mai puține decât găini. Câte păsări are băiatul în total?', { v0: count(hens, 'găini') }), [
          [tr('Câte rațe are? {hens} - 7 = ?', { hens }), ducks, [geese, ducks + 1, hens + 7]],
          [tr('Câte gâște are? {hens} : 7 = ?', { hens }), geese, [geese + 1, geese + 2, geese === 2 ? 4 : geese - 1]],
          [tr('Câte păsări în total? {hens} + {ducks} + {geese} = ?', { hens, ducks, geese }), hens + ducks + geese, [hens + ducks, hens + ducks + geese + 1, hens + geese]],
        ], tr('Rațe: {hens} - 7 = {ducks} („cu 7 mai puține” = scădere). Gâște: {v0} : 7 = {geese} („de 7 ori mai puține” = împărțire). În total: {v1}.', { hens, ducks, v0: hens, geese, v1: hens + ducks + geese }));
      },
      // Câte săptămâni?
      () => {
        const k = randInt(2, 9); const n = 7 * k;
        return problem(tr('O tabără a durat {v0}. Câte săptămâni a durat tabăra? (o săptămână are 7 zile)', { v0: count(n, 'zile') }), k,
          tr('{n} : 7 = {k} săptămâni.', { n, k }), [k + 1, n - 7, k - 1]);
      },
    );
  } else if (d === 8) {
    solve.push(
      // Olivia: 48 de abțibilduri cu animale și 24 cu flori, câte 8 într-un plic (pe pași).
      () => {
        const [a, b] = pick([[48, 24], [40, 16], [32, 24], [56, 16]]);
        return stepped(tr('Olivia are {v0} cu animale și {v1} cu flori. Ea pune câte 8 abțibilduri într-un plic. În câte plicuri au fost puse abțibildurile?', { v0: count(a, 'abțibilduri'), v1: count(b, 'abțibilduri') }), [
          [tr('Câte abțibilduri are în total? {a} + {b} = ?', { a, b }), a + b, [a + b + 10, a + b - 1, a - b]],
          [tr('Câte plicuri? {v0} : 8 = ?', { v0: a + b }), (a + b) / 8, [(a + b) / 8 + 1, (a + b) / 8 - 1, a / 8]],
        ], tr('În total: {a} + {b} = {v0}. Plicuri: {v1} : 8 = {v2}.', { a, b, v0: a + b, v1: a + b, v2: (a + b) / 8 }));
      },
      // Picioarele păianjenilor.
      () => {
        const k = randInt(2, 9); const n = 8 * k;
        return problem(tr('Un păianjen are 8 picioare. Câți păianjeni au împreună {v0}?', { v0: count(n, 'picioare') }), k,
          tr('{n} : 8 = {k} păianjeni, pentru că {v0} × 8 = {v1}.', { n, k, v0: k, v1: n }), [k + 1, n - 8, k - 1]);
      },
      // Caracatițe și scoici: de 8 ori mai puține (pe pași).
      () => {
        const shells = pick([16, 24, 32, 40, 48]); const octo = shells / 8;
        return stepped(tr('În acvariu sunt {v0}, iar caracatițe de 8 ori mai puține. Câte viețuitoare sunt în total în acvariu?', { v0: count(shells, 'scoici') }), [
          [tr('Câte caracatițe sunt? {shells} : 8 = ?', { shells }), octo, [shells - 8, octo + 1, octo + 2]],
          [tr('Câte în total? {shells} + {octo} = ?', { shells, octo }), shells + octo, [shells, shells + octo + 1, shells - octo]],
        ], tr('Caracatițe: {shells} : 8 = {octo}. În total: {v0} + {v1} = {v2}.', { shells, octo, v0: shells, v1: octo, v2: shells + octo }));
      },
    );
  } else {
    solve.push(
      // Pe teren sunt 81 de copii care se așază în mod egal în 9 echipe.
      () => {
        const k = randInt(3, 9); const n = 9 * k;
        return problem(tr('Pe teren sunt {v0} care trebuie să se așeze, în mod egal, în 9 echipe. Câți copii vor fi în fiecare echipă?', { v0: count(n, 'copii') }), k,
          tr('{n} : 9 = {k} copii, pentru că {v0} × 9 = {v1}.', { n, k, v0: k, v1: n }), [k + 1, n - 9, k - 1]);
      },
      // Pavel: un buchet cu 9 trandafiri costă 63 de lei; Adina ia 7 trandafiri (pe pași).
      () => {
        const price = pick([5, 6, 7, 8]); const total = 9 * price; const roses = pick([4, 6, 7]);
        return stepped(tr('Pentru un buchet cu 9 trandafiri, Pavel a plătit {v0}. Cât plătește Adina pentru un buchet cu {roses} trandafiri de același fel?', { v0: count(total, 'lei'), roses }), [
          [tr('Cât costă un trandafir? {total} : 9 = ?', { total }), price, [price + 1, total - 9, price - 1]],
          [tr('Cât costă {roses} trandafiri? {v0} × {price} = ?', { roses, v0: roses, price }), roses * price, [roses * price + price, roses + price, roses * price - 1]],
        ], tr('Un trandafir: {total} : 9 = {price} lei. {roses} trandafiri: {v0} × {v1} = {v2} lei.', { total, price, roses, v0: roses, v1: price, v2: roses * price }));
      },
      // Mădălina: bile colorate, 9 pentru un colier, restul brățări cu câte 9 mărgele (pe pași).
      () => {
        const total = pick([36, 45, 54, 63]); const rest = total - 9;
        return stepped(tr('Mădălina are {v0} colorate. Folosește 9 bile pentru un colier, iar din rest face brățări cu câte 9 mărgele. Câte brățări a făcut fetița?', { v0: count(total, 'bile') }), [
          [tr('Câte bile au rămas? {total} - 9 = ?', { total }), rest, [rest + 1, total, rest - 9]],
          [tr('Câte brățări? {rest} : 9 = ?', { rest }), rest / 9, [rest / 9 + 1, rest - 9, rest / 9 - 1]],
        ], tr('Rămase: {total} - 9 = {rest}. Brățări: {v0} : 9 = {v1}.', { total, rest, v0: rest, v1: rest / 9 }));
      },
      // Echipe de câte 9 jucători.
      () => {
        const k = randInt(2, 9); const n = 9 * k;
        return problem(tr('La un turneu au venit {v0}. O echipă are 9 jucători. Câte echipe s-au format?', { v0: count(n, 'jucători') }), k,
          tr('{n} : 9 = {k} echipe, pentru că {v0} × 9 = {v1}.', { n, k, v0: k, v1: n }), [k + 1, n - 9, k - 1]);
      },
      // Mere și pere: pere de 9 ori mai puține (pe pași).
      () => {
        const apples = pick([18, 27, 36, 45, 54]); const pears = apples / 9;
        return stepped(tr('Bunica are {v0}, iar pere de 9 ori mai puține. Câte fructe are bunica în total?', { v0: count(apples, 'mere') }), [
          [tr('Câte pere are? {apples} : 9 = ?', { apples }), pears, [apples - 9, pears + 1, pears + 2]],
          [tr('Câte fructe în total? {apples} + {pears} = ?', { apples, pears }), apples + pears, [apples, apples + pears + 1, apples - pears]],
        ], tr('Pere: {apples} : 9 = {pears}. În total: {v0} + {v1} = {v2}.', { apples, pears, v0: apples, v1: pears, v2: apples + pears }));
      },
    );
  }
  return { discover, apply, practice, solve };
}

const SIX_LESSON = divisorLesson(6);
const SEVEN_LESSON = divisorLesson(7);
const EIGHT_LESSON = divisorLesson(8);
const NINE_LESSON = divisorLesson(9);

// ================= „Împărțirea”: cazuri speciale și proba =================
// 🔟 Împărțirea la 10.
const BY_TEN = [
  // Marius a plătit 60 de lei pe mingi; o minge costă 10 lei.
  () => {
    const k = randInt(2, 9); const n = 10 * k;
    return problem(tr('Marius a cumpărat un set de mingi și a plătit {v0}. Câte mingi a cumpărat, dacă o minge costă 10 lei?', { v0: count(n, 'lei') }), k,
      tr('{n} : 10 = {k} mingi, pentru că {v0} × 10 = {v1}.', { n, k, v0: k, v1: n }), [k + 1, n - 10, k - 1]);
  },
  // Pornind de la tabla înmulțirii cu 10, află câturile.
  () => {
    const k = randInt(1, 10); const n = 10 * k;
    return problem(tr('Află câtul: {n} : 10 = ?', { n }), k, tr('{n} : 10 = {k}, pentru că {v0} × 10 = {v1}.', { n, k, v0: k, v1: n }), [k + 1, n - 10, k + 10]);
  },
  () => {
    const k = randInt(2, 10); const n = 10 * k;
    return problem(tr('Află numărul de 10 ori mai mic decât {n}.', { n }), k,
      tr('„De 10 ori mai mic” înseamnă împărțire la 10: {n} : 10 = {k}.', { n, k }), [n - 10, k + 1, k - 1]);
  },
  // Numerele care se împart exact la 10 au cifra unităților 0.
  () => {
    const answer = 10 * randInt(2, 9);
    const others = shuffle([25, 47, 52, 33, 65, 18, 71, 99, 46, 85]).slice(0, 3);
    return {
      text: 'Care dintre aceste numere se împarte exact la 10?',
      answer,
      explanation: tr('{answer} : 10 = {v0}. Numerele care se împart exact la 10 au cifra unităților 0.', { answer, v0: answer / 10 }),
      choices: shuffle([answer, ...others]),
    };
  },
  () => {
    const k = randInt(2, 10);
    return problem(tr('Ce număr, împărțit la 10, dă {k}?', { k }), 10 * k,
      tr('Verificăm cu înmulțirea: {k} × 10 = {v0}, deci {v1} : 10 = {v2}.', { k, v0: 10 * k, v1: 10 * k, v2: k }), [k + 10, 10 * k + 10, k * 2]);
  },
];

// ☝️ Împărțirea la el însuși, la 1 și împărțirea lui 0.
const SPECIAL_CASES = [
  // Albă-ca-Zăpada are 7 nuci și le împarte celor 7 pitici.
  () => {
    const n = pick([7, 7, 5, 6, 8, 9]);
    const text = n === 7
      ? 'Albă-ca-Zăpada are 7 nuci. Ea le împarte în mod egal celor 7 pitici. Câte nuci primește fiecare dintre ei?'
      : tr('Albă-ca-Zăpada are {n} mere. Ea le împarte în mod egal celor {v0} prieteni ai ei. Câte mere primește fiecare?', { n, v0: n });
    return problem(text, 1, tr('{n} : {v0} = 1. Dacă împărțim un număr la el însuși, obținem câtul 1.', { n, v0: n }), [0, n, 2]);
  },
  () => {
    const n = randInt(2, 10);
    return problem(`${n} : ${n} = ?`, 1, tr('Dacă împărțim un număr la el însuși, obținem câtul 1: {n} : {v0} = 1.', { n, v0: n }), [0, n, 2]);
  },
  // Cristi are 5 coifuri și dăruiește fiecărui prieten câte un coif.
  () => {
    const n = randInt(3, 9);
    return problem(tr('Cristi are {n} coifuri. La petrecere, el a dăruit fiecărui prieten câte un coif. Câți prieteni au venit la petrecerea lui Cristi?', { n }), n,
      tr('{n} : 1 = {v0} prieteni. Când împărțim un număr la 1, obținem câtul egal cu acel număr.', { n, v0: n }), [1, n - 1, n + 1]);
  },
  // 0 împărțit la orice număr dă câtul 0.
  () => {
    const n = randInt(2, 10);
    return problem(`0 : ${n} = ?`, 0, tr('0 împărțit la orice număr dă câtul 0: 0 : {n} = 0.', { n }), [1, n, 10]);
  },
  // Transcrie doar împărțirile al căror cât este egal cu 1.
  () => {
    const answer = pick(['9 : 9', '6 : 6', '10 : 10', '2 : 2', '8 : 8', '5 : 5']);
    const others = shuffle(['9 : 3', '90 : 9', '100 : 10', '12 : 2', '8 : 1', '0 : 4']).slice(0, 3);
    return {
      text: 'Care împărțire are câtul egal cu 1?',
      answer,
      explanation: tr('{answer} = 1. Dacă împărțim un număr la el însuși, obținem câtul 1.', { answer }),
      choices: shuffle([answer, ...others]),
    };
  },
  // Împărțirea la 0 nu are sens.
  () => {
    const n = randInt(2, 9);
    return {
      text: 'Care dintre aceste împărțiri nu are sens?',
      answer: `${n} : 0`,
      explanation: tr('0 : {n} = 0, dar {v0} : 0 nu are sens — împărțirea la 0 nu are sens!', { n, v0: n }),
      choices: shuffle([`${n} : 0`, `0 : ${n}`, `${n} : 1`, `${n} : ${n}`]),
    };
  },
];

// ✅ Proba înmulțirii și a împărțirii.
const PROOF = [
  // Teodora a cumpărat 8 cutii cu câte 7 brioșe: calcul și proba prin împărțire.
  () => {
    const a = randInt(3, 9); const b = randInt(3, 9); const p = a * b;
    return stepped(tr('Pentru o petrecere, Teodora a cumpărat {a} cutii cu câte {b} brioșe fiecare. Câte brioșe sunt în total? Fă și proba prin împărțire.', { a, b }), [
      [tr('Câte brioșe în total? {a} × {b} = ?', { a, b }), p, [p + 1, p - 1, a + b]],
      [tr('Proba prin împărțire: {p} : {a} = ?', { p, a }), b, [b + 1, b - 1, a]],
    ], tr('{a} × {b} = {p} brioșe. Proba: {v0} : {v1} = {v2} (sau {v3} : {v4} = {v5}).', { a, b, p, v0: p, v1: a, v2: b, v3: p, v4: b, v5: a }));
  },
  // Teodora împarte în mod egal 56 de brioșe pe 8 farfurii: calcul și proba prin înmulțire.
  () => {
    const d = randInt(3, 9); const q = randInt(3, 9); const n = d * q;
    return stepped(tr('Teodora împarte în mod egal {v0} pe {d} farfurii. Câte brioșe pune pe o farfurie? Fă și proba prin înmulțire.', { v0: count(n, 'brioșe'), d }), [
      [tr('Câte brioșe pe o farfurie? {n} : {d} = ?', { n, d }), q, [q + 1, q - 1, d]],
      [tr('Proba prin înmulțire: {q} × {d} = ?', { q, d }), n, [n + 1, n - d, n + d]],
    ], tr('{n} : {d} = {q} brioșe. Proba: {v0} × {v1} = {v2}.', { n, d, q, v0: q, v1: d, v2: n }));
  },
  // Calculează, apoi efectuează proba: 24 : 3 = ?, proba 8 × 3.
  () => {
    const [n, d] = pick([[24, 3], [72, 9], [42, 6], [35, 5], [48, 8], [63, 7], [36, 4]]);
    const q = n / d;
    return stepped(tr('Calculează, apoi efectuează proba: {n} : {d} = ?', { n, d }), [
      [`${n} : ${d} = ?`, q, [q + 1, q - 1, d]],
      [tr('Proba: {q} × {d} = ?', { q, d }), n, [n + 1, n - 1, n + d]],
    ], tr('{n} : {d} = {q}. Proba: {v0} × {v1} = {v2} ✅', { n, d, q, v0: q, v1: d, v2: n }));
  },
  // Scrie toate operațiile folosind numerele de pe pălării: 3, 9, 27.
  () => {
    const [a, b] = pick([[3, 9], [5, 8], [7, 9], [8, 6], [4, 6], [6, 7]]); const p = a * b;
    const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
    return problem(tr('Pe o pălărie sunt numerele {a}, {b} și {p}. Știm că {v0} × {v1} = {v2}. Cât este {v3} : {x}?', { a, b, p, v0: a, v1: b, v2: p, v3: p, x }), y,
      tr('Din {a} × {b} = {p} scriem și împărțirile: {v0} : {v1} = {v2} și {v3} : {v4} = {v5}.', { a, b, p, v0: p, v1: a, v2: b, v3: p, v4: b, v5: a }), [y + 1, x, y - 1]);
  },
  // Care este proba împărțirii?
  () => {
    const [n, d] = pick([[42, 6], [56, 8], [27, 3], [45, 5], [63, 9], [28, 7], [32, 4]]); const q = n / d;
    return {
      text: tr('Care este proba prin înmulțire pentru împărțirea {n} : {d} = {q}?', { n, d, q }),
      answer: `${q} × ${d} = ${n}`,
      explanation: tr('Proba împărțirii se face prin înmulțire: câtul × împărțitorul = deîmpărțitul, adică {q} × {d} = {n}.', { q, d, n }),
      choices: shuffle([`${q} × ${d} = ${n}`, `${q} + ${d} = ${q + d}`, `${n} − ${d} = ${n - d}`, `${n} + ${q} = ${n + q}`]),
    };
  },
];

// 🧩 Probleme rezolvate și verificate prin proba.
const PROOF_SOLVE = [
  // Pentru 5 ascuțitori voi plăti 15 lei: cât costă o ascuțitoare? (pe pași, cu proba)
  () => {
    const k = randInt(2, 6); const many = pick([3, 4, 5]); const total = k * many;
    return stepped(tr('Adela spune: „Pentru {many} ascuțitori voi plăti {v0}.” Cât costă o ascuțitoare? Verifică apoi prin proba înmulțirii.', { many, v0: count(total, 'lei') }), [
      [tr('Cât costă o ascuțitoare? {total} : {many} = ?', { total, many }), k, [k + 1, total - many, k - 1]],
      [tr('Proba: {k} × {many} = ?', { k, many }), total, [total + 1, total - 1, k + many]],
    ], tr('{total} : {many} = {k} lei. Proba: {v0} × {v1} = {v2} ✅', { total, many, k, v0: k, v1: many, v2: total }));
  },
  // Dacă Alex și-ar tripla suma, ar avea 27 de lei. Câți lei are?
  () => {
    const k = randInt(3, 9); const total = 3 * k;
    return stepped(tr('Dacă Alex și-ar tripla suma din pușculiță, ar avea {v0}. Câți lei are băiatul în pușculiță?', { v0: count(total, 'lei') }), [
      [tr('A tripla înseamnă a înmulți cu 3, deci căutăm: {total} : 3 = ?', { total }), k, [k + 1, total - 3, k + 3]],
      [tr('Proba: {k} × 3 = ?', { k }), total, [total + 1, total - 3, k + 3]],
    ], tr('{total} : 3 = {k} lei. Proba: {v0} × 3 = {v1} ✅', { total, k, v0: k, v1: total }));
  },
  // Într-o cutie sunt 7 creioane. Câte creioane sunt în 5 cutii? (cu proba prin împărțire)
  () => {
    const per = randInt(4, 9); const boxes = randInt(3, 6); const total = per * boxes;
    return stepped(tr('Într-o cutie sunt {per} creioane. Câte creioane sunt în {boxes} cutii de același fel? Verifică prin operația inversă.', { per, boxes }), [
      [`${per} × ${boxes} = ?`, total, [total + 1, total - 1, per + boxes]],
      [tr('Proba: {total} : {boxes} = ?', { total, boxes }), per, [per + 1, per - 1, boxes]],
    ], tr('{per} × {boxes} = {total} creioane. Proba: {v0} : {v1} = {v2} ✅', { per, boxes, total, v0: total, v1: boxes, v2: per }));
  },
  // Bunica a împărțit 32 de cireșe, în mod egal, celor 4 nepoți. (cu proba prin înmulțire)
  () => {
    const kids = pick([2, 3, 4, 5]); const each = randInt(4, 9); const total = kids * each;
    return stepped(tr('Bunica a împărțit {v0}, în mod egal, celor {kids} nepoți. Câte cireșe a primit fiecare? Verifică prin operația inversă.', { v0: count(total, 'cireșe'), kids }), [
      [`${total} : ${kids} = ?`, each, [each + 1, each - 1, total - kids]],
      [tr('Proba: {each} × {kids} = ?', { each, kids }), total, [total + 1, total - 1, each + kids]],
    ], tr('{total} : {kids} = {each} cireșe. Proba: {v0} × {v1} = {v2} ✅', { total, kids, each, v0: each, v1: kids, v2: total }));
  },
];

const BY_LEVEL = {
  imp1: DISCOVER, imp2: APPLY, imp3: PRACTICE, imp4: SOLVE,
  imp5: BY_TEN, imp6: SPECIAL_CASES, imp7: PROOF, imp8: PROOF_SOLVE,
  impd1: HALF_DISCOVER, impd2: HALF_APPLY, impd3: HALF_PRACTICE, impd4: HALF_SOLVE,
  impt1: THIRD_DISCOVER, impt2: THIRD_APPLY, impt3: THIRD_PRACTICE, impt4: THIRD_SOLVE,
  impq1: QUARTER_DISCOVER, impq2: QUARTER_APPLY, impq3: QUARTER_PRACTICE, impq4: QUARTER_SOLVE,
  impc1: FIFTH_DISCOVER, impc2: FIFTH_APPLY, impc3: FIFTH_PRACTICE, impc4: FIFTH_SOLVE,
  impsa1: SIX_LESSON.discover, impsa2: SIX_LESSON.apply, impsa3: SIX_LESSON.practice, impsa4: SIX_LESSON.solve,
  impse1: SEVEN_LESSON.discover, impse2: SEVEN_LESSON.apply, impse3: SEVEN_LESSON.practice, impse4: SEVEN_LESSON.solve,
  impo1: EIGHT_LESSON.discover, impo2: EIGHT_LESSON.apply, impo3: EIGHT_LESSON.practice, impo4: EIGHT_LESSON.solve,
  impn1: NINE_LESSON.discover, impn2: NINE_LESSON.apply, impn3: NINE_LESSON.practice, impn4: NINE_LESSON.solve,
};

export function isDivisionLevel(level) {
  return DIVISION_LEVELS.includes(level) || HALF_LEVELS.includes(level) || THIRD_LEVELS.includes(level)
    || QUARTER_LEVELS.includes(level) || FIFTH_LEVELS.includes(level)
    || DIV6_LEVELS.includes(level) || DIV7_LEVELS.includes(level)
    || DIV8_LEVELS.includes(level) || DIV9_LEVELS.includes(level);
}

export function buildDivisionProblem(level) {
  return { ...pick(BY_LEVEL[level])(), badge: BADGES[level] };
}
