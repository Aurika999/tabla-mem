// Probleme de nivel avansat, care cer mai mult raționament, cu mai multe tipuri de exerciții.
import { makeAnswers } from './data';
import { tr } from './i18n';

const AVANSATE_NAMES = ['Andrei', 'Mara', 'Ioana', 'Matei', 'Elena', 'David', 'Sofia', 'Tudor'];

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pickName() {
  return AVANSATE_NAMES[Math.floor(Math.random() * AVANSATE_NAMES.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildChoices(correct, wrongCandidates) {
  const set = new Set([correct]);
  for (const v of wrongCandidates) {
    if (set.size >= 4) break;
    if (v >= 0 && v !== correct) set.add(v);
  }
  if (set.size < 4) return makeAnswers(correct);
  return shuffle([...set].slice(0, 4));
}

function digitCountProblem() {
  const n = randInt(15, 45);
  const digits = n <= 9 ? n : 9 + (n - 9) * 2;
  return {
    text: tr('Doamna învățătoare scrie numere pe dulăpioarele din vestiar, de la 1 la {v0}. Câte cifre scrie în total?', { n, v0: n }),
    answer: digits,
    choices: buildChoices(digits, [n, digits - 1, digits + 1, digits + n]),
    explanation: tr('Numerele 1-9 au 1 cifră: 9 numere → 9 cifre. Numerele 10-{n} au 2 cifre: {v0} numere → {v1} cifre. Total: 9 + {v2} = {digits}.', { n, v0: n - 9, v1: (n - 9) * 2, v2: (n - 9) * 2, digits }),
  };
}

function plantingRowsProblem() {
  const perRow = randInt(4, 12);
  const rows = randInt(4, 12);
  const total = perRow * rows;
  return {
    text: tr('Pentru serbare, în sală s-au adus scaune: în total {total}. Câte rânduri se formează, dacă pe fiecare rând se pun câte {perRow} scaune?', { total, perRow }),
    answer: rows,
    choices: buildChoices(rows, [rows - 1, rows + 1, perRow, total]),
    explanation: tr('Împărțim toate scaunele la câte încap pe un rând: {total} : {perRow} = {rows} rânduri.', { total, perRow, rows }),
  };
}

function expressionProblem() {
  const variant = randInt(1, 3);
  if (variant === 1) {
    const b = randInt(2, 9), c = randInt(2, 9);
    const a = b * c + randInt(5, 60);
    const answer = a - b * c;
    const commonMistake = (a - b) * c;
    return {
      text: `${a} - ${b} × ${c} =`,
      answer,
      choices: buildChoices(answer, [commonMistake, answer - c, answer + b]),
      explanation: tr('Întâi înmulțirea (are prioritate): {b} × {c} = {v0}. Apoi scădem: {a} - {v1} = {answer}.', { b, c, v0: b * c, a, v1: b * c, answer }),
    };
  }
  if (variant === 2) {
    const a = randInt(2, 9), b = randInt(2, 9);
    const c = randInt(5, 60);
    const answer = a * b + c;
    const commonMistake = a * (b + c);
    return {
      text: `${a} × ${b} + ${c} =`,
      answer,
      choices: buildChoices(answer, [commonMistake, answer - a, answer + b]),
      explanation: tr('Întâi înmulțirea (are prioritate): {a} × {b} = {v0}. Apoi adunăm: {v1} + {c} = {answer}.', { a, b, v0: a * b, v1: a * b, c, answer }),
    };
  }
  const b = randInt(2, 9), q = randInt(2, 12);
  const a = b * q;
  const c = randInt(5, 60);
  const answer = q + c;
  const commonMistake = a / (b + 1) + c;
  return {
    text: `${a} : ${b} + ${c} =`,
    answer,
    choices: buildChoices(answer, [Math.round(commonMistake), answer - 1, answer + 1]),
    explanation: tr('Întâi împărțirea (are prioritate): {a} : {b} = {q}. Apoi adunăm: {v0} + {c} = {answer}.', { a, b, q, v0: q, c, answer }),
  };
}

function fractionAgeProblem() {
  const name = pickName();
  const n = randInt(4, 12) * 4;
  const answer = n / 2;
  return {
    text: tr('Ghicitoare: ca să afli câți ani are {name}, iei sfertul lui {n} și apoi îl dublezi. Câți ani are {v0}?', { name, n, v0: name }),
    answer,
    choices: buildChoices(answer, [n / 4, n, answer - 2, answer + 2]),
    explanation: tr('Sfertul lui {n} este {v0} : 4 = {v1}. Dublul lui {v2} este {v3} × 2 = {answer}.', { n, v0: n, v1: n / 4, v2: n / 4, v3: n / 4, answer }),
  };
}

function rabbitJumpProblem() {
  const length = randInt(10, 20) * 2;
  const times = randInt(2, 5);
  const jumps = randInt(3, 6);
  const jumpLength = length * times;
  const answer = jumpLength * jumps + jumpLength / 2;
  return {
    text: tr('O broscuță de jucărie are {length} cm. La fiecare săritură, ea sare de {times} ori lungimea ei. Câți centimetri parcurge în {jumps} sărituri întregi și încă o jumătate de săritură?', { length, times, jumps }),
    answer,
    choices: buildChoices(answer, [jumpLength * jumps, answer - jumpLength, answer + jumpLength]),
    explanation: tr('O săritură are {length} × {times} = {jumpLength} cm. {jumps} sărituri întregi: {v0} × {v1} = {v2} cm. Jumătate de săritură: {v3} : 2 = {v4} cm. Total: {v5} + {v6} = {answer} cm.', { length, times, jumpLength, jumps, v0: jumpLength, v1: jumps, v2: jumpLength * jumps, v3: jumpLength, v4: jumpLength / 2, v5: jumpLength * jumps, v6: jumpLength / 2, answer }),
  };
}

function tripMultiStepProblem() {
  const name = pickName();
  const behind = randInt(5, 20);
  const times = randInt(2, 5);
  const base = randInt(4, 10);
  const ahead = times * base;
  const answer = behind + ahead + 1;
  return {
    text: tr('{name} stă la coadă la tobogan. În spatele său sunt {behind} copii, iar în fața sa sunt de {times} ori mai mulți copii decât {base}. Câți copii sunt la coadă, cu tot cu {v0}?', { name, behind, times, base, v0: name }),
    answer,
    choices: buildChoices(answer, [behind + ahead, ahead + 1, answer - times]),
    explanation: tr('În față: {times} × {base} = {ahead} copii. Total: {behind} (în spate) + {v0} (în față) + 1 ({v1}) = {answer}.', { name, times, base, ahead, behind, v0: ahead, v1: name, answer }),
  };
}

const TEMPLATES = [
  digitCountProblem,
  plantingRowsProblem,
  expressionProblem,
  expressionProblem,
  fractionAgeProblem,
  rabbitJumpProblem,
  tripMultiStepProblem,
];

export function buildAdvancedProblem() {
  const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  return template();
}
