// Date statice folosite de joc: niveluri, cuvinte pentru probleme, fructe pentru indicii.

export const PROBLEME_LEVEL = 'probleme';
export const AVANSATE_LEVEL = 'avansate';
// „Insula Isteților”: probleme fără înmulțire (adunări, scăderi, comparații).
export const LOGIC_LEVELS = ['logica1', 'logica2', 'logica3', 'logica4'];
// „Înmulțirea cu 5”: lecția din manual, pe secțiuni.
export const TWO_LEVELS = ['doi1', 'doi2', 'doi3', 'doi4'];
export const EVAL_LEVELS = ['eval1', 'eval2', 'eval4', 'eval3'];
// „Tabla împărțirii”: lecția „Împărțirea” (scădere repetată, operația inversă înmulțirii).
export const DIVISION_LEVELS = ['imp1', 'imp2', 'imp3', 'imp4'];
export const THREE_LEVELS = ['trei1', 'trei2', 'trei3', 'trei4'];
export const FOUR_LEVELS = ['patru1', 'patru2', 'patru3', 'patru4'];
export const FIVE_LEVELS = ['cinci1', 'cinci2', 'cinci3', 'cinci4'];
export const SIX_LEVELS = ['sase1', 'sase2', 'sase3', 'sase4'];
export const SEVEN_LEVELS = ['sapte1', 'sapte2', 'sapte3', 'sapte4'];
export const EIGHT_LEVELS = ['opt1', 'opt2', 'opt3', 'opt4'];
export const NINE_LEVELS = ['noua1', 'noua2', 'noua3', 'noua4'];

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
  cinci1: { key: 'cinci1', label: '🖐️ 1. DESCOPĂR', hint: 'Cum înmulțim cu 5', className: 'lf1' },
  cinci2: { key: 'cinci2', label: '🖐️ 2. APLIC', hint: 'Efectuează, calculează, mărește de 5 ori', className: 'lf2' },
  cinci3: { key: 'cinci3', label: '🖐️ 3. EXERSEZ', hint: 'Factori lipsă, adevărat/fals, comparații', className: 'lf3' },
  cinci4: { key: 'cinci4', label: '🖐️ 4. REZOLV PROBLEME', hint: 'Probleme cu înmulțirea cu 5', className: 'lf4' },
  sase1: { key: 'sase1', label: '🔋 1. DESCOPĂR', hint: 'Cum înmulțim cu 6', className: 'lf1' },
  sase2: { key: 'sase2', label: '🔋 2. APLIC', hint: 'Efectuează, alege, calculează', className: 'lf2' },
  sase3: { key: 'sase3', label: '🔋 3. EXERSEZ', hint: 'Factori lipsă, semne <, >, =', className: 'lf3' },
  sase4: { key: 'sase4', label: '🔋 4. REZOLV PROBLEME', hint: 'Probleme cu înmulțirea cu 6', className: 'lf4' },
  sapte1: { key: 'sapte1', label: '🪙 1. DESCOPĂR', hint: 'Cum înmulțim cu 7', className: 'lf1' },
  sapte2: { key: 'sapte2', label: '🪙 2. APLIC', hint: 'Efectuează, alege, calculează', className: 'lf2' },
  sapte3: { key: 'sapte3', label: '🪙 3. EXERSEZ', hint: 'Factori lipsă, semne <, >, =', className: 'lf3' },
  sapte4: { key: 'sapte4', label: '🪙 4. REZOLV PROBLEME', hint: 'Probleme cu înmulțirea cu 7', className: 'lf4' },
  opt1: { key: 'opt1', label: '🐙 1. DESCOPĂR', hint: 'Cum înmulțim cu 8', className: 'lf1' },
  opt2: { key: 'opt2', label: '🐙 2. APLIC', hint: 'Efectuează, compară, completează', className: 'lf2' },
  opt3: { key: 'opt3', label: '🐙 3. EXERSEZ', hint: 'Factori lipsă, semne, produse', className: 'lf3' },
  opt4: { key: 'opt4', label: '🐙 4. REZOLV PROBLEME', hint: 'Probleme cu înmulțirea cu 8', className: 'lf4' },
  noua1: { key: 'noua1', label: '🎈 1. DESCOPĂR', hint: 'Cum înmulțim cu 9', className: 'lf1' },
  noua2: { key: 'noua2', label: '🎈 2. APLIC', hint: 'Efectuează, compară, completează', className: 'lf2' },
  noua3: { key: 'noua3', label: '🎈 3. EXERSEZ', hint: 'Factori lipsă, semne, produse', className: 'lf3' },
  noua4: { key: 'noua4', label: '🎈 4. REZOLV PROBLEME', hint: 'Probleme cu înmulțirea cu 9', className: 'lf4' },
  patru1: { key: 'patru1', label: '🐻‍❄️ 1. DESCOPĂR', hint: 'Cum înmulțim cu 4', className: 'lf1' },
  patru2: { key: 'patru2', label: '🐻‍❄️ 2. APLIC', hint: 'După model, adunări repetate', className: 'lf2' },
  patru3: { key: 'patru3', label: '🐻‍❄️ 3. EXERSEZ', hint: 'Cu 4 / de 4 ori, factori, comparații', className: 'lf3' },
  patru4: { key: 'patru4', label: '🐻‍❄️ 4. REZOLV PROBLEME', hint: 'Probleme cu înmulțirea cu 4', className: 'lf4' },
  trei1: { key: 'trei1', label: '⛄ 1. DESCOPĂR', hint: 'Cum înmulțim cu 3', className: 'lf1' },
  trei2: { key: 'trei2', label: '⛄ 2. APLIC', hint: 'Adunări repetate și înmulțiri', className: 'lf2' },
  trei3: { key: 'trei3', label: '⛄ 3. EXERSEZ', hint: 'Cu 3 / de 3 ori, triplul, factori', className: 'lf3' },
  trei4: { key: 'trei4', label: '⛄ 4. REZOLV PROBLEME', hint: 'Probleme cu înmulțirea cu 3', className: 'lf4' },
  doi1: { key: 'doi1', label: '🛷 1. DESCOPĂR', hint: 'Cum înmulțim cu 2', className: 'lf1' },
  doi2: { key: 'doi2', label: '🛷 2. APLIC', hint: 'Adunări repetate și înmulțiri', className: 'lf2' },
  doi3: { key: 'doi3', label: '🛷 3. EXERSEZ', hint: 'Cu 2 / de 2 ori, dublul, numere pare', className: 'lf3' },
  doi4: { key: 'doi4', label: '🛷 4. REZOLV PROBLEME', hint: 'Probleme cu înmulțirea cu 2', className: 'lf4' },
  eval1: { key: 'eval1', label: '📝 1. CALCULEZ', hint: 'Rezultate, factori lipsă, dublu, triplu', className: 'lf1' },
  eval2: { key: 'eval2', label: '📝 2. PROBLEME PE PAȘI', hint: 'Rezolvă problema pas cu pas', className: 'lf2' },
  eval4: { key: 'eval4', label: '📝 3. EXERSEZ ȘI REZOLV', hint: 'Factori, produse, probleme pe pași', className: 'lf3' },
  eval3: { key: 'eval3', label: '📝 4. TESTUL FINAL', hint: 'Primești calificativ: FB, B, S', className: 'lf4' },
  imp1: { key: 'imp1', label: '➗ 1. DESCOPĂR', hint: 'Împărțirea ca scădere repetată', className: 'lf1' },
  imp2: { key: 'imp2', label: '➗ 2. APLIC', hint: 'Scăderi repetate și împărțiri', className: 'lf2' },
  imp3: { key: 'imp3', label: '➗ 3. EXERSEZ', hint: 'Câtul, operația inversă înmulțirii', className: 'lf3' },
  imp4: { key: 'imp4', label: '➗ 4. REZOLV PROBLEME', hint: 'Probleme cu împărțirea', className: 'lf4' },
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
