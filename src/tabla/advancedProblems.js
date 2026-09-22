// Probleme de nivel avansat (tip fișă de concurs), cu mai multe tipuri de exerciții.
import { makeAnswers } from './data';

const AVANSATE_NAMES = ['Rița-Veverița', 'Andrei', 'Mara', 'Ioana', 'Matei', 'Elena', 'David', 'Sofia'];

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
    text: `Pe o stradă sunt ${n} case, numerotate de la 1 la ${n}. Câte cifre sunt necesare pentru a scrie numerele tuturor caselor?`,
    answer: digits,
    choices: buildChoices(digits, [n, digits - 1, digits + 1, digits + n]),
    explanation: `Numerele 1-9 au 1 cifră: 9 numere → 9 cifre. Numerele 10-${n} au 2 cifre: ${n - 9} numere → ${(n - 9) * 2} cifre. Total: 9 + ${(n - 9) * 2} = ${digits}.`,
  };
}

function plantingRowsProblem() {
  const perRow = randInt(4, 12);
  const rows = randInt(4, 12);
  const total = perRow * rows;
  return {
    text: `Într-o livadă s-au adus ${total} pomi pentru a fi plantați. Câte rânduri s-au format, dacă pe fiecare rând erau câte ${perRow} pomi?`,
    answer: rows,
    choices: buildChoices(rows, [rows - 1, rows + 1, perRow, total]),
    explanation: `Împărțim totalul de pomi la câți sunt pe un rând: ${total} : ${perRow} = ${rows} rânduri.`,
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
      explanation: `Întâi înmulțirea (are prioritate): ${b} × ${c} = ${b * c}. Apoi scădem: ${a} - ${b * c} = ${answer}.`,
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
      explanation: `Întâi înmulțirea (are prioritate): ${a} × ${b} = ${a * b}. Apoi adunăm: ${a * b} + ${c} = ${answer}.`,
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
    explanation: `Întâi împărțirea (are prioritate): ${a} : ${b} = ${q}. Apoi adunăm: ${q} + ${c} = ${answer}.`,
  };
}

function fractionAgeProblem() {
  const name = pickName();
  const n = randInt(4, 12) * 4;
  const answer = n / 2;
  return {
    text: `${name} are vârsta egală cu dublul sfertului numărului ${n}. Câți ani are ${name}?`,
    answer,
    choices: buildChoices(answer, [n / 4, n, answer - 2, answer + 2]),
    explanation: `Sfertul lui ${n} este ${n} : 4 = ${n / 4}. Dublul lui ${n / 4} este ${n / 4} × 2 = ${answer}.`,
  };
}

function rabbitJumpProblem() {
  const length = randInt(10, 20) * 2;
  const times = randInt(2, 5);
  const jumps = randInt(3, 6);
  const jumpLength = length * times;
  const answer = jumpLength * jumps + jumpLength / 2;
  return {
    text: `Un iepuraș are lungimea de ${length} cm. El poate face un salt de ${times} ori mai mare decât lungimea lui. Ce distanță parcurge (în cm) după ${jumps} salturi și jumătate?`,
    answer,
    choices: buildChoices(answer, [jumpLength * jumps, answer - jumpLength, answer + jumpLength]),
    explanation: `Un salt are ${length} × ${times} = ${jumpLength} cm. Pentru ${jumps} salturi întregi: ${jumpLength} × ${jumps} = ${jumpLength * jumps} cm. Jumătate de salt: ${jumpLength} : 2 = ${jumpLength / 2} cm. Total: ${jumpLength * jumps} + ${jumpLength / 2} = ${answer} cm.`,
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
    text: `${name} merge într-o excursie împreună cu colegii de clasă. În urma lui sunt ${behind} colegi, iar înaintea lui sunt de ${times} ori mai mulți copii decât ${base}. Câți copii merg în total la excursie (inclusiv ${name})?`,
    answer,
    choices: buildChoices(answer, [behind + ahead, ahead + 1, answer - times]),
    explanation: `Înaintea lui ${name}: ${times} × ${base} = ${ahead} copii. Total: ${behind} (în urmă) + ${ahead} (înainte) + 1 (${name}) = ${answer}.`,
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
