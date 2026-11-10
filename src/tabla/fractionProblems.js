import { tr } from './i18n';
// Fracții (lecția 10 din manual): jumătatea (doimea) și sfertul (pătrimea) unui întreg,
// „două sferturi formează o jumătate” și jumătatea / sfertul numerelor 4, 8, 12, 16, 20.
// O rundă are 10 exerciții, de fiecare dată altele.

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

const HALF = 'o jumătate (1/2)';
const QUARTER = 'un sfert (1/4)';
const TWO_QUARTERS = 'două sferturi (2/4)';
const THREE_QUARTERS = 'trei sferturi (3/4)';
const WHOLE = 'un întreg';

const HALF_RULE = 'Când împărțim un întreg în două părți egale, fiecare parte reprezintă o jumătate sau o doime (1/2).';
const QUARTER_RULE = 'Când împărțim un întreg în 4 părți egale, fiecare parte reprezintă un sfert sau o pătrime (1/4).';

// Variante numerice: răspunsul și greșeli tipice, toate diferite și pozitive.
function numberChoices(answer, mistakes) {
  return shuffle([answer, ...[...new Set(mistakes)].filter(n => n > 0 && n !== answer).slice(0, 3)]);
}

// Ce parte din întreg este colorată? (cerc, dreptunghi sau pătrat)
function pictureItem(kind) {
  const shape = pick(['circle', 'bar', 'square']);
  const cases = {
    half: { parts: 2, filled: 1, answer: HALF, choices: [HALF, QUARTER, WHOLE, TWO_QUARTERS] },
    quarter: { parts: 4, filled: 1, answer: QUARTER, choices: [QUARTER, HALF, WHOLE, THREE_QUARTERS] },
    twoQuarters: { parts: 4, filled: 2, answer: TWO_QUARTERS, choices: [TWO_QUARTERS, QUARTER, WHOLE, THREE_QUARTERS] },
  };
  const c = cases[kind];
  return {
    points: 1,
    get text() { return tr('Ce parte din întreg este colorată?'); },
    visual: { type: 'fraction', shape, parts: c.parts, filled: c.filled },
    answer: c.answer,
    choices: shuffle(c.choices),
    get explanation() {
      if (kind === 'half') return tr('Întregul este împărțit în 2 părți egale, iar o parte este colorată: o jumătate (o doime), 1/2.');
      if (kind === 'quarter') return tr('Întregul este împărțit în 4 părți egale, iar o parte este colorată: un sfert (o pătrime), 1/4.');
      return tr('Întregul este împărțit în 4 părți egale, iar 2 părți sunt colorate: două sferturi, 2/4. Două sferturi formează o jumătate: 2/4 = 1/2.');
    },
  };
}

// Este întregul împărțit în părți egale? (ca la „Alege imaginile în care întregul este împărțit în jumătăți”)
const EQUAL_HALVES = 'Da, în jumătăți';
const EQUAL_QUARTERS = 'Da, în sferturi';
const NOT_EQUAL = 'Nu, părțile nu sunt egale';
function equalPartsItem() {
  const kind = pick(['halves', 'quarters', 'unequal2', 'unequal4']);
  const widths = {
    halves: [1, 1], quarters: [1, 1, 1, 1],
    unequal2: pick([[1, 2], [2, 1], [3, 2]]), unequal4: pick([[1, 2, 1, 3], [2, 1, 1, 1], [1, 1, 2, 3]]),
  }[kind];
  const answer = kind === 'halves' ? EQUAL_HALVES : kind === 'quarters' ? EQUAL_QUARTERS : NOT_EQUAL;
  return {
    points: 1,
    get text() { return tr('Este întregul împărțit în părți egale?'); },
    visual: { type: 'fraction', shape: 'bar', parts: widths.length, filled: 0, widths },
    answer,
    choices: [EQUAL_HALVES, EQUAL_QUARTERS, NOT_EQUAL],
    get explanation() {
      if (kind === 'halves') return tr('Cele 2 părți sunt la fel de mari: întregul este împărțit în jumătăți.');
      if (kind === 'quarters') return tr('Cele 4 părți sunt la fel de mari: întregul este împărțit în sferturi.');
      return tr('Părțile nu sunt la fel de mari, deci nu sunt nici jumătăți, nici sferturi. Jumătățile și sferturile sunt părți egale!');
    },
  };
}

