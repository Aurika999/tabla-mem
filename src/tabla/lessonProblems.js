// Exerciții pentru lecțiile „Înmulțirea cu 2, 3, 4, 6, 7, 8, 9”, după manual,
// pe cele 4 secțiuni: Descopăr, Aplic, Exersez, Rezolv probleme.
// (Înmulțirea cu 5 are exercițiile ei în fiveProblems.js.)
import { makeAnswers } from './data';
import { tr } from './i18n';

// Niveluri: sase1…sase4 (cu 6) și sapte1…sapte4 (cu 7).
export const LESSON_LEVELS = {
  2: ['doi1', 'doi2', 'doi3', 'doi4'],
  3: ['trei1', 'trei2', 'trei3', 'trei4'],
  4: ['patru1', 'patru2', 'patru3', 'patru4'],
  6: ['sase1', 'sase2', 'sase3', 'sase4'],
  7: ['sapte1', 'sapte2', 'sapte3', 'sapte4'],
  8: ['opt1', 'opt2', 'opt3', 'opt4'],
  9: ['noua1', 'noua2', 'noua3', 'noua4'],
};
const BADGES = ['🔍 Descopăr', '✏️ Aplic', '⭐ Exersez', '🧩 Rezolv probleme'];
const TRUE_FALSE = ['Adevărat', 'Fals'];
const SIGNS = ['<', '>', '='];
const OPERATIONS = ['×', '+', '−'];

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

function mult(a, b) {
  return { kind: 'mult', a, b };
}

// Povestea din „Descopăr”: baterii pentru 6, monede pentru 7.
const STORY = {
  2: (k) => problem(tr('Pe fiecare săniuță stau câte 2 copii. Câți copii sunt pe {k} săniuțe?', { k }), 2 * k,
    tr('{v0} = de {k} ori câte 2 = {v1} × 2 = {v2} copii.', { v0: Array(k).fill(2).join(' + '), k, v1: k, v2: 2 * k }), [2 + k, 2 * k + 2, 2 * k - 2]),
  3: (k) => problem(tr('Fiecare copil a pregătit câte 3 bulgări de zăpadă. Câți bulgări au pregătit {k} copii?', { k }), 3 * k,
    tr('{v0} = de {k} ori câte 3 = {v1} × 3 = {v2} bulgări.', { v0: Array(k).fill(3).join(' + '), k, v1: k, v2: 3 * k }), [3 + k, 3 * k + 3, 3 * k - 3]),
  4: (k) => problem(tr('Un urs polar are 4 picioare. Câte picioare au {k} urși polari?', { k }), 4 * k,
    tr('{v0} = de {k} ori câte 4 = {v1} × 4 = {v2} picioare.', { v0: Array(k).fill(4).join(' + '), k, v1: k, v2: 4 * k }), [4 + k, 4 * k + 4, 4 * k - 4]),
  6: (k) => problem(tr('Într-o cutie sunt 6 baterii. Câte baterii sunt în {k} cutii?', { k }), 6 * k,
    tr('{v0} = de {k} ori câte 6 = {v1} × 6 = {v2} baterii.', { v0: Array(k).fill(6).join(' + '), k, v1: k, v2: 6 * k }), [6 + k, 6 * k + 6, 6 * k - 6]),
  7: (k) => problem(tr('Într-un teanc sunt 7 monede. Câte monede sunt în {k} teancuri?', { k }), 7 * k,
    tr('{v0} = de {k} ori câte 7 = {v1} × 7 = {v2} monede.', { v0: Array(k).fill(7).join(' + '), k, v1: k, v2: 7 * k }), [7 + k, 7 * k + 7, 7 * k - 7]),
  8: (k) => problem(tr('O caracatiță are 8 brațe. Câte brațe au {k} caracatițe?', { k }), 8 * k,
    tr('{v0} = de {k} ori câte 8 = {v1} × 8 = {v2} brațe.', { v0: Array(k).fill(8).join(' + '), k, v1: k, v2: 8 * k }), [8 + k, 8 * k + 8, 8 * k - 8]),
  9: (k) => problem(tr('Într-o cutie sunt 9 baloane. Câte baloane sunt în {k} cutii?', { k }), 9 * k,
    tr('{v0} = de {k} ori câte 9 = {v1} × 9 = {v2} baloane.', { v0: Array(k).fill(9).join(' + '), k, v1: k, v2: 9 * k }), [9 + k, 9 * k + 9, 9 * k - 9]),
};

// Lucruri care au mereu câte N bucăți, pentru problemele cu grupe.
const GROUPS = {
  2: [['O bicicletă', 'biciclete', 'roți'], ['O pereche de mănuși', 'perechi', 'mănuși'], ['O găină', 'găini', 'picioare']],
  3: [['O tricicletă', 'triciclete', 'roți'], ['Un triunghi', 'triunghiuri', 'laturi'], ['Un trifoi', 'trifoi', 'frunze']],
  4: [['O mașinuță', 'mașinuțe', 'roți'], ['Un urs polar', 'urși polari', 'picioare'], ['Un an', 'ani', 'anotimpuri']],
  6: [['O cutie de ouă', 'cutii', 'ouă'], ['O insectă', 'insecte', 'picioare'], ['Un fagure', 'faguri', 'colțuri']],
  7: [['O săptămână', 'săptămâni', 'zile'], ['Un curcubeu', 'curcubee', 'culori'], ['O gărgăriță', 'gărgărițe', 'buline']],
  8: [['O caracatiță', 'caracatițe', 'brațe'], ['Un păianjen', 'păianjeni', 'picioare'], ['O cutie de creioane', 'cutii', 'creioane']],
  9: [['O tablă de X și 0', 'table', 'căsuțe'], ['O cutie', 'cutii', 'baloane'], ['O față de cub Rubik', 'fețe', 'pătrățele']],
};

// ---------- Exerciții în plus, din lecția „Înmulțirea cu 4” ----------
const FOUR_DISCOVER = [
  // Lor li se alătură Fram, ursul polar: 4 + 4 + 4 + 4 + 4 = 20.
  () => {
    const bears = randInt(3, 6);
    return problem(tr('Pe gheață sunt {bears} urși polari. Lor li se alătură Fram, ursul polar. ', { bears })
      + tr('Câte picioare au urșii la un loc?'), 4 * (bears + 1),
      tr('Sunt {bears} + 1 = {v0} urși. {v1} × 4 = {v2} picioare ', { bears, v0: bears + 1, v1: bears + 1, v2: 4 * (bears + 1) })
      + tr('(sau {bears} × 4 + 4 = {v0} + 4 = {v1}).', { bears, v0: 4 * bears, v1: 4 * (bears + 1) }),
      [4 * bears, bears + 1 + 4, 4 * (bears + 2)]);
  },
  // Pinguinii: 6 + 6 + 6 + 6 = 24, deci 4 × 6 = 6 × 4.
  () => {
    const per = randInt(3, 9);
    return problem(tr('Sunt 4 grupuri de pinguini, cu câte {per} pinguini în fiecare grup. Câți pinguini sunt?', { per }), 4 * per,
      tr('{v0} = 4 × {per} = {v1} × 4 = {v2} pinguini.', { v0: Array(4).fill(per).join(' + '), per, v1: per, v2: 4 * per }), [4 + per, 4 * per + per, 4 * per - 4]);
  },
];

