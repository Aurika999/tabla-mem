// Probleme pentru „Insula Isteților”: fără înmulțire — adunări, scăderi,
// comparații („cu atât mai mult / mai puțin”), bani, vârste, ore și șiruri.
import { makeAnswers } from './data';
import { tr } from './i18n';

const NAMES = ['Andrei', 'Mara', 'Ioana', 'Matei', 'Elena', 'David', 'Sofia', 'Alex', 'Diana', 'Bogdan', 'Ana', 'Luca'];
const THINGS = ['mere', 'bomboane', 'baloane', 'creioane', 'cărți', 'biluțe', 'abțibilduri', 'nuci', 'scoici', 'timbre'];

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function twoNames() {
  const first = pick(NAMES);
  let second = pick(NAMES);
  while (second === first) second = pick(NAMES);
  return [first, second];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Răspunsul corect + greșeli tipice (ex. a adunat în loc să scadă), apoi completăm.
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

// ---------- Nivelul 1: adunări și scăderi până la 20 ----------
const LEVEL1 = [
  () => {
    const [n] = twoNames(); const t = pick(THINGS);
    const a = randInt(3, 12); const b = randInt(2, 20 - a);
    return problem(tr('{n} are {a} {t}. Mai primește {b} {v0}. Câte {v1} are acum?', { n, a, t, b, v0: t, v1: t }), a + b,
      tr('A primit mai multe, deci adunăm: {a} + {b} = {v0}.', { a, b, v0: a + b }), [a - b, a + b + 1, a + b - 1]);
  },
  () => {
    const [n] = twoNames();
    const a = randInt(8, 20); const b = randInt(2, a - 1);
    return problem(tr('{n} avea {a} baloane. S-au spart {b}. Câte baloane i-au rămas?', { n, a, b }), a - b,
      tr('Unele s-au spart, deci scădem: {a} - {b} = {v0}.', { a, b, v0: a - b }), [a + b, a - b + 1, b]);
  },
  () => {
    const a = randInt(5, 12); const b = randInt(4, 20 - a);
    return problem(tr('Într-o clasă sunt {a} fete și {b} băieți. Câți copii sunt în clasă?', { a, b }), a + b,
      tr('Toți copiii împreună: {a} + {b} = {v0}.', { a, b, v0: a + b }), [a - b, Math.abs(a - b), a + b + 2]);
  },
  () => {
    const a = randInt(9, 20); const b = randInt(2, a - 2);
    return problem(tr('Pe o ramură erau {a} vrăbii. Au zburat {b}. Câte vrăbii au rămas pe ramură?', { a, b }), a - b,
      tr('Au zburat, deci scădem: {a} - {b} = {v0}.', { a, b, v0: a - b }), [a + b, a - b - 1, b]);
  },
  () => {
    const [n] = twoNames();
    const a = randInt(3, 10); const b = randInt(3, 10);
    return problem(tr('{n} a citit {a} pagini luni și {b} pagini marți. Câte pagini a citit în cele două zile?', { n, a, b }), a + b,
      tr('Adunăm paginile din ambele zile: {a} + {b} = {v0}.', { a, b, v0: a + b }), [Math.abs(a - b), a + b - 1, a + b + 1]);
  },
  () => {
    const [n] = twoNames(); const t = pick(THINGS);
    const total = randInt(10, 20); const a = randInt(2, total - 3);
    return problem(tr('{n} are {total} {t}. Dă {a} {v0} prietenului său. Câte {v1} îi rămân?', { n, total, t, a, v0: t, v1: t }), total - a,
      tr('A dat o parte, deci scădem: {total} - {a} = {v0}.', { total, a, v0: total - a }), [total + a, total - a + 1, a]);
  },
];

// ---------- Nivelul 2: mai mult / mai puțin, bani, vârste (până la 50) ----------
const LEVEL2 = [
  () => {
    const [n1, n2] = twoNames(); const t = pick(THINGS);
    const a = randInt(6, 40); const b = randInt(1, Math.min(9, a - 1));
    return problem(tr('{n1} are {a} {t}, iar {n2} are cu {b} mai puține. Câte {v0} are {v1}?', { n1, a, t, n2, b, v0: t, v1: n2 }), a - b,
      tr('„Cu {b} mai puține” înseamnă că scădem: {a} - {v0} = {v1}.', { b, a, v0: b, v1: a - b }), [a + b, a - b + 1, a - b - 1]);
  },
  () => {
    const [n1, n2] = twoNames(); const t = pick(THINGS);
    const a = randInt(5, 35); const b = randInt(2, 15);
    return problem(tr('{n1} are {a} {t}, iar {n2} are cu {b} mai multe. Câte {v0} are {v1}?', { n1, a, t, n2, b, v0: t, v1: n2 }), a + b,
      tr('„Cu {b} mai multe” înseamnă că adunăm: {a} + {v0} = {v1}.', { b, a, v0: b, v1: a + b }), [a - b, a + b + 1, a + b - 1]);
  },
  () => {
    const [n1, n2] = twoNames(); const t = pick(THINGS);
    const b = randInt(5, 30); const a = b + randInt(2, 15);
    return problem(tr('{n1} are {a} {t}, iar {n2} are {b}. Cu câte {v0} are {v1} mai multe decât {v2}?', { n1, a, t, n2, b, v0: t, v1: n1, v2: n2 }), a - b,
      tr('Ca să aflăm „cu cât mai mult”, scădem: {a} - {b} = {v0}.', { a, b, v0: a - b }), [a + b, a - b + 1, a - b - 1]);
  },
  () => {
    const [n] = twoNames();
    const money = randInt(15, 50); const price = randInt(5, money - 2);
    return problem(tr('{n} are {money} lei. Cumpără o jucărie care costă {price} lei. Câți lei îi rămân?', { n, money, price }), money - price,
      tr('Din bani scădem prețul: {money} - {price} = {v0}.', { money, price, v0: money - price }), [money + price, money - price + 1, price]);
  },
  () => {
    const [n] = twoNames(); const t = pick(THINGS);
    const goal = randInt(15, 50); const has = randInt(3, goal - 2);
    return problem(tr('{n} are {has} {t} și vrea să aibă {goal}. Câte {v0} îi mai trebuie?', { n, has, t, goal, v0: t }), goal - has,
      tr('Din cât vrea scădem cât are: {goal} - {has} = {v0}.', { goal, has, v0: goal - has }), [goal + has, goal - has + 1, has]);
  },
  () => {
    const [n] = twoNames();
    const age = randInt(6, 12); const diff = randInt(2, 9);
    return problem(tr('{n} are {age} ani și are un frate cu {diff} ani mai mare. Câți ani are fratele?', { n, age, diff }), age + diff,
      tr('„Mai mare cu {diff} ani” înseamnă că adunăm: {age} + {v0} = {v1}.', { diff, age, v0: diff, v1: age + diff }), [age - diff, age + diff + 1, diff]);
  },
];

// ---------- Nivelul 3: probleme în doi pași, ore, șiruri (până la 100) ----------
const LEVEL3 = [
  () => {
    const [n] = twoNames(); const t = pick(THINGS);
    const a = randInt(20, 60); const b = randInt(5, 25); const c = randInt(5, a + b - 5);
    const r = a + b - c;
    return problem(tr('{n} are {a} {t}. Mai primește {b}, apoi dă {c} unei prietene. Câte {v0} are la final?', { n, a, t, b, c, v0: t }), r,
      tr('Întâi adunăm ce a primit: {a} + {b} = {v0}. Apoi scădem ce a dat: {v1} - {c} = {r}.', { a, b, v0: a + b, v1: a + b, c, r }), [a + b + c, a - b + c, a + b]);
  },
  () => {
    const a = randInt(15, 50); const off = randInt(3, Math.min(15, a - 1)); const on = randInt(3, 20);
    const r = a - off + on;
    return problem(tr('Într-un autobuz sunt {a} pasageri. La stație coboară {off} și urcă {on}. Câți pasageri sunt acum în autobuz?', { a, off, on }), r,
      tr('Cei care coboară pleacă: {a} - {off} = {v0}. Cei care urcă se adaugă: {v1} + {on} = {r}.', { a, off, v0: a - off, v1: a - off, on, r }), [a + off + on, a + off - on, a - off]);
  },
  () => {
    const [n1, n2] = twoNames(); const t = pick(THINGS);
    const a = randInt(10, 40); const b = randInt(3, 15); const second = a + b;
    return problem(tr('{n1} are {a} {t}, iar {n2} are cu {b} mai multe. Câte {v0} au împreună?', { n1, a, t, n2, b, v0: t }), a + second,
      tr('Întâi aflăm cât are {n2}: {a} + {b} = {second}. Apoi adunăm: {v0} + {v1} = {v2}.', { n2, a, b, second, v0: a, v1: second, v2: a + second }), [second, a + b, a + second - b]);
  },
  () => {
    const start = randInt(8, 15); const dur = randInt(1, 4);
    return problem(tr('Un film începe la ora {start} și durează {dur} {v0}. La ce oră se termină?', { start, dur, v0: dur === 1 ? 'oră' : 'ore' }), start + dur,
      tr('Adunăm durata la ora de început: {start} + {dur} = {v0}.', { start, dur, v0: start + dur }), [start - dur, start + dur + 1, dur]);
  },
  () => {
    const startN = randInt(2, 30); const step = randInt(2, 10);
    const seq = [0, 1, 2, 3].map(i => startN + i * step);
    const next = startN + 4 * step;
    return problem(tr('Ce număr urmează în șir: {v0}, …?', { v0: seq.join(', ') }), next,
      tr('Fiecare număr crește cu {step}: {v0} + {v1} = {next}.', { step, v0: seq[3], v1: step, next }), [next + step, next - 1, seq[3] + 1]);
  },
  () => {
    const [n] = twoNames();
    const age = randInt(6, 14); const years = randInt(3, 20);
    return problem(tr('{n} are acum {age} ani. Câți ani va avea peste {years} ani?', { n, age, years }), age + years,
      tr('Adunăm anii care vor trece: {age} + {years} = {v0}.', { age, years, v0: age + years }), [age - years, age + years + 1, years]);
  },
];

// ---------- Nivelul 4: „Exersez și rezolv” — ca în manual (înmulțiri + probleme) ----------
const TRUE_FALSE = ['Adevărat', 'Fals'];

function trueFalse(text, isTrue, explanation) {
  return { text, answer: isTrue ? 'Adevărat' : 'Fals', explanation, choices: TRUE_FALSE };
}

const LEVEL4 = [
  // Află produsul numerelor.
  () => {
    const a = randInt(2, 9); const b = randInt(2, 9);
    return problem(tr('Află produsul numerelor {a} și {b}.', { a, b }), a * b,
      tr('Produsul înseamnă înmulțirea: {a} × {b} = {v0}.', { a, b, v0: a * b }), [a + b, a * b + a, a * b - b]);
  },
  // Află numărul de 5 ori mai mare decât…
  () => {
    const k = randInt(2, 5); const n = randInt(2, 10);
    return problem(tr('Află numărul de {k} ori mai mare decât {n}.', { k, n }), n * k,
      tr('„De {k} ori mai mare” înseamnă că înmulțim: {n} × {v0} = {v1}.', { k, n, v0: k, v1: n * k }), [n + k, n * k + k, n * k - n]);
  },
  // Completează cu factorul care lipsește.
  () => {
    const a = randInt(2, 9); const x = randInt(1, 9); const left = Math.random() < 0.5;
    const eq = left ? `□ × ${a} = ${a * x}` : `${a} × □ = ${a * x}`;
    return problem(tr('Completează factorul care lipsește: {eq}', { eq }), x,
      tr('Căutăm numărul care înmulțit cu {a} dă {v0}: {v1} × {x} = {v2}.', { a, v0: a * x, v1: a, x, v2: a * x }), [a * x - a, x + 1, a]);
  },
  // Adevărat sau fals.
  () => {
    const a = randInt(2, 9); const b = randInt(2, 9);
    const kind = randInt(1, 3);
    if (kind === 1) {
      return trueFalse(tr('Adevărat sau fals? {a} × {b} = {v0} × {v1}', { a, b, v0: b, v1: a }), true,
        tr('Dacă schimbăm ordinea factorilor, produsul rămâne același: {v0} = {v1}. Adevărat!', { v0: a * b, v1: a * b }));
    }
    if (kind === 2) {
      const c = b + 1;
      return trueFalse(tr('Adevărat sau fals? {a} × {b} = {v0} × {c}', { a, b, v0: a, c }), false,
        tr('{a} × {b} = {v0}, dar {v1} × {c} = {v2}. Nu sunt egale, deci e fals.', { a, b, v0: a * b, v1: a, c, v2: a * c }));
    }
    const p = a * b; const c = randInt(2, 9); const isTrue = p % c === 0 && p / c <= 10;
    const d = isTrue ? p / c : randInt(2, 9);
    const right = c * d;
    return trueFalse(tr('Adevărat sau fals? {a} × {b} = {c} × {d}', { a, b, c, d }), right === p,
      tr('{a} × {b} = {p}, iar {c} × {d} = {right}. {v0}', { a, b, p, c, d, right, v0: right === p ? 'Sunt egale — adevărat!' : 'Nu sunt egale — fals.' }));
  },
  // Scrie numărul ca produs de 2 factori egali.
  () => {
    const f = randInt(2, 10);
    return problem(tr('Scrie numărul {v0} ca produs de 2 factori egali: {v1} = □ × □. Ce număr pui în căsuțe?', { v0: f * f, v1: f * f }), f,
      tr('Căutăm un număr care înmulțit cu el însuși dă {v0}: {f} × {v1} = {v2}.', { v0: f * f, f, v1: f, v2: f * f }), [f * f / 2 | 0, f + 1, f - 1]);
  },
  // Dacă a = 8, cât este a × 3?
  () => {
    const a = randInt(2, 10); const k = randInt(3, 5);
    return problem(tr('Dacă a = {a}, cât este a × {k}?', { a, k }), a * k,
      tr('Înlocuim a cu {a}: {v0} × {k} = {v1}.', { a, v0: a, k, v1: a * k }), [a + k, a * k + a, a * k - k]);
  },
  // Trei factori: 3 × 2 × □ = 24.
  () => {
    const a = randInt(2, 4); const b = randInt(2, 3); const x = randInt(2, 5);
    const total = a * b * x;
    return problem(tr('Completează factorul potrivit: {a} × {b} × □ = {total}', { a, b, total }), x,
      tr('Întâi {a} × {b} = {v0}. Apoi căutăm numărul pentru care {v1} × □ = {total}: {v2} × {x} = {v3}.', { a, b, v0: a * b, v1: a * b, total, v2: a * b, x, v3: total }),
      [x + 1, x - 1, total / a | 0]);
  },
  // 5 × □ < 18: cel mai mare număr care se potrivește.
  () => {
    const a = randInt(3, 9); const limit = a * randInt(2, 6) + randInt(1, a - 1);
    const best = Math.floor((limit - 1) / a);
    return problem(tr('Care este cel mai mare număr care se potrivește în căsuță? {a} × □ < {limit}', { a, limit }), best,
      tr('{a} × {best} = {v0}, care e mai mic decât {limit}. Dar {v1} × {v2} = {v3}, prea mare.', { a, best, v0: a * best, limit, v1: a, v2: best + 1, v3: a * (best + 1) }),
      [best + 1, best - 1, limit - a]);
  },
  // □ × 5 > 25: cel mai mic număr care se potrivește.
  () => {
    const a = randInt(3, 9); const limit = a * randInt(2, 6);
    const best = limit / a + 1;
    return problem(tr('Care este cel mai mic număr care se potrivește în căsuță? □ × {a} > {limit}', { a, limit }), best,
      tr('{v0} × {a} = {limit}, care nu e mai mare decât {v1}. Următorul: {best} × {v2} = {v3} > {v4}.', { v0: limit / a, a, limit, v1: limit, best, v2: a, v3: best * a, v4: limit }),
      [best - 1, best + 1, limit - a]);
  },
  // Diana și cele 4 prietene au cumpărat bilete…
  () => {
    const n = pick(['Diana', 'Ioana', 'Mara', 'Sofia', 'Elena']); const friends = randInt(2, 6); const price = randInt(3, 9);
    const people = friends + 1;
    return problem(tr('{n} și cele {friends} prietene ale ei au cumpărat bilete la observatorul astronomic. ', { n, friends })
      + tr('Ce sumă au plătit fetele, dacă un bilet costă {price} lei?', { price }), people * price,
      tr('Atenție: sunt {n} plus {friends} prietene, adică {people} fete. {v0} × {price} = {v1} lei.', { n, friends, people, v0: people, price, v1: people * price }),
      [friends * price, people + price, people * price + price]);
  },
  // La observator pot intra 8 persoane într-o tură…
  () => {
    const per = randInt(4, 10); const rounds = randInt(2, 9);
    return problem(tr('La observatorul astronomic pot intra cel mult {per} persoane într-o tură. ', { per })
      + tr('Care este numărul maxim de vizitatori care pot intra în {rounds} ture?', { rounds }), per * rounds,
      tr('În fiecare tură intră {per} persoane: {rounds} × {v0} = {v1}.', { per, rounds, v0: per, v1: per * rounds }), [per + rounds, per * rounds - per, per * rounds + per]);
  },
  // Lucrări așezate câte 5 pe 6 rânduri; s-au vândut 27…
  () => {
    const per = randInt(3, 9); const rows = randInt(3, 9); const total = per * rows; const sold = randInt(Math.ceil(total / 3), total - 1);
    return problem(tr('Lucrările pentru expoziția „Universul” au fost așezate câte {per} pe {rows} rânduri. ', { per, rows })
      + tr('Câte lucrări au mai rămas, dacă s-au vândut {sold}?', { sold }), total - sold,
      tr('Întâi aflăm câte lucrări erau: {rows} × {per} = {total}. Apoi scădem ce s-a vândut: {v0} - {sold} = {v1}.', { rows, per, total, v0: total, sold, v1: total - sold }),
      [total, total + sold, total - sold + 1]);
  },
  // Ceai de mentă și de fructe de 5 ori mai multe — câte în total?
  () => {
    const mint = randInt(3, 9); const k = randInt(2, 6); const fruit = mint * k;
    return problem(tr('La un chioșc s-au vândut {mint} pahare cu ceai de mentă, iar cu ceai de fructe de {k} ori mai multe. ', { mint, k })
      + tr('Câte pahare cu ceai s-au vândut în total?'), mint + fruit,
      tr('Ceai de fructe: {mint} × {k} = {fruit} pahare. În total: {v0} + {v1} = {v2}.', { mint, k, fruit, v0: mint, v1: fruit, v2: mint + fruit }),
      [fruit, mint + k, mint * (k + 2)]);
  },
  // Un buchet are 5 trandafiri mov și 4 albi; câți în 5 buchete?
  () => {
    const purple = randInt(2, 6); const white = randInt(2, 5); const b = randInt(2, 6);
    const perBouquet = purple + white;
    return problem(tr('Un buchet de flori are {purple} trandafiri mov și {white} albi. ', { purple, white })
      + tr('Câți trandafiri sunt în {b} buchete de același fel?', { b }), perBouquet * b,
      tr('Într-un buchet sunt {purple} + {white} = {perBouquet} trandafiri. În {b} buchete: {v0} × {v1} = {v2}. ', { purple, white, perBouquet, b, v0: b, v1: perBouquet, v2: perBouquet * b })
      + tr('(Sau: {b} × {purple} + {v0} × {white} = {v1} + {v2}.)', { b, purple, v0: b, white, v1: b * purple, v2: b * white }),
      [purple * white * b, perBouquet + b, purple * b]);
  },
  // Suma dintre triplul lui 5 și produsul numerelor 9 și 4.
  () => {
    const n = randInt(2, 9); const a = randInt(2, 9); const b = randInt(2, 9);
    const mult = pick([['dublul', 2], ['triplul', 3]]);
    const answer = n * mult[1] + a * b;
    return problem(tr('Află suma dintre {v0} lui {n} și produsul numerelor {a} și {b}.', { v0: mult[0], n, a, b }), answer,
      tr('{v0} lui {n}: {v1} × {v2} = {v3}. ', { v0: mult[0][0].toUpperCase() + mult[0].slice(1), n, v1: n, v2: mult[1], v3: n * mult[1] })
      + tr('Produsul: {a} × {b} = {v0}. Suma: {v1} + {v2} = {answer}.', { a, b, v0: a * b, v1: n * mult[1], v2: a * b, answer }),
      [n + mult[1] + a * b, n * mult[1] + a + b, a * b]);
  },
];

const BY_LEVEL = { logica1: LEVEL1, logica2: LEVEL2, logica3: LEVEL3, logica4: LEVEL4 };

export function buildLogicProblem(level) {
  return pick(BY_LEVEL[level])();
}
