// „Evaluare” (Recapitulare): exerciții de recapitulare la înmulțire, cu numere noi la fiecare rundă.
// Problemele mai lungi se rezolvă pe pași: fiecare pas are întrebarea, răspunsul
// și variantele lui ({ text, steps: [{ question, answer, choices }], explanation }).
import { makeAnswers } from './data';
import { tr } from './i18n';

// eval4 (Mă antrenez și rezolv) stă înaintea testului final.
export const EVAL_LEVELS = ['eval1', 'eval2', 'eval4', 'eval3'];

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

// Problemă rezolvată pe pași; `steps` = [[întrebare, răspuns, greșeli tipice], …].
function stepped(text, steps, explanation) {
  return {
    text,
    explanation,
    steps: steps.map(([question, answer, mistakes]) => ({ question, answer, choices: buildChoices(answer, mistakes) })),
  };
}

// ---------- 1. Calcul: alege rezultatul, factorul lipsă, tabelul ----------
const CALC = [
  // Alege rezultatul corect.
  () => {
    const a = pick([2, 3, 4]); const b = randInt(3, 10);
    return problem(tr('Alege rezultatul corect: {a} × {b} = ?', { a, b }), a * b,
      `${a} × ${b} = ${a * b}.`, [a * (b - 1), a + b, a * (b + 1)]);
  },
  // Completează înmulțirile cu factorul care lipsește.
  () => {
    const a = pick([2, 3, 4, 6, 9]); const x = randInt(2, 10);
    const eq = pick([`${a} × □ = ${a * x}`, `□ × ${a} = ${a * x}`]);
    return problem(tr('Completează cu factorul care lipsește: {eq}', { eq }), x,
      tr('Căutăm numărul care înmulțit cu {a} dă {v0}: {v1} × {x} = {v2}.', { a, v0: a * x, v1: a, x, v2: a * x }), [x + 1, x - 1, a * x - a]);
  },
  // Tabelul: a × 2, a × 3, a × 4.
  () => {
    const a = pick([9, 4, 8, 7, 5, 6]); const k = pick([2, 3, 4]);
    return problem(tr('Dacă a = {a}, cât este a × {k}?', { a, k }), a * k,
      tr('Înlocuim a cu {a}: {v0} × {k} = {v1}.', { a, v0: a, k, v1: a * k }), [a + k, a * k + a, a * k - k]);
  },
  // Dublul / triplul unui număr.
  () => {
    const n = randInt(3, 10); const [word, k] = pick([['dublul', 2], ['triplul', 3]]);
    return problem(tr('Află {word} numărului {n}.', { word, n }), k * n,
      tr('{v0} înseamnă de {k} ori mai mare: {v1} × {n} = {v2}.', { v0: word[0].toUpperCase() + word.slice(1), k, v1: k, n, v2: k * n }), [n + k, (k + 1) * n, k * n + k]);
  },
];

