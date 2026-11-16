import { tr } from './i18n';
// Probleme cu text pentru nivelul „📖 PROBLEME”: doar înmulțiri.
// Fiecare problemă întoarce `factors: [grupe, câte în fiecare grupă]`, folosiți
// de „Arată explicația” (ex. 3 × 7 = 7 + 7 + 7, cu buline).
// Adunările și scăderile sunt pe Insula Isteților (logicProblems.js).

const NAMES = ['Andrei', 'Mara', 'Ioana', 'Matei', 'Elena', 'David', 'Sofia', 'Alex', 'Diana', 'Bogdan', 'Ana', 'Luca'];
// Doar pluraluri care merg cu „câte” (feminin/neutru), ca întrebarea să fie corectă.
const OBJECTS = ['bomboane', 'mere', 'creioane', 'biluțe', 'nuci', 'prăjituri', 'abțibilduri', 'baloane', 'scoici', 'jucării'];
const CONTAINERS = [
  { inOne: 'Într-o cutie', many: 'cutii', each: 'fiecare cutie' },
  { inOne: 'Într-o pungă', many: 'pungi', each: 'fiecare pungă' },
  { inOne: 'Într-un coș', many: 'coșuri', each: 'fiecare coș' },
  { inOne: 'Într-un borcan', many: 'borcane', each: 'fiecare borcan' },
  { inOne: 'Într-un pachet', many: 'pachete', each: 'fiecare pachet' },
];
// Lucruri care au mereu același număr de părți (roți, picioare, zile…).
const FIXED_GROUPS = [
  { one: 'O mașină', many: 'mașini', part: 'roți', count: 4 },
  { one: 'O bicicletă', many: 'biciclete', part: 'roți', count: 2 },
  { one: 'O tricicletă', many: 'triciclete', part: 'roți', count: 3 },
  { one: 'Un cățel', many: 'cățeluși', part: 'lăbuțe', count: 4 },
  { one: 'O găină', many: 'găini', part: 'picioare', count: 2 },
  { one: 'Un păianjen', many: 'păianjeni', part: 'picioare', count: 8 },
  { one: 'O mână', many: 'mâini', part: 'degete', count: 5 },
  { one: 'O săptămână', many: 'săptămâni', part: 'zile', count: 7 },
  { one: 'Un trifoi norocos', many: 'trifoi norocoși', part: 'frunze', count: 4 },
  { one: 'O stea de mare', many: 'stele de mare', part: 'brațe', count: 5 },
];
// Perechi: „pentru fiecare, câte o pereche”; o pereche are 2.
// `how` = „Câte”/„Câți”, după genul obiectului.
const PAIRS = [
  { item: 'șosete', how: 'Câte', verb: 'cumpără', who: 'Bunicul', for: 'nepoți' },
  { item: 'patine', how: 'Câte', verb: 'închiriază', who: 'Antrenorul', for: 'elevi' },
  { item: 'cercei', how: 'Câți', verb: 'cumpără', who: 'Mătușa', for: 'nepoate' },
  { item: 'papuci', how: 'Câți', verb: 'cumpără', who: 'Mama', for: 'copii' },
];
// „de k ori mai scump”: [ce costă puțin, ce costă mai mult, forma de acord].
const PRICES = [
  ['O riglă', 'un penar', 'mai scump', 'un penar'],
  ['Un creion', 'o carte', 'mai scumpă', 'o carte'],
  ['O minge', 'o păpușă', 'mai scumpă', 'o păpușă'],
  ['Un caiet', 'un rucsac', 'mai scump', 'un rucsac'],
  ['O bomboană', 'o ciocolată', 'mai scumpă', 'o ciocolată'],
  ['Un suc', 'o pizza', 'mai scumpă', 'o pizza'],
];
const BIRDS = [['vrăbii', 'Câte'], ['porumbei', 'Câți'], ['pițigoi', 'Câți'], ['rândunele', 'Câte']];
// Animalele de companie pentru problemele cu vârste.
const PETS = ['Pisica', 'Papagalul', 'Țestoasa'];

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

function mult(text, groups, perGroup) {
  return { text, answer: groups * perGroup, factors: [groups, perGroup] };
}

