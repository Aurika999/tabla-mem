// Date statice folosite de joc: niveluri, cuvinte pentru probleme, fructe pentru indicii.

export const PROBLEME_LEVEL = 'probleme';
export const AVANSATE_LEVEL = 'avansate';

export const LEVELS = {
  1: { key: 1, range: [1, 5, 1, 5], label: '1. UȘOR', hint: '1 × 1 până la 5 × 5', className: 'l1' },
  2: { key: 2, range: [1, 5, 6, 10], label: '2. ÎNCEPĂTOR', hint: '1 × 6 până la 5 × 10', className: 'l2' },
  3: { key: 3, range: [6, 10, 1, 10], label: '3. MEDIU', hint: '6 × 1 până la 10 × 10', className: 'l3' },
  4: { key: 4, range: [11, 12, 1, 12], label: '4. AVANSAT', hint: '11 × 1 până la 12 × 12', className: 'l4' },
  5: { key: 5, range: [1, 12, 1, 12], label: '5. EXPERT', hint: 'Provocări mixte', className: 'l5' },
  [PROBLEME_LEVEL]: { key: PROBLEME_LEVEL, range: [1, 10, 1, 10], label: '📖 PROBLEME', hint: 'Probleme de logică', className: 'lp' },
  [AVANSATE_LEVEL]: { key: AVANSATE_LEVEL, range: [1, 10, 1, 10], label: '🧠 PROVOCĂRI', hint: 'Probleme pentru concurs', className: 'la' },
};

export const LEVEL_ORDER = [1, 2, 3, 4, 5];

export const FRUITS = ['🍎', '🍐', '🍊', '🥝'];

const WP_NAMES = ['Andrei', 'Mara', 'Ioana', 'Matei', 'Elena', 'David', 'Sofia', 'Alex', 'Diana', 'Bogdan'];
const WP_OBJECTS = ['scoici', 'mere', 'baloane', 'creioane', 'bomboane', 'cărți', 'biluțe', 'ouă', 'nasturi'];
const WP_OBJECTS_CMP = ['scoici', 'mere', 'baloane', 'creioane', 'bomboane', 'flori', 'cărți', 'biluțe', 'ouă'];

function pickTwoNames() {
  const n1 = WP_NAMES[Math.floor(Math.random() * WP_NAMES.length)];
  let n2 = WP_NAMES[Math.floor(Math.random() * WP_NAMES.length)];
  while (n2 === n1) n2 = WP_NAMES[Math.floor(Math.random() * WP_NAMES.length)];
  return [n1, n2];
}

export function buildWordProblem(a, b) {
  const obj = WP_OBJECTS[Math.floor(Math.random() * WP_OBJECTS.length)];
  const objCmp = WP_OBJECTS_CMP[Math.floor(Math.random() * WP_OBJECTS_CMP.length)];
  const [n1, n2] = pickTwoNames();
  const templates = [
    () => ({ text: `${n1} are ${a} pungi cu câte ${b} ${obj} în fiecare pungă. Câte ${obj} are ${n1} în total?`, answer: a * b, isMult: true }),
    () => ({ text: `În grădină sunt ${a} rânduri cu câte ${b} flori pe fiecare rând. Câte flori sunt în total?`, answer: a * b, isMult: true }),
    () => ({ text: `${n1} are ${a} cutii cu câte ${b} ${obj} în fiecare cutie. Câte ${obj} are ${n1}?`, answer: a * b, isMult: true }),
    () => ({
      text: `${n1} are ${a} ${objCmp}, iar ${n2} are cu ${b} mai multe. Câte ${objCmp} are ${n2}?`,
      answer: a + b, isMult: false,
      explanation: `${n2} are cu ${b} mai multe decât ${n1}, deci adunăm: ${a} + ${b} = ${a + b}.`,
    }),
    () => {
      const hi = Math.max(a, b), lo = Math.min(a, b);
      const diff = hi > lo ? hi - lo : (hi > 1 ? 1 : 0);
      return {
        text: `${n1} are ${hi} ${objCmp}, iar ${n2} are cu ${diff} mai puține. Câte ${objCmp} are ${n2}?`,
        answer: hi - diff, isMult: false,
        explanation: `${n2} are cu ${diff} mai puține decât ${n1}, deci scădem: ${hi} - ${diff} = ${hi - diff}.`,
      };
    },
  ];
  if (b >= 2) {
    templates.push(() => ({ text: `${n1} are ${a} ${objCmp}. ${n2} are de ${b} ori mai multe ${objCmp} decât ${n1}. Câte ${objCmp} are ${n2}?`, answer: a * b, isMult: true }));
  }
  return templates[Math.floor(Math.random() * templates.length)]();
}

export function buildBreakdownText(a, b) {
  return Array(a).fill(b).join(' + ');
}

export function makeAnswers(correct) {
  const set = new Set([correct]);
  while (set.size < 4) {
    const d = Math.floor(Math.random() * 9) - 4;
    const v = correct + d;
    if (v >= 0 && v !== correct) set.add(v);
  }
  return [...set].sort(() => Math.random() - 0.5);
}

export function rangeForLevel(level) {
  return LEVELS[level].range;
}

export function tableSize(level) {
  return level === 1 ? 5 : level === 2 ? 10 : level === 4 ? 12 : 12;
}