// Jumătatea și sfertul unui număr.
function halfItem(n) {
  const h = n / 2;
  return {
    points: 1,
    get text() { return tr('Află jumătatea numărului {n}.', { n }); },
    answer: h,
    choices: numberChoices(h, [n / 4, n * 2, h + 1, h - 1, h + 2]),
    get explanation() { return tr('Jumătatea unui număr se află împărțindu-l la 2: {n} : 2 = {h}. Verificare: {h} + {h} = {n}.', { n, h }); },
  };
}

function quarterItem(n) {
  const q = n / 4;
  const h = n / 2;
  return {
    points: 1,
    get text() { return tr('Află sfertul numărului {n}.', { n }); },
    answer: q,
    choices: numberChoices(q, [h, n * 4, q + 1, q - 1, q + 2]),
    get explanation() {
      return tr('Sfertul unui număr se află împărțindu-l la 4: {n} : 4 = {q}. Sau jumătatea jumătății: {n} : 2 = {h}, apoi {h} : 2 = {q}.', { n, h, q });
    },
  };
}

// Întrebări despre jumătăți și sferturi.
const CONCEPTS = [
  { text: 'Câte jumătăți formează un întreg?', answer: 2, choices: [2, 4, 1, 3], explanation: 'Un întreg are 2 jumătăți: 1/2 + 1/2 = un întreg.' },
  { text: 'Câte sferturi formează un întreg?', answer: 4, choices: [4, 2, 1, 8], explanation: 'Un întreg are 4 sferturi: 1/4 + 1/4 + 1/4 + 1/4 = un întreg.' },
  { text: 'Câte sferturi formează o jumătate?', answer: 2, choices: [2, 4, 1, 3], explanation: 'Două sferturi formează o jumătate: 2/4 = 1/2.' },
  { text: 'Ce formează două sferturi?', answer: HALF, choices: [HALF, WHOLE, QUARTER, THREE_QUARTERS], explanation: 'Două sferturi formează o jumătate: 2/4 = 1/2.' },
  { text: 'Cum se mai numește o jumătate?', answer: 'o doime', choices: ['o doime', 'o pătrime', 'un sfert', 'un întreg'], explanation: 'Jumătatea se mai numește doime și se scrie 1/2.' },
  { text: 'Cum se mai numește un sfert?', answer: 'o pătrime', choices: ['o pătrime', 'o doime', 'o jumătate', 'un întreg'], explanation: 'Sfertul se mai numește pătrime și se scrie 1/4.' },
];
function conceptItem() {
  const c = pick(CONCEPTS);
  return {
    points: 1,
    get text() { return tr(c.text); },
    answer: c.answer,
    choices: shuffle(c.choices),
    get explanation() { return tr(c.explanation); },
  };
}