const FOUR_APPLY = [
  // B. Continuă după model: 2 × 4 = 4 × 2.
  () => {
    const k = randInt(3, 9);
    return problem(tr('Continuă după model: 2 × 4 = 4 × 2. Atunci {k} × 4 = 4 × □', { k }), k,
      tr('Ordinea factorilor nu contează: {k} × 4 = 4 × {v0} = {v1}.', { k, v0: k, v1: 4 * k }), [4, k + 1, 4 * k]);
  },
  // C. Completează: 3 × 4 = 4 + 4 + … (câți de 4 adunăm?)
  () => {
    const k = randInt(3, 8);
    return problem(tr('{k} × 4 = 4 + 4 + … Câte numere de 4 trebuie să aduni?', { k }), k,
      tr('{k} × 4 înseamnă de {v0} ori câte 4: {v1} = {v2}.', { k, v0: k, v1: Array(k).fill(4).join(' + '), v2: 4 * k }), [4, k + 1, 4 * k]);
  },
  () => {
    const k = randInt(3, 8);
    return problem(tr('Completează și calculează: {k} × 4 = {v0} = ?', { k, v0: Array(k).fill(4).join(' + ') }), 4 * k,
      tr('Am adunat 4 de {k} ori: {v0}.', { k, v0: 4 * k }), [4 + k, 4 * k + 4, 4 * k - 4]);
  },
];

const FOUR_PRACTICE = [
  // Cu 4 mai mare vs. de 4 ori mai mare.
  () => {
    const n = pick([8, 1, 5, 6, 2, 9, 4, 10]);
    return Math.random() < 0.5
      ? problem(tr('Află numărul cu 4 mai mare decât {n}.', { n }), n + 4,
        tr('„Cu 4 mai mare” înseamnă adunare: {n} + 4 = {v0}. (Atenție: nu e „de 4 ori”!)', { n, v0: n + 4 }), [n * 4, n + 5, n + 3])
      : problem(tr('Află numărul de 4 ori mai mare decât {n}.', { n }), n * 4,
        tr('„De 4 ori mai mare” înseamnă înmulțire: {n} × 4 = {v0}. (Atenție: nu e „cu 4”!)', { n, v0: n * 4 }), [n + 4, n * 4 + 4, n * 4 - 4]);
  },
  // Rezolvă după model: 4 × 4 = 3 × 4 + 4.
  () => {
    const k = randInt(5, 9);
    return problem(tr('Rezolvă după model (4 × 4 = 3 × 4 + 4): {k} × 4 = {v0} × 4 + □', { k, v0: k - 1 }), 4,
      tr('{k} × 4 înseamnă cu încă un 4 mai mult decât {v0} × 4: {v1} + 4 = {v2}.', { k, v0: k - 1, v1: 4 * (k - 1), v2: 4 * k }), [k, k - 1, 4 * k]);
  },
  // Completează: 5 × 4 = 2 × □, 8 × 3 = □ × 4, 6 × 2 = 3 × □…
  () => {
    const [text, answer, explanation] = pick([
      ['5 × 4 = 2 × □', 10, '5 × 4 = 20, iar 2 × 10 = 20.'],
      ['□ × 2 = 4 × 4', 8, '4 × 4 = 16, iar 8 × 2 = 16.'],
      ['8 × 3 = □ × 4', 6, '8 × 3 = 24, iar 6 × 4 = 24.'],
      ['6 × 2 = 3 × □', 4, '6 × 2 = 12, iar 3 × 4 = 12.'],
      ['9 × 2 = 3 × □', 6, '9 × 2 = 18, iar 3 × 6 = 18.'],
      ['1 × □ = 2 × 2', 4, '2 × 2 = 4, iar 1 × 4 = 4.'],
      ['4 × 6 = 8 × □', 3, '4 × 6 = 24, iar 8 × 3 = 24.'],
    ]);
    return problem(tr('Completează cu factorul care lipsește: {text}', { text }), answer,
      tr('Ambele părți trebuie să dea același rezultat: {explanation}', { explanation }), [answer + 1, answer - 1, answer * 2]);
  },
  // Calculează și compară: 2 × 6 ○ 3 × 4.
  () => {
    const [l, r] = pick([[[2, 6], [3, 4]], [[3, 8], [7, 4]], [[4, 9], [8, 4]], [[2, 4], [4, 2]], [[4, 5], [3, 6]], [[4, 7], [5, 6]]]);
    const a = l[0] * l[1]; const b = r[0] * r[1];
    const sign = a < b ? '<' : a > b ? '>' : '=';
    return {
      text: tr('Calculează și compară: {v0} × {v1} ○ {v2} × {v3}', { v0: l[0], v1: l[1], v2: r[0], v3: r[1] }),
      answer: sign,
      explanation: tr('{v0} × {v1} = {a} și {v2} × {v3} = {b}, deci {v4} {sign} {v5}.', { v0: l[0], v1: l[1], a, v2: r[0], v3: r[1], b, v4: a, sign, v5: b }),
      choices: SIGNS,
    };
  },
];

const FOUR_SOLVE = [
  // Câte luni sunt în 4 anotimpuri? Câte zile în 4 săptămâni?
  () => (Math.random() < 0.5
    ? problem('Câte luni sunt în 4 anotimpuri, dacă fiecare anotimp are 3 luni?', 12,
      'Fiecare anotimp are 3 luni: 4 × 3 = 12 luni (un an întreg!).', [7, 16, 4])
    : problem('Câte zile sunt în 4 săptămâni?', 28,
      'O săptămână are 7 zile: 4 × 7 = 28 zile.', [11, 24, 32])),
  // Câte roți au 6 mașinuțe? Dar 8 mașinuțe?
  () => {
    const cars = randInt(3, 9);
    return problem(tr('Câte roți au {cars} mașinuțe?', { cars }), 4 * cars,
      tr('Fiecare mașinuță are 4 roți: {cars} × 4 = {v0} roți.', { cars, v0: 4 * cars }), [cars + 4, 4 * cars + 4, 4 * cars - 4]);
  },
  // O cabană are 10 camere, câte 4 locuri în fiecare.
  () => {
    const rooms = randInt(5, 10);
    return problem(tr('O cabană are {rooms} camere. În fiecare cameră sunt câte 4 locuri de cazare. Câte locuri de cazare are cabana?', { rooms }),
      4 * rooms, tr('{rooms} camere × 4 locuri = {v0} locuri.', { rooms, v0: 4 * rooms }), [rooms + 4, 4 * rooms + 4, 4 * rooms - 4]);
  },
  // Cu cât este mai mare produsul numerelor 9 și 4 decât suma lor?
  () => {
    const n = randInt(5, 9);
    return problem(tr('Cu cât este mai mare produsul numerelor {n} și 4 decât suma lor?', { n }), 4 * n - (n + 4),
      tr('Produsul: {n} × 4 = {v0}. Suma: {v1} + 4 = {v2}. Diferența: {v3} - {v4} = {v5}.', { n, v0: 4 * n, v1: n, v2: n + 4, v3: 4 * n, v4: n + 4, v5: 4 * n - (n + 4) }),
      [4 * n, n + 4, 4 * n + n + 4]);
  },
  // Mara are 7 ani, iar mama de 4 ori mai mulți. Câți ani va avea mama peste 5 ani?
  () => {
    const girl = pick(['Mara', 'Ioana', 'Sofia', 'Ana']); const age = randInt(6, 9); const later = randInt(2, 6);
    const mom = 4 * age;
    return problem(tr('{girl} are {age} ani, iar mama sa de 4 ori mai mulți. Câți ani va avea mama peste {later} ani?', { girl, age, later }), mom + later,
      tr('Acum mama are {age} × 4 = {mom} ani. Peste {later} ani: {v0} + {v1} = {v2} ani.', { age, mom, later, v0: mom, v1: later, v2: mom + later }),
      [mom, age + 4 + later, age + later]);
  },
  // Oana citește o carte cu 198 de pagini; în primele 4 zile câte 9 pagini pe zi.
  () => {
    const per = randInt(6, 9); const total = randInt(60, 99);
    const read = 4 * per;
    return problem(tr('Oana citește o carte cu {total} de pagini. În primele 4 zile a citit câte {per} pagini pe zi. ', { total, per })
      + tr('Câte pagini mai are de citit pentru a termina cartea?'), total - read,
      tr('În 4 zile a citit 4 × {per} = {read} pagini. Mai are {total} - {v0} = {v1} pagini.', { per, read, total, v0: read, v1: total - read }),
      [total - per, read, total - read + 4]);
  },
];

