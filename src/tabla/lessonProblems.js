// Exerciții pentru lecțiile „Înmulțirea cu 2, 3, 4, 6, 7, 8, 9”, după manual,
// pe cele 4 secțiuni: Descopăr, Aplic, Exersez, Rezolv probleme.
// (Înmulțirea cu 5 are exercițiile ei în fiveProblems.js.)
import { makeAnswers } from './data';

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
  2: (k) => problem(`Pe fiecare săniuță stau câte 2 copii. Câți copii sunt pe ${k} săniuțe?`, 2 * k,
    `${Array(k).fill(2).join(' + ')} = de ${k} ori câte 2 = ${k} × 2 = ${2 * k} copii.`, [2 + k, 2 * k + 2, 2 * k - 2]),
  3: (k) => problem(`Fiecare copil a pregătit câte 3 bulgări de zăpadă. Câți bulgări au pregătit ${k} copii?`, 3 * k,
    `${Array(k).fill(3).join(' + ')} = de ${k} ori câte 3 = ${k} × 3 = ${3 * k} bulgări.`, [3 + k, 3 * k + 3, 3 * k - 3]),
  4: (k) => problem(`Un urs polar are 4 picioare. Câte picioare au ${k} urși polari?`, 4 * k,
    `${Array(k).fill(4).join(' + ')} = de ${k} ori câte 4 = ${k} × 4 = ${4 * k} picioare.`, [4 + k, 4 * k + 4, 4 * k - 4]),
  6: (k) => problem(`Într-o cutie sunt 6 baterii. Câte baterii sunt în ${k} cutii?`, 6 * k,
    `${Array(k).fill(6).join(' + ')} = de ${k} ori câte 6 = ${k} × 6 = ${6 * k} baterii.`, [6 + k, 6 * k + 6, 6 * k - 6]),
  7: (k) => problem(`Într-un teanc sunt 7 monede. Câte monede sunt în ${k} teancuri?`, 7 * k,
    `${Array(k).fill(7).join(' + ')} = de ${k} ori câte 7 = ${k} × 7 = ${7 * k} monede.`, [7 + k, 7 * k + 7, 7 * k - 7]),
  8: (k) => problem(`O caracatiță are 8 brațe. Câte brațe au ${k} caracatițe?`, 8 * k,
    `${Array(k).fill(8).join(' + ')} = de ${k} ori câte 8 = ${k} × 8 = ${8 * k} brațe.`, [8 + k, 8 * k + 8, 8 * k - 8]),
  9: (k) => problem(`Într-o cutie sunt 9 baloane. Câte baloane sunt în ${k} cutii?`, 9 * k,
    `${Array(k).fill(9).join(' + ')} = de ${k} ori câte 9 = ${k} × 9 = ${9 * k} baloane.`, [9 + k, 9 * k + 9, 9 * k - 9]),
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
    return problem(`Pe gheață sunt ${bears} urși polari. Lor li se alătură Fram, ursul polar. `
      + 'Câte picioare au urșii la un loc?', 4 * (bears + 1),
      `Sunt ${bears} + 1 = ${bears + 1} urși. ${bears + 1} × 4 = ${4 * (bears + 1)} picioare `
      + `(sau ${bears} × 4 + 4 = ${4 * bears} + 4 = ${4 * (bears + 1)}).`,
      [4 * bears, bears + 1 + 4, 4 * (bears + 2)]);
  },
  // Pinguinii: 6 + 6 + 6 + 6 = 24, deci 4 × 6 = 6 × 4.
  () => {
    const per = randInt(3, 9);
    return problem(`Sunt 4 grupuri de pinguini, cu câte ${per} pinguini în fiecare grup. Câți pinguini sunt?`, 4 * per,
      `${Array(4).fill(per).join(' + ')} = 4 × ${per} = ${per} × 4 = ${4 * per} pinguini.`, [4 + per, 4 * per + per, 4 * per - 4]);
  },
];

const FOUR_APPLY = [
  // B. Continuă după model: 2 × 4 = 4 × 2.
  () => {
    const k = randInt(3, 9);
    return problem(`Continuă după model: 2 × 4 = 4 × 2. Atunci ${k} × 4 = 4 × □`, k,
      `Ordinea factorilor nu contează: ${k} × 4 = 4 × ${k} = ${4 * k}.`, [4, k + 1, 4 * k]);
  },
  // C. Completează: 3 × 4 = 4 + 4 + … (câți de 4 adunăm?)
  () => {
    const k = randInt(3, 8);
    return problem(`${k} × 4 = 4 + 4 + … Câte numere de 4 trebuie să aduni?`, k,
      `${k} × 4 înseamnă de ${k} ori câte 4: ${Array(k).fill(4).join(' + ')} = ${4 * k}.`, [4, k + 1, 4 * k]);
  },
  () => {
    const k = randInt(3, 8);
    return problem(`Completează și calculează: ${k} × 4 = ${Array(k).fill(4).join(' + ')} = ?`, 4 * k,
      `Am adunat 4 de ${k} ori: ${4 * k}.`, [4 + k, 4 * k + 4, 4 * k - 4]);
  },
];

