// „Înmulțirea cu 5” — exerciții pe cele 4 secțiuni ale insulei:
// Învăț, Încerc, Mă antrenez, Probleme.
// Un exercițiu e fie o înmulțire simplă ({ kind: 'mult', a, b }), afișată mare
// cu buline la explicație, fie o problemă cu text și variante de răspuns.
import { makeAnswers } from './data';
import { tr } from './i18n';

const BADGES = {
  cinci1: '🔍 Descopăr',
  cinci2: '✏️ Aplic',
  cinci3: '⭐ Exersez',
  cinci4: '🧩 Rezolv probleme',
};
const TRUE_FALSE = ['Adevărat', 'Fals'];
const GIRLS = ['Diana', 'Ioana', 'Mara', 'Sofia', 'Elena', 'Ana', 'Roxana'];

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

function trueFalse(text, isTrue, explanation) {
  return { text, answer: isTrue ? 'Adevărat' : 'Fals', explanation, choices: TRUE_FALSE };
}

function mult(a, b) {
  return { kind: 'mult', a, b };
}

// ---------- 🔍 Descopăr ----------
const DISCOVER = [
  () => (Math.random() < 0.5 ? mult(randInt(1, 10), 5) : mult(5, randInt(1, 10))),
  () => {
    const n = randInt(2, 10);
    return problem(tr('Continuă după model: 5 × {n} = {v0}, deci {v1} × 5 = ?', { n, v0: 5 * n, v1: n }), 5 * n,
      tr('Dacă schimbăm ordinea factorilor, rezultatul rămâne același: {n} × 5 = 5 × {v0} = {v1}.', { n, v0: n, v1: 5 * n }),
      [5 + n, 5 * n + 5, 5 * n - 5]);
  },
  () => {
    const n = randInt(2, 10);
    return problem(tr('Completează: {n} × 5 = {v0} × 5 + 5 = ?', { n, v0: n - 1 }), 5 * n,
      tr('Știm că {v0} × 5 = {v1}. Mai adăugăm încă un 5: {v2} + 5 = {v3}.', { v0: n - 1, v1: 5 * (n - 1), v2: 5 * (n - 1), v3: 5 * n }),
      [5 * (n - 1), 5 * n + 5, n + 5]);
  },
  () => {
    const friends = randInt(2, 9); const girl = pick(GIRLS);
    return problem(tr('{girl} pune câte 5 căpșuni în fiecare dintre cele {friends} cutiuțe. Câte căpșuni pune în total?', { girl, friends }),
      5 * friends,
      tr('Câte 5 căpșuni în fiecare cutiuță: {v0} = {friends} × 5 = {v1} căpșuni.', { v0: Array(friends).fill(5).join(' + '), friends, v1: 5 * friends }),
      [5 + friends, 5 * friends + 5, 5 * (friends - 1)]);
  },
];

// ---------- ✏️ Aplic ----------
const APPLY = [
  // A. Efectuează
  () => mult(randInt(1, 10), 5),
  // B. Calculează (trei factori)
  () => {
    const a = randInt(1, 3); const b = randInt(1, Math.floor(10 / a));
    return problem(tr('Calculează: {a} × {b} × 5 = ?', { a, b }), a * b * 5,
      tr('Întâi {a} × {b} = {v0}, apoi {v1} × 5 = {v2}.', { a, b, v0: a * b, v1: a * b, v2: a * b * 5 }), [a + b + 5, a * b + 5, a * 5]);
  },
  // C. Mărește de 5 ori
  () => {
    const n = randInt(2, 10);
    return problem(tr('Mărește de 5 ori numărul {n}.', { n }), 5 * n,
      tr('„Mărește de 5 ori” înseamnă că înmulțim cu 5: {n} × 5 = {v0}.', { n, v0: 5 * n }), [n + 5, 5 * n + 5, 5 * n - 5]);
  },
  // D. Care număr poate fi rezultat al înmulțirii cu 5?
  () => {
    const good = 5 * randInt(1, 10);
    const bad = new Set();
    while (bad.size < 3) {
      const v = randInt(3, 54);
      if (v % 5 !== 0) bad.add(v);
    }
    return {
      text: 'Care dintre aceste numere poate fi rezultatul unei înmulțiri cu 5?',
      answer: good,
      explanation: tr('Rezultatul înmulțirii unui număr cu 5 are cifra unităților 0 sau 5. Doar {good} se termină în {v0}.', { good, v0: good % 10 }),
      choices: shuffle([good, ...bad]),
    };
  },
  () => {
    const bad = pick([12, 18, 23, 27, 31, 33, 36, 42, 44, 48, 53]);
    const good = new Set();
    while (good.size < 3) good.add(5 * randInt(1, 10));
    return {
      text: 'Care dintre aceste numere NU poate fi rezultatul unei înmulțiri cu 5?',
      answer: bad,
      explanation: tr('Rezultatele înmulțirii cu 5 se termină în 0 sau 5. {bad} se termină în {v0}, deci nu poate fi.', { bad, v0: bad % 10 }),
      choices: shuffle([bad, ...good]),
    };
  },
];