// ---------- Exerciții în plus, din lecția „Înmulțirea cu 3” ----------
const THREE_DISCOVER = [
  // Dan face și el 3 bulgări și li se alătură: 4 copii.
  () => {
    const kids = randInt(2, 5);
    return problem(tr('{kids} copii au făcut câte 3 bulgări. Dan face și el 3 bulgări și li se alătură. ', { kids })
      + tr('Câți bulgări au făcut în total cei {v0} copii?', { v0: kids + 1 }), 3 * (kids + 1),
      tr('{kids} × 3 = {v0}, plus cei 3 ai lui Dan: {v1} + 3 = {v2} (sau {v3} × 3).', { kids, v0: 3 * kids, v1: 3 * kids, v2: 3 * (kids + 1), v3: kids + 1 }),
      [3 * kids, kids + 1 + 3, 3 * (kids + 2)]);
  },
  // Câți bulgări au lovit cele 3 ținte? 5 + 5 + 5 = 3 × 5 = 5 × 3.
  () => {
    const per = randInt(3, 9);
    return problem(tr('Pe fiecare din cele 3 ținte au lovit câte {per} bulgări. Câți bulgări au lovit cele 3 ținte?', { per }), 3 * per,
      `${per} + ${per} + ${per} = 3 × ${per} = ${per} × 3 = ${3 * per}.`, [3 + per, 3 * per + per, 3 * per - 3]);
  },
];

const THREE_APPLY = [
  // B. Scrie adunările repetate sub formă de înmulțiri: 8 + 8 + 8 = 3 × □
  () => {
    const n = randInt(2, 9);
    return problem(tr('Scrie adunarea ca înmulțire: {n} + {v0} + {v1} = 3 × □', { n, v0: n, v1: n }), n,
      tr('Am adunat {n} de 3 ori, deci 3 × {v0} = {v1}.', { n, v0: n, v1: 3 * n }), [3 * n, n + 3, 3]);
  },
  // C. Scrie înmulțirile ca adunări repetate: 5 × 3 = 5 + 5 + □
  () => {
    const n = randInt(2, 9);
    return problem(tr('Scrie înmulțirea ca adunare repetată: 3 × {n} = {v0} + {v1} + □', { n, v0: n, v1: n }), n,
      tr('3 × {n} înseamnă de 3 ori câte {v0}: {v1} + {v2} + {v3} = {v4}.', { n, v0: n, v1: n, v2: n, v3: n, v4: 3 * n }), [3, 3 * n, n + 1]);
  },
];

const THREE_PRACTICE = [
  // Cu 3 mai mare vs. de 3 ori mai mare.
  () => {
    const n = pick([7, 5, 2, 9, 4, 10, 8, 3]);
    return Math.random() < 0.5
      ? problem(tr('Află numărul cu 3 mai mare decât {n}.', { n }), n + 3,
        tr('„Cu 3 mai mare” înseamnă adunare: {n} + 3 = {v0}.', { n, v0: n + 3 }), [n * 3, n + 4, n + 2])
      : problem(tr('Află numărul de 3 ori mai mare decât {n}.', { n }), n * 3,
        tr('„De 3 ori mai mare” înseamnă înmulțire: {n} × 3 = {v0}.', { n, v0: n * 3 }), [n + 3, n * 3 + 3, n * 3 - 3]);
  },
  // Află triplul numerelor pare mai mari decât 3 și mai mici decât 12.
  () => {
    const n = pick([4, 6, 8, 10]);
    return problem(tr('Află triplul numărului {n}.', { n }), 3 * n,
      tr('Triplul înseamnă de 3 ori mai mare: 3 × {n} = {v0}.', { n, v0: 3 * n }), [n + 3, 2 * n, 3 * n + 3]);
  },
  // 3 × 7 = 7 × □
  () => {
    const n = randInt(2, 10);
    return problem(tr('Completează: 3 × {n} = {v0} × □', { n, v0: n }), 3,
      tr('Ordinea factorilor nu contează: 3 × {n} = {v0} × 3 = {v1}.', { n, v0: n, v1: 3 * n }), [n, 3 * n, 4]);
  },
  // Scrie numărul 21 sub formă de produs.
  () => {
    const n = randInt(3, 9);
    return problem(tr('Scrie numărul {v0} sub formă de produs: {v1} = 3 × □', { v0: 3 * n, v1: 3 * n }), n,
      `3 × ${n} = ${3 * n}.`, [n + 1, n - 1, 3 * n - 3]);
  },
];

const THREE_SOLVE = [
  // Un copac are 7 crengi, pe fiecare câte 3 vrăbii.
  () => {
    const b = randInt(3, 9);
    return problem(tr('Un copac are {b} crengi. Pe fiecare creangă stau câte 3 vrăbii. Câte vrăbii stau în copac?', { b }), 3 * b,
      tr('{b} crengi × 3 vrăbii = {v0} vrăbii.', { b, v0: 3 * b }), [b + 3, 3 * b + 3, 3 * b - 3]);
  },
  // Ioana are 2 ani, sora de 3 ori mai mare.
  () => {
    const age = randInt(2, 4);
    return problem(tr('Ioana are {age} ani, iar vârsta surorii sale e de 3 ori mai mare. Câți ani are sora Ioanei?', { age }), 3 * age,
      tr('„De 3 ori mai mare”: {age} × 3 = {v0} ani.', { age, v0: 3 * age }), [age + 3, 3 * age + 3, 2 * age]);
  },
  // Fular 9 lei, căciula de 3 ori mai scumpă. Cât costă un fular și o căciulă?
  () => {
    const price = randInt(5, 9); const cap = 3 * price;
    return problem(tr('Un fular costă {price} lei, iar o căciulă este de 3 ori mai scumpă. Cât costă un fular și o căciulă?', { price }), price + cap,
      tr('Căciula: {price} × 3 = {cap} lei. Împreună: {v0} + {v1} = {v2} lei.', { price, cap, v0: price, v1: cap, v2: price + cap }), [cap, price + 3, 2 * cap]);
  },
  // Mihai are 9 invitați, 3 pizza a câte 8 felii; fiecare copil mănâncă câte 2.
  () => {
    const guests = randInt(7, 10); const slices = 8; const kids = guests + 1; const total = 3 * slices;
    return problem(tr('Mihai are {guests} invitați la ziua lui. El comandă 3 pizza, fiecare tăiată în {slices} felii. ', { guests, slices })
      + tr('Fiecare copil (și Mihai) mănâncă câte 2 felii. Câte felii rămân?'), total - 2 * kids,
      tr('Felii: 3 × {slices} = {total}. Copii: {guests} + 1 = {kids}, mănâncă {v0} × 2 = {v1}. Rămân {v2} - {v3} = {v4}.', { slices, total, guests, kids, v0: kids, v1: 2 * kids, v2: total, v3: 2 * kids, v4: total - 2 * kids }),
      [total - 2 * guests, total, 2 * kids]);
  },
  // Un creion costă 3 lei; 6 creioane, plătește cu două bancnote de 10 lei.
  () => {
    const n = randInt(3, 6);
    return problem(tr('Un creion costă 3 lei. Ce rest primește Anca dacă își cumpără {n} creioane și plătește cu două bancnote de câte 10 lei?', { n }),
      20 - 3 * n, tr('Creioanele costă {n} × 3 = {v0} lei. Plătește 2 × 10 = 20 lei. Restul: 20 - {v1} = {v2} lei.', { n, v0: 3 * n, v1: 3 * n, v2: 20 - 3 * n }),
      [10 - 3 * n >= 0 ? 10 - 3 * n : 1, 3 * n, 20 - n]);
  },
];