const FOUR_PRACTICE = [
  // Cu 4 mai mare vs. de 4 ori mai mare.
  () => {
    const n = pick([8, 1, 5, 6, 2, 9, 4, 10]);
    return Math.random() < 0.5
      ? problem(`Află numărul cu 4 mai mare decât ${n}.`, n + 4,
        `„Cu 4 mai mare” înseamnă adunare: ${n} + 4 = ${n + 4}. (Atenție: nu e „de 4 ori”!)`, [n * 4, n + 5, n + 3])
      : problem(`Află numărul de 4 ori mai mare decât ${n}.`, n * 4,
        `„De 4 ori mai mare” înseamnă înmulțire: ${n} × 4 = ${n * 4}. (Atenție: nu e „cu 4”!)`, [n + 4, n * 4 + 4, n * 4 - 4]);
  },
  // Rezolvă după model: 4 × 4 = 3 × 4 + 4.
  () => {
    const k = randInt(5, 9);
    return problem(`Rezolvă după model (4 × 4 = 3 × 4 + 4): ${k} × 4 = ${k - 1} × 4 + □`, 4,
      `${k} × 4 înseamnă cu încă un 4 mai mult decât ${k - 1} × 4: ${4 * (k - 1)} + 4 = ${4 * k}.`, [k, k - 1, 4 * k]);
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
    return problem(`Completează cu factorul care lipsește: ${text}`, answer,
      `Ambele părți trebuie să dea același rezultat: ${explanation}`, [answer + 1, answer - 1, answer * 2]);
  },
  // Calculează și compară: 2 × 6 ○ 3 × 4.
  () => {
    const [l, r] = pick([[[2, 6], [3, 4]], [[3, 8], [7, 4]], [[4, 9], [8, 4]], [[2, 4], [4, 2]], [[4, 5], [3, 6]], [[4, 7], [5, 6]]]);
    const a = l[0] * l[1]; const b = r[0] * r[1];
    const sign = a < b ? '<' : a > b ? '>' : '=';
    return {
      text: `Calculează și compară: ${l[0]} × ${l[1]} ○ ${r[0]} × ${r[1]}`,
      answer: sign,
      explanation: `${l[0]} × ${l[1]} = ${a} și ${r[0]} × ${r[1]} = ${b}, deci ${a} ${sign} ${b}.`,
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
    return problem(`Câte roți au ${cars} mașinuțe?`, 4 * cars,
      `Fiecare mașinuță are 4 roți: ${cars} × 4 = ${4 * cars} roți.`, [cars + 4, 4 * cars + 4, 4 * cars - 4]);
  },
  // O cabană are 10 camere, câte 4 locuri în fiecare.
  () => {
    const rooms = randInt(5, 10);
    return problem(`O cabană are ${rooms} camere. În fiecare cameră sunt câte 4 locuri de cazare. Câte locuri de cazare are cabana?`,
      4 * rooms, `${rooms} camere × 4 locuri = ${4 * rooms} locuri.`, [rooms + 4, 4 * rooms + 4, 4 * rooms - 4]);
  },
  // Cu cât este mai mare produsul numerelor 9 și 4 decât suma lor?
  () => {
    const n = randInt(5, 9);
    return problem(`Cu cât este mai mare produsul numerelor ${n} și 4 decât suma lor?`, 4 * n - (n + 4),
      `Produsul: ${n} × 4 = ${4 * n}. Suma: ${n} + 4 = ${n + 4}. Diferența: ${4 * n} - ${n + 4} = ${4 * n - (n + 4)}.`,
      [4 * n, n + 4, 4 * n + n + 4]);
  },
  // Mara are 7 ani, iar mama de 4 ori mai mulți. Câți ani va avea mama peste 5 ani?
  () => {
    const girl = pick(['Mara', 'Ioana', 'Sofia', 'Ana']); const age = randInt(6, 9); const later = randInt(2, 6);
    const mom = 4 * age;
    return problem(`${girl} are ${age} ani, iar mama sa de 4 ori mai mulți. Câți ani va avea mama peste ${later} ani?`, mom + later,
      `Acum mama are ${age} × 4 = ${mom} ani. Peste ${later} ani: ${mom} + ${later} = ${mom + later} ani.`,
      [mom, age + 4 + later, age + later]);
  },
  // Oana citește o carte cu 198 de pagini; în primele 4 zile câte 9 pagini pe zi.
  () => {
    const per = randInt(6, 9); const total = randInt(60, 99);
    const read = 4 * per;
    return problem(`Oana citește o carte cu ${total} de pagini. În primele 4 zile a citit câte ${per} pagini pe zi. `
      + 'Câte pagini mai are de citit pentru a termina cartea?', total - read,
      `În 4 zile a citit 4 × ${per} = ${read} pagini. Mai are ${total} - ${read} = ${total - read} pagini.`,
      [total - per, read, total - read + 4]);
  },
];

// ---------- Exerciții în plus, din lecția „Înmulțirea cu 3” ----------
const THREE_DISCOVER = [
  // Dan face și el 3 bulgări și li se alătură: 4 copii.
  () => {
    const kids = randInt(2, 5);
    return problem(`${kids} copii au făcut câte 3 bulgări. Dan face și el 3 bulgări și li se alătură. `
      + `Câți bulgări au făcut în total cei ${kids + 1} copii?`, 3 * (kids + 1),
      `${kids} × 3 = ${3 * kids}, plus cei 3 ai lui Dan: ${3 * kids} + 3 = ${3 * (kids + 1)} (sau ${kids + 1} × 3).`,
      [3 * kids, kids + 1 + 3, 3 * (kids + 2)]);
  },
  // Câți bulgări au lovit cele 3 ținte? 5 + 5 + 5 = 3 × 5 = 5 × 3.
  () => {
    const per = randInt(3, 9);
    return problem(`Pe fiecare din cele 3 ținte au lovit câte ${per} bulgări. Câți bulgări au lovit cele 3 ținte?`, 3 * per,
      `${per} + ${per} + ${per} = 3 × ${per} = ${per} × 3 = ${3 * per}.`, [3 + per, 3 * per + per, 3 * per - 3]);
  },
];

const THREE_APPLY = [
  // B. Scrie adunările repetate sub formă de înmulțiri: 8 + 8 + 8 = 3 × □
  () => {
    const n = randInt(2, 9);
    return problem(`Scrie adunarea ca înmulțire: ${n} + ${n} + ${n} = 3 × □`, n,
      `Am adunat ${n} de 3 ori, deci 3 × ${n} = ${3 * n}.`, [3 * n, n + 3, 3]);
  },
  // C. Scrie înmulțirile ca adunări repetate: 5 × 3 = 5 + 5 + □
  () => {
    const n = randInt(2, 9);
    return problem(`Scrie înmulțirea ca adunare repetată: 3 × ${n} = ${n} + ${n} + □`, n,
      `3 × ${n} înseamnă de 3 ori câte ${n}: ${n} + ${n} + ${n} = ${3 * n}.`, [3, 3 * n, n + 1]);
  },
];

const THREE_PRACTICE = [
  // Cu 3 mai mare vs. de 3 ori mai mare.
  () => {
    const n = pick([7, 5, 2, 9, 4, 10, 8, 3]);
    return Math.random() < 0.5
      ? problem(`Află numărul cu 3 mai mare decât ${n}.`, n + 3,
        `„Cu 3 mai mare” înseamnă adunare: ${n} + 3 = ${n + 3}.`, [n * 3, n + 4, n + 2])
      : problem(`Află numărul de 3 ori mai mare decât ${n}.`, n * 3,
        `„De 3 ori mai mare” înseamnă înmulțire: ${n} × 3 = ${n * 3}.`, [n + 3, n * 3 + 3, n * 3 - 3]);
  },
  // Află triplul numerelor pare mai mari decât 3 și mai mici decât 12.
  () => {
    const n = pick([4, 6, 8, 10]);
    return problem(`Află triplul numărului ${n}.`, 3 * n,
      `Triplul înseamnă de 3 ori mai mare: 3 × ${n} = ${3 * n}.`, [n + 3, 2 * n, 3 * n + 3]);
  },
  // 3 × 7 = 7 × □
  () => {
    const n = randInt(2, 10);
    return problem(`Completează: 3 × ${n} = ${n} × □`, 3,
      `Ordinea factorilor nu contează: 3 × ${n} = ${n} × 3 = ${3 * n}.`, [n, 3 * n, 4]);
  },
  // Scrie numărul 21 sub formă de produs.
  () => {
    const n = randInt(3, 9);
    return problem(`Scrie numărul ${3 * n} sub formă de produs: ${3 * n} = 3 × □`, n,
      `3 × ${n} = ${3 * n}.`, [n + 1, n - 1, 3 * n - 3]);
  },
];

const THREE_SOLVE = [
  // Un copac are 7 crengi, pe fiecare câte 3 vrăbii.
  () => {
    const b = randInt(3, 9);
    return problem(`Un copac are ${b} crengi. Pe fiecare creangă stau câte 3 vrăbii. Câte vrăbii stau în copac?`, 3 * b,
      `${b} crengi × 3 vrăbii = ${3 * b} vrăbii.`, [b + 3, 3 * b + 3, 3 * b - 3]);
  },
  // Ioana are 2 ani, sora de 3 ori mai mare.
  () => {
    const age = randInt(2, 4);
    return problem(`Ioana are ${age} ani, iar vârsta surorii sale e de 3 ori mai mare. Câți ani are sora Ioanei?`, 3 * age,
      `„De 3 ori mai mare”: ${age} × 3 = ${3 * age} ani.`, [age + 3, 3 * age + 3, 2 * age]);
  },
  // Fular 9 lei, căciula de 3 ori mai scumpă. Cât costă un fular și o căciulă?
  () => {
    const price = randInt(5, 9); const cap = 3 * price;
    return problem(`Un fular costă ${price} lei, iar o căciulă este de 3 ori mai scumpă. Cât costă un fular și o căciulă?`, price + cap,
      `Căciula: ${price} × 3 = ${cap} lei. Împreună: ${price} + ${cap} = ${price + cap} lei.`, [cap, price + 3, 2 * cap]);
  },
  // Mihai are 9 invitați, 3 pizza a câte 8 felii; fiecare copil mănâncă câte 2.
  () => {
    const guests = randInt(7, 10); const slices = 8; const kids = guests + 1; const total = 3 * slices;
    return problem(`Mihai are ${guests} invitați la ziua lui. El comandă 3 pizza, fiecare tăiată în ${slices} felii. `
      + 'Fiecare copil (și Mihai) mănâncă câte 2 felii. Câte felii rămân?', total - 2 * kids,
      `Felii: 3 × ${slices} = ${total}. Copii: ${guests} + 1 = ${kids}, mănâncă ${kids} × 2 = ${2 * kids}. Rămân ${total} - ${2 * kids} = ${total - 2 * kids}.`,
      [total - 2 * guests, total, 2 * kids]);
  },
  // Un creion costă 3 lei; 6 creioane, plătește cu două bancnote de 10 lei.
  () => {
    const n = randInt(3, 6);
    return problem(`Un creion costă 3 lei. Ce rest primește Anca dacă își cumpără ${n} creioane și plătește cu două bancnote de câte 10 lei?`,
      20 - 3 * n, `Creioanele costă ${n} × 3 = ${3 * n} lei. Plătește 2 × 10 = 20 lei. Restul: 20 - ${3 * n} = ${20 - 3 * n} lei.`,
      [10 - 3 * n >= 0 ? 10 - 3 * n : 1, 3 * n, 20 - n]);
  },
];

// ---------- Exerciții în plus, din lecția „Înmulțirea cu 2” ----------
const TWO_DISCOVER = [
  // Dacă mai vine o sanie cu 2 copii, câți copii vor fi pe cele 4 sănii?
  () => {
    const sleds = randInt(2, 6);
    return problem(`Pe ${sleds} săniuțe stau câte 2 copii. Dacă mai vine o sanie cu 2 copii, câți copii vor fi pe cele ${sleds + 1} sănii?`,
      2 * (sleds + 1),
      `${sleds} × 2 = ${2 * sleds}, plus încă 2: ${2 * sleds} + 2 = ${2 * (sleds + 1)} (sau ${sleds + 1} × 2).`,
      [2 * sleds, sleds + 3, 2 * (sleds + 2)]);
  },
  // Câți nasturi s-au folosit pentru cei doi oameni de zăpadă? 5 + 5 = 2 × 5.
  () => {
    const per = randInt(3, 9);
    return problem(`Fiecare din cei 2 oameni de zăpadă are câte ${per} nasturi. Câți nasturi s-au folosit?`, 2 * per,
      `${per} + ${per} = 2 × ${per} = ${per} × 2 = ${2 * per} nasturi.`, [per + 2, 2 * per + 2, 2 * per - 1]);
  },
];

const TWO_APPLY = [
  // C. Transformă adunările în înmulțiri: 2 + 2 + 2 + 2 = □ × 2
  () => {
    const k = randInt(3, 9);
    return problem(`Transformă adunarea în înmulțire: ${Array(k).fill(2).join(' + ')} = □ × 2`, k,
      `L-am adunat pe 2 de ${k} ori, deci ${k} × 2 = ${2 * k}.`, [2 * k, k + 1, 2]);
  },
  // B. Scrie adunările repetate sub formă de înmulțiri: 6 + 6 = 2 × □
  () => {
    const n = randInt(1, 10);
    return problem(`Scrie adunarea ca înmulțire: ${n} + ${n} = 2 × □`, n,
      `Am adunat ${n} de 2 ori, deci 2 × ${n} = ${2 * n}.`, [2 * n, n + 2, 2]);
  },
];

const TWO_PRACTICE = [
  // Cu 2 mai mare vs. de 2 ori mai mare.
  () => {
    const n = pick([7, 5, 2, 9, 4, 10, 3, 6]);
    return Math.random() < 0.5
      ? problem(`Află numărul cu 2 mai mare decât ${n}.`, n + 2,
        `„Cu 2 mai mare” înseamnă adunare: ${n} + 2 = ${n + 2}.`, [n * 2, n + 3, n + 1])
      : problem(`Află numărul de 2 ori mai mare decât ${n}.`, n * 2,
        `„De 2 ori mai mare” înseamnă înmulțire: ${n} × 2 = ${n * 2}.`, [n + 2, n * 2 + 2, n * 2 - 1]);
  },
  // După model: 7 + 7 = 2 × 7 = 14.
  () => {
    const n = randInt(3, 10);
    return problem(`Calculează după model (7 + 7 = 2 × 7 = 14): ${n} + ${n} = 2 × ${n} = ?`, 2 * n,
      `${n} + ${n} = 2 × ${n} = ${2 * n}.`, [n + 2, 2 * n + 1, 2 * n - 2]);
  },
  // Dublul numerelor cuprinse între 2 și 9.
  () => {
    const n = randInt(3, 8);
    return problem(`Află dublul numărului ${n}.`, 2 * n,
      `Dublul înseamnă de 2 ori mai mare: 2 × ${n} = ${2 * n}.`, [n + 2, 3 * n, 2 * n + 2]);
  },
  // Care număr poate fi rezultat al înmulțirii cu 2 (număr par)?
  () => {
    const good = 2 * randInt(2, 10);
    const bad = new Set();
    while (bad.size < 3) bad.add(2 * randInt(2, 9) + 1);
    return {
      text: 'Care dintre aceste numere poate fi rezultatul unei înmulțiri cu 2?',
      answer: good,
      explanation: `Rezultatul înmulțirii cu 2 este întotdeauna un număr par. Doar ${good} este par.`,
      choices: shuffle([good, ...bad]),
    };
  },
  // Scrie numărul 12 sub formă de produs.
  () => {
    const n = randInt(3, 10);
    return problem(`Scrie numărul ${2 * n} sub formă de produs: ${2 * n} = 2 × □`, n,
      `2 × ${n} = ${2 * n}.`, [n + 1, n - 1, 2 * n - 2]);
  },
];

const TWO_SOLVE = [
  // Bunica a tricotat câte o pereche de mănuși pentru cei 8 nepoți.
  () => {
    const g = randInt(3, 9);
    return problem(`Bunica a tricotat câte o pereche de mănuși pentru cei ${g} nepoți ai săi. Câte mănuși a tricotat?`, 2 * g,
      `O pereche are 2 mănuși: ${g} × 2 = ${2 * g} mănuși.`, [g, g + 2, 2 * g + 2]);
  },
  // Într-o cutie sunt 7 bomboane. Câte bomboane sunt în două cutii?
  () => {
    const n = randInt(4, 10);
    return problem(`Într-o cutie sunt ${n} bomboane. Câte bomboane sunt în două cutii de același fel?`, 2 * n,
      `2 × ${n} = ${2 * n} bomboane (sau ${n} + ${n}).`, [n + 2, 2 * n + 2, n]);
  },
  // Numărul băieților e dublu față de cel al fetelor; sunt 9 fete. Câți copii?
  () => {
    const girls = randInt(4, 9); const boys = 2 * girls;
    return problem(`Numărul băieților de pe pârtie este dublu față de cel al fetelor. Știind că sunt ${girls} fete, `
      + 'află câți copii sunt pe pârtie.', girls + boys,
      `Băieți: 2 × ${girls} = ${boys}. Copii: ${girls} + ${boys} = ${girls + boys}.`, [boys, girls + 2, 2 * boys]);
  },
  // Bilet patinoar: 5 lei copii, adulți de 2 ori mai mare.
  () => {
    const price = randInt(3, 8); const adult = 2 * price;
    return Math.random() < 0.5
      ? problem(`Prețul unui bilet de intrare la patinoar este de ${price} lei pentru copii, iar pentru adulți de 2 ori mai mare. `
        + 'Cât costă un bilet pentru adulți?', adult,
        `${price} × 2 = ${adult} lei.`, [price + 2, adult + price, price])
      : problem(`Un bilet la patinoar costă ${price} lei pentru copii, iar pentru adulți de 2 ori mai mult. `
        + 'Cât plătesc Ioana și părinții ei pentru intrarea la patinoar?', price + 2 * adult,
        `Bilet adult: ${price} × 2 = ${adult} lei. Doi părinți: 2 × ${adult} = ${2 * adult} lei. Cu Ioana: ${2 * adult} + ${price} = ${price + 2 * adult} lei.`,
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
        text: `Compară produsele: ${N} × ${a} ○ ${rightText}`,
        answer: sign,
        explanation: `${N} × ${a} = ${left} și ${rightText} = ${right}, deci ${left} ${sign} ${right}.`,
        choices: SIGNS,
      };
    },
    // D. Completează și calculează: 2 × 3 × 8 = □ × 8
    () => {
      const [a, b] = pick([[2, 3], [3, 3], [2, 4], [2, 2], [3, 2]]);
      return problem(`Completează: ${a} × ${b} × ${N} = □ × ${N}. Ce număr pui în căsuță?`, a * b,
        `Grupăm primii doi factori: ${a} × ${b} = ${a * b}, deci ${a} × ${b} × ${N} = ${a * b} × ${N} = ${a * b * N}.`,
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
        text: `Ce semn pui ca să fie adevărat? ${a} ○ ${b} = ${result}`,
        answer: kind,
        explanation: `${a} × ${b} = ${a * b}, ${a} + ${b} = ${a + b}${a > b ? `, ${a} − ${b} = ${a - b}` : ''}. `
          + `Ca să obținem ${result}, ${words[kind]}: ${a} ${kind} ${b} = ${result}.`,
        choices: OPERATIONS,
      };
    },
    // □ × □ = 81 și 32 = 8 × □
    () => (Math.random() < 0.5
      ? problem(`Completează: □ × □ = ${N * N}, unde în ambele căsuțe e același număr.`, N,
        `${N} × ${N} = ${N * N}.`, [N + 1, N - 1, N * N / 2 | 0])
      : (() => {
        const k = randInt(2, 9);
        return problem(`Completează: ${N * k} = ${N} × □`, k,
          `Căutăm numărul care înmulțit cu ${N} dă ${N * k}: ${N} × ${k} = ${N * k}.`, [k + 1, k - 1, N * k - N]);
      })()),
    // Scrie ca produs de 2 factori: 16 = 2 × 8
    () => {
      const k = randInt(2, 9);
      return problem(`Scrie numărul ${N * k} ca produs de 2 factori: ${N * k} = ${k} × □`, N,
        `${k} × ${N} = ${N * k}, deci în căsuță e ${N}.`, [N + 1, N - 1, N * k - k]);
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
      return problem(`Pentru petrecerea dată în cinstea lui Habarnam, spiridușii au cumpărat ${boxes} cutii cu câte ${per} baloane fiecare. `
        + `Câte baloane au rămas, dacă s-au spart ${popped} dintre ele?`, total - popped,
        `Baloane cumpărate: ${boxes} × ${per} = ${total}. Rămase: ${total} - ${popped} = ${total - popped}.`,
        [total, total + popped, boxes * per - per]);
    },
    // 3 cutii cu câte 3 cozonaci, fiecare tăiat în 9 felii.
    () => {
      const boxes = randInt(2, 3); const per = randInt(2, 3); const slices = N;
      const answer = boxes * per * slices;
      return problem(`La petrecere s-au adus ${boxes} cutii cu câte ${per} cozonaci. Fiecare cozonac a fost tăiat în ${slices} felii. `
        + 'Câte felii de cozonac s-au obținut?', answer,
        `Cozonaci: ${boxes} × ${per} = ${boxes * per}. Felii: ${boxes * per} × ${slices} = ${answer}.`,
        [boxes * per, boxes + per + slices, boxes * slices]);
    },
    // 8 ghirlande cu câte 6 steluțe albastre și 4 albe — în două moduri.
    () => {
      const g = N; const blue = randInt(3, 6); const white = randInt(2, 4);
      const answer = g * (blue + white);
      return problem(`Spiridușii au pregătit ${g} ghirlande cu steluțe. Fiecare ghirlandă are ${blue} steluțe albastre și ${white} albe. `
        + 'Câte steluțe au folosit pentru ghirlande?', answer,
        `Modul I: pe o ghirlandă sunt ${blue} + ${white} = ${blue + white} steluțe; ${g} × ${blue + white} = ${answer}. `
        + `Modul II: ${g} × ${blue} = ${g * blue} albastre și ${g} × ${white} = ${g * white} albe; ${g * blue} + ${g * white} = ${answer}.`,
        [g * blue, blue + white + g, g * white]);
    },
    // 8 baxuri cu câte 8 flacoane de apă; au rămas 19.
    () => {
      const packs = randInt(4, 9); const per = N; const total = packs * per; const left = randInt(5, total - 10);
      return problem(`Pentru petrecere s-au adus ${packs} baxuri cu câte ${per} flacoane de apă fiecare. `
        + `Câte flacoane cu apă s-au consumat, dacă au rămas ${left}?`, total - left,
        `Flacoane aduse: ${packs} × ${per} = ${total}. Consumate: ${total} - ${left} = ${total - left}.`,
        [total, total + left, left]);
    },
    // Cu cât e mai mare produsul numerelor 8 și 9 decât suma lor?
    () => {
      const other = randInt(4, 9);
      const product = N * other; const sum = N + other;
      return problem(`Află cu cât este mai mare produsul numerelor ${N} și ${other} decât suma lor.`, product - sum,
        `Produsul: ${N} × ${other} = ${product}. Suma: ${N} + ${other} = ${sum}. Diferența: ${product} - ${sum} = ${product - sum}.`,
        [product, sum, product + sum]);
    },
    // La triplul numărului 8 adaugă dublul lui 9.
    () => {
      const other = N === 8 ? 9 : 8;
      const answer = 3 * N + 2 * other;
      return problem(`La triplul numărului ${N} adaugă dublul lui ${other}. Ce rezultat ai obținut?`, answer,
        `Triplul lui ${N}: 3 × ${N} = ${3 * N}. Dublul lui ${other}: 2 × ${other} = ${2 * other}. Suma: ${3 * N} + ${2 * other} = ${answer}.`,
        [3 * N + other, N + 2 * other, 2 * N + 3 * other]);
    },
    // Habarnam a cumpărat pixuri și creioane; cât au costat / ce rest a primit?
    () => {
      const pens = randInt(3, 7); const pencils = randInt(3, 8); const penPrice = N; const pencilPrice = randInt(2, 5);
      const cost = pens * penPrice + pencils * pencilPrice;
      const paid = Math.ceil((cost + 1) / 10) * 10;
      return Math.random() < 0.5
        ? problem(`Habarnam a cumpărat ${pens} pixuri și ${pencils} creioane pentru prietenii lui. `
          + `Cât au costat cadourile, dacă un pix costă ${penPrice} lei, iar un creion ${pencilPrice} lei?`, cost,
          `Pixuri: ${pens} × ${penPrice} = ${pens * penPrice} lei. Creioane: ${pencils} × ${pencilPrice} = ${pencils * pencilPrice} lei. `
          + `Total: ${pens * penPrice} + ${pencils * pencilPrice} = ${cost} lei.`,
          [pens * penPrice, pencils * pencilPrice, (pens + pencils) * penPrice])
        : problem(`Habarnam a cumpărat ${pens} pixuri a câte ${penPrice} lei și ${pencils} creioane a câte ${pencilPrice} lei. `
          + `Ce rest a primit de la ${paid} de lei?`, paid - cost,
          `Cadourile au costat ${pens} × ${penPrice} + ${pencils} × ${pencilPrice} = ${cost} lei. Restul: ${paid} - ${cost} = ${paid - cost} lei.`,
          [cost, paid - pens * penPrice, paid - cost + pencilPrice]);
    },
    // Pe 4 mese sunt câte 2 farfurii; pe fiecare farfurie câte 5 prăjituri.
    () => {
      const tables = N === 8 ? 4 : 3; const plates = 2; const cakes = randInt(3, 5);
      const answer = tables * plates * cakes;
      return problem(`Pe ${tables} mese sunt câte ${plates} farfurii. Pe fiecare farfurie sunt câte ${cakes} prăjituri. Câte prăjituri sunt în total?`,
        answer,
        `Modul I: ${tables} × ${plates} = ${tables * plates} farfurii; ${tables * plates} × ${cakes} = ${answer}. `
        + `Modul II: ${plates} × ${cakes} = ${plates * cakes} prăjituri pe o masă; ${tables} × ${plates * cakes} = ${answer}.`,
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
      return problem(`Continuă după model: ${N} × ${k} = ${N * k}, deci ${k} × ${N} = ?`, N * k,
        `Dacă schimbăm ordinea factorilor, rezultatul rămâne același: ${k} × ${N} = ${N * k}.`,
        [N + k, N * k + N, N * k - N]);
    },
    () => {
      const k = randInt(3, 10);
      return problem(`Completează: ${k} × ${N} = ${k - 1} × ${N} + ${N} = ?`, N * k,
        `Știm că ${k - 1} × ${N} = ${N * (k - 1)}. Mai adăugăm încă un ${N}: ${N * (k - 1)} + ${N} = ${N * k}.`,
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
        text: `Alege rezultatul corect: ${k} × ${N} = ?`,
        answer: N * k,
        explanation: `${k} × ${N} = ${N * k}. Celelalte sunt rezultatele vecine: ${N * (k - 1)}, ${N * (k + 1)}, ${N * (k - 2)}.`,
        choices: shuffle([N * k, N * (k - 1), N * (k + 1), N * (k - 2)]),
      };
    },
    // C. Înmulțește cu el însuși — doar numere până la cel al lecției (ca în manual: 4, 5, 6, 7).
    () => {
      const n = randInt(4, N);
      return problem(`Înmulțește numărul ${n} cu el însuși.`, n * n,
        `„Cu el însuși” înseamnă ${n} × ${n} = ${n * n}.`, [n + n, n * n + n, n * n - n]);
    },
    // D. Calculează (trei factori)
    () => {
      const [a, b] = pick([[2, 3], [3, 3], [5, 2], [1, 7], [2, 2], [3, 2], [1, 8], [2, 4]]);
      return problem(`Calculează: ${a} × ${b} × ${N} = ?`, a * b * N,
        `Întâi ${a} × ${b} = ${a * b}, apoi ${a * b} × ${N} = ${a * b * N}.`, [a + b + N, a * b + N, a * N]);
    },
    () => {
      const n = randInt(2, 10);
      return problem(`Mărește de ${N} ori numărul ${n}.`, N * n,
        `„Mărește de ${N} ori” înseamnă că înmulțim cu ${N}: ${n} × ${N} = ${N * n}.`, [n + N, N * n + N, N * n - N]);
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
      return problem(`Află numărul de ${N} ori mai mare decât ${n}.`, N * n,
        `„De ${N} ori mai mare” înseamnă că înmulțim: ${n} × ${N} = ${N * n}.`, [n + N, N * n + N, N * n - N]);
    },
    // Factorul care lipsește
    () => {
      const x = randInt(2, 10);
      const eq = pick([`${N} × □ = ${N * x}`, `□ × ${N} = ${N * x}`]);
      return problem(`Completează cu factorul care lipsește: ${eq}`, x,
        `Căutăm numărul care înmulțit cu ${N} dă ${N * x}: ${x} × ${N} = ${N * x}.`, [N * x - N, x + 1, N]);
    },
    () => {
      const a = randInt(2, 9);
      return problem(`Completează cu factorul care lipsește: ${a} × □ = ${a * N}`, N,
        `Căutăm numărul care înmulțit cu ${a} dă ${a * N}: ${a} × ${N} = ${a * N}.`, [a, a * N - a, N + 1]);
    },
    // Suma și produsul perechilor de numere
    () => {
      const a = randInt(2, 9); const b = N;
      const askProduct = Math.random() < 0.5;
      return askProduct
        ? problem(`Pentru numerele ${a} și ${b}, află produsul.`, a * b,
          `Produsul înseamnă înmulțire: ${a} × ${b} = ${a * b}.`, [a + b, a * b + a, a * b - b])
        : problem(`Pentru numerele ${a} și ${b}, află suma.`, a + b,
          `Suma înseamnă adunare: ${a} + ${b} = ${a + b}.`, [a * b, a + b + 1, a + b - 1]);
    },
    // Completează cu semnele <, > sau =
    () => {
      const k = randInt(3, 9); const product = N * k;
      const other = pick([product, product + randInt(1, 4), product - randInt(1, 4)]);
      const sign = product < other ? '<' : product > other ? '>' : '=';
      return {
        text: `Ce semn pui între ele? ${N} × ${k} ○ ${other}`,
        answer: sign,
        explanation: `${N} × ${k} = ${product}. Comparăm ${product} cu ${other}: ${product} ${sign} ${other}.`,
        choices: SIGNS,
      };
    },
    // Trei factori: 3 × 2 × □ = 36
    () => {
      const [a, b] = pick([[3, 2], [2, 2], [2, 4], [3, 3], [2, 3]]);
      return problem(`Completează factorul potrivit: ${a} × ${b} × □ = ${a * b * N}`, N,
        `Întâi ${a} × ${b} = ${a * b}. Căutăm numărul pentru care ${a * b} × □ = ${a * b * N}: ${a * b} × ${N} = ${a * b * N}.`,
        [N + 1, N - 1, a * b]);
    },
    // Ce numere înmulțite cu 6 dau produsul mai mic decât 54?
    () => {
      const limit = N * randInt(5, 9);
      const best = limit / N - 1;
      return problem(`Care este cel mai mare număr care, înmulțit cu ${N}, dă un produs mai mic decât ${limit}?`, best,
        `${best} × ${N} = ${best * N}, mai mic decât ${limit}. Dar ${best + 1} × ${N} = ${limit}, nu e mai mic.`,
        [best + 1, best - 1, limit - N]);
    },
    // Figurile geometrice: ● × ● = 36
    () => {
      const shape = pick(['🟠', '🔵', '🟢', '🔺']);
      return problem(`Descoperă numărul ascuns: ${shape} × ${shape} = ${N * N}. Ce număr este ${shape}?`, N,
        `Căutăm un număr care înmulțit cu el însuși dă ${N * N}: ${N} × ${N} = ${N * N}.`, [N + 1, N - 1, N * N / 2 | 0]);
    },
    // Adevărat / fals
    () => {
      const k = randInt(3, 9); const ok = Math.random() < 0.5;
      const right = ok ? `${k - 1} × ${N} + ${N}` : `${k - 1} × ${N} + ${k}`;
      const value = ok ? N * k : N * (k - 1) + k;
      return {
        text: `Adevărat sau fals? ${k} × ${N} = ${right}`,
        answer: value === N * k ? 'Adevărat' : 'Fals',
        explanation: `${k} × ${N} = ${N * k}, iar ${right} = ${value}. ${value === N * k ? 'Sunt egale — adevărat!' : 'Nu sunt egale — fals.'}`,
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
      return problem(`Pe fiecare din cele ${N} rafturi din cămară sunt așezate câte ${per} borcane cu miere. `
        + 'Câte borcane cu miere sunt în cămară?', N * per,
        `${N} rafturi × ${per} borcane = ${N * per} borcane.`, [N + per, N * per - per, N * per + per]);
    },
    // 8 machete de sateliți, de rachete de 7 ori mai multe — în total?
    () => {
      const sat = randInt(3, 9); const rockets = sat * N;
      return problem(`La clubul de aeromodele s-au construit ${sat} machete de sateliți, iar de rachete de ${N} ori mai multe. `
        + 'Câte machete s-au construit în total?', sat + rockets,
        `Rachete: ${sat} × ${N} = ${rockets}. În total: ${sat} + ${rockets} = ${sat + rockets} machete.`,
        [rockets, sat + N, sat * (N + 2)]);
    },
    // Laura are 6 cartonașe, Alin de 10 ori mai multe — de câte mai are nevoie Laura?
    () => {
      const [girl, boy] = [pick(['Laura', 'Ioana', 'Sofia', 'Mara']), pick(['Alin', 'Matei', 'David', 'Luca'])];
      const has = N; const k = randInt(3, 10); const other = has * k;
      return problem(`${girl} are ${has} cartonașe cu planete, iar ${boy} de ${k} ori mai multe. `
        + `De câte cartonașe mai are nevoie ${girl}, pentru a avea câte ${boy}?`, other - has,
        `${boy} are ${has} × ${k} = ${other} cartonașe. ${girl} mai are nevoie de ${other} - ${has} = ${other - has}.`,
        [other, other + has, k]);
    },
    // 6 lădițe cu câte 9 kg de ceapă; s-a vândut ceapa din 4 lădițe.
    () => {
      // La 2 și 3 numărul lecției e cantitatea din lădiță (altfel ar fi prea puține lădițe).
      const boxes = N >= 4 ? N : randInt(5, 8); const kg = N >= 4 ? randInt(4, 9) : N; const sold = randInt(2, boxes - 2);
      const left = (boxes - sold) * kg;
      return problem(`La un aprozar s-au adus ${boxes} lădițe cu câte ${kg} kilograme de ceapă fiecare. `
        + `Câte kilograme de ceapă au rămas, dacă s-a vândut ceapa din ${sold} lădițe?`, left,
        `Modul I: au rămas ${boxes} - ${sold} = ${boxes - sold} lădițe; ${boxes - sold} × ${kg} = ${left} kg. `
        + `Modul II: în total ${boxes} × ${kg} = ${boxes * kg} kg, s-au vândut ${sold} × ${kg} = ${sold * kg} kg; ${boxes * kg} - ${sold * kg} = ${left} kg.`,
        [boxes * kg, sold * kg, left + kg]);
    },
    // 43 de machete câte 3 într-o cutie; 7 cutii — câte rămân neambalate?
    () => {
      const per = randInt(2, 5); const packed = N * per; const total = packed + randInt(3, 25);
      return problem(`${total}${total >= 20 ? " de" : ""} machete trebuie ambalate câte ${per} într-o cutie. Dacă sunt ${N} cutii, `
        + 'câte machete rămân neambalate?', total - packed,
        `În ${N} cutii încap ${N} × ${per} = ${packed} machete. Rămân ${total} - ${packed} = ${total - packed}.`,
        [packed, total - per, total - N]);
    },
    // Un factor e 6, celălalt cel mai mare număr par de o cifră; cu cât e mai mic produsul decât 80?
    () => {
      const other = pick([[8, 'cel mai mare număr par de o cifră'], [9, 'cel mai mare număr de o cifră'], [7, 'cel mai mare număr impar de o cifră, mai mic decât 9']]);
      const product = N * other[0];
      const limit = Math.ceil((product + 1) / 10) * 10 + 10;
      return problem(`Un factor al înmulțirii este ${N}, iar celălalt este ${other[1]}. `
        + `Cu cât este mai mic produsul lor decât numărul ${limit}?`, limit - product,
        `Celălalt factor este ${other[0]}. Produsul: ${N} × ${other[0]} = ${product}. Diferența: ${limit} - ${product} = ${limit - product}.`,
        [product, limit - N - other[0], limit - product + N]);
    },
    // Grupe de câte N.
    () => {
      const k = randInt(2, 10);
      const [one, many, thing] = pick(GROUPS[N]);
      return problem(`${one} are ${N} ${thing}. Câte ${thing} au ${k} ${many}?`, N * k,
        `Câte ${N} pentru fiecare: ${k} × ${N} = ${N * k}.`, [N + k, N * k + N, N * k - N]);
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
