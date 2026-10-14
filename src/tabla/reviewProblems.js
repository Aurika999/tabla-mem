// „Probleme de recapitulare” (pagina cu urși, copaci, veverițe și postere din manual):
// probleme cu mai multe operații, rezolvate pe pași. Numerele se schimbă la fiecare rundă.

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
  return n >= 20 && (lastTwo === 0 || lastTwo >= 20) ? `${n} de ${word}` : `${n} ${word}`;
}

const TEMPLATES = [
  // 4. Pui de urs, urși adulți de 4 ori mai mulți, căprioare cu 6 mai multe decât urși.
  () => {
    const cubs = randInt(5, 9); const times = pick([2, 3, 4]); const more = randInt(3, 9);
    const adults = cubs * times; const bears = cubs + adults; const deer = bears + more;
    return {
      text: `Într-o rezervație sunt ${count(cubs, 'pui')} de urs, de ${times} ori mai mulți urși adulți și cu ${more} mai multe căprioare decât urși. Câte animale sunt în rezervație?`,
      steps: [
        step(`Câți urși adulți sunt? ${cubs} × ${times} = ?`, adults, [cubs + times, adults + cubs]),
        step(`Câți urși sunt în total? ${cubs} + ${adults} = ?`, bears, [adults, bears + 10]),
        step(`Câte căprioare sunt? ${bears} + ${more} = ?`, deer, [bears - more, deer + 10]),
        step(`Câte animale sunt în total? ${bears} + ${deer} = ?`, bears + deer, [deer + cubs, bears + deer + 10]),
      ],
      explanation: `Urși adulți: ${cubs} × ${times} = ${adults}. Urși: ${cubs} + ${adults} = ${bears}. `
        + `Căprioare: ${bears} + ${more} = ${deer}. În total: ${bears} + ${deer} = ${bears + deer} de animale.`,
    };
  },
  // 5. Pepinieră: rânduri cu stejari, frasini și mesteceni.
  () => {
    const [r1, p1] = [randInt(2, 5), randInt(5, 9)]; const [r2, p2] = [randInt(4, 7), randInt(3, 6)]; const [r3, p3] = [randInt(6, 9), 5];
    const a = r1 * p1; const b = r2 * p2; const c = r3 * p3;
    return {
      text: `Într-o pepinieră sunt ${r1} rânduri a câte ${p1} stejari pe rând, ${r2} rânduri a câte ${p2} frasini pe rând și ${r3} rânduri a câte ${p3} mesteceni pe rând. Câți pomi sunt în total?`,
      steps: [
        step(`Câți stejari? ${r1} × ${p1} = ?`, a, [r1 + p1, a + p1]),
        step(`Câți frasini? ${r2} × ${p2} = ?`, b, [r2 + p2, b + p2]),
        step(`Câți mesteceni? ${r3} × ${p3} = ?`, c, [r3 + p3, c + p3]),
        step(`Câți pomi în total? ${a} + ${b} + ${c} = ?`, a + b + c, [a + b, a + b + c + 10]),
      ],
      explanation: `Stejari: ${r1} × ${p1} = ${a}. Frasini: ${r2} × ${p2} = ${b}. Mesteceni: ${r3} × ${p3} = ${c}. `
        + `În total: ${a} + ${b} + ${c} = ${a + b + c} de pomi.`,
    };
  },
  // 6. Două veverițe strâng alune o săptămână (7 zile).
  () => {
    const x = randInt(3, 6); const y = x + randInt(1, 3);
    return {
      text: `O veveriță strânge provizii pentru iarnă, într-o săptămână, câte ${x} alune pe zi, iar altă veveriță strânge câte ${y} alune pe zi, timp de o săptămână. Câte alune strâng cele două veverițe într-o săptămână?`,
      steps: [
        step(`O săptămână are 7 zile. Prima veveriță: ${x} × 7 = ?`, x * 7, [x + 7, x * 6]),
        step(`A doua veveriță: ${y} × 7 = ?`, y * 7, [y + 7, y * 6]),
        step(`Împreună: ${x * 7} + ${y * 7} = ?`, (x + y) * 7, [(x + y) * 7 + 10, x * 7 + y]),
      ],
      explanation: `Prima: ${x} × 7 = ${x * 7}. A doua: ${y} × 7 = ${y * 7}. Împreună: ${x * 7} + ${y * 7} = ${(x + y) * 7} de alune. `
        + `Al doilea mod: (${x} + ${y}) × 7 = ${x + y} × 7 = ${(x + y) * 7}.`,
    };
  },
  // 7. Tren de marfă: vagoane cu saci, mai multe curse.
  () => {
    const wagons = randInt(2, 4); const sacks = pick([5, 10]); const trips = randInt(2, 5);
    const perTrip = wagons * sacks;
    return {
      text: `Un tren de marfă are ${wagons} vagoane. În fiecare vagon sunt câte ${sacks} saci cu cereale. Știind că trenul face ${trips} curse, transportând de fiecare dată același număr de saci, află câți saci transportă trenul în total.`,
      steps: [
        step(`Câți saci duce la o cursă? ${wagons} × ${sacks} = ?`, perTrip, [wagons + sacks, perTrip + sacks]),
        step(`Câți saci în ${trips} curse? ${perTrip} × ${trips} = ?`, perTrip * trips, [perTrip + trips, perTrip * (trips + 1)]),
      ],
      explanation: `La o cursă: ${wagons} × ${sacks} = ${perTrip} de saci. În ${trips} curse: ${perTrip} × ${trips} = ${perTrip * trips} de saci.`,
    };
  },
  // 8. Postere: clasa A, clasa B de două ori mai multe, clasa C cât celelalte două la un loc.
  () => {
    const a = randInt(5, 12); const b = 2 * a; const c = a + b;
    return {
      text: `Clasa a II-a A a realizat ${a} postere cu îndemnuri de protejare a pădurilor, clasa a II-a B a realizat de două ori mai multe, iar clasa a II-a C cât celelalte două clase la un loc. Câte postere au realizat cele trei clase?`,
      steps: [
        step(`Câte postere a făcut clasa B? ${a} × 2 = ?`, b, [a + 2, b + 2]),
        step(`Câte postere a făcut clasa C? ${a} + ${b} = ?`, c, [b, c + 10]),
        step(`Câte postere în total? ${a} + ${b} + ${c} = ?`, a + b + c, [a + b, a + b + c + 10]),
      ],
      explanation: `Clasa B: ${a} × 2 = ${b}. Clasa C: ${a} + ${b} = ${c}. În total: ${a} + ${b} + ${c} = ${a + b + c} de postere.`,
    };
  },
];

export function isReviewLevel(level) {
  return REVIEW_LEVELS.includes(level);
}

export function buildReviewProblem() {
  return { ...pick(TEMPLATES)(), badge: BADGE };
}
