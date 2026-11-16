import { tr } from './i18n';
// „Probleme de recapitulare”: probleme cu mai multe operații, rezolvate pe pași. Numerele se schimbă la fiecare rundă.

export const REVIEW_LEVELS = ['recap1'];

const BADGE = '🌳 Probleme de recapitulare';

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Variantele unui pas: răspunsul corect și greșeli tipice (fără duplicate sau numere negative).
function choices(answer, mistakes) {
  const set = new Set([answer]);
  for (const m of [...mistakes, answer + 1, answer + 10, answer - 1, answer + 2]) {
    if (set.size >= 4) break;
    if (Number.isInteger(m) && m >= 0) set.add(m);
  }
  return shuffle([...set]);
}

const step = (question, answer, mistakes) => ({ question, answer, choices: choices(answer, mistakes) });

// Româna cere „de” după numerele de la 20 în sus (20 de urși, dar 19 urși).
function count(n, word) {
  const lastTwo = n % 100;
  return n >= 20 && (lastTwo === 0 || lastTwo >= 20) ? tr('{n} de {word}', { n, word }) : `${n} ${word}`;
}

const TEMPLATES = [
  // Ferma: iezi, capre mari de câteva ori mai multe, oi cu câteva mai multe decât caprele.
  () => {
    const kids = randInt(5, 9); const times = pick([2, 3, 4]); const more = randInt(3, 9);
    const adults = kids * times; const goats = kids + adults; const sheep = goats + more;
    return {
      text: tr('La ferma lui Tudor sunt {v0}. Caprele mari sunt de {times} ori mai multe decât iezii, iar oile sunt cu {more} mai multe decât toate caprele. Câte animale sunt la fermă?', { v0: count(kids, 'iezi'), times, more }),
      steps: [
        step(tr('Câte capre mari sunt? {kids} × {times} = ?', { kids, times }), adults, [kids + times, adults + kids]),
        step(tr('Câte capre sunt cu totul (iezi și capre mari)? {kids} + {adults} = ?', { kids, adults }), goats, [adults, goats + 10]),
        step(tr('Câte oi sunt? {goats} + {more} = ?', { goats, more }), sheep, [goats - more, sheep + 10]),
        step(tr('Câte animale sunt la fermă? {goats} + {sheep} = ?', { goats, sheep }), goats + sheep, [sheep + kids, goats + sheep + 10]),
      ],
      explanation: tr('Capre mari: {kids} × {times} = {adults}. Toate caprele: {kids} + {adults} = {goats}. ', { kids, times, adults, goats })
        + tr('Oi: {goats} + {more} = {sheep}. La fermă: {goats} + {sheep} = {v0} de animale.', { goats, more, sheep, v0: goats + sheep }),
    };
  },
  // Grădina: rânduri cu lalele, trandafiri și narcise.
  () => {
    const [r1, p1] = [randInt(2, 5), randInt(5, 9)]; const [r2, p2] = [randInt(4, 7), randInt(3, 6)]; const [r3, p3] = [randInt(6, 9), 5];
    const a = r1 * p1; const b = r2 * p2; const c = r3 * p3;
    return {
      text: tr('Bunica și Matei plantează flori în grădină: {r1} rânduri cu câte {p1} lalele, {r2} rânduri cu câte {p2} trandafiri și {r3} rânduri cu câte {p3} narcise. Câte flori au plantat?', { r1, p1, r2, p2, r3, p3 }),
      steps: [
        step(tr('Câte lalele? {r1} × {p1} = ?', { r1, p1 }), a, [r1 + p1, a + p1]),
        step(tr('Câți trandafiri? {r2} × {p2} = ?', { r2, p2 }), b, [r2 + p2, b + p2]),
        step(tr('Câte narcise? {r3} × {p3} = ?', { r3, p3 }), c, [r3 + p3, c + p3]),
        step(tr('Câte flori în total? {a} + {b} + {c} = ?', { a, b, c }), a + b + c, [a + b, a + b + c + 10]),
      ],
      explanation: tr('Lalele: {r1} × {p1} = {a}. Trandafiri: {r2} × {p2} = {b}. Narcise: {r3} × {p3} = {c}. ', { r1, p1, a, r2, p2, b, r3, p3, c })
        + tr('În total: {a} + {b} + {c} = {v0} de flori.', { a, b, c, v0: a + b + c }),
    };
  },
  // Doi frați citesc câteva pagini pe zi, o săptămână (7 zile).
  () => {
    const x = randInt(3, 6); const y = x + randInt(1, 3);
    return {
      text: tr('În vacanță, Ioana citește în fiecare zi câte {x} pagini, iar fratele ei, Luca, câte {y} pagini. Câte pagini citesc cei doi frați într-o săptămână?', { x, y }),
      steps: [
        step(tr('O săptămână are 7 zile. Câte pagini citește Ioana? {x} × 7 = ?', { x }), x * 7, [x + 7, x * 6]),
        step(tr('Câte pagini citește Luca? {y} × 7 = ?', { y }), y * 7, [y + 7, y * 6]),
        step(tr('Împreună: {v0} + {v1} = ?', { v0: x * 7, v1: y * 7 }), (x + y) * 7, [(x + y) * 7 + 10, x * 7 + y]),
      ],
      explanation: tr('Ioana: {x} × 7 = {v0}. Luca: {y} × 7 = {v1}. Împreună: {v0} + {v1} = {v2} de pagini. ', { x, v0: x * 7, y, v1: y * 7, v2: (x + y) * 7 })
        + tr('Al doilea mod: ({x} + {y}) × 7 = {v0} × 7 = {v1}.', { x, y, v0: x + y, v1: (x + y) * 7 }),
    };
  },
  // Duba brutăriei: lăzi cu pâini, mai multe drumuri.
  () => {
    const crates = randInt(2, 4); const loaves = pick([5, 10]); const trips = randInt(2, 5);
    const perTrip = crates * loaves;
    return {
      text: tr('Duba unei brutării încarcă {crates} lăzi, iar în fiecare ladă sunt câte {loaves} pâini. Într-o dimineață, duba face {trips} drumuri la magazine, de fiecare dată la fel de încărcată. Câte pâini a dus în total?', { crates, loaves, trips }),
      steps: [
        step(tr('Câte pâini duce la un drum? {crates} × {loaves} = ?', { crates, loaves }), perTrip, [crates + loaves, perTrip + loaves]),
        step(tr('Câte pâini în {trips} drumuri? {perTrip} × {v0} = ?', { trips, perTrip, v0: trips }), perTrip * trips, [perTrip + trips, perTrip * (trips + 1)]),
      ],
      explanation: tr('La un drum: {crates} × {loaves} = {perTrip} de pâini. În {trips} drumuri: {perTrip} × {trips} = {v0} de pâini.', { crates, loaves, perTrip, trips, v0: perTrip * trips }),
    };
  },
  // Târgul de toamnă: trei echipe aduc borcane cu miere.
  () => {
    const a = randInt(5, 12); const b = 2 * a; const c = a + b;
    return {
      text: tr('La târgul de toamnă al școlii, echipa „Albinele” a adus {a} borcane cu miere, echipa „Fluturii” de două ori mai multe, iar echipa „Buburuzele” cât celelalte două echipe la un loc. Câte borcane au adus cele trei echipe?', { a }),
      steps: [
        step(tr('Câte borcane au adus „Fluturii”? {a} × 2 = ?', { a }), b, [a + 2, b + 2]),
        step(tr('Câte borcane au adus „Buburuzele”? {a} + {b} = ?', { a, b }), c, [b, c + 10]),
        step(tr('Câte borcane în total? {a} + {b} + {c} = ?', { a, b, c }), a + b + c, [a + b, a + b + c + 10]),
      ],
      explanation: tr('„Fluturii”: {a} × 2 = {b}. „Buburuzele”: {a} + {b} = {c}. În total: {a} + {b} + {c} = {v0} de borcane.', { a, b, c, v0: a + b + c }),
    };
  },
];

export function isReviewLevel(level) {
  return REVIEW_LEVELS.includes(level);
}

export function buildReviewProblem() {
  return { ...pick(TEMPLATES)(), badge: BADGE };
}
