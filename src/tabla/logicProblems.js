// Probleme pentru „Insula Isteților”: fără înmulțire — adunări, scăderi,
// comparații („cu atât mai mult / mai puțin”), bani, vârste, ore și șiruri.
import { makeAnswers } from './data';

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
    return problem(`${n} are ${a} ${t}. Mai primește ${b} ${t}. Câte ${t} are acum?`, a + b,
      `A primit mai multe, deci adunăm: ${a} + ${b} = ${a + b}.`, [a - b, a + b + 1, a + b - 1]);
  },
  () => {
    const [n] = twoNames();
    const a = randInt(8, 20); const b = randInt(2, a - 1);
    return problem(`${n} avea ${a} baloane. S-au spart ${b}. Câte baloane i-au rămas?`, a - b,
      `Unele s-au spart, deci scădem: ${a} - ${b} = ${a - b}.`, [a + b, a - b + 1, b]);
  },
  () => {
    const a = randInt(5, 12); const b = randInt(4, 20 - a);
    return problem(`Într-o clasă sunt ${a} fete și ${b} băieți. Câți copii sunt în clasă?`, a + b,
      `Toți copiii împreună: ${a} + ${b} = ${a + b}.`, [a - b, Math.abs(a - b), a + b + 2]);
  },
  () => {
    const a = randInt(9, 20); const b = randInt(2, a - 2);
    return problem(`Pe o ramură erau ${a} vrăbii. Au zburat ${b}. Câte vrăbii au rămas pe ramură?`, a - b,
      `Au zburat, deci scădem: ${a} - ${b} = ${a - b}.`, [a + b, a - b - 1, b]);
  },
  () => {
    const [n] = twoNames();
    const a = randInt(3, 10); const b = randInt(3, 10);
    return problem(`${n} a citit ${a} pagini luni și ${b} pagini marți. Câte pagini a citit în cele două zile?`, a + b,
      `Adunăm paginile din ambele zile: ${a} + ${b} = ${a + b}.`, [Math.abs(a - b), a + b - 1, a + b + 1]);
  },
  () => {
    const [n] = twoNames(); const t = pick(THINGS);
    const total = randInt(10, 20); const a = randInt(2, total - 3);
    return problem(`${n} are ${total} ${t}. Dă ${a} ${t} prietenului său. Câte ${t} îi rămân?`, total - a,
      `A dat o parte, deci scădem: ${total} - ${a} = ${total - a}.`, [total + a, total - a + 1, a]);
  },
];

// ---------- Nivelul 2: mai mult / mai puțin, bani, vârste (până la 50) ----------
const LEVEL2 = [
  () => {
    const [n1, n2] = twoNames(); const t = pick(THINGS);
    const a = randInt(6, 40); const b = randInt(1, Math.min(9, a - 1));
    return problem(`${n1} are ${a} ${t}, iar ${n2} are cu ${b} mai puține. Câte ${t} are ${n2}?`, a - b,
      `„Cu ${b} mai puține” înseamnă că scădem: ${a} - ${b} = ${a - b}.`, [a + b, a - b + 1, a - b - 1]);
  },
  () => {
    const [n1, n2] = twoNames(); const t = pick(THINGS);
    const a = randInt(5, 35); const b = randInt(2, 15);
    return problem(`${n1} are ${a} ${t}, iar ${n2} are cu ${b} mai multe. Câte ${t} are ${n2}?`, a + b,
      `„Cu ${b} mai multe” înseamnă că adunăm: ${a} + ${b} = ${a + b}.`, [a - b, a + b + 1, a + b - 1]);
  },
  () => {
    const [n1, n2] = twoNames(); const t = pick(THINGS);
    const b = randInt(5, 30); const a = b + randInt(2, 15);
    return problem(`${n1} are ${a} ${t}, iar ${n2} are ${b}. Cu câte ${t} are ${n1} mai multe decât ${n2}?`, a - b,
      `Ca să aflăm „cu cât mai mult”, scădem: ${a} - ${b} = ${a - b}.`, [a + b, a - b + 1, a - b - 1]);
  },
  () => {
    const [n] = twoNames();
    const money = randInt(15, 50); const price = randInt(5, money - 2);
    return problem(`${n} are ${money} lei. Cumpără o jucărie care costă ${price} lei. Câți lei îi rămân?`, money - price,
      `Din bani scădem prețul: ${money} - ${price} = ${money - price}.`, [money + price, money - price + 1, price]);
  },
  () => {
    const [n] = twoNames(); const t = pick(THINGS);
    const goal = randInt(15, 50); const has = randInt(3, goal - 2);
    return problem(`${n} are ${has} ${t} și vrea să aibă ${goal}. Câte ${t} îi mai trebuie?`, goal - has,
      `Din cât vrea scădem cât are: ${goal} - ${has} = ${goal - has}.`, [goal + has, goal - has + 1, has]);
  },
  () => {
    const [n] = twoNames();
    const age = randInt(6, 12); const diff = randInt(2, 9);
    return problem(`${n} are ${age} ani și are un frate cu ${diff} ani mai mare. Câți ani are fratele?`, age + diff,
      `„Mai mare cu ${diff} ani” înseamnă că adunăm: ${age} + ${diff} = ${age + diff}.`, [age - diff, age + diff + 1, diff]);
  },
];