// ---------- Exerciții în plus, din lecția „Înmulțirea cu 2” ----------
const TWO_DISCOVER = [
  // Dacă mai vine o sanie cu 2 copii, câți copii vor fi pe cele 4 sănii?
  () => {
    const sleds = randInt(2, 6);
    return problem(tr('Pe {sleds} săniuțe stau câte 2 copii. Dacă mai vine o sanie cu 2 copii, câți copii vor fi pe cele {v0} sănii?', { sleds, v0: sleds + 1 }),
      2 * (sleds + 1),
      tr('{sleds} × 2 = {v0}, plus încă 2: {v1} + 2 = {v2} (sau {v3} × 2).', { sleds, v0: 2 * sleds, v1: 2 * sleds, v2: 2 * (sleds + 1), v3: sleds + 1 }),
      [2 * sleds, sleds + 3, 2 * (sleds + 2)]);
  },
  // Câți nasturi s-au folosit pentru cei doi oameni de zăpadă? 5 + 5 = 2 × 5.
  () => {
    const per = randInt(3, 9);
    return problem(tr('Fiecare din cei 2 oameni de zăpadă are câte {per} nasturi. Câți nasturi s-au folosit?', { per }), 2 * per,
      tr('{per} + {v0} = 2 × {v1} = {v2} × 2 = {v3} nasturi.', { per, v0: per, v1: per, v2: per, v3: 2 * per }), [per + 2, 2 * per + 2, 2 * per - 1]);
  },
];

const TWO_APPLY = [
  // C. Transformă adunările în înmulțiri: 2 + 2 + 2 + 2 = □ × 2
  () => {
    const k = randInt(3, 9);
    return problem(tr('Transformă adunarea în înmulțire: {v0} = □ × 2', { v0: Array(k).fill(2).join(' + ') }), k,
      tr('L-am adunat pe 2 de {k} ori, deci {v0} × 2 = {v1}.', { k, v0: k, v1: 2 * k }), [2 * k, k + 1, 2]);
  },
  // B. Scrie adunările repetate sub formă de înmulțiri: 6 + 6 = 2 × □
  () => {
    const n = randInt(1, 10);
    return problem(tr('Scrie adunarea ca înmulțire: {n} + {v0} = 2 × □', { n, v0: n }), n,
      tr('Am adunat {n} de 2 ori, deci 2 × {v0} = {v1}.', { n, v0: n, v1: 2 * n }), [2 * n, n + 2, 2]);
  },
];

const TWO_PRACTICE = [
  // Cu 2 mai mare vs. de 2 ori mai mare.
  () => {
    const n = pick([7, 5, 2, 9, 4, 10, 3, 6]);
    return Math.random() < 0.5
      ? problem(tr('Află numărul cu 2 mai mare decât {n}.', { n }), n + 2,
        tr('„Cu 2 mai mare” înseamnă adunare: {n} + 2 = {v0}.', { n, v0: n + 2 }), [n * 2, n + 3, n + 1])
      : problem(tr('Află numărul de 2 ori mai mare decât {n}.', { n }), n * 2,
        tr('„De 2 ori mai mare” înseamnă înmulțire: {n} × 2 = {v0}.', { n, v0: n * 2 }), [n + 2, n * 2 + 2, n * 2 - 1]);
  },
  // După model: 7 + 7 = 2 × 7 = 14.
  () => {
    const n = randInt(3, 10);
    return problem(tr('Calculează după model (7 + 7 = 2 × 7 = 14): {n} + {v0} = 2 × {v1} = ?', { n, v0: n, v1: n }), 2 * n,
      `${n} + ${n} = 2 × ${n} = ${2 * n}.`, [n + 2, 2 * n + 1, 2 * n - 2]);
  },
  // Dublul numerelor cuprinse între 2 și 9.
  () => {
    const n = randInt(3, 8);
    return problem(tr('Află dublul numărului {n}.', { n }), 2 * n,
      tr('Dublul înseamnă de 2 ori mai mare: 2 × {n} = {v0}.', { n, v0: 2 * n }), [n + 2, 3 * n, 2 * n + 2]);
  },
  // Care număr poate fi rezultat al înmulțirii cu 2 (număr par)?
  () => {
    const good = 2 * randInt(2, 10);
    const bad = new Set();
    while (bad.size < 3) bad.add(2 * randInt(2, 9) + 1);
    return {
      text: 'Care dintre aceste numere poate fi rezultatul unei înmulțiri cu 2?',
      answer: good,
      explanation: tr('Rezultatul înmulțirii cu 2 este întotdeauna un număr par. Doar {good} este par.', { good }),
      choices: shuffle([good, ...bad]),
    };
  },
  // Scrie numărul 12 sub formă de produs.
  () => {
    const n = randInt(3, 10);
    return problem(tr('Scrie numărul {v0} sub formă de produs: {v1} = 2 × □', { v0: 2 * n, v1: 2 * n }), n,
      `2 × ${n} = ${2 * n}.`, [n + 1, n - 1, 2 * n - 2]);
  },
];