// ---------- 2. Probleme în pași ----------
const STEPS = [
  // Dublul unui număr plus triplul altuia.
  () => {
    const a = randInt(3, 9); const b = randInt(4, 10);
    return stepped(tr('Cât obții dacă aduni dublul lui {a} cu triplul lui {b}?', { a, b }), [
      [tr('Cât este dublul lui {a}?', { a }), 2 * a, [a + 2, 3 * a, a]],
      [tr('Cât este triplul lui {b}?', { b }), 3 * b, [b + 3, 2 * b, b]],
      [tr('Adaugă-le: {v0} + {v1} = ?', { v0: 2 * a, v1: 3 * b }), 2 * a + 3 * b, [2 * a + b, a + 3 * b, 3 * b]],
    ], tr('Dublul lui {a}: 2 × {v0} = {v1}. Triplul lui {b}: 3 × {v2} = {v3}. Suma: {v4} + {v5} = {v6}.', { a, v0: a, v1: 2 * a, b, v2: b, v3: 3 * b, v4: 2 * a, v5: 3 * b, v6: 2 * a + 3 * b }));
  },
  // Un produs, apoi un număr mai mare cu atât.
  () => {
    const a = randInt(3, 6); const b = randInt(4, 9); const more = randInt(15, 50);
    const p = a * b;
    return stepped(tr('Înmulțește {a} cu {b}. Ce număr obții dacă rezultatul crește cu {more}?', { a, b, more }), [
      [tr('Cât este produsul numerelor {a} și {b}?', { a, b }), p, [a + b, p + a, p - b]],
      [tr('Ce număr este cu {more} mai mare decât {p}?', { more, p }), p + more, [p * 2, p + more - 10, p - more >= 0 ? p - more : p + more + 10]],
    ], tr('Produsul: {a} × {b} = {p}. Cu {more} mai mare: {v0} + {v1} = {v2}.', { a, b, p, more, v0: p, v1: more, v2: p + more }));
  },
  // Un produs comparat cu triplul altui număr.
  () => {
    const b = randInt(5, 9); const t = randInt(2, 4);
    const p = 3 * b; const triple = 3 * t;
    return stepped(tr('Compară 3 × {b} cu triplul lui {t}. Cu cât este mai mare primul număr?', { b, t }), [
      [tr('Cât este produsul numerelor 3 și {b}?', { b }), p, [3 + b, p + 3, p - 3]],
      [tr('Cât este triplul lui {t}?', { t }), triple, [t + 3, 2 * t, triple + 3]],
      [tr('Cu cât este mai mare {p} decât {triple}?', { p, triple }), p - triple, [p + triple, p - triple + 1, triple]],
    ], tr('Produsul: 3 × {b} = {p}. Triplul lui {t}: 3 × {v0} = {triple}. Diferența: {v1} - {v2} = {v3}.', { b, p, t, v0: t, triple, v1: p, v2: triple, v3: p - triple }));
  },
  // Vacanța la bunici: câteva săptămâni, câte zile?
  () => {
    const w = randInt(2, 6);
    return stepped(tr('Radu a stat în vacanță la bunici {w} săptămâni. Câte zile a stat la bunici?', { w }), [
      ['Câte zile are o săptămână?', 7, [5, 6, 10]],
      [tr('Câte zile sunt în {w} săptămâni?', { w }), 7 * w, [7 + w, 7 * w + 7, 7 * w - 7]],
    ], tr('O săptămână are 7 zile. {w} săptămâni: {v0} × 7 = {v1} zile.', { w, v0: w, v1: 7 * w }));
  },
  // O brioșă și o limonadă mai scumpă de câteva ori; câte două din fiecare.
  () => {
    const tea = randInt(2, 5); const k = pick([2, 3]); const juice = tea * k; const n = 2;
    return stepped(tr('La cofetărie, o brioșă costă {tea} lei, iar o limonadă costă de {k} ori mai mult. ', { tea, k })
      + tr('Cât plătesc două prietene pentru {n} brioșe și {v0} limonade?', { n, v0: n }), [
      [tr('Cât costă o limonadă?'), juice, [tea + k, juice + tea, tea]],
      [tr('Cât costă o brioșă și o limonadă împreună?'), tea + juice, [juice, tea * juice, tea + juice + 2]],
      [tr('Cât costă {n} brioșe și {v0} limonade?', { n, v0: n }), n * (tea + juice), [tea + juice + n, n * juice, n * tea]],
    ], tr('Limonada: {tea} × {k} = {juice} lei. O brioșă + o limonadă: {v0} + {v1} = {v2} lei. ', { tea, k, juice, v0: tea, v1: juice, v2: tea + juice })
      + tr('De {n} ori: {v0} × {v1} = {v2} lei.', { n, v0: n, v1: tea + juice, v2: n * (tea + juice) }));
  },
  // Cutii cu creioane: câte în total, apoi câte rămân după ce dăm.
  () => {
    const boxes = randInt(3, 6); const per = pick([2, 3, 4]); const given = randInt(2, boxes * per - 2);
    const total = boxes * per;
    return stepped(tr('Ana are {boxes} cutii cu câte {per} creioane. Dă {given} creioane colegilor. Câte creioane îi rămân?', { boxes, per, given }), [
      ['Câte creioane are Ana la început?', total, [boxes + per, total + per, total - per]],
      [tr('Câte creioane îi rămân după ce dă {given}?', { given }), total - given, [total + given, total, total - given + 1]],
    ], tr('La început: {boxes} × {per} = {total} creioane. Rămân: {v0} - {given} = {v1}.', { boxes, per, total, v0: total, given, v1: total - given }));
  },
];

