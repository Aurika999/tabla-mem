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
  { item: 'mănuși', how: 'Câte', verb: 'tricotează', who: 'Bunica', for: 'nepoți' },
  { item: 'șosete', how: 'Câte', verb: 'tricotează', who: 'Bunica', for: 'nepoți' },
  { item: 'cercei', how: 'Câți', verb: 'cumpără', who: 'Mătușa', for: 'nepoate' },
  { item: 'papuci', how: 'Câți', verb: 'cumpără', who: 'Mama', for: 'copii' },
];
// „de k ori mai scump”: [ce costă puțin, ce costă mai mult, forma de acord].
const PRICES = [
  ['Un fular', 'o căciulă', 'mai scumpă', 'o căciulă'],
  ['Un creion', 'o carte', 'mai scumpă', 'o carte'],
  ['O minge', 'o păpușă', 'mai scumpă', 'o păpușă'],
  ['Un caiet', 'un rucsac', 'mai scump', 'un rucsac'],
  ['O bomboană', 'o ciocolată', 'mai scumpă', 'o ciocolată'],
  ['Un suc', 'o pizza', 'mai scumpă', 'o pizza'],
];
const BIRDS = [['vrăbii', 'Câte'], ['porumbei', 'Câți'], ['pițigoi', 'Câți'], ['rândunele', 'Câte']];

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
    return mult(`${c.inOne} sunt ${per} ${o}. Câte ${o} sunt în ${g} ${c.many} de același fel?`, g, per);
  },
  // Sunt 2 cutii, iar în fiecare sunt 7 bomboane. Câte bomboane sunt în cele 2 cutii?
  () => {
    const c = pick(CONTAINERS); const o = pick(OBJECTS);
    const g = randInt(2, 9); const per = randInt(2, 10);
    return mult(`Sunt ${g} ${c.many}, iar în ${c.each} sunt ${per} ${o}. Câte ${o} sunt în cele ${g} ${c.many}?`, g, per);
  },
  // Bunica are 8 nepoți și tricotează câte o pereche de mănuși pentru fiecare.
  () => {
    const p = pick(PAIRS); const g = randInt(2, 10);
    return mult(`${p.who} are ${g} ${p.for} și ${p.verb} câte o pereche de ${p.item} pentru fiecare. `
      + `O pereche are 2 ${p.item}. ${p.how} ${p.item} sunt în total?`, g, 2);
  },
  // Un copac are 7 crengi. Pe fiecare creangă stau câte 3 vrăbii.
  () => {
    const [bird, how] = pick(BIRDS); const g = randInt(2, 10); const per = randInt(2, 6);
    return mult(`Un copac are ${g} crengi. Pe fiecare creangă stau câte ${per} ${bird}. ${how} ${bird} stau în copac?`, g, per);
  },
  // Ioana are 2 ani, iar vârsta surorii sale e de 3 ori mai mare.
  () => {
    const n = pick(NAMES); const age = randInt(2, 9); const k = randInt(2, 5);
    const rel = pick([['sora', 'surorii'], ['fratele', 'fratelui'], ['verișoara', 'verișoarei']]);
    return mult(`${n} are ${age} ani, iar vârsta ${rel[1]} e de ${k} ori mai mare. Câți ani are ${rel[0]}?`, k, age);
  },
  // Un fular costă 9 lei, iar o căciulă este de 3 ori mai scumpă.
  () => {
    const [cheap, pricey, adj, question] = pick(PRICES); const price = randInt(2, 10); const k = randInt(2, 5);
    return mult(`${cheap} costă ${price} lei, iar ${pricey} este de ${k} ori ${adj}. Cât costă ${question}?`, k, price);
  },
  // O mașină are 4 roți. Câte roți au 3 mașini?
  () => {
    const f = pick(FIXED_GROUPS); const g = randInt(2, 10);
    return mult(`${f.one} are ${f.count} ${f.part}. Câte ${f.part} au ${g} ${f.many}?`, g, f.count);
  },
  // Pungi / grădini / mese cu câte … în fiecare.
  () => {
    const n = pick(NAMES); const o = pick(OBJECTS); const g = randInt(2, 10); const per = randInt(2, 10);
    return mult(`${n} are ${g} pungi cu câte ${per} ${o} în fiecare pungă. Câte ${o} are ${n} în total?`, g, per);
  },
  () => {
    const g = randInt(2, 10); const per = randInt(2, 10);
    return mult(`În grădină sunt ${g} rânduri cu câte ${per} flori pe fiecare rând. Câte flori sunt în total?`, g, per);
  },
  () => {
    const g = randInt(2, 10); const per = randInt(2, 8);
    return mult(`La o masă stau ${per} copii. Câți copii stau la ${g} mese la fel de pline?`, g, per);
  },
  // Cumpărături: un lucru costă p lei, cât costă g bucăți?
  () => {
    const item = pick([['Un caiet', 'caiete'], ['O înghețată', 'înghețate'], ['Un creion', 'creioane'], ['O carte', 'cărți']]);
    const price = randInt(2, 10); const g = randInt(2, 9);
    return mult(`${item[0]} costă ${price} lei. Cât costă ${g} ${item[1]}?`, g, price);
  },
  // De k ori mai multe.
  () => {
    const [n1, n2] = twoNames(); const o = pick(OBJECTS); const a = randInt(2, 10); const k = randInt(2, 5);
    return mult(`${n1} are ${a} ${o}. ${n2} are de ${k} ori mai multe ${o} decât ${n1}. Câte ${o} are ${n2}?`, k, a);
  },
  // Pachete cumpărate.
  () => {
    const n = pick(NAMES); const per = randInt(3, 10); const g = randInt(2, 6);
    return mult(`Un pachet are ${per} creioane colorate. ${n} cumpără ${g} pachete. Câte creioane colorate are?`, g, per);
  },
];

export function buildWordProblem() {
  return pick(TEMPLATES)();
}