// ---------- Nivelul 3: probleme în doi pași, ore, șiruri (până la 100) ----------
const LEVEL3 = [
  () => {
    const [n] = twoNames(); const t = pick(THINGS);
    const a = randInt(20, 60); const b = randInt(5, 25); const c = randInt(5, a + b - 5);
    const r = a + b - c;
    return problem(`${n} are ${a} ${t}. Mai primește ${b}, apoi dă ${c} unei prietene. Câte ${t} are la final?`, r,
      `Întâi adunăm ce a primit: ${a} + ${b} = ${a + b}. Apoi scădem ce a dat: ${a + b} - ${c} = ${r}.`, [a + b + c, a - b + c, a + b]);
  },
  () => {
    const a = randInt(15, 50); const off = randInt(3, Math.min(15, a - 1)); const on = randInt(3, 20);
    const r = a - off + on;
    return problem(`Într-un autobuz sunt ${a} pasageri. La stație coboară ${off} și urcă ${on}. Câți pasageri sunt acum în autobuz?`, r,
      `Cei care coboară pleacă: ${a} - ${off} = ${a - off}. Cei care urcă se adaugă: ${a - off} + ${on} = ${r}.`, [a + off + on, a + off - on, a - off]);
  },
  () => {
    const [n1, n2] = twoNames(); const t = pick(THINGS);
    const a = randInt(10, 40); const b = randInt(3, 15); const second = a + b;
    return problem(`${n1} are ${a} ${t}, iar ${n2} are cu ${b} mai multe. Câte ${t} au împreună?`, a + second,
      `Întâi aflăm cât are ${n2}: ${a} + ${b} = ${second}. Apoi adunăm: ${a} + ${second} = ${a + second}.`, [second, a + b, a + second - b]);
  },
  () => {
    const start = randInt(8, 15); const dur = randInt(1, 4);
    return problem(`Un film începe la ora ${start} și durează ${dur} ${dur === 1 ? 'oră' : 'ore'}. La ce oră se termină?`, start + dur,
      `Adunăm durata la ora de început: ${start} + ${dur} = ${start + dur}.`, [start - dur, start + dur + 1, dur]);
  },
  () => {
    const startN = randInt(2, 30); const step = randInt(2, 10);
    const seq = [0, 1, 2, 3].map(i => startN + i * step);
    const next = startN + 4 * step;
    return problem(`Ce număr urmează în șir: ${seq.join(', ')}, …?`, next,
      `Fiecare număr crește cu ${step}: ${seq[3]} + ${step} = ${next}.`, [next + step, next - 1, seq[3] + 1]);
  },
  () => {
    const [n] = twoNames();
    const age = randInt(6, 14); const years = randInt(3, 20);
    return problem(`${n} are acum ${age} ani. Câți ani va avea peste ${years} ani?`, age + years,
      `Adunăm anii care vor trece: ${age} + ${years} = ${age + years}.`, [age - years, age + years + 1, years]);
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
    return problem(`Află produsul numerelor ${a} și ${b}.`, a * b,
      `Produsul înseamnă înmulțirea: ${a} × ${b} = ${a * b}.`, [a + b, a * b + a, a * b - b]);
  },
  // Află numărul de 5 ori mai mare decât…
  () => {
    const k = randInt(2, 5); const n = randInt(2, 10);
    return problem(`Află numărul de ${k} ori mai mare decât ${n}.`, n * k,
      `„De ${k} ori mai mare” înseamnă că înmulțim: ${n} × ${k} = ${n * k}.`, [n + k, n * k + k, n * k - n]);
  },
  // Completează cu factorul care lipsește.
  () => {
    const a = randInt(2, 9); const x = randInt(1, 9); const left = Math.random() < 0.5;
    const eq = left ? `□ × ${a} = ${a * x}` : `${a} × □ = ${a * x}`;
    return problem(`Completează factorul care lipsește: ${eq}`, x,
      `Căutăm numărul care înmulțit cu ${a} dă ${a * x}: ${a} × ${x} = ${a * x}.`, [a * x - a, x + 1, a]);
  },
  // Adevărat sau fals.
  () => {
    const a = randInt(2, 9); const b = randInt(2, 9);
    const kind = randInt(1, 3);
    if (kind === 1) {
      return trueFalse(`Adevărat sau fals? ${a} × ${b} = ${b} × ${a}`, true,
        `Dacă schimbăm ordinea factorilor, produsul rămâne același: ${a * b} = ${a * b}. Adevărat!`);
    }
    if (kind === 2) {
      const c = b + 1;
      return trueFalse(`Adevărat sau fals? ${a} × ${b} = ${a} × ${c}`, false,
        `${a} × ${b} = ${a * b}, dar ${a} × ${c} = ${a * c}. Nu sunt egale, deci e fals.`);
    }
    const p = a * b; const c = randInt(2, 9); const isTrue = p % c === 0 && p / c <= 10;
    const d = isTrue ? p / c : randInt(2, 9);
    const right = c * d;
    return trueFalse(`Adevărat sau fals? ${a} × ${b} = ${c} × ${d}`, right === p,
      `${a} × ${b} = ${p}, iar ${c} × ${d} = ${right}. ${right === p ? 'Sunt egale — adevărat!' : 'Nu sunt egale — fals.'}`);
  },
  // Scrie numărul ca produs de 2 factori egali.
  () => {
    const f = randInt(2, 10);
    return problem(`Scrie numărul ${f * f} ca produs de 2 factori egali: ${f * f} = □ × □. Ce număr pui în căsuțe?`, f,
      `Căutăm un număr care înmulțit cu el însuși dă ${f * f}: ${f} × ${f} = ${f * f}.`, [f * f / 2 | 0, f + 1, f - 1]);
  },
  // Dacă a = 8, cât este a × 3?
  () => {
    const a = randInt(2, 10); const k = randInt(3, 5);
    return problem(`Dacă a = ${a}, cât este a × ${k}?`, a * k,
      `Înlocuim a cu ${a}: ${a} × ${k} = ${a * k}.`, [a + k, a * k + a, a * k - k]);
  },
  // Trei factori: 3 × 2 × □ = 24.
  () => {
    const a = randInt(2, 4); const b = randInt(2, 3); const x = randInt(2, 5);
    const total = a * b * x;
    return problem(`Completează factorul potrivit: ${a} × ${b} × □ = ${total}`, x,
      `Întâi ${a} × ${b} = ${a * b}. Apoi căutăm numărul pentru care ${a * b} × □ = ${total}: ${a * b} × ${x} = ${total}.`,
      [x + 1, x - 1, total / a | 0]);
  },
  // 5 × □ < 18: cel mai mare număr care se potrivește.
  () => {
    const a = randInt(3, 9); const limit = a * randInt(2, 6) + randInt(1, a - 1);
    const best = Math.floor((limit - 1) / a);
    return problem(`Care este cel mai mare număr care se potrivește în căsuță? ${a} × □ < ${limit}`, best,
      `${a} × ${best} = ${a * best}, care e mai mic decât ${limit}. Dar ${a} × ${best + 1} = ${a * (best + 1)}, prea mare.`,
      [best + 1, best - 1, limit - a]);
  },
  // □ × 5 > 25: cel mai mic număr care se potrivește.
  () => {
    const a = randInt(3, 9); const limit = a * randInt(2, 6);
    const best = limit / a + 1;
    return problem(`Care este cel mai mic număr care se potrivește în căsuță? □ × ${a} > ${limit}`, best,
      `${limit / a} × ${a} = ${limit}, care nu e mai mare decât ${limit}. Următorul: ${best} × ${a} = ${best * a} > ${limit}.`,
      [best - 1, best + 1, limit - a]);
  },
  // Diana și cele 4 prietene au cumpărat bilete…
  () => {
    const n = pick(['Diana', 'Ioana', 'Mara', 'Sofia', 'Elena']); const friends = randInt(2, 6); const price = randInt(3, 9);
    const people = friends + 1;
    return problem(`${n} și cele ${friends} prietene ale ei au cumpărat bilete la observatorul astronomic. `
      + `Ce sumă au plătit fetele, dacă un bilet costă ${price} lei?`, people * price,
      `Atenție: sunt ${n} plus ${friends} prietene, adică ${people} fete. ${people} × ${price} = ${people * price} lei.`,
      [friends * price, people + price, people * price + price]);
  },
  // La observator pot intra 8 persoane într-o tură…
  () => {
    const per = randInt(4, 10); const rounds = randInt(2, 9);
    return problem(`La observatorul astronomic pot intra cel mult ${per} persoane într-o tură. `
      + `Care este numărul maxim de vizitatori care pot intra în ${rounds} ture?`, per * rounds,
      `În fiecare tură intră ${per} persoane: ${rounds} × ${per} = ${per * rounds}.`, [per + rounds, per * rounds - per, per * rounds + per]);
  },
  // Lucrări așezate câte 5 pe 6 rânduri; s-au vândut 27…
  () => {
    const per = randInt(3, 9); const rows = randInt(3, 9); const total = per * rows; const sold = randInt(Math.ceil(total / 3), total - 1);
    return problem(`Lucrările pentru expoziția „Universul” au fost așezate câte ${per} pe ${rows} rânduri. `
      + `Câte lucrări au mai rămas, dacă s-au vândut ${sold}?`, total - sold,
      `Întâi aflăm câte lucrări erau: ${rows} × ${per} = ${total}. Apoi scădem ce s-a vândut: ${total} - ${sold} = ${total - sold}.`,
      [total, total + sold, total - sold + 1]);
  },
  // Ceai de mentă și de fructe de 5 ori mai multe — câte în total?
  () => {
    const mint = randInt(3, 9); const k = randInt(2, 6); const fruit = mint * k;
    return problem(`La un chioșc s-au vândut ${mint} pahare cu ceai de mentă, iar cu ceai de fructe de ${k} ori mai multe. `
      + `Câte pahare cu ceai s-au vândut în total?`, mint + fruit,
      `Ceai de fructe: ${mint} × ${k} = ${fruit} pahare. În total: ${mint} + ${fruit} = ${mint + fruit}.`,
      [fruit, mint + k, mint * (k + 2)]);
  },
  // Un buchet are 5 trandafiri mov și 4 albi; câți în 5 buchete?
  () => {
    const purple = randInt(2, 6); const white = randInt(2, 5); const b = randInt(2, 6);
    const perBouquet = purple + white;
    return problem(`Un buchet de flori are ${purple} trandafiri mov și ${white} albi. `
      + `Câți trandafiri sunt în ${b} buchete de același fel?`, perBouquet * b,
      `Într-un buchet sunt ${purple} + ${white} = ${perBouquet} trandafiri. În ${b} buchete: ${b} × ${perBouquet} = ${perBouquet * b}. `
      + `(Sau: ${b} × ${purple} + ${b} × ${white} = ${b * purple} + ${b * white}.)`,
      [purple * white * b, perBouquet + b, purple * b]);
  },
  // Suma dintre triplul lui 5 și produsul numerelor 9 și 4.
  () => {
    const n = randInt(2, 9); const a = randInt(2, 9); const b = randInt(2, 9);
    const mult = pick([['dublul', 2], ['triplul', 3]]);
    const answer = n * mult[1] + a * b;
    return problem(`Află suma dintre ${mult[0]} lui ${n} și produsul numerelor ${a} și ${b}.`, answer,
      `${mult[0][0].toUpperCase() + mult[0].slice(1)} lui ${n}: ${n} × ${mult[1]} = ${n * mult[1]}. `
      + `Produsul: ${a} × ${b} = ${a * b}. Suma: ${n * mult[1]} + ${a * b} = ${answer}.`,
      [n + mult[1] + a * b, n * mult[1] + a + b, a * b]);
  },
];

const BY_LEVEL = { logica1: LEVEL1, logica2: LEVEL2, logica3: LEVEL3, logica4: LEVEL4 };

export function buildLogicProblem(level) {
  return pick(BY_LEVEL[level])();
}
