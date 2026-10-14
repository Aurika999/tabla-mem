// Date statice folosite de joc: niveluri, cuvinte pentru probleme, fructe pentru indicii.

export const PROBLEME_LEVEL = 'probleme';
export const AVANSATE_LEVEL = 'avansate';
// „Insula Isteților”: probleme fără înmulțire (adunări, scăderi, comparații).
// Insula Isteților: niveluri după dificultate (ușor → avansat).
export const LOGIC_LEVELS = ['ist1', 'ist2', 'ist3', 'ist4', 'ist5', 'ist6', 'ist7', 'ist8', 'ist9', 'ist10', 'ist11', 'ist12', 'ist13', 'ist14'];
// Nivelurile de dinainte (tabla înmulțirii 1–5, Probleme, Provocări și vechea Insulă a Isteților;
// exercițiile din „Evaluare” sunt acum tot în Insula Isteților):
// nu se mai joacă, dar scorurile obținute pe ele rămân vizibile în clasament.
export const OLD_LOGIC_LEVELS = ['logica1', 'logica2', 'logica3', 'logica4'];
// „Înmulțirea cu 5”: lecția din manual, pe secțiuni.
export const TWO_LEVELS = ['doi1', 'doi2', 'doi3', 'doi4'];
export const EVAL_LEVELS = ['eval1', 'eval2', 'eval4', 'eval3'];
// „Tabla împărțirii”: lecția „Împărțirea” (scădere repetată, operația inversă înmulțirii).
export const DIVISION_LEVELS = ['imp1', 'imp2', 'imp3', 'imp4', 'imp5', 'imp6', 'imp7', 'imp8'];
// „Împărțirea la 2” (tot în Tabla împărțirii).
export const HALF_LEVELS = ['impd1', 'impd2', 'impd3', 'impd4'];
// „Împărțirea la 3” (tot în Tabla împărțirii).
export const THIRD_LEVELS = ['impt1', 'impt2', 'impt3', 'impt4'];
// „Împărțirea la 4” (tot în Tabla împărțirii).
export const QUARTER_LEVELS = ['impq1', 'impq2', 'impq3', 'impq4'];
// „Împărțirea la 5” (tot în Tabla împărțirii).
export const FIFTH_LEVELS = ['impc1', 'impc2', 'impc3', 'impc4'];
// „Împărțirea la 6” și „Împărțirea la 7” (tot în Tabla împărțirii).
export const DIV6_LEVELS = ['impsa1', 'impsa2', 'impsa3', 'impsa4'];
export const DIV7_LEVELS = ['impse1', 'impse2', 'impse3', 'impse4'];
// „Împărțirea la 8” și „Împărțirea la 9”.
export const DIV8_LEVELS = ['impo1', 'impo2', 'impo3', 'impo4'];
export const DIV9_LEVELS = ['impn1', 'impn2', 'impn3', 'impn4'];
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
  imp5: { key: 'imp5', label: '➗ 5. ÎMPĂRȚIREA LA 10', hint: 'De 10 ori mai mic, cifra unităților 0', className: 'lf1' },
  imp6: { key: 'imp6', label: '➗ 6. CAZURI SPECIALE', hint: 'La el însuși, la 1, împărțirea lui 0', className: 'lf2' },
  imp7: { key: 'imp7', label: '➗ 7. PROBA', hint: 'Proba înmulțirii și a împărțirii', className: 'lf3' },
  imp8: { key: 'imp8', label: '➗ 8. REZOLV ȘI VERIFIC', hint: 'Probleme verificate prin proba', className: 'lf4' },
  impd1: { key: 'impd1', label: '✌️ 1. DESCOPĂR', hint: 'Jumătatea unui număr', className: 'lf1' },
  impd2: { key: 'impd2', label: '✌️ 2. APLIC', hint: 'De 2 ori mai mic, jumătatea', className: 'lf2' },
  impd3: { key: 'impd3', label: '✌️ 3. EXERSEZ', hint: 'Câtul, numere pare, cu 2 / de 2 ori', className: 'lf3' },
  impd4: { key: 'impd4', label: '✌️ 4. REZOLV PROBLEME', hint: 'Probleme cu împărțirea la 2', className: 'lf4' },
  impt1: { key: 'impt1', label: '🐦 1. DESCOPĂR', hint: 'Căsuțe și afișe: împărțim la 3', className: 'lf1' },
  impt2: { key: 'impt2', label: '🐦 2. APLIC', hint: 'De 3 ori mai mic, numere care lipsesc', className: 'lf2' },
  impt3: { key: 'impt3', label: '🐦 3. EXERSEZ', hint: 'Câtul, compară, micșorează de 3 ori', className: 'lf3' },
  impt4: { key: 'impt4', label: '🐦 4. REZOLV PROBLEME', hint: 'Probleme cu împărțirea la 3', className: 'lf4' },
  impq1: { key: 'impq1', label: '🍀 1. DESCOPĂR', hint: 'Roți și păsări: împărțim la 4', className: 'lf1' },
  impq2: { key: 'impq2', label: '🍀 2. APLIC', hint: 'De 4 ori mai mic, jumătatea și sfertul', className: 'lf2' },
  impq3: { key: 'impq3', label: '🍀 3. EXERSEZ', hint: 'Câtul, compară, sfertul, tabele', className: 'lf3' },
  impq4: { key: 'impq4', label: '🍀 4. REZOLV PROBLEME', hint: 'Probleme cu împărțirea la 4', className: 'lf4' },
  impc1: { key: 'impc1', label: '🏮 1. DESCOPĂR', hint: 'Lampioane și lalele: împărțim la 5', className: 'lf1' },
  impc2: { key: 'impc2', label: '🏮 2. APLIC', hint: 'De 5 ori mai mic, numere care se împart la 5', className: 'lf2' },
  impc3: { key: 'impc3', label: '🏮 3. EXERSEZ', hint: 'Câtul, compară, ordinea operațiilor', className: 'lf3' },
  impc4: { key: 'impc4', label: '🏮 4. REZOLV PROBLEME', hint: 'Probleme cu împărțirea la 5', className: 'lf4' },
  impsa1: { key: 'impsa1', label: '🍬 1. DESCOPĂR', hint: 'Pagini și bomboane: împărțim la 6', className: 'lf1' },
  impsa2: { key: 'impsa2', label: '🍬 2. APLIC', hint: 'De 6 ori mai mic, verificarea', className: 'lf2' },
  impsa3: { key: 'impsa3', label: '🍬 3. EXERSEZ', hint: 'Compară, ordinea operațiilor', className: 'lf3' },
  impsa4: { key: 'impsa4', label: '🍬 4. REZOLV PROBLEME', hint: 'Probleme cu împărțirea la 6', className: 'lf4' },
  impse1: { key: 'impse1', label: '📅 1. DESCOPĂR', hint: 'Zilele săptămânii: împărțim la 7', className: 'lf1' },
  impse2: { key: 'impse2', label: '📅 2. APLIC', hint: 'De 7 ori mai mic, verificarea', className: 'lf2' },
  impse3: { key: 'impse3', label: '📅 3. EXERSEZ', hint: 'Compară, ordinea operațiilor', className: 'lf3' },
  impse4: { key: 'impse4', label: '📅 4. REZOLV PROBLEME', hint: 'Probleme cu împărțirea la 7', className: 'lf4' },
  impo1: { key: 'impo1', label: '🐙 1. DESCOPĂR', hint: 'Caracatițe și bomboane: împărțim la 8', className: 'lf1' },
  impo2: { key: 'impo2', label: '🐙 2. APLIC', hint: 'De 8 ori mai mic, verificarea', className: 'lf2' },
  impo3: { key: 'impo3', label: '🐙 3. EXERSEZ', hint: 'Compară, ordinea operațiilor', className: 'lf3' },
  impo4: { key: 'impo4', label: '🐙 4. REZOLV PROBLEME', hint: 'Probleme cu împărțirea la 8', className: 'lf4' },
  impn1: { key: 'impn1', label: '🎯 1. DESCOPĂR', hint: 'Cireșe și fotografii: împărțim la 9', className: 'lf1' },
  impn2: { key: 'impn2', label: '🎯 2. APLIC', hint: 'De 9 ori mai mic, verificarea', className: 'lf2' },
  impn3: { key: 'impn3', label: '🎯 3. EXERSEZ', hint: 'Compară, ordinea operațiilor', className: 'lf3' },
  impn4: { key: 'impn4', label: '🎯 4. REZOLV PROBLEME', hint: 'Probleme cu împărțirea la 9', className: 'lf4' },
  ist1: { key: 'ist1', label: '➕ 1. ADUNĂRI ȘI SCĂDERI', hint: '🟢 Ușor · probleme până la 20', className: 'lg1' },
  ist2: { key: 'ist2', label: '✖️ 2. ÎNMULȚIRI UȘOARE', hint: '🟢 Ușor · până la 5 × 5', className: 'lg2' },
  ist3: { key: 'ist3', label: '💰 3. MAI MULT, MAI PUȚIN', hint: '🟡 Mediu · bani, vârste — până la 50', className: 'lg3' },
  ist4: { key: 'ist4', label: '✖️ 4. TABLA PÂNĂ LA 10', hint: '🟡 Mediu · până la 10 × 10', className: 'lg4' },
  ist5: { key: 'ist5', label: '📖 5. PROBLEME CU ÎNMULȚIRE', hint: '🟡 Mediu · grupe, pachete, rânduri', className: 'lg1' },
  ist6: { key: 'ist6', label: '📝 6. CALCULEZ', hint: '🟡 Mediu · rezultate, factori lipsă, dublu, triplu', className: 'lg2' },
  ist7: { key: 'ist7', label: '🧠 7. PROBLEME ÎN DOI PAȘI', hint: '🟠 Greu · ore, șiruri — până la 100', className: 'lg3' },
  ist8: { key: 'ist8', label: '🔟 8. ÎNMULȚIRI CU 11 ȘI 12', hint: '🟠 Greu · până la 12 × 12', className: 'lg4' },
  ist9: { key: 'ist9', label: '📒 9. EXERSEZ CA ÎN MANUAL', hint: '🟠 Greu · factori, adevărat sau fals', className: 'lg1' },
  ist10: { key: 'ist10', label: '🪜 10. PROBLEME PE PAȘI', hint: '🟠 Greu · rezolvi problema pas cu pas', className: 'lg2' },
  ist11: { key: 'ist11', label: '🤖 11. EXERSEZ ȘI REZOLV', hint: '🟠 Greu · factori, produse, probleme pe pași', className: 'lg3' },
  ist12: { key: 'ist12', label: '💪 12. ÎNMULȚIRI MARI', hint: '🔴 Avansat · de la 6 × 6 la 12 × 12', className: 'lg4' },
  ist13: { key: 'ist13', label: '🏆 13. PROVOCĂRI', hint: '🔴 Avansat · probleme cu mai mulți pași', className: 'lg1' },
  ist14: { key: 'ist14', label: '🏔️ 14. TESTUL FINAL', hint: '🔴 Avansat · primești calificativ: FB, B, S', className: 'lg2' },
  recap1: { key: 'recap1', label: '🌳 PROBLEME DE RECAPITULARE', hint: 'Urși, copaci, veverițe, postere · pe pași', className: 'lg4' },
  en2025: { key: 'en2025', label: '🎓 EVALUAREA NAȚIONALĂ 2025', hint: 'Clasa a II-a · Medii de viață', className: 'lg2' },
  en2025b: { key: 'en2025b', label: '🎓 EVALUAREA NAȚIONALĂ 2025', hint: 'Clasa a II-a · Animale polare', className: 'lg3' },
  en2026: { key: 'en2026', label: '🎓 EVALUAREA NAȚIONALĂ 2026', hint: 'Clasa a II-a · Animale de companie', className: 'lg1' },
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