const TWO_SOLVE = [
  // Bunica a tricotat câte o pereche de mănuși pentru cei 8 nepoți.
  () => {
    const g = randInt(3, 9);
    return problem(tr('Bunica a tricotat câte o pereche de mănuși pentru cei {g} nepoți ai săi. Câte mănuși a tricotat?', { g }), 2 * g,
      tr('O pereche are 2 mănuși: {g} × 2 = {v0} mănuși.', { g, v0: 2 * g }), [g, g + 2, 2 * g + 2]);
  },
  // Într-o cutie sunt 7 bomboane. Câte bomboane sunt în două cutii?
  () => {
    const n = randInt(4, 10);
    return problem(tr('Într-o cutie sunt {n} bomboane. Câte bomboane sunt în două cutii de același fel?', { n }), 2 * n,
      tr('2 × {n} = {v0} bomboane (sau {v1} + {v2}).', { n, v0: 2 * n, v1: n, v2: n }), [n + 2, 2 * n + 2, n]);
  },
  // Numărul băieților e dublu față de cel al fetelor; sunt 9 fete. Câți copii?
  () => {
    const girls = randInt(4, 9); const boys = 2 * girls;
    return problem(tr('Numărul băieților de pe pârtie este dublu față de cel al fetelor. Știind că sunt {girls} fete, ', { girls })
      + tr('află câți copii sunt pe pârtie.'), girls + boys,
      tr('Băieți: 2 × {girls} = {boys}. Copii: {v0} + {v1} = {v2}.', { girls, boys, v0: girls, v1: boys, v2: girls + boys }), [boys, girls + 2, 2 * boys]);
  },
  // Bilet patinoar: 5 lei copii, adulți de 2 ori mai mare.
  () => {
    const price = randInt(3, 8); const adult = 2 * price;
    return Math.random() < 0.5
      ? problem(tr('Prețul unui bilet de intrare la patinoar este de {price} lei pentru copii, iar pentru adulți de 2 ori mai mare. ', { price })
        + tr('Cât costă un bilet pentru adulți?'), adult,
        tr('{price} × 2 = {adult} lei.', { price, adult }), [price + 2, adult + price, price])
      : problem(tr('Un bilet la patinoar costă {price} lei pentru copii, iar pentru adulți de 2 ori mai mult. ', { price })
        + tr('Cât plătesc Ioana și părinții ei pentru intrarea la patinoar?'), price + 2 * adult,
        tr('Bilet adult: {price} × 2 = {adult} lei. Doi părinți: 2 × {v0} = {v1} lei. Cu Ioana: {v2} + {v3} = {v4} lei.', { price, adult, v0: adult, v1: 2 * adult, v2: 2 * adult, v3: price, v4: price + 2 * adult }),
        [3 * price, price + adult, 2 * adult]);
  },
];

// Exerciții în plus, din lecția „Înmulțirea cu 8 sau 9”.
function extraDiscover(N) {
  if (N === 2) return TWO_DISCOVER;
  if (N === 3) return THREE_DISCOVER;
  return N === 4 ? FOUR_DISCOVER : [];
}

function extraApply(N) {
  if (N === 2) return TWO_APPLY;
  if (N === 3) return THREE_APPLY;
  if (N === 4) return FOUR_APPLY;
  if (N < 8) return [];
  return [
    // B. Compară produsele, folosind semnele <, > sau =
    () => {
      const a = randInt(3, 9); const b = randInt(3, 9); const c = randInt(3, 9);
      const left = N * a; const right = Math.random() < 0.5 ? b * c : N * b;
      const rightText = right === N * b ? `${N} × ${b}` : `${b} × ${c}`;
      const sign = left < right ? '<' : left > right ? '>' : '=';
      return {
        text: tr('Compară produsele: {N} × {a} ○ {rightText}', { N, a, rightText }),
        answer: sign,
        explanation: tr('{N} × {a} = {left} și {rightText} = {right}, deci {v0} {sign} {v1}.', { N, a, left, rightText, right, v0: left, sign, v1: right }),
        choices: SIGNS,
      };
    },
    // D. Completează și calculează: 2 × 3 × 8 = □ × 8
    () => {
      const [a, b] = pick([[2, 3], [3, 3], [2, 4], [2, 2], [3, 2]]);
      return problem(tr('Completează: {a} × {b} × {N} = □ × {v0}. Ce număr pui în căsuță?', { a, b, N, v0: N }), a * b,
        tr('Grupăm primii doi factori: {a} × {b} = {v0}, deci {v1} × {v2} × {N} = {v3} × {v4} = {v5}.', { a, b, v0: a * b, v1: a, v2: b, N, v3: a * b, v4: N, v5: a * b * N }),
        [a + b, a * b * N, a * b + 1]);
    },
  ];
}

function extraPractice(N) {
  if (N === 2) return TWO_PRACTICE;
  if (N === 3) return THREE_PRACTICE;
  if (N === 4) return FOUR_PRACTICE;
  if (N < 8) return [];
  return [
    // Completează cu semnul potrivit: 6 ○ 6 = 36, 4 ○ 9 = 13…
    () => {
      const a = randInt(2, 9); const b = randInt(2, 9);
      const kind = pick(['×', '+', '−']);
      if (kind === '−' && a <= b) return extraPractice(N)[0]();
      const result = kind === '×' ? a * b : kind === '+' ? a + b : a - b;
      if ([a * b, a + b, a - b].filter(v => v === result).length > 1) return extraPractice(N)[0]();
      const words = { '×': 'înmulțim', '+': 'adunăm', '−': 'scădem' };
      return {
        text: tr('Ce semn pui ca să fie adevărat? {a} ○ {b} = {result}', { a, b, result }),
        answer: kind,
        explanation: `${a} × ${b} = ${a * b}, ${a} + ${b} = ${a + b}${a > b ? `, ${a} − ${b} = ${a - b}` : ''}. `
          + tr('Ca să obținem {result}, {v0}: {a} {kind} {b} = {v1}.', { result, v0: words[kind], a, kind, b, v1: result }),
        choices: OPERATIONS,
      };
    },
    // □ × □ = 81 și 32 = 8 × □
    () => (Math.random() < 0.5
      ? problem(tr('Completează: □ × □ = {v0}, unde în ambele căsuțe e același număr.', { v0: N * N }), N,
        `${N} × ${N} = ${N * N}.`, [N + 1, N - 1, N * N / 2 | 0])
      : (() => {
        const k = randInt(2, 9);
        return problem(tr('Completează: {v0} = {N} × □', { v0: N * k, N }), k,
          tr('Căutăm numărul care înmulțit cu {N} dă {v0}: {v1} × {k} = {v2}.', { N, v0: N * k, v1: N, k, v2: N * k }), [k + 1, k - 1, N * k - N]);
      })()),
    // Scrie ca produs de 2 factori: 16 = 2 × 8
    () => {
      const k = randInt(2, 9);
      return problem(tr('Scrie numărul {v0} ca produs de 2 factori: {v1} = {k} × □', { v0: N * k, v1: N * k, k }), N,
        tr('{k} × {N} = {v0}, deci în căsuță e {v1}.', { k, N, v0: N * k, v1: N }), [N + 1, N - 1, N * k - k]);
    },
  ];
}