const TEMPLATES = [
  // Într-o cutie sunt 7 bomboane. Câte bomboane sunt în două cutii de același fel?
  () => {
    const c = pick(CONTAINERS); const o = pick(OBJECTS);
    const per = randInt(2, 10); const g = randInt(2, 6);
    return mult(tr('{v0} sunt {per} {o}. Câte {v1} sunt în {g} {v2} de același fel?', { v0: c.inOne, per, o, v1: o, g, v2: c.many }), g, per);
  },
  // Sunt 2 cutii, iar în fiecare sunt 7 bomboane. Câte bomboane sunt în cele 2 cutii?
  () => {
    const c = pick(CONTAINERS); const o = pick(OBJECTS);
    const g = randInt(2, 9); const per = randInt(2, 10);
    return mult(tr('Sunt {g} {v0}, iar în {v1} sunt {per} {o}. Câte {v2} sunt în cele {v3} {v4}?', { g, v0: c.many, v1: c.each, per, o, v2: o, v3: g, v4: c.many }), g, per);
  },
  // Cineva cumpără câte o pereche de lucruri pentru fiecare copil.
  () => {
    const p = pick(PAIRS); const g = randInt(2, 10);
    return mult(tr('{v0} are {g} {v1} și {v2} câte o pereche de {v3} pentru fiecare. ', { v0: p.who, g, v1: p.for, v2: p.verb, v3: p.item })
      + tr('O pereche are 2 {v0}. {v1} {v2} sunt în total?', { v0: p.item, v1: p.how, v2: p.item }), g, 2);
  },
  // Stâlpi de gard, pe fiecare câteva păsări.
  () => {
    const [bird, how] = pick(BIRDS); const g = randInt(2, 10); const per = randInt(2, 6);
    return mult(tr('Gardul din curte are {g} stâlpi. Pe fiecare stâlp stau câte {per} {bird}. {how} {v0} stau pe gard?', { g, per, bird, how, v0: bird }), g, per);
  },
  // Un animal de companie e de câteva ori mai în vârstă decât cățelul.
  () => {
    const n = pick(NAMES); const age = randInt(1, 4); const k = randInt(2, 4);
    const pet = pick(PETS);
    return mult(tr('Cățelul lui {n} are {age} ani. {pet} lui {v0} are de {k} ori mai mulți ani. Câți ani are?', { n, age, pet, v0: n, k }), k, age);
  },
  // Un lucru ieftin și altul de câteva ori mai scump.
  () => {
    const [cheap, pricey, adj, question] = pick(PRICES); const price = randInt(2, 10); const k = randInt(2, 5);
    return mult(tr('{cheap} costă {price} lei, iar {pricey} este de {k} ori {adj}. Cât costă {question}?', { cheap, price, pricey, k, adj, question }), k, price);
  },
  // O mașină are 4 roți. Câte roți au 3 mașini?
  () => {
    const f = pick(FIXED_GROUPS); const g = randInt(2, 10);
    return mult(tr('{v0} are {v1} {v2}. Câte {v3} au {g} {v4}?', { v0: f.one, v1: f.count, v2: f.part, v3: f.part, g, v4: f.many }), g, f.count);
  },
  // Pungi / grădini / mese cu câte … în fiecare.
  () => {
    const n = pick(NAMES); const o = pick(OBJECTS); const g = randInt(2, 10); const per = randInt(2, 10);
    return mult(tr('{n} are {g} pungi cu câte {per} {o} în fiecare pungă. Câte {v0} are {v1} în total?', { n, g, per, o, v0: o, v1: n }), g, per);
  },
  () => {
    const g = randInt(2, 10); const per = randInt(2, 10);
    return mult(tr('În grădină sunt {g} rânduri cu câte {per} flori pe fiecare rând. Câte flori sunt în total?', { g, per }), g, per);
  },
  () => {
    const g = randInt(2, 10); const per = randInt(2, 8);
    return mult(tr('La o masă stau {per} copii. Câți copii stau la {g} mese la fel de pline?', { per, g }), g, per);
  },
  // Cumpărături: un lucru costă p lei, cât costă g bucăți?
  () => {
    const item = pick([['Un caiet', 'caiete'], ['O înghețată', 'înghețate'], ['Un creion', 'creioane'], ['O carte', 'cărți']]);
    const price = randInt(2, 10); const g = randInt(2, 9);
    return mult(tr('{v0} costă {price} lei. Cât costă {g} {v1}?', { v0: item[0], price, g, v1: item[1] }), g, price);
  },
  // De k ori mai multe.
  () => {
    const [n1, n2] = twoNames(); const o = pick(OBJECTS); const a = randInt(2, 10); const k = randInt(2, 5);
    return mult(tr('{n1} are {a} {o}. {n2} are de {k} ori mai multe {v0} decât {v1}. Câte {v2} are {v3}?', { n1, a, o, n2, k, v0: o, v1: n1, v2: o, v3: n2 }), k, a);
  },
  // Pachete cumpărate.
  () => {
    const n = pick(NAMES); const per = randInt(3, 10); const g = randInt(2, 6);
    return mult(tr('Un pachet are {per} creioane colorate. {n} cumpără {g} pachete. Câte creioane colorate are?', { per, n, g }), g, per);
  },
];

export function buildWordProblem() {
  return pick(TEMPLATES)();
}