// ---------- ⭐ Exersez ----------
const PRACTICE = [
  () => {
    const n = randInt(2, 10);
    return problem(tr('Află produsul numerelor {n} și 5.', { n }), 5 * n,
      tr('Produsul înseamnă înmulțirea: {n} × 5 = {v0}.', { n, v0: 5 * n }), [n + 5, 5 * n + 5, 5 * n - n]);
  },
  () => {
    const n = randInt(2, 10);
    return problem(tr('Află numărul de 5 ori mai mare decât {n}.', { n }), 5 * n,
      tr('„De 5 ori mai mare” înseamnă înmulțire: {n} × 5 = {v0}.', { n, v0: 5 * n }), [n + 5, 5 * n + 5, 5 * n - 5]);
  },
  () => {
    const x = randInt(1, 10);
    const eq = pick([`5 × □ = ${5 * x}`, `□ × 5 = ${5 * x}`]);
    return problem(tr('Completează cu factorul care lipsește: {eq}', { eq }), x,
      tr('Căutăm numărul care înmulțit cu 5 dă {v0}: {x} × 5 = {v1}.', { v0: 5 * x, x, v1: 5 * x }), [5 * x - 5, x + 1, 5]);
  },
  () => {
    const a = pick([2, 4, 6, 8]);
    return problem(tr('Completează cu factorul care lipsește: {a} × □ = {v0}', { a, v0: a * 5 }), 5,
      tr('Căutăm numărul care înmulțit cu {a} dă {v0}: {v1} × 5 = {v2}.', { a, v0: a * 5, v1: a, v2: a * 5 }), [a, a * 5 - a, 4]);
  },
  () => {
    const kind = randInt(1, 3);
    if (kind === 1) {
      const n = pick([2, 3, 4, 6, 7, 8, 9]);
      return trueFalse(tr('Adevărat sau fals? {n} × 5 = 5 × {v0}', { n, v0: n }), true,
        tr('Schimbând ordinea factorilor, produsul nu se schimbă: amândouă dau {v0}. Adevărat!', { v0: 5 * n }));
    }
    if (kind === 2) {
      const [l, r] = pick([[[5, 8], [4, 9]], [[5, 6], [4, 7]], [[3, 5], [2, 8]], [[5, 7], [6, 6]]]);
      return trueFalse(tr('Adevărat sau fals? {v0} × {v1} = {v2} × {v3}', { v0: l[0], v1: l[1], v2: r[0], v3: r[1] }), false,
        tr('{v0} × {v1} = {v2}, dar {v3} × {v4} = {v5}. Nu sunt egale — fals.', { v0: l[0], v1: l[1], v2: l[0] * l[1], v3: r[0], v4: r[1], v5: r[0] * r[1] }));
    }
    const [l, r] = pick([[[6, 5], [10, 3]], [[8, 5], [10, 4]], [[4, 5], [10, 2]], [[2, 5], [10, 1]], [[10, 5], [5, 10]]]);
    return trueFalse(tr('Adevărat sau fals? {v0} × {v1} = {v2} × {v3}', { v0: l[0], v1: l[1], v2: r[0], v3: r[1] }), true,
      tr('{v0} × {v1} = {v2} și {v3} × {v4} = {v5}. Sunt egale — adevărat!', { v0: l[0], v1: l[1], v2: l[0] * l[1], v3: r[0], v4: r[1], v5: r[0] * r[1] }));
  },
  () => {
    const a = randInt(2, 10);
    return problem(tr('Dacă a = {a}, cât este a × 5?', { a }), 5 * a,
      tr('Înlocuim a cu {a}: {v0} × 5 = {v1}.', { a, v0: a, v1: 5 * a }), [a + 5, 5 * a + 5, 5 * a - a]);
  },
  () => {
    const limit = pick([18, 22, 27, 33, 39, 44, 48]);
    const best = Math.floor((limit - 1) / 5);
    return problem(tr('Care este cel mai mare număr care se potrivește? 5 × □ < {limit}', { limit }), best,
      tr('5 × {best} = {v0}, mai mic decât {limit}. Dar 5 × {v1} = {v2}, prea mare.', { best, v0: 5 * best, limit, v1: best + 1, v2: 5 * (best + 1) }),
      [best + 1, best - 1, limit - 5]);
  },
  () => {
    const limit = pick([15, 20, 25, 30, 35, 40]);
    const best = limit / 5 + 1;
    return problem(tr('Care este cel mai mic număr care se potrivește? □ × 5 > {limit}', { limit }), best,
      tr('{v0} × 5 = {limit}, care nu e mai mare decât {v1}. Următorul: {best} × 5 = {v2} > {v3}.', { v0: limit / 5, limit, v1: limit, best, v2: 5 * best, v3: limit }),
      [best - 1, best + 1, limit - 5]);
  },
  () => {
    const limit = pick([20, 25, 30, 35, 40, 45]);
    const best = limit / 5 - 1;
    return problem(tr('Care este cel mai mare număr care se potrivește? {limit} > 5 × □', { limit }), best,
      tr('5 × {best} = {v0}, care e mai mic decât {limit}. Dar 5 × {v1} = {v2}, nu e mai mic.', { best, v0: 5 * best, limit, v1: best + 1, v2: limit }),
      [best + 1, best - 1, limit / 5 + 1]);
  },
];