// Probleme scurte, ca în lecție (pepenele lui Annika și Tommy) și cu numere.
function wordItem() {
  const kind = pick(['melonHalf', 'melonQuarter', 'pizza', 'candies', 'kids']);
  if (kind === 'melonHalf') {
    return {
      points: 1,
      get text() { return tr('Annika a tăiat pepenele în două părți egale. O parte o păstrează, cealaltă i-o dă lui Tommy. Ce parte din pepene primește Tommy?'); },
      answer: HALF,
      choices: shuffle([HALF, QUARTER, WHOLE, TWO_QUARTERS]),
      get explanation() { return tr(HALF_RULE); },
    };
  }
  if (kind === 'melonQuarter') {
    return {
      points: 1,
      get text() { return tr('Tommy și-a împărțit jumătatea de pepene în două părți egale. O parte i-o dă Annikăi. Ce parte din întregul pepene primește Annika?'); },
      answer: QUARTER,
      choices: shuffle([QUARTER, HALF, WHOLE, THREE_QUARTERS]),
      get explanation() { return tr('Jumătatea împărțită în două părți egale dă o pătrime din întreg: un sfert, 1/4. Două sferturi formează o jumătate.'); },
    };
  }
  if (kind === 'pizza') {
    return {
      points: 1,
      get text() { return tr('O pizza a fost tăiată în 4 felii egale. Andrei a mâncat 2 felii. Ce parte din pizza a mâncat Andrei?'); },
      visual: { type: 'fraction', shape: 'circle', parts: 4, filled: 2 },
      answer: TWO_QUARTERS,
      choices: shuffle([TWO_QUARTERS, QUARTER, WHOLE, THREE_QUARTERS]),
      get explanation() { return tr('Fiecare felie este un sfert. 2 felii înseamnă două sferturi, 2/4, adică jumătate din pizza.'); },
    };
  }
  if (kind === 'candies') {
    const n = pick([8, 10, 12, 14, 16, 18, 20, 24]);
    return {
      points: 1,
      get text() { return tr('Ana are {n} bomboane și îi dă fratelui ei jumătate din ele. Câte bomboane îi dă?', { n }); },
      answer: n / 2,
      choices: numberChoices(n / 2, [n / 4, n, n / 2 + 2, n / 2 - 1]),
      get explanation() { return tr('Jumătate din {n} înseamnă {n} : 2 = {h} bomboane.', { n, h: n / 2 }); },
    };
  }
  const n = pick([8, 12, 16, 20, 24, 28]);
  return {
    points: 1,
    get text() { return tr('La o excursie merg {n} copii. Un sfert dintre ei au bicicletă. Câți copii au bicicletă?', { n }); },
    answer: n / 4,
    choices: numberChoices(n / 4, [n / 2, n, n / 4 + 1, n / 4 + 2]),
    get explanation() { return tr('Un sfert din {n} înseamnă {n} : 4 = {q} copii.', { n, q: n / 4 }); },
  };
}

// ---------- Exercițiul 14: „Scrie fracția corespunzătoare pentru fiecare figură.” ----------
// Figurile din carte: pătrate tăiate în 4 (cu părțile colorate oriunde), pe diagonale, dreptunghiuri.
// [formă, părți, părțile colorate]
const FIGURES = [
  ['square', 4, [0]], ['square', 4, [3]], ['square', 4, [1, 2]], ['square', 4, [0, 3]], ['square', 4, [0, 1, 3]],
  ['square', 2, [0]], ['square', 2, [1]], ['squareH', 2, [0]], ['squareH', 2, [1]],
  ['squareX', 4, [0]], ['squareX', 4, [2]], ['squareX', 4, [1, 3]], ['squareX', 4, [0, 1, 2]],
  ['squareD', 2, [0]], ['squareD', 2, [1]],
  ['circle', 4, [1]], ['circle', 4, [2, 3]], ['circle', 4, [0, 1, 2]], ['circle', 2, [1]],
  ['tall', 2, [1]], ['tall', 4, [2, 3]], ['tall', 4, [3]],
  ['bar', 4, [1]], ['bar', 4, [0, 2, 3]], ['bar', 2, [0]],
];

// Variantele de răspuns: fracția figurii și alte fracții cu același număr de părți (fără 1/2 lângă 2/4).
const FRACTION_CHOICES = {
  2: ['1/2', '1/4', '2/2', '3/4'],
  4: ['1/4', '2/4', '3/4', '4/4'],
};

