// Exerciții pentru lecțiile „Înmulțirea cu 2, 3, 4, 6, 7, 8, 9”,
// pe cele 4 secțiuni ale insulei: Învăț, Încerc, Mă antrenez, Probleme.
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
const BADGES = ['🔍 Învăț', '✏️ Încerc', '⭐ Mă antrenez', '🧩 Probleme'];
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

// Povestea de la „Învăț”: câte o poveste scurtă pentru fiecare număr.
const STORY = {
  2: (k) => problem(tr('În caiac stau câte 2 copii. Câți copii sunt în {k} caiace?', { k }), 2 * k,
    tr('{v0} = de {k} ori câte 2 = {v1} × 2 = {v2} copii.', { v0: Array(k).fill(2).join(' + '), k, v1: k, v2: 2 * k }), [2 + k, 2 * k + 2, 2 * k - 2]),
  3: (k) => problem(tr('Fiecare copil plantează câte 3 răsaduri de roșii. Câte răsaduri plantează {k} copii?', { k }), 3 * k,
    tr('{v0} = de {k} ori câte 3 = {v1} × 3 = {v2} răsaduri.', { v0: Array(k).fill(3).join(' + '), k, v1: k, v2: 3 * k }), [3 + k, 3 * k + 3, 3 * k - 3]),
  4: (k) => problem(tr('Un scaun are 4 picioare. Câte picioare au {k} scaune?', { k }), 4 * k,
    tr('{v0} = de {k} ori câte 4 = {v1} × 4 = {v2} picioare.', { v0: Array(k).fill(4).join(' + '), k, v1: k, v2: 4 * k }), [4 + k, 4 * k + 4, 4 * k - 4]),
  6: (k) => problem(tr('O cutie are 6 brioșe. Câte brioșe sunt în {k} cutii?', { k }), 6 * k,
    tr('{v0} = de {k} ori câte 6 = {v1} × 6 = {v2} brioșe.', { v0: Array(k).fill(6).join(' + '), k, v1: k, v2: 6 * k }), [6 + k, 6 * k + 6, 6 * k - 6]),
  7: (k) => problem(tr('Pe un raft sunt 7 cărți. Câte cărți sunt pe {k} rafturi?', { k }), 7 * k,
    tr('{v0} = de {k} ori câte 7 = {v1} × 7 = {v2} cărți.', { v0: Array(k).fill(7).join(' + '), k, v1: k, v2: 7 * k }), [7 + k, 7 * k + 7, 7 * k - 7]),
  8: (k) => problem(tr('Un păianjen are 8 picioare. Câte picioare au {k} păianjeni?', { k }), 8 * k,
    tr('{v0} = de {k} ori câte 8 = {v1} × 8 = {v2} picioare.', { v0: Array(k).fill(8).join(' + '), k, v1: k, v2: 8 * k }), [8 + k, 8 * k + 8, 8 * k - 8]),
  9: (k) => problem(tr('Un pachet are 9 biscuiți. Câți biscuiți sunt în {k} pachete?', { k }), 9 * k,
    tr('{v0} = de {k} ori câte 9 = {v1} × 9 = {v2} biscuiți.', { v0: Array(k).fill(9).join(' + '), k, v1: k, v2: 9 * k }), [9 + k, 9 * k + 9, 9 * k - 9]),
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

// ---------- Exerciții în plus pentru înmulțirea cu 4 ----------
const FOUR_DISCOVER = [
  // La câteva mese de câte 4 locuri se mai adaugă o masă.
  () => {
    const bears = randInt(3, 6);
    return problem(tr('În sala de mese sunt {bears} mese cu câte 4 scaune. Doamna învățătoare mai aduce o masă la fel. ', { bears })
      + tr('Câte scaune sunt acum la mese?'), 4 * (bears + 1),
      tr('Sunt {bears} + 1 = {v0} mese. {v1} × 4 = {v2} scaune ', { bears, v0: bears + 1, v1: bears + 1, v2: 4 * (bears + 1) })
      + tr('(sau {bears} × 4 + 4 = {v0} + 4 = {v1}).', { bears, v0: 4 * bears, v1: 4 * (bears + 1) }),
      [4 * bears, bears + 1 + 4, 4 * (bears + 2)]);
  },
  // 4 echipe la fel de mari: 6 + 6 + 6 + 6 = 4 × 6 = 6 × 4.
  () => {
    const per = randInt(3, 9);
    return problem(tr('La ora de sport sunt 4 echipe, cu câte {per} copii în fiecare echipă. Câți copii sunt?', { per }), 4 * per,
      tr('{v0} = 4 × {per} = {v1} × 4 = {v2} copii.', { v0: Array(4).fill(per).join(' + '), per, v1: per, v2: 4 * per }), [4 + per, 4 * per + per, 4 * per - 4]);
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
    const n = randInt(1, 10);
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
  // Două produse egale, unul cu un factor lipsă: 4 × 6 = 8 × □.
  () => {
    const [text, answer, explanation] = (() => {
      const x = randInt(1, 5); const y = 2 * randInt(1, 4);
      // 4 × (x·y/2) are același rezultat ca 2 × (x·y)… alegem forma cu 4 sau cu 2.
      const product = 4 * x * y / 2;
      const left = `4 × ${(x * y) / 2}`;
      return Math.random() < 0.5
        ? [`${left} = 2 × □`, product / 2, `${left} = ${product}, iar 2 × ${product / 2} = ${product}.`]
        : [`□ × 2 = ${left}`, product / 2, `${left} = ${product}, iar ${product / 2} × 2 = ${product}.`];
    })();
    return problem(tr('Completează cu factorul care lipsește: {text}', { text }), answer,
      tr('Ambele părți trebuie să dea același rezultat: {explanation}', { explanation }), [answer + 1, answer - 1, answer * 2]);
  },
  // Calculează și compară: 2 × 6 ○ 3 × 4.
  () => {
    const l = [randInt(2, 9), 4]; const r = [randInt(2, 9), randInt(2, 9)];
    if (Math.random() < 0.5) l.reverse();
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
  // Un autobuz de excursie cu rânduri de câte 4 scaune.
  () => {
    const rooms = randInt(5, 10);
    return problem(tr('Autobuzul de excursie are {rooms} rânduri, cu câte 4 scaune pe fiecare rând. Câți copii pot sta pe scaune?', { rooms }),
      4 * rooms, tr('{rooms} rânduri × 4 scaune = {v0} scaune.', { rooms, v0: 4 * rooms }), [rooms + 4, 4 * rooms + 4, 4 * rooms - 4]);
  },
  // Cu cât este mai mare produsul numerelor 9 și 4 decât suma lor?
  () => {
    const n = randInt(5, 9);
    return problem(tr('Calculează {n} × 4 și {n} + 4. Cu cât este mai mare produsul decât suma?', { n }), 4 * n - (n + 4),
      tr('Produsul: {n} × 4 = {v0}. Suma: {v1} + 4 = {v2}. Diferența: {v3} - {v4} = {v5}.', { n, v0: 4 * n, v1: n, v2: n + 4, v3: 4 * n, v4: n + 4, v5: 4 * n - (n + 4) }),
      [4 * n, n + 4, 4 * n + n + 4]);
  },
  // Bunicul are de 4 ori mai mulți ani decât nepotul; câți ani va avea peste câțiva ani?
  () => {
    const girl = pick(['Vlad', 'Tudor', 'Radu', 'Petru']); const age = randInt(6, 9); const later = randInt(2, 6);
    const mom = 4 * age;
    return problem(tr('{girl} are {age} ani. Bunicul lui are de 4 ori mai mulți ani. Câți ani va avea bunicul peste {later} ani?', { girl, age, later }), mom + later,
      tr('Acum bunicul are {age} × 4 = {mom} ani. Peste {later} ani: {v0} + {v1} = {v2} ani.', { age, mom, later, v0: mom, v1: later, v2: mom + later }),
      [mom, age + 4 + later, age + later]);
  },
  // Un album cu abțibilduri: câteva pe zi, 4 zile.
  () => {
    const per = randInt(6, 9); const total = randInt(60, 99);
    const read = 4 * per;
    return problem(tr('Albumul lui Andrei are loc pentru {total} de abțibilduri. În 4 zile, el a lipit câte {per} abțibilduri pe zi. ', { total, per })
      + tr('Câte abțibilduri mai trebuie să lipească pentru a umple albumul?'), total - read,
      tr('În 4 zile a lipit 4 × {per} = {read} abțibilduri. Mai are {total} - {v0} = {v1}.', { per, read, total, v0: read, v1: total - read }),
      [total - per, read, total - read + 4]);
  },
];

// ---------- Exerciții în plus pentru înmulțirea cu 3 ----------
const THREE_DISCOVER = [
  // Câțiva copii culeg câte 3 mere; mai vine un copil.
  () => {
    const kids = randInt(2, 5);
    return problem(tr('{kids} copii culeg câte 3 mere din livadă. Mai vine Cezar și culege și el 3 mere. ', { kids })
      + tr('Câte mere au cules în total cei {v0} copii?', { v0: kids + 1 }), 3 * (kids + 1),
      tr('{kids} × 3 = {v0}, plus cele 3 ale lui Cezar: {v1} + 3 = {v2} (sau {v3} × 3).', { kids, v0: 3 * kids, v1: 3 * kids, v2: 3 * (kids + 1), v3: kids + 1 }),
      [3 * kids, kids + 1 + 3, 3 * (kids + 2)]);
  },
  // 3 vaze cu același număr de lalele: 5 + 5 + 5 = 3 × 5 = 5 × 3.
  () => {
    const per = randInt(3, 9);
    return problem(tr('Pe masă sunt 3 vaze. În fiecare vază sunt câte {per} lalele. Câte lalele sunt în cele 3 vaze?', { per }), 3 * per,
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
    const n = randInt(2, 10);
    return Math.random() < 0.5
      ? problem(tr('Află numărul cu 3 mai mare decât {n}.', { n }), n + 3,
        tr('„Cu 3 mai mare” înseamnă adunare: {n} + 3 = {v0}.', { n, v0: n + 3 }), [n * 3, n + 4, n + 2])
      : problem(tr('Află numărul de 3 ori mai mare decât {n}.', { n }), n * 3,
        tr('„De 3 ori mai mare” înseamnă înmulțire: {n} × 3 = {v0}.', { n, v0: n * 3 }), [n + 3, n * 3 + 3, n * 3 - 3]);
  },
  // Triplul unui număr.
  () => {
    const n = randInt(2, 10);
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
  // Stâlpi de gard cu câte 3 porumbei.
  () => {
    const b = randInt(3, 9);
    return problem(tr('Pe gardul din curte sunt {b} stâlpi. Pe fiecare stâlp stau câte 3 porumbei. Câți porumbei stau pe gard?', { b }), 3 * b,
      tr('{b} stâlpi × 3 porumbei = {v0} porumbei.', { b, v0: 3 * b }), [b + 3, 3 * b + 3, 3 * b - 3]);
  },
  // Un cățel și o pisică de 3 ori mai în vârstă.
  () => {
    const age = randInt(2, 4);
    return problem(tr('Cățelul lui Matei are {age} ani, iar pisica are de 3 ori mai mulți ani. Câți ani are pisica?', { age }), 3 * age,
      tr('„De 3 ori mai mare”: {age} × 3 = {v0} ani.', { age, v0: 3 * age }), [age + 3, 3 * age + 3, 2 * age]);
  },
  // O gumă și un penar de 3 ori mai scump.
  () => {
    const price = randInt(5, 9); const cap = 3 * price;
    return problem(tr('O riglă costă {price} lei, iar un penar costă de 3 ori mai mult. Cât costă o riglă și un penar?', { price }), price + cap,
      tr('Penarul: {price} × 3 = {cap} lei. Împreună: {v0} + {v1} = {v2} lei.', { price, cap, v0: price, v1: cap, v2: price + cap }), [cap, price + 3, 2 * cap]);
  },
  // Ziua Ralucăi: 3 torturi tăiate în câte 8 felii; fiecare copil ia câte 2.
  () => {
    const guests = randInt(7, 10); const slices = 8; const kids = guests + 1; const total = 3 * slices;
    return problem(tr('La ziua Ralucăi vin {guests} prieteni. Pe masă sunt 3 torturi, fiecare tăiat în {slices} felii. ', { guests, slices })
      + tr('Fiecare copil (și Raluca) ia câte 2 felii. Câte felii rămân?'), total - 2 * kids,
      tr('Felii: 3 × {slices} = {total}. Copii: {guests} + 1 = {kids}, iau {v0} × 2 = {v1} felii. Rămân {v2} - {v3} = {v4}.', { slices, total, guests, kids, v0: kids, v1: 2 * kids, v2: total, v3: 2 * kids, v4: total - 2 * kids }),
      [total - 2 * guests, total, 2 * kids]);
  },
  // Un caiet costă 3 lei; câteva caiete, plătește cu două bancnote de 10 lei.
  () => {
    const n = randInt(3, 6);
    return problem(tr('Un caiet costă 3 lei. Tudor cumpără {n} caiete și dă vânzătoarei două bancnote de câte 10 lei. Cât rest primește?', { n }),
      20 - 3 * n, tr('Caietele costă {n} × 3 = {v0} lei. Tudor dă 2 × 10 = 20 lei. Restul: 20 - {v1} = {v2} lei.', { n, v0: 3 * n, v1: 3 * n, v2: 20 - 3 * n }),
      [10 - 3 * n >= 0 ? 10 - 3 * n : 1, 3 * n, 20 - n]);
  },
];

// ---------- Exerciții în plus pentru înmulțirea cu 2 ----------
const TWO_DISCOVER = [
  // Caiace cu câte 2 copii; mai vine un caiac.
  () => {
    const sleds = randInt(2, 6);
    return problem(tr('Pe lac sunt {sleds} caiace cu câte 2 copii. Dacă mai vine un caiac cu 2 copii, câți copii vor fi în cele {v0} caiace?', { sleds, v0: sleds + 1 }),
      2 * (sleds + 1),
      tr('{sleds} × 2 = {v0}, plus încă 2: {v1} + 2 = {v2} (sau {v3} × 2).', { sleds, v0: 2 * sleds, v1: 2 * sleds, v2: 2 * (sleds + 1), v3: sleds + 1 }),
      [2 * sleds, sleds + 3, 2 * (sleds + 2)]);
  },
  // Două păpuși cu câte câțiva nasturi: 5 + 5 = 2 × 5.
  () => {
    const per = randInt(3, 9);
    return problem(tr('Fiecare din cele 2 păpuși are câte {per} nasturi pe rochiță. Câți nasturi sunt pe cele două rochițe?', { per }), 2 * per,
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
    const n = randInt(2, 10);
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
  // Bunicul cumpără câte o pereche de șosete pentru fiecare nepot.
  () => {
    const g = randInt(3, 9);
    return problem(tr('Bunicul cumpără câte o pereche de șosete pentru fiecare dintre cei {g} nepoți. Câte șosete cumpără?', { g }), 2 * g,
      tr('O pereche are 2 șosete: {g} × 2 = {v0} șosete.', { g, v0: 2 * g }), [g, g + 2, 2 * g + 2]);
  },
  // Un pachet cu napolitane; două pachete.
  () => {
    const n = randInt(4, 10);
    return problem(tr('Un pachet are {n} napolitane. Câte napolitane sunt în două pachete la fel?', { n }), 2 * n,
      tr('2 × {n} = {v0} napolitane (sau {v1} + {v2}).', { n, v0: 2 * n, v1: n, v2: n }), [n + 2, 2 * n + 2, n]);
  },
  // La cercul de șah sunt de două ori mai mulți băieți decât fete.
  () => {
    const girls = randInt(4, 9); const boys = 2 * girls;
    return problem(tr('La cercul de șah, băieții sunt de două ori mai mulți decât fetele. Sunt {girls} fete. ', { girls })
      + tr('Câți copii vin la cercul de șah?'), girls + boys,
      tr('Băieți: 2 × {girls} = {boys}. Copii: {v0} + {v1} = {v2}.', { girls, boys, v0: girls, v1: boys, v2: girls + boys }), [boys, girls + 2, 2 * boys]);
  },
  // Bilet la grădina zoologică: copii și adulți (de 2 ori mai scump).
  () => {
    const price = randInt(3, 8); const adult = 2 * price;
    return Math.random() < 0.5
      ? problem(tr('La grădina zoologică, biletul pentru copii costă {price} lei, iar cel pentru adulți costă de 2 ori mai mult. ', { price })
        + tr('Cât costă biletul unui adult?'), adult,
        tr('{price} × 2 = {adult} lei.', { price, adult }), [price + 2, adult + price, price])
      : problem(tr('La grădina zoologică, biletul pentru copii costă {price} lei, iar pentru adulți de 2 ori mai mult. ', { price })
        + tr('Cât plătește Sebi împreună cu mama și tata?'), price + 2 * adult,
        tr('Bilet adult: {price} × 2 = {adult} lei. Doi părinți: 2 × {v0} = {v1} lei. Cu Sebi: {v2} + {v3} = {v4} lei.', { price, adult, v0: adult, v1: 2 * adult, v2: 2 * adult, v3: price, v4: price + 2 * adult }),
        [3 * price, price + adult, 2 * adult]);
  },
];

// Exerciții în plus pentru înmulțirea cu 8 sau 9.
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
      const a = randInt(2, 3); const b = randInt(2, 4);
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
    // Carnavalul clasei: pungi cu baloane, câteva se sparg.
    () => {
      const boxes = randInt(3, 8); const per = N; const popped = randInt(3, 9);
      const total = boxes * per;
      return problem(tr('Pentru carnavalul clasei s-au cumpărat {boxes} pungi cu câte {per} baloane. ', { boxes, per })
        + tr('În timpul jocurilor s-au spart {popped} baloane. Câte baloane au rămas?', { popped }), total - popped,
        tr('Baloane cumpărate: {boxes} × {per} = {total}. Rămase: {v0} - {popped} = {v1}.', { boxes, per, total, v0: total, popped, v1: total - popped }),
        [total, total + popped, boxes * per - per]);
    },
    // Coșuri de picnic cu pizza, fiecare tăiată în N felii.
    () => {
      const boxes = randInt(2, 3); const per = randInt(2, 3); const slices = N;
      const answer = boxes * per * slices;
      return problem(tr('La picnic s-au adus {boxes} coșuri, în fiecare câte {per} pizza. Fiecare pizza a fost tăiată în {slices} felii. ', { boxes, per, slices })
        + tr('Câte felii de pizza sunt?'), answer,
        tr('Pizza: {boxes} × {per} = {v0}. Felii: {v1} × {slices} = {answer}.', { boxes, per, v0: boxes * per, v1: boxes * per, slices, answer }),
        [boxes * per, boxes + per + slices, boxes * slices]);
    },
    // Brățări cu mărgele roșii și aurii — în două moduri.
    () => {
      const g = N; const blue = randInt(3, 6); const white = randInt(2, 4);
      const answer = g * (blue + white);
      return problem(tr('Fetele din clasă fac {g} brățări. Fiecare brățară are {blue} mărgele roșii și {white} mărgele aurii. ', { g, blue, white })
        + tr('Câte mărgele folosesc pentru toate brățările?'), answer,
        tr('Modul I: o brățară are {blue} + {white} = {v0} mărgele; {g} × {v1} = {answer}. ', { blue, white, v0: blue + white, g, v1: blue + white, answer })
        + tr('Modul II: {g} × {blue} = {v0} roșii și {v1} × {white} = {v2} aurii; {v3} + {v4} = {answer}.', { g, blue, v0: g * blue, v1: g, white, v2: g * white, v3: g * blue, v4: g * white, answer }),
        [g * blue, blue + white + g, g * white]);
    },
    // Lăzi cu mere la crosul școlii; câteva rămân.
    () => {
      const packs = randInt(4, 9); const per = N; const total = packs * per; const left = randInt(5, total - 10);
      return problem(tr('La crosul școlii s-au adus {packs} lăzi cu câte {per} mere. ', { packs, per })
        + tr('După cros au rămas {left} mere. Câte mere au mâncat sportivii?', { left }), total - left,
        tr('Mere aduse: {packs} × {per} = {total}. Mâncate: {v0} - {left} = {v1}.', { packs, per, total, v0: total, left, v1: total - left }),
        [total, total + left, left]);
    },
    // Cu cât e mai mare produsul numerelor 8 și 9 decât suma lor?
    () => {
      const other = randInt(4, 9);
      const product = N * other; const sum = N + other;
      return problem(tr('Calculează {N} × {other} și {N} + {other}. Cu cât este mai mare produsul decât suma?', { N, other }), product - sum,
        tr('Produsul: {N} × {other} = {product}. Suma: {v0} + {v1} = {sum}. Diferența: {v2} - {v3} = {v4}.', { N, other, product, v0: N, v1: other, sum, v2: product, v3: sum, v4: product - sum }),
        [product, sum, product + sum]);
    },
    // Triplul numărului lecției plus dublul celuilalt.
    () => {
      const other = N === 8 ? 9 : 8;
      const answer = 3 * N + 2 * other;
      return problem(tr('Cât face triplul lui {N} adunat cu dublul lui {other}?', { N, other }), answer,
        tr('Triplul lui {N}: 3 × {v0} = {v1}. Dublul lui {other}: 2 × {v2} = {v3}. Suma: {v4} + {v5} = {answer}.', { N, v0: N, v1: 3 * N, other, v2: other, v3: 2 * other, v4: 3 * N, v5: 2 * other, answer }),
        [3 * N + other, N + 2 * other, 2 * N + 3 * other]);
    },
    // Bunica cumpără caiete și gume: cât costă / ce rest primește?
    () => {
      const pens = randInt(3, 7); const pencils = randInt(3, 8); const penPrice = N; const pencilPrice = randInt(2, 5);
      const cost = pens * penPrice + pencils * pencilPrice;
      const paid = Math.ceil((cost + 1) / 10) * 10;
      return Math.random() < 0.5
        ? problem(tr('Pentru școală, bunica a cumpărat {pens} caiete și {pencils} gume. ', { pens, pencils })
          + tr('Cât a plătit, dacă un caiet costă {penPrice} lei, iar o gumă {pencilPrice} lei?', { penPrice, pencilPrice }), cost,
          tr('Caiete: {pens} × {penPrice} = {v0} lei. Gume: {pencils} × {pencilPrice} = {v1} lei. ', { pens, penPrice, v0: pens * penPrice, pencils, pencilPrice, v1: pencils * pencilPrice })
          + tr('Total: {v0} + {v1} = {cost} lei.', { v0: pens * penPrice, v1: pencils * pencilPrice, cost }),
          [pens * penPrice, pencils * pencilPrice, (pens + pencils) * penPrice])
        : problem(tr('Bunica a cumpărat {pens} caiete a câte {penPrice} lei și {pencils} gume a câte {pencilPrice} lei. ', { pens, penPrice, pencils, pencilPrice })
          + tr('Ea a plătit cu {paid} de lei. Cât rest a primit?', { paid }), paid - cost,
          tr('Cumpărăturile au costat {pens} × {penPrice} + {pencils} × {pencilPrice} = {cost} lei. Restul: {paid} - {v0} = {v1} lei.', { pens, penPrice, pencils, pencilPrice, cost, paid, v0: cost, v1: paid - cost }),
          [cost, paid - pens * penPrice, paid - cost + pencilPrice]);
    },
    // Rafturi cu coșuri, în fiecare coș câteva ouă.
    () => {
      const tables = N === 8 ? 4 : 3; const plates = 2; const cakes = randInt(3, 5);
      const answer = tables * plates * cakes;
      return problem(tr('În cămară sunt {tables} rafturi, pe fiecare câte {plates} coșuri. În fiecare coș sunt câte {cakes} ouă. Câte ouă sunt în total?', { tables, plates, cakes }),
        answer,
        tr('Modul I: {tables} × {plates} = {v0} coșuri; {v1} × {cakes} = {answer}. ', { tables, plates, v0: tables * plates, v1: tables * plates, cakes, answer })
        + tr('Modul II: {plates} × {cakes} = {v0} ouă pe un raft; {tables} × {v1} = {answer}.', { plates, cakes, v0: plates * cakes, tables, v1: plates * cakes, answer }),
        [tables * cakes, tables + plates + cakes, plates * cakes]);
    },
  ];
}

// ---------- 🔍 Învăț ----------
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

// ---------- ✏️ Încerc ----------
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
    // C. Înmulțește cu el însuși — doar numere până la cel al lecției.
    () => {
      const n = randInt(4, N);
      return problem(tr('Înmulțește numărul {n} cu el însuși.', { n }), n * n,
        tr('„Cu el însuși” înseamnă {n} × {v0} = {v1}.', { n, v0: n, v1: n * n }), [n + n, n * n + n, n * n - n]);
    },
    // D. Calculează (trei factori)
    () => {
      const a = randInt(1, 3); const b = randInt(1, 3);
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

// ---------- ⭐ Mă antrenez ----------
function practice(N) {
  return [
    // Află numerele de N ori mai mari decât…
    () => {
      const n = randInt(2, 10);
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
      const a = randInt(2, 3); const b = randInt(2, 3);
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

// ---------- 🧩 Probleme ----------
function solve(N) {
  return [
    // Biblioteca clasei: N rafturi cu câte câteva cărți.
    () => {
      const per = randInt(3, 9);
      return problem(tr('Biblioteca clasei are {N} rafturi. Pe fiecare raft sunt câte {per} cărți. ', { N, per })
        + tr('Câte cărți are biblioteca clasei?'), N * per,
        tr('{N} rafturi × {per} cărți = {v0} cărți.', { N, per, v0: N * per }), [N + per, N * per - per, N * per + per]);
    },
    // Atelierul de origami: broscuțe și de N ori mai multe bărcuțe.
    () => {
      const sat = randInt(3, 9); const rockets = sat * N;
      return problem(tr('La atelierul de origami, copiii au împăturit {sat} broscuțe și de {N} ori mai multe bărcuțe. ', { sat, N })
        + tr('Câte figurine au făcut în total?'), sat + rockets,
        tr('Bărcuțe: {sat} × {N} = {rockets}. În total: {v0} + {v1} = {v2} figurine.', { sat, N, rockets, v0: sat, v1: rockets, v2: sat + rockets }),
        [rockets, sat + N, sat * (N + 2)]);
    },
    // O fată are câteva timbre, un băiat de câteva ori mai multe — câte îi mai trebuie fetei?
    () => {
      const [girl, boy] = [pick(['Laura', 'Ioana', 'Sofia', 'Mara']), pick(['Alin', 'Matei', 'David', 'Luca'])];
      const has = N; const k = randInt(3, 10); const other = has * k;
      return problem(tr('{girl} are {has} timbre în clasor, iar {boy} are de {k} ori mai multe. ', { girl, has, boy, k })
        + tr('Câte timbre îi mai trebuie lui {girl} ca să aibă tot atâtea cât {boy}?', { girl, boy }), other - has,
        tr('{boy} are {has} × {k} = {other} timbre. {girl} mai are nevoie de {v0} - {v1} = {v2}.', { boy, has, k, other, girl, v0: other, v1: has, v2: other - has }),
        [other, other + has, k]);
    },
    // Saci cu cartofi la piață; s-au vândut cartofii din câțiva saci.
    () => {
      // La 2 și 3 numărul lecției e cantitatea din sac (altfel ar fi prea puțini saci).
      const boxes = N >= 4 ? N : randInt(5, 8); const kg = N >= 4 ? randInt(4, 9) : N; const sold = randInt(2, boxes - 2);
      const left = (boxes - sold) * kg;
      return problem(tr('La piață, un fermier a adus {boxes} saci cu câte {kg} kilograme de cartofi. ', { boxes, kg })
        + tr('A vândut cartofii din {sold} saci. Câte kilograme de cartofi i-au rămas?', { sold }), left,
        tr('Modul I: au rămas {boxes} - {sold} = {v0} saci; {v1} × {kg} = {left} kg. ', { boxes, sold, v0: boxes - sold, v1: boxes - sold, kg, left })
        + tr('Modul II: în total {boxes} × {kg} = {v0} kg, s-au vândut {sold} × {v1} = {v2} kg; {v3} - {v4} = {left} kg.', { boxes, kg, v0: boxes * kg, sold, v1: kg, v2: sold * kg, v3: boxes * kg, v4: sold * kg, left }),
        [boxes * kg, sold * kg, left + kg]);
    },
    // Brioșe puse câte câteva în pungi; câte rămân pe tavă?
    () => {
      const per = randInt(2, 5); const packed = N * per; const total = packed + randInt(3, 25);
      return problem(tr('Brutarul a copt {total}{v0} brioșe și le pune câte {per} într-o pungă. Are doar {N} pungi. ', { total, v0: total >= 20 ? " de" : "", per, N })
        + tr('Câte brioșe rămân pe tavă?'), total - packed,
        tr('În {N} pungi încap {v0} × {per} = {packed} brioșe. Rămân {total} - {v1} = {v2}.', { N, v0: N, per, packed, total, v1: packed, v2: total - packed }),
        [packed, total - per, total - N]);
    },
    // Un factor e numărul lecției, celălalt e descris în cuvinte; cât lipsește până la un număr rotund?
    () => {
      const other = pick([[8, 'cel mai mare număr par de o cifră'], [9, 'cel mai mare număr de o cifră'], [7, 'cel mai mare număr impar de o cifră, mai mic decât 9']]);
      const product = N * other[0];
      const limit = Math.ceil((product + 1) / 10) * 10 + 10;
      return problem(tr('Înmulțim {N} cu {v0}. ', { N, v0: other[1] })
        + tr('Cât mai trebuie adăugat la rezultat ca să ajungem la {limit}?', { limit }), limit - product,
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

// Fiecare secțiune: exercițiile comune + cele în plus pentru unele numere.
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