// ---------- 🧩 Rezolv probleme ----------
const SOLVE = [
  // O mănușă are 5 degete. Câte degete au câteva perechi de mănuși?
  () => {
    const pairs = randInt(2, 5);
    const answer = pairs * 2 * 5;
    return problem(tr('O mănușă are 5 degete. Câte degete au, la un loc, {pairs} perechi de mănuși?', { pairs }), answer,
      tr('Modul I: o pereche are 2 × 5 = 10 degete; {pairs} perechi: {v0} × 10 = {answer}. ', { pairs, v0: pairs, answer })
      + tr('Modul II: {pairs} perechi înseamnă {v0} × 2 = {v1} mănuși; {v2} × 5 = {answer} degete.', { pairs, v0: pairs, v1: pairs * 2, v2: pairs * 2, answer }),
      [pairs * 5, pairs * 2 + 5, answer + 5]);
  },
  // O fată și 4 prietene — 5 fete la piscină.
  () => {
    const girl = pick(GIRLS); const price = randInt(2, 10);
    return problem(tr('{girl} merge la piscină împreună cu 4 prietene. ', { girl })
      + tr('Intrarea costă {price} lei de persoană. Cât plătesc fetele în total?', { price }), 5 * price,
      tr('Sunt {girl} plus 4 prietene, adică 5 fete. 5 × {price} = {v0} lei.', { girl, price, v0: 5 * price }), [4 * price, 5 + price, 5 * price + price]);
  },
  // O barcă pe lac: câțiva copii la o plimbare, 5 plimbări.
  () => {
    const per = randInt(4, 10);
    return problem(tr('Într-o barcă de pe lac încap cel mult {per} copii. ', { per })
      + tr('Barca face 5 plimbări. Câți copii se pot plimba cel mult?'), 5 * per,
      tr('La fiecare din cele 5 plimbări urcă {per} copii: 5 × {v0} = {v1}.', { per, v0: per, v1: 5 * per }), [per + 5, 5 * per - per, 5 * per + per]);
  },
  // Scaune câte 5 pe rând la serbare; câteva sunt ocupate.
  () => {
    const rows = randInt(4, 10); const total = 5 * rows; const sold = randInt(Math.ceil(total / 2), total - 1);
    return problem(tr('Pentru serbare, scaunele au fost puse câte 5 pe {rows} rânduri. ', { rows })
      + tr('Au venit {sold} părinți și fiecare s-a așezat pe un scaun. Câte scaune au rămas libere?', { sold }), total - sold,
      tr('Întâi aflăm câte scaune sunt: {rows} × 5 = {total}. Apoi scădem: {v0} - {sold} = {v1}.', { rows, total, v0: total, sold, v1: total - sold }),
      [total, total + sold, total - sold + 1]);
  },
  // Clătite cu gem și de 5 ori mai multe cu ciocolată.
  () => {
    const mint = randInt(2, 9); const fruit = 5 * mint;
    return problem(tr('La o tarabă s-au vândut {mint} clătite cu gem și de 5 ori mai multe clătite cu ciocolată. ', { mint })
      + tr('Câte clătite s-au vândut în total?'), mint + fruit,
      tr('Cu ciocolată: {mint} × 5 = {fruit} clătite. În total: {v0} + {v1} = {v2}.', { mint, fruit, v0: mint, v1: fruit, v2: mint + fruit }),
      [fruit, mint + 5, mint * 7]);
  },
  // O cutie are 5 creioane verzi și câteva galbene; câte în 5 cutii? (în două moduri)
  () => {
    const white = randInt(2, 5);
    const per = 5 + white; const answer = 5 * per;
    return problem(tr('O cutie are 5 creioane verzi și {white} creioane galbene. Câte creioane sunt în 5 cutii la fel?', { white }), answer,
      tr('Modul I: într-o cutie sunt 5 + {white} = {per} creioane; în 5 cutii: 5 × {v0} = {answer}. ', { white, per, v0: per, answer })
      + tr('Modul II: 5 × 5 = 25 verzi și 5 × {white} = {v0} galbene; 25 + {v1} = {answer}.', { white, v0: 5 * white, v1: 5 * white, answer }),
      [25 + white, per + 5, 25]);
  },
  // Triplul lui 5 adunat cu un produs.
  () => {
    const a = randInt(2, 9); const b = randInt(2, 9);
    const answer = 15 + a * b;
    return problem(tr('Adună triplul lui 5 cu rezultatul lui {a} × {b}. Ce obții?', { a, b }), answer,
      tr('Triplul lui 5: 3 × 5 = 15. Produsul: {a} × {b} = {v0}. Suma: 15 + {v1} = {answer}.', { a, b, v0: a * b, v1: a * b, answer }),
      [8 + a * b, 15 + a + b, a * b]);
  },
  // Mâini și degete, stele de mare.
  () => {
    const [one, many, part] = pick([['O mână', 'mâini', 'degete'], ['O stea de mare', 'stele de mare', 'brațe'], ['O floare', 'flori', 'petale']]);
    const n = randInt(2, 10);
    return problem(tr('{one} are 5 {part}. Câte {v0} au {n} {many}?', { one, part, v0: part, n, many }), 5 * n,
      tr('Câte 5 {part} pentru fiecare: {n} × 5 = {v0}.', { part, n, v0: 5 * n }), [n + 5, 5 * n + 5, 5 * n - 5]);
  },
  // Monede de 5 lei.
  () => {
    const n = randInt(2, 10); const girl = pick(GIRLS);
    return problem(tr('{girl} are {n} bancnote de câte 5 lei. Câți lei are în total?', { girl, n }), 5 * n,
      tr('{n} bancnote × 5 lei = {v0} lei.', { n, v0: 5 * n }), [n + 5, 5 * n + 5, 5 * n - 5]);
  },
];

const BY_LEVEL = { cinci1: DISCOVER, cinci2: APPLY, cinci3: PRACTICE, cinci4: SOLVE };

export function buildFiveProblem(level) {
  return { ...pick(BY_LEVEL[level])(), badge: BADGES[level] };
}