function extraSolve(N) {
  if (N === 2) return TWO_SOLVE;
  if (N === 3) return THREE_SOLVE;
  if (N === 4) return FOUR_SOLVE;
  if (N < 8) return [];
  return [
    // Habarnam: 6 cutii cu câte 9 baloane, s-au spart 7.
    () => {
      const boxes = randInt(3, 8); const per = N; const popped = randInt(3, 9);
      const total = boxes * per;
      return problem(tr('Pentru petrecerea dată în cinstea lui Habarnam, spiridușii au cumpărat {boxes} cutii cu câte {per} baloane fiecare. ', { boxes, per })
        + tr('Câte baloane au rămas, dacă s-au spart {popped} dintre ele?', { popped }), total - popped,
        tr('Baloane cumpărate: {boxes} × {per} = {total}. Rămase: {v0} - {popped} = {v1}.', { boxes, per, total, v0: total, popped, v1: total - popped }),
        [total, total + popped, boxes * per - per]);
    },
    // 3 cutii cu câte 3 cozonaci, fiecare tăiat în 9 felii.
    () => {
      const boxes = randInt(2, 3); const per = randInt(2, 3); const slices = N;
      const answer = boxes * per * slices;
      return problem(tr('La petrecere s-au adus {boxes} cutii cu câte {per} cozonaci. Fiecare cozonac a fost tăiat în {slices} felii. ', { boxes, per, slices })
        + tr('Câte felii de cozonac s-au obținut?'), answer,
        tr('Cozonaci: {boxes} × {per} = {v0}. Felii: {v1} × {slices} = {answer}.', { boxes, per, v0: boxes * per, v1: boxes * per, slices, answer }),
        [boxes * per, boxes + per + slices, boxes * slices]);
    },
    // 8 ghirlande cu câte 6 steluțe albastre și 4 albe — în două moduri.
    () => {
      const g = N; const blue = randInt(3, 6); const white = randInt(2, 4);
      const answer = g * (blue + white);
      return problem(tr('Spiridușii au pregătit {g} ghirlande cu steluțe. Fiecare ghirlandă are {blue} steluțe albastre și {white} albe. ', { g, blue, white })
        + tr('Câte steluțe au folosit pentru ghirlande?'), answer,
        tr('Modul I: pe o ghirlandă sunt {blue} + {white} = {v0} steluțe; {g} × {v1} = {answer}. ', { blue, white, v0: blue + white, g, v1: blue + white, answer })
        + tr('Modul II: {g} × {blue} = {v0} albastre și {v1} × {white} = {v2} albe; {v3} + {v4} = {answer}.', { g, blue, v0: g * blue, v1: g, white, v2: g * white, v3: g * blue, v4: g * white, answer }),
        [g * blue, blue + white + g, g * white]);
    },
    // 8 baxuri cu câte 8 flacoane de apă; au rămas 19.
    () => {
      const packs = randInt(4, 9); const per = N; const total = packs * per; const left = randInt(5, total - 10);
      return problem(tr('Pentru petrecere s-au adus {packs} baxuri cu câte {per} flacoane de apă fiecare. ', { packs, per })
        + tr('Câte flacoane cu apă s-au consumat, dacă au rămas {left}?', { left }), total - left,
        tr('Flacoane aduse: {packs} × {per} = {total}. Consumate: {v0} - {left} = {v1}.', { packs, per, total, v0: total, left, v1: total - left }),
        [total, total + left, left]);
    },
    // Cu cât e mai mare produsul numerelor 8 și 9 decât suma lor?
    () => {
      const other = randInt(4, 9);
      const product = N * other; const sum = N + other;
      return problem(tr('Află cu cât este mai mare produsul numerelor {N} și {other} decât suma lor.', { N, other }), product - sum,
        tr('Produsul: {N} × {other} = {product}. Suma: {v0} + {v1} = {sum}. Diferența: {v2} - {v3} = {v4}.', { N, other, product, v0: N, v1: other, sum, v2: product, v3: sum, v4: product - sum }),
        [product, sum, product + sum]);
    },
    // La triplul numărului 8 adaugă dublul lui 9.
    () => {
      const other = N === 8 ? 9 : 8;
      const answer = 3 * N + 2 * other;
      return problem(tr('La triplul numărului {N} adaugă dublul lui {other}. Ce rezultat ai obținut?', { N, other }), answer,
        tr('Triplul lui {N}: 3 × {v0} = {v1}. Dublul lui {other}: 2 × {v2} = {v3}. Suma: {v4} + {v5} = {answer}.', { N, v0: N, v1: 3 * N, other, v2: other, v3: 2 * other, v4: 3 * N, v5: 2 * other, answer }),
        [3 * N + other, N + 2 * other, 2 * N + 3 * other]);
    },
    // Habarnam a cumpărat pixuri și creioane; cât au costat / ce rest a primit?
    () => {
      const pens = randInt(3, 7); const pencils = randInt(3, 8); const penPrice = N; const pencilPrice = randInt(2, 5);
      const cost = pens * penPrice + pencils * pencilPrice;
      const paid = Math.ceil((cost + 1) / 10) * 10;
      return Math.random() < 0.5
        ? problem(tr('Habarnam a cumpărat {pens} pixuri și {pencils} creioane pentru prietenii lui. ', { pens, pencils })
          + tr('Cât au costat cadourile, dacă un pix costă {penPrice} lei, iar un creion {pencilPrice} lei?', { penPrice, pencilPrice }), cost,
          tr('Pixuri: {pens} × {penPrice} = {v0} lei. Creioane: {pencils} × {pencilPrice} = {v1} lei. ', { pens, penPrice, v0: pens * penPrice, pencils, pencilPrice, v1: pencils * pencilPrice })
          + tr('Total: {v0} + {v1} = {cost} lei.', { v0: pens * penPrice, v1: pencils * pencilPrice, cost }),
          [pens * penPrice, pencils * pencilPrice, (pens + pencils) * penPrice])
        : problem(tr('Habarnam a cumpărat {pens} pixuri a câte {penPrice} lei și {pencils} creioane a câte {pencilPrice} lei. ', { pens, penPrice, pencils, pencilPrice })
          + tr('Ce rest a primit de la {paid} de lei?', { paid }), paid - cost,
          tr('Cadourile au costat {pens} × {penPrice} + {pencils} × {pencilPrice} = {cost} lei. Restul: {paid} - {v0} = {v1} lei.', { pens, penPrice, pencils, pencilPrice, cost, paid, v0: cost, v1: paid - cost }),
          [cost, paid - pens * penPrice, paid - cost + pencilPrice]);
    },
    // Pe 4 mese sunt câte 2 farfurii; pe fiecare farfurie câte 5 prăjituri.
    () => {
      const tables = N === 8 ? 4 : 3; const plates = 2; const cakes = randInt(3, 5);
      const answer = tables * plates * cakes;
      return problem(tr('Pe {tables} mese sunt câte {plates} farfurii. Pe fiecare farfurie sunt câte {cakes} prăjituri. Câte prăjituri sunt în total?', { tables, plates, cakes }),
        answer,
        tr('Modul I: {tables} × {plates} = {v0} farfurii; {v1} × {cakes} = {answer}. ', { tables, plates, v0: tables * plates, v1: tables * plates, cakes, answer })
        + tr('Modul II: {plates} × {cakes} = {v0} prăjituri pe o masă; {tables} × {v1} = {answer}.', { plates, cakes, v0: plates * cakes, tables, v1: plates * cakes, answer }),
        [tables * cakes, tables + plates + cakes, plates * cakes]);
    },
  ];
}

// ---------- 🔍 Descopăr ----------
function discover(N) {
  return [
    () => (Math.random() < 0.5 ? mult(randInt(1, 10), N) : mult(N, randInt(1, 10))),
    () => {
      const k = randInt(2, 10);
      return problem(tr('Continuă după model: {N} × {k} = {v0}, deci {v1} × {v2} = ?', { N, k, v0: N * k, v1: k, v2: N }), N * k,
        tr('Dacă schimbăm ordinea factorilor, rezultatul rămâne același: {k} × {N} = {v0}.', { k, N, v0: N * k }),
        [N + k, N * k + N, N * k - N]);
    },
    () => {
      const k = randInt(3, 10);
      return problem(tr('Completează: {k} × {N} = {v0} × {v1} + {v2} = ?', { k, N, v0: k - 1, v1: N, v2: N }), N * k,
        tr('Știm că {v0} × {N} = {v1}. Mai adăugăm încă un {v2}: {v3} + {v4} = {v5}.', { v0: k - 1, N, v1: N * (k - 1), v2: N, v3: N * (k - 1), v4: N, v5: N * k }),
        [N * (k - 1), N * k + N, k + N]);
    },
    () => STORY[N](randInt(2, 9)),
  ];
}