function writeFractionItem(figure) {
  const [shape, parts, filledIdx] = figure;
  const k = filledIdx.length;
  const answer = `${k}/${parts}`;
  return {
    points: 1,
    get text() { return tr('Scrie fracția corespunzătoare figurii.'); },
    visual: { type: 'fraction', shape, parts, filledIdx },
    answer,
    choices: shuffle(FRACTION_CHOICES[parts]),
    get explanation() {
      return tr('Figura este împărțită în {parts} părți egale (numitorul, jos), iar {k} sunt colorate (numărătorul, sus): {answer}.', { parts, k, answer });
    },
  };
}

// ---------- Exercițiul 15: „Scrie fracția pentru fiecare pereche de figuri și compară-le.” ----------
// Ca în carte (o jumătate și două sferturi sunt egale), plus perechi cu < și >.
const PAIRS_EQUAL = [
  [['circle', 2, [1]], ['circle', 4, [2, 3]]],
  [['squareD', 2, [0]], ['squareX', 4, [0, 1]]],
  [['tall', 2, [1]], ['tall', 4, [2, 3]]],
  [['square', 2, [0]], ['square', 4, [0, 2]]],
  [['bar', 2, [0]], ['bar', 4, [0, 1]]],
];
const PAIRS_OTHER = [
  [['circle', 4, [0]], ['circle', 2, [0]]],
  [['square', 4, [0, 1, 3]], ['square', 2, [1]]],
  [['squareX', 4, [2]], ['squareX', 4, [0, 1]]],
  [['tall', 4, [3]], ['tall', 2, [1]]],
  [['bar', 4, [0, 1, 2]], ['bar', 4, [0]]],
  [['circle', 2, [1]], ['circle', 4, [3]]],
];
const value = ([, parts, idx]) => idx.length / parts;
const fracText = ([, parts, idx]) => `${idx.length}/${parts}`;

function compareItem(pair) {
  const [left, right] = pair;
  const sign = value(left) === value(right) ? '=' : value(left) < value(right) ? '<' : '>';
  const toVisual = ([shape, parts, filledIdx]) => ({ shape, parts, filledIdx });
  return {
    points: 1,
    get text() { return tr('Scrie fracția fiecărei figuri și compară-le. Ce semn pui în locul lui „?”?'); },
    visual: { type: 'fractionPair', left: toVisual(left), right: toVisual(right) },
    answer: sign,
    choices: ['<', '=', '>'],
    get explanation() {
      const vars = { l: fracText(left), r: fracText(right) };
      if (sign === '=') return tr('Figurile sunt la fel de mari, iar partea colorată este la fel de mare: {l} = {r}. Două sferturi formează o jumătate.', vars);
      if (sign === '<') return tr('Partea colorată din prima figură este mai mică: {l} < {r}.', vars);
      return tr('Partea colorată din prima figură este mai mare: {l} > {r}.', vars);
    },
  };
}

// O rundă de 12: imagini, fracția figurii, comparări, părți egale, o întrebare, jumătăți, sferturi și o problemă.
// Numerele din carte sunt 4, 8, 12, 16, 20; continuăm cu alți multipli de 4.
export function buildFractionRound() {
  const numbers = shuffle([4, 8, 12, 16, 20, 24, 28, 32, 36, 40]);
  const figures = shuffle(FIGURES);
  return [
    pictureItem('half'),
    pictureItem(pick(['quarter', 'twoQuarters'])),
    writeFractionItem(figures[0]),
    writeFractionItem(figures[1]),
    compareItem(pick(PAIRS_EQUAL)),
    compareItem(pick(PAIRS_OTHER)),
    equalPartsItem(),
    conceptItem(),
    halfItem(numbers[0]),
    quarterItem(numbers[1]),
    Math.random() < 0.5 ? halfItem(numbers[2]) : quarterItem(numbers[2]),
    wordItem(),
  ];
}

export { HALF_RULE, QUARTER_RULE };