// ---------- 3. Exersez și rezolv: factori lipsă și probleme cu mai mulți pași ----------
const MORE = [
  // Factorul care lipsește, la un produs de doi sau de trei factori.
  () => {
    const [text, answer, explanation] = (() => {
      if (Math.random() < 0.6) {
        const a = randInt(3, 9); const x = randInt(2, 9);
        return [`${a} × □ = ${a * x}`, x, `${a} × ${x} = ${a * x}.`];
      }
      const a = randInt(2, 3); const b = randInt(2, 3); const x = randInt(2, 5);
      const ab = a * b;
      return [`${a} × ${b} × □ = ${ab * x}`, x, `${a} × ${b} = ${ab}, ${ab} × ${x} = ${ab * x}.`];
    })();
    return problem(tr('Completează cu factorul care lipsește: {text}', { text }), answer, explanation, [answer + 1, answer - 1, answer * 2]);
  },
  // Scrie numerele ca produse de doi factori.
  () => {
    const a = randInt(3, 9); const n = a * randInt(2, 9);
    return problem(tr('Scrie numărul {n} ca produs de doi factori: {v0} = {a} × □', { n, v0: n, a }), n / a,
      `${a} × ${n / a} = ${n}.`, [n / a + 1, n / a - 1, n - a]);
  },
  // Află suma dintre dublul și triplul numărului.
  () => {
    const n = randInt(3, 10);
    return stepped(tr('Adună dublul lui {n} cu triplul lui {n}. Ce obții?', { n }), [
      [tr('Cât este dublul lui {n}?', { n }), 2 * n, [n + 2, 3 * n, n]],
      [tr('Cât este triplul lui {n}?', { n }), 3 * n, [n + 3, 2 * n, 4 * n]],
      [tr('Adună-le: {v0} + {v1} = ?', { v0: 2 * n, v1: 3 * n }), 5 * n, [6 * n, 5 * n + 1, 3 * n]],
    ], tr('Dublul: 2 × {n} = {v0}. Triplul: 3 × {v1} = {v2}. Suma: {v3} + {v4} = {v5}.', { n, v0: 2 * n, v1: n, v2: 3 * n, v3: 2 * n, v4: 3 * n, v5: 5 * n }));
  },
  // O diferență mărită de câteva ori.
  () => {
    const b = randInt(30, 80); const d = randInt(2, 9); const a = b + d; const k = pick([3, 4, 5]);
    return stepped(tr('Scade {b} din {a}, apoi fă rezultatul de {k} ori mai mare.', { k, a, b }), [
      [tr('Cât este diferența {a} - {b}?', { a, b }), d, [a + b, d + 1, d - 1]],
      [tr('Mărește de {k} ori: {d} × {v0} = ?', { k, d, v0: k }), d * k, [d + k, d * k + k, d * (k + 1)]],
    ], tr('Diferența: {a} - {b} = {d}. De {k} ori mai mare: {v0} × {v1} = {v2}.', { a, b, d, k, v0: d, v1: k, v2: d * k }));
  },
  // Produsul a două numere comparat cu suma lor.
  () => {
    const a = randInt(5, 9); const b = randInt(5, 9);
    return stepped(tr('Calculează {a} × {b} și {a} + {b}. Cu cât este mai mare produsul decât suma?', { a, b }), [
      [tr('Cât este produsul {a} × {b}?', { a, b }), a * b, [a + b, a * b + a, a * b - b]],
      [tr('Cât este suma {a} + {b}?', { a, b }), a + b, [a * b, a + b + 1, a + b - 1]],
      [tr('Cu cât este mai mare {v0} decât {v1}?', { v0: a * b, v1: a + b }), a * b - (a + b), [a * b + a + b, a * b - (a + b) + 1, a * b]],
    ], tr('Produsul: {v0}. Suma: {v1}. Diferența: {v2} - {v3} = {v4}.', { v0: a * b, v1: a + b, v2: a * b, v3: a + b, v4: a * b - (a + b) }));
  },
  // Un termen lipsă dintr-o sumă, când celălalt e un produs.
  () => {
    const a = randInt(3, 9); const b = randInt(4, 9);
    const first = a * b;
    // Suma e un număr „rotund” mai mare decât primul termen, ca al doilea să fie pozitiv.
    const sum = pick([90, 80, 100, 70].filter(v => v > first + 5));
    return stepped(tr('Două numere adunate dau {sum}. Primul număr este {a} × {b}. Care este al doilea număr?', { sum, a, b }), [
      [tr('Cât este primul termen ({a} × {b})?', { a, b }), first, [a + b, first + a, first - b]],
      [tr('Cât este al doilea termen? {sum} - {first} = ?', { sum, first }), sum - first, [sum + first, sum - first + 10, first]],
    ], tr('Primul termen: {a} × {b} = {first}. Al doilea: {sum} - {v0} = {v1}.', { a, b, first, sum, v0: first, v1: sum - first }));
  },
  // Mingi de tenis în pungi: o pungă, apoi două pungi.
  () => {
    const per = randInt(3, 5); const price = pick([5, 10, 4, 6]);
    const box = per * price;
    return stepped(tr('O pungă are {per} mingi de tenis, iar o minge costă {price} lei. Antrenorul cumpără două pungi. Cât plătește?', { per, price }), [
      [tr('Cât costă mingile dintr-o pungă?'), box, [per + price, box + price, box - price]],
      [tr('Cât costă mingile din două pungi?'), 2 * box, [box + 2, box, 3 * box]],
    ], tr('O pungă: {per} × {price} = {box} lei. Două pungi: 2 × {v0} = {v1} lei.', { per, price, box, v0: box, v1: 2 * box }));
  },
  // Brățara: mărgele roșii și de câteva ori mai multe albastre.
  () => {
    const bulbs = randInt(4, 8); const k = pick([2, 3]);
    return stepped(tr('Sara face o brățară cu {bulbs} mărgele roșii și de {k} ori mai multe mărgele albastre. ', { bulbs, k })
      + tr('Câte mărgele are brățara?'), [
      [tr('Câte mărgele albastre are brățara?'), bulbs * k, [bulbs + k, bulbs * k + bulbs, bulbs]],
      [tr('Câte mărgele în total? {bulbs} + {v0} = ?', { bulbs, v0: bulbs * k }), bulbs + bulbs * k, [bulbs * k, bulbs + k, bulbs * (k + 2)]],
    ], tr('Albastre: {bulbs} × {k} = {v0}. În total: {v1} + {v2} = {v3} mărgele.', { bulbs, k, v0: bulbs * k, v1: bulbs, v2: bulbs * k, v3: bulbs + bulbs * k }));
  },
  // Jocul cu ținta: puncte pentru cercul verde și pentru cercul galben.
  () => {
    const blue = 6; const red = 8;
    let ca; let cr; let ba; let br; let c; let b;
    do {
      ca = randInt(3, 9); cr = randInt(3, 9); ba = randInt(3, 9); br = randInt(3, 9);
      c = ca * blue + cr * red; b = ba * blue + br * red;
    } while (c === b);
    const winner = c > b ? 'Mara' : 'Victor';
    return stepped(tr('La jocul cu ținta, fiecare săgeată în cercul verde aduce {blue} puncte, iar fiecare săgeată în cercul galben aduce {red} puncte. ', { blue, red })
      + tr('Mara a nimerit de {ca} ori cercul verde și de {cr} ori cercul galben, iar Victor de {ba} ori cercul verde și de {br} ori cercul galben. Cine are mai multe puncte și cu cât?', { ca, cr, ba, br }), [
      [tr('Câte puncte are Mara? ({ca} × {blue} + {cr} × {red})', { ca, blue, cr, red }), c, [ca * blue, cr * red, c + 2]],
      [tr('Câte puncte are Victor? ({ba} × {blue} + {br} × {red})', { ba, blue, br, red }), b, [ba * blue, br * red, b + 2]],
      [tr('Cu câte puncte mai mult are {winner}?', { winner }), Math.abs(c - b), [c + b, Math.abs(c - b) + 2, Math.max(c, b)]],
    ], tr('Mara: {ca} × {blue} + {cr} × {red} = {v0} + {v1} = {c}. ', { ca, blue, cr, red, v0: ca * blue, v1: cr * red, c })
      + tr('Victor: {ba} × {blue} + {br} × {red} = {v0} + {v1} = {b}. ', { ba, blue, br, red, v0: ba * blue, v1: br * red, b })
      + tr('{winner} a câștigat cu {v0} - {v1} = {v2} puncte.', { winner, v0: Math.max(c, b), v1: Math.min(c, b), v2: Math.abs(c - b) }));
  },
];

// ---------- 4. Test final: amestec din toată recapitularea ----------
const FINAL = [...CALC, ...STEPS, ...MORE];

const BY_LEVEL = { eval1: CALC, eval2: STEPS, eval4: MORE, eval3: FINAL };

export function isEvalLevel(level) {
  return EVAL_LEVELS.includes(level);
}

export function buildEvalProblem(level) {
  return pick(BY_LEVEL[level])();
}

// Calificativul din școală, după răspunsurile corecte din 10.
export function gradeFor(correct) {
  if (correct >= 9) return { label: 'Foarte bine', short: 'FB', emoji: '🏆' };
  if (correct >= 7) return { label: 'Bine', short: 'B', emoji: '👍' };
  if (correct >= 5) return { label: 'Suficient', short: 'S', emoji: '🙂' };
  return { label: 'Insuficient', short: 'I', emoji: '💪' };
}