// ---------- ✏️ Aplic ----------
function apply(N) {
  return [
    // A. Efectuează
    () => mult(randInt(2, 10), N),
    // B. Alege rezultatul corect (ex. 7 × 7 = 42 / 49 / 36)
    () => {
      const k = randInt(4, 10);
      return {
        text: tr('Alege rezultatul corect: {k} × {N} = ?', { k, N }),
        answer: N * k,
        explanation: tr('{k} × {N} = {v0}. Celelalte sunt rezultatele vecine: {v1}, {v2}, {v3}.', { k, N, v0: N * k, v1: N * (k - 1), v2: N * (k + 1), v3: N * (k - 2) }),
        choices: shuffle([N * k, N * (k - 1), N * (k + 1), N * (k - 2)]),
      };
    },
    // C. Înmulțește cu el însuși — doar numere până la cel al lecției (ca în manual: 4, 5, 6, 7).
    () => {
      const n = randInt(4, N);
      return problem(tr('Înmulțește numărul {n} cu el însuși.', { n }), n * n,
        tr('„Cu el însuși” înseamnă {n} × {v0} = {v1}.', { n, v0: n, v1: n * n }), [n + n, n * n + n, n * n - n]);
    },
    // D. Calculează (trei factori)
    () => {
      const [a, b] = pick([[2, 3], [3, 3], [5, 2], [1, 7], [2, 2], [3, 2], [1, 8], [2, 4]]);
      return problem(tr('Calculează: {a} × {b} × {N} = ?', { a, b, N }), a * b * N,
        tr('Întâi {a} × {b} = {v0}, apoi {v1} × {N} = {v2}.', { a, b, v0: a * b, v1: a * b, N, v2: a * b * N }), [a + b + N, a * b + N, a * N]);
    },
    () => {
      const n = randInt(2, 10);
      return problem(tr('Mărește de {N} ori numărul {n}.', { N, n }), N * n,
        tr('„Mărește de {N} ori” înseamnă că înmulțim cu {v0}: {n} × {v1} = {v2}.', { N, v0: N, n, v1: N, v2: N * n }), [n + N, N * n + N, N * n - N]);
    },
  ];
}

// ---------- ⭐ Exersez ----------
function practice(N) {
  return [
    // Află numerele de N ori mai mari decât…
    () => {
      // Numerele din manual pentru fiecare lecție.
      const n = pick({ 2: [7, 5, 2, 9, 4, 10, 3, 6], 3: [7, 5, 2, 9, 4, 10, 8, 3], 4: [8, 1, 5, 6, 2, 9, 4, 10], 7: [1, 3, 5, 7, 9], 8: [2, 4, 7, 10, 9, 5, 8, 3], 9: [4, 7, 9, 5, 3, 8] }[N] || [4, 7, 10, 5, 6, 2, 3, 8, 9]);
      return problem(tr('Află numărul de {N} ori mai mare decât {n}.', { N, n }), N * n,
        tr('„De {N} ori mai mare” înseamnă că înmulțim: {n} × {v0} = {v1}.', { N, n, v0: N, v1: N * n }), [n + N, N * n + N, N * n - N]);
    },
    // Factorul care lipsește
    () => {
      const x = randInt(2, 10);
      const eq = pick([`${N} × □ = ${N * x}`, `□ × ${N} = ${N * x}`]);
      return problem(tr('Completează cu factorul care lipsește: {eq}', { eq }), x,
        tr('Căutăm numărul care înmulțit cu {N} dă {v0}: {x} × {v1} = {v2}.', { N, v0: N * x, x, v1: N, v2: N * x }), [N * x - N, x + 1, N]);
    },
    () => {
      const a = randInt(2, 9);
      return problem(tr('Completează cu factorul care lipsește: {a} × □ = {v0}', { a, v0: a * N }), N,
        tr('Căutăm numărul care înmulțit cu {a} dă {v0}: {v1} × {N} = {v2}.', { a, v0: a * N, v1: a, N, v2: a * N }), [a, a * N - a, N + 1]);
    },
    // Suma și produsul perechilor de numere
    () => {
      const a = randInt(2, 9); const b = N;
      const askProduct = Math.random() < 0.5;
      return askProduct
        ? problem(tr('Pentru numerele {a} și {b}, află produsul.', { a, b }), a * b,
          tr('Produsul înseamnă înmulțire: {a} × {b} = {v0}.', { a, b, v0: a * b }), [a + b, a * b + a, a * b - b])
        : problem(tr('Pentru numerele {a} și {b}, află suma.', { a, b }), a + b,
          tr('Suma înseamnă adunare: {a} + {b} = {v0}.', { a, b, v0: a + b }), [a * b, a + b + 1, a + b - 1]);
    },
    // Completează cu semnele <, > sau =
    () => {
      const k = randInt(3, 9); const product = N * k;
      const other = pick([product, product + randInt(1, 4), product - randInt(1, 4)]);
      const sign = product < other ? '<' : product > other ? '>' : '=';
      return {
        text: tr('Ce semn pui între ele? {N} × {k} ○ {other}', { N, k, other }),
        answer: sign,
        explanation: tr('{N} × {k} = {product}. Comparăm {v0} cu {other}: {v1} {sign} {v2}.', { N, k, product, v0: product, other, v1: product, sign, v2: other }),
        choices: SIGNS,
      };
    },
    // Trei factori: 3 × 2 × □ = 36
    () => {
      const [a, b] = pick([[3, 2], [2, 2], [2, 4], [3, 3], [2, 3]]);
      return problem(tr('Completează factorul potrivit: {a} × {b} × □ = {v0}', { a, b, v0: a * b * N }), N,
        tr('Întâi {a} × {b} = {v0}. Căutăm numărul pentru care {v1} × □ = {v2}: {v3} × {N} = {v4}.', { a, b, v0: a * b, v1: a * b, v2: a * b * N, v3: a * b, N, v4: a * b * N }),
        [N + 1, N - 1, a * b]);
    },
    // Ce numere înmulțite cu 6 dau produsul mai mic decât 54?
    () => {
      const limit = N * randInt(5, 9);
      const best = limit / N - 1;
      return problem(tr('Care este cel mai mare număr care, înmulțit cu {N}, dă un produs mai mic decât {limit}?', { N, limit }), best,
        tr('{best} × {N} = {v0}, mai mic decât {limit}. Dar {v1} × {v2} = {v3}, nu e mai mic.', { best, N, v0: best * N, limit, v1: best + 1, v2: N, v3: limit }),
        [best + 1, best - 1, limit - N]);
    },
    // Figurile geometrice: ● × ● = 36
    () => {
      const shape = pick(['🟠', '🔵', '🟢', '🔺']);
      return problem(tr('Descoperă numărul ascuns: {shape} × {v0} = {v1}. Ce număr este {v2}?', { shape, v0: shape, v1: N * N, v2: shape }), N,
        tr('Căutăm un număr care înmulțit cu el însuși dă {v0}: {N} × {v1} = {v2}.', { v0: N * N, N, v1: N, v2: N * N }), [N + 1, N - 1, N * N / 2 | 0]);
    },
    // Adevărat / fals
    () => {
      const k = randInt(3, 9); const ok = Math.random() < 0.5;
      const right = ok ? `${k - 1} × ${N} + ${N}` : `${k - 1} × ${N} + ${k}`;
      const value = ok ? N * k : N * (k - 1) + k;
      return {
        text: tr('Adevărat sau fals? {k} × {N} = {right}', { k, N, right }),
        answer: value === N * k ? 'Adevărat' : 'Fals',
        explanation: tr('{k} × {N} = {v0}, iar {right} = {value}. {v1}', { k, N, v0: N * k, right, value, v1: value === N * k ? 'Sunt egale — adevărat!' : 'Nu sunt egale — fals.' }),
        choices: TRUE_FALSE,
      };
    },
  ];
}

