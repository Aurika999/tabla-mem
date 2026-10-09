// Date statice folosite de joc: niveluri, cuvinte pentru probleme, fructe pentru indicii.

export const PROBLEME_LEVEL = 'probleme';
export const AVANSATE_LEVEL = 'avansate';
// „Insula Isteților”: probleme fără înmulțire (adunări, scăderi, comparații).
export const LOGIC_LEVELS = ['logica1', 'logica2', 'logica3', 'logica4'];

export const LEVELS = {
  1: { key: 1, range: [1, 5, 1, 5], label: '1. UȘOR', hint: '1 × 1 până la 5 × 5', className: 'l1' },
  2: { key: 2, range: [1, 5, 6, 10], label: '2. ÎNCEPĂTOR', hint: '1 × 6 până la 5 × 10', className: 'l2' },
  3: { key: 3, range: [6, 10, 1, 10], label: '3. MEDIU', hint: '6 × 1 până la 10 × 10', className: 'l3' },
  4: { key: 4, range: [11, 12, 1, 12], label: '4. AVANSAT', hint: '11 × 1 până la 12 × 12', className: 'l4' },
  5: { key: 5, range: [1, 12, 1, 12], label: '5. EXPERT', hint: 'Provocări mixte', className: 'l5' },
  [PROBLEME_LEVEL]: { key: PROBLEME_LEVEL, range: [1, 10, 1, 10], label: '📖 PROBLEME', hint: 'Probleme de logică', className: 'lp' },
  [AVANSATE_LEVEL]: { key: AVANSATE_LEVEL, range: [1, 10, 1, 10], label: '🧠 PROVOCĂRI', hint: 'Probleme pentru concurs', className: 'la' },
  logica1: { key: 'logica1', label: '🧩 1. ADUNĂRI ȘI SCĂDERI', hint: 'Probleme până la 20', className: 'lg1' },
  logica2: { key: 'logica2', label: '🧩 2. MAI MULT, MAI PUȚIN', hint: 'Comparații, bani, vârste — până la 50', className: 'lg2' },
  logica4: { key: 'logica4', label: '🧩 4. EXERSEZ ȘI REZOLV', hint: 'Ca în manual: înmulțiri și probleme', className: 'lg4' },
  logica3: { key: 'logica3', label: '🧩 3. PROBLEME ISTEȚE', hint: 'În doi pași, ore, șiruri — până la 100', className: 'lg3' },
};

export const LEVEL_ORDER = [1, 2, 3, 4, 5];

export const FRUITS = ['🍎', '🍐', '🍊', '🥝'];

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