// ---------- 🧩 Rezolv probleme ----------
function solve(N) {
  return [
    // Pe fiecare din cele 7 rafturi sunt câte 8 borcane cu miere.
    () => {
      const per = randInt(3, 9);
      return problem(tr('Pe fiecare din cele {N} rafturi din cămară sunt așezate câte {per} borcane cu miere. ', { N, per })
        + tr('Câte borcane cu miere sunt în cămară?'), N * per,
        tr('{N} rafturi × {per} borcane = {v0} borcane.', { N, per, v0: N * per }), [N + per, N * per - per, N * per + per]);
    },
    // 8 machete de sateliți, de rachete de 7 ori mai multe — în total?
    () => {
      const sat = randInt(3, 9); const rockets = sat * N;
      return problem(tr('La clubul de aeromodele s-au construit {sat} machete de sateliți, iar de rachete de {N} ori mai multe. ', { sat, N })
        + tr('Câte machete s-au construit în total?'), sat + rockets,
        tr('Rachete: {sat} × {N} = {rockets}. În total: {v0} + {v1} = {v2} machete.', { sat, N, rockets, v0: sat, v1: rockets, v2: sat + rockets }),
        [rockets, sat + N, sat * (N + 2)]);
    },
    // Laura are 6 cartonașe, Alin de 10 ori mai multe — de câte mai are nevoie Laura?
    () => {
      const [girl, boy] = [pick(['Laura', 'Ioana', 'Sofia', 'Mara']), pick(['Alin', 'Matei', 'David', 'Luca'])];
      const has = N; const k = randInt(3, 10); const other = has * k;
      return problem(tr('{girl} are {has} cartonașe cu planete, iar {boy} de {k} ori mai multe. ', { girl, has, boy, k })
        + tr('De câte cartonașe mai are nevoie {girl}, pentru a avea câte {boy}?', { girl, boy }), other - has,
        tr('{boy} are {has} × {k} = {other} cartonașe. {girl} mai are nevoie de {v0} - {v1} = {v2}.', { boy, has, k, other, girl, v0: other, v1: has, v2: other - has }),
        [other, other + has, k]);
    },
    // 6 lădițe cu câte 9 kg de ceapă; s-a vândut ceapa din 4 lădițe.
    () => {
      // La 2 și 3 numărul lecției e cantitatea din lădiță (altfel ar fi prea puține lădițe).
      const boxes = N >= 4 ? N : randInt(5, 8); const kg = N >= 4 ? randInt(4, 9) : N; const sold = randInt(2, boxes - 2);
      const left = (boxes - sold) * kg;
      return problem(tr('La un aprozar s-au adus {boxes} lădițe cu câte {kg} kilograme de ceapă fiecare. ', { boxes, kg })
        + tr('Câte kilograme de ceapă au rămas, dacă s-a vândut ceapa din {sold} lădițe?', { sold }), left,
        tr('Modul I: au rămas {boxes} - {sold} = {v0} lădițe; {v1} × {kg} = {left} kg. ', { boxes, sold, v0: boxes - sold, v1: boxes - sold, kg, left })
        + tr('Modul II: în total {boxes} × {kg} = {v0} kg, s-au vândut {sold} × {v1} = {v2} kg; {v3} - {v4} = {left} kg.', { boxes, kg, v0: boxes * kg, sold, v1: kg, v2: sold * kg, v3: boxes * kg, v4: sold * kg, left }),
        [boxes * kg, sold * kg, left + kg]);
    },
    // 43 de machete câte 3 într-o cutie; 7 cutii — câte rămân neambalate?
    () => {
      const per = randInt(2, 5); const packed = N * per; const total = packed + randInt(3, 25);
      return problem(tr('{total}{v0} machete trebuie ambalate câte {per} într-o cutie. Dacă sunt {N} cutii, ', { total, v0: total >= 20 ? " de" : "", per, N })
        + tr('câte machete rămân neambalate?'), total - packed,
        tr('În {N} cutii încap {v0} × {per} = {packed} machete. Rămân {total} - {v1} = {v2}.', { N, v0: N, per, packed, total, v1: packed, v2: total - packed }),
        [packed, total - per, total - N]);
    },
    // Un factor e 6, celălalt cel mai mare număr par de o cifră; cu cât e mai mic produsul decât 80?
    () => {
      const other = pick([[8, 'cel mai mare număr par de o cifră'], [9, 'cel mai mare număr de o cifră'], [7, 'cel mai mare număr impar de o cifră, mai mic decât 9']]);
      const product = N * other[0];
      const limit = Math.ceil((product + 1) / 10) * 10 + 10;
      return problem(tr('Un factor al înmulțirii este {N}, iar celălalt este {v0}. ', { N, v0: other[1] })
        + tr('Cu cât este mai mic produsul lor decât numărul {limit}?', { limit }), limit - product,
        tr('Celălalt factor este {v0}. Produsul: {N} × {v1} = {product}. Diferența: {limit} - {v2} = {v3}.', { v0: other[0], N, v1: other[0], product, limit, v2: product, v3: limit - product }),
        [product, limit - N - other[0], limit - product + N]);
    },
    // Grupe de câte N.
    () => {
      const k = randInt(2, 10);
      const [one, many, thing] = pick(GROUPS[N]);
      return problem(tr('{one} are {N} {thing}. Câte {v0} au {k} {many}?', { one, N, thing, v0: thing, k, many }), N * k,
        tr('Câte {N} pentru fiecare: {k} × {v0} = {v1}.', { N, k, v0: N, v1: N * k }), [N + k, N * k + N, N * k - N]);
    },
  ];
}

// Fiecare secțiune: exercițiile comune + cele în plus pentru lecția cu 8 sau 9.
const BUILDERS = [
  N => [...discover(N), ...extraDiscover(N)],
  N => [...apply(N), ...extraApply(N)],
  N => [...practice(N), ...extraPractice(N)],
  N => [...solve(N), ...extraSolve(N)],
];

export function lessonFactorOf(level) {
  const entry = Object.entries(LESSON_LEVELS).find(([, levels]) => levels.includes(level));
  return entry ? Number(entry[0]) : null;
}

export function buildLessonProblem(level) {
  const N = lessonFactorOf(level);
  const section = LESSON_LEVELS[N].indexOf(level);
  return { ...pick(BUILDERS[section](N))(), badge: BADGES[section] };
}
