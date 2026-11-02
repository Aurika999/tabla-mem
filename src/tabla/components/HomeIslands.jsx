import {
  LOGIC_PATH, LESSON_PATHS, DIVISION_PATH, HALF_PATH, THIRD_PATH, QUARTER_PATH, FIFTH_PATH, DIV6_PATH, DIV7_PATH, DIV8_PATH, DIV9_PATH, isLevelDone,
} from '../mapProgress';
import { NATIONAL_LEVELS, questionCount, nationalYear, nationalTheme } from '../nationalTest';
import { REVIEW_LEVELS } from '../reviewProblems';
import InstallButton from './InstallButton';
import { Island, Waves, useMediaQuery, PHONE_QUERY } from './MapHome';
import { tr } from '../i18n';

// Prima pagină (Arena Concursului și Insula Învățării), pagina „Insula Învățării”
// (Insula Isteților, Tabla înmulțirii, Tabla împărțirii, Evaluare) și pagina
// „Tabla înmulțirii”, cu lecțiile din manual de la 2 la 9.
// Decorurile fiecărei insule, relativ la centrul ei: [emoji, dx, dy, mărime].
const DECOR = {
  recap1: [['🌲', -4, -40, 82], ['🐻', -100, 4, 32], ['🐿️', 98, 0, 30], ['🦌', 80, 26, 26], ['🚂', -82, 28, 24]],
  national: [['🎓', -4, -40, 84], ['📝', -100, 4, 32], ['🏅', 98, 0, 30], ['✏️', 80, 26, 26], ['📚', -82, 28, 24]],
  en2025: [['🌍', -4, -40, 80], ['🌴', -100, 4, 32], ['🐧', 98, 0, 30], ['📝', 80, 26, 26], ['🦢', -82, 28, 24]],
  en2025b: [['🐻‍❄️', -4, -40, 80], ['🐧', -100, 4, 32], ['🦉', 98, 0, 30], ['📝', 80, 26, 26], ['❄️', -82, 28, 24]],
  en2026: [['🏅', -4, -40, 80], ['🐶', -100, 4, 32], ['🦜', 98, 0, 30], ['📝', 80, 26, 26], ['🐰', -82, 28, 24]],
  termeni46: [['✏️', -4, -40, 80], ['➕', -100, 4, 32], ['➖', 98, 0, 30], ['❓', 80, 26, 26], ['📒', -82, 28, 24]],
  school: [['🎒', -4, -40, 84], ['📚', -100, 4, 34], ['✏️', 98, 0, 30], ['🧮', 80, 26, 26], ['📝', -82, 28, 24]],
  arena: [['🏰', -6, -40, 84], ['🚩', -105, -16, 32], ['🚩', 100, -22, 32], ['🏆', 70, 22, 28]],
  learn: [['🏫', -4, -40, 84], ['📚', -100, 6, 36], ['🧮', 98, 4, 34], ['🌳', -80, -42, 32]],
  logic: [['🧩', -4, -40, 78], ['🍬', -95, 0, 30], ['🎈', 95, -20, 32], ['🍎', -80, 26, 26]],
  lessons: [['📘', -4, -40, 78], ['🛷', -100, 0, 30], ['🐙', 95, -10, 30], ['🎈', 80, 24, 26], ['⛄', -80, 26, 24]],
  division: [['➗', -4, -40, 78], ['🌼', -95, 0, 30], ['🐞', 95, -6, 28], ['🐛', 80, 26, 24]],
  div9: [['🎯', -4, -40, 78], ['🍒', -95, 0, 30], ['📸', 95, -6, 28], ['⚽', 80, 26, 26]],
  div8: [['🐙', -4, -40, 78], ['🕷️', -95, 0, 30], ['🐚', 95, -6, 28], ['🐠', 80, 26, 26]],
  div7: [['📅', -4, -40, 78], ['📖', -95, 0, 30], ['🧸', 95, -6, 28], ['🐔', 80, 26, 26]],
  div6: [['🍬', -4, -40, 78], ['📚', -95, 0, 30], ['🎁', 95, -6, 28], ['🐱', 80, 26, 26]],
  div5: [['🏮', -4, -40, 78], ['🌷', -95, 0, 30], ['🎈', 95, -6, 28], ['🍊', 80, 26, 26]],
  div4: [['🍀', -4, -40, 78], ['🚗', -95, 0, 30], ['🐝', 95, -6, 28], ['🧺', 80, 26, 26]],
  div3: [['🐦', -4, -40, 78], ['🏠', -95, 0, 30], ['🍫', 95, -6, 28], ['🐥', 80, 26, 26]],
  div2: [['🐰', -4, -40, 78], ['🦋', -95, 0, 30], ['🌷', 95, -6, 28], ['🪺', 80, 26, 26]],
  div1: [['🌼', -4, -40, 78], ['🐞', -95, 0, 30], ['🐛', 95, -6, 28], ['➗', 80, 26, 26]],
  eval: [['📝', -4, -40, 78], ['🏆', -95, 0, 30], ['🪜', 95, -6, 28], ['✅', 80, 26, 24]],
  lesson2: [['🛷', -4, -40, 78], ['⛄', -95, 0, 30], ['🧤', 95, -6, 28], ['❄️', 80, 26, 24]],
  lesson3: [['⛄', -4, -40, 78], ['🎯', -95, 0, 30], ['❄️', 95, -6, 28], ['🧣', 80, 26, 24]],
  lesson4: [['🐻‍❄️', -4, -40, 78], ['🐧', -95, 0, 30], ['🧊', 95, -6, 28], ['🐟', 80, 26, 24]],
  lesson5: [['🖐️', -4, -40, 78], ['⭐', -95, 0, 30], ['⭐', 95, -6, 28], ['✂️', 80, 26, 24]],
  lesson6: [['🔋', -4, -40, 78], ['🍯', -95, 0, 30], ['🧅', 95, -6, 28], ['🐝', 80, 26, 24]],
  lesson7: [['🪙', -4, -40, 78], ['🚀', -95, 0, 30], ['🪐', 95, -6, 28], ['🌈', 80, 26, 24]],
  lesson8: [['🐙', -4, -40, 78], ['🐚', -95, 0, 30], ['🎂', 95, -6, 28], ['💧', 80, 26, 24]],
  lesson9: [['🎈', -4, -40, 78], ['🎉', -95, 0, 30], ['🎁', 95, -6, 28], ['⭐', 80, 26, 24]],
};

const HOME_KEYS = ['arena', 'school', 'termeni46'];
// Nivelurile „Tablei înmulțirii” sunt acum în Insula Isteților, pe dificultate.
// Exercițiile din „Evaluare” sunt acum în Insula Isteților.
const SCHOOL_KEYS = ['logic', 'lessons', 'division', 'national'];
// Lecțiile de împărțire (deocamdată una; se pot adăuga altele).
const DIVISION_KEYS = ['div1', 'div2', 'div3', 'div4', 'div5', 'div6', 'div7', 'div8', 'div9'];
const LESSON_FACTORS = [2, 3, 4, 5, 6, 7, 8, 9];
const LESSON_KEYS = LESSON_FACTORS.map(f => `lesson${f}`);

function place(key, cx, cy, rx, ry, scale = 1) {
  return {
    cx, cy, rx, ry,
    decor: DECOR[key].map(([emoji, dx, dy, size]) => [emoji, cx + dx * scale, cy + dy * scale, size * scale]),
  };
}

// Pe telefon insulele sunt mai mici, ca să încapă mai multe pe ecran.
const PHONE_STEP = 370;
function phoneIsland(key, cy) {
  return place(key, 300, cy, 150, 66, 0.9);
}

// Calculator: rânduri de câte trei insule (ultimul rând, dacă nu e plin, centrat).
// Telefon: una sub alta.
function buildLayouts(keys, top, perRow = 3) {
  if (perRow === 2) return buildTwoColumnLayouts(keys, top);
  const rows = Math.ceil(keys.length / 3);
  const lastStart = (rows - 1) * 3;
  // Patru insule: două rânduri de câte două. Altfel: rânduri de câte trei.
  if (keys.length === 4) return buildLayouts(keys, top, 2);
  const lastX = { 1: [500], 2: [337, 663], 3: [175, 500, 825] }[keys.length - lastStart];
  const colX = i => (i >= lastStart ? lastX[i - lastStart] : [175, 500, 825][i % 3]);
  const deskH = top + rows * 380;
  // Pe telefon lăsăm loc sus pentru bara cu butoane și pentru titlu.
  const phoneTop = top + 90;
  const phoneH = phoneTop - 60 + keys.length * PHONE_STEP;
  return {
    desktop: {
      W: 1000,
      H: deskH,
      islands: Object.fromEntries(keys.map((key, i) => [key, place(key, colX(i), top + Math.floor(i / 3) * 380, 140, 70)])),
      extras: [['⛵', 60, 90, 34], ['☁️', 40, 40, 30], ['🐬', 90, deskH - 160, 40], ['🐟', 130, deskH - 130, 22],
        ['🐳', 940, deskH - 60, 32], ['🐠', 660, top + 220, 24]],
    },
    phone: {
      W: 600,
      H: phoneH,
      islands: Object.fromEntries(keys.map((key, i) => [key, phoneIsland(key, phoneTop - 90 + i * PHONE_STEP)])),
      extras: [['⛵', 40, phoneTop + 150, 34], ['🐬', 470, phoneTop + 170, 44], ['🐳', 520, phoneH - 50, 32], ['☁️', 30, 40, 28]],
    },
  };
}

function buildTwoColumnLayouts(keys, top) {
  const rows = Math.ceil(keys.length / 2);
  const deskH = top + rows * 380;
  const phoneTop = top + 90;
  const phoneH = phoneTop - 60 + keys.length * PHONE_STEP;
  return {
    desktop: {
      W: 1000,
      H: deskH,
      islands: Object.fromEntries(keys.map((key, i) => [key, place(key, [300, 700][i % 2], top + Math.floor(i / 2) * 380, 150, 72)])),
      extras: [['⛵', 60, 90, 34], ['☁️', 40, 40, 30], ['🐬', 500, deskH - 170, 40], ['🐟', 540, deskH - 140, 22],
        ['🐳', 940, deskH - 60, 32], ['🐠', 500, top + 120, 24]],
    },
    phone: {
      W: 600,
      H: phoneH,
      islands: Object.fromEntries(keys.map((key, i) => [key, phoneIsland(key, phoneTop - 90 + i * PHONE_STEP)])),
      extras: [['⛵', 40, phoneTop + 150, 34], ['🐬', 470, phoneTop + 170, 44], ['🐳', 520, phoneH - 50, 32], ['☁️', 30, 40, 28]],
    },
  };
}

// Prima pagină: două insule mari, una lângă alta.
function buildHomeLayouts() {
  return {
    desktop: {
      W: 1000,
      H: 640,
      islands: {
        arena: place('arena', 175, 320, 145, 72, 1.05),
        school: place('school', 500, 320, 145, 72, 1.05),
        termeni46: place('termeni46', 825, 320, 145, 72, 1.05),
      },
      extras: [['⛵', 70, 110, 34], ['🐬', 500, 520, 42], ['🐟', 545, 555, 22], ['🐳', 940, 580, 32], ['☁️', 40, 40, 30],
        ['🐠', 120, 560, 24]],
    },
    phone: {
      W: 600,
      // Destul loc jos pentru titlul, descrierea și butonul ultimei insule.
      H: 1340,
      // Pe telefon: Insula Învățării, Arena Concursului, apoi „Află termenii necunoscuți”.
      islands: {
        school: place('school', 300, 130, 165, 74, 1.0),
        arena: place('arena', 300, 530, 165, 74, 1.0),
        termeni46: place('termeni46', 300, 930, 165, 74, 1.0),
      },
      extras: [['⛵', 50, 360, 34], ['🐬', 520, 370, 40], ['🐠', 70, 760, 30], ['🐳', 540, 1315, 30], ['☁️', 30, 30, 28]],
    },
  };
}

const LAYOUTS = {
  home: buildHomeLayouts(),
  school: buildLayouts(SCHOOL_KEYS, 300),
  lessons: buildLayouts(LESSON_KEYS, 300),
  division: buildLayouts(DIVISION_KEYS, 300),
  national: buildLayouts([...NATIONAL_LEVELS, ...REVIEW_LEVELS], 300),
};

// Titlul de sus și butonul „înapoi” pentru paginile din interiorul insulelor.
const SUBPAGES = {
  school: { title: '🎒 INSULA ÎNVĂȚĂRII', back: '← Prima pagină', greeting: 'Aici înveți! Alege: Insula Isteților, lecțiile din manual, împărțirea sau Evaluarea Națională. 🎒' },
  national: { title: '🎓 EVALUAREA NAȚIONALĂ', back: '← Insula Învățării', greeting: 'Alege un test de la Evaluarea Națională! 🎓' },
  division: { title: '➗ TABLA ÎMPĂRȚIRII', back: '← Insula Învățării', greeting: 'Aici înveți împărțirea! Alege lecția. ➗' },
  lessons: { title: '📘 TABLA ÎNMULȚIRII', back: '← Insula Învățării', greeting: 'Alege lecția! Fiecare are „📖 Reține” și exerciții din manual. 📘' },
};

function pct(value, total) {
  return `${(value / total) * 100}%`;
}

export default function HomeIslands({
  mode = 'home', name, scores, onOpenLearn, onOpenLogic, onOpenLessons, onOpenLesson, onOpenEval, onOpenSchool,
  onOpenDivision, onOpenDivisionLesson, onOpenHalfLesson, onOpenThirdLesson, onOpenQuarterLesson, onOpenFifthLesson, onOpenSixLesson, onOpenSevenLesson, onOpenEightLesson, onOpenNineLesson,
  onOpenPanel, onBack, chatUnread, onOpenNational, onOpenNationalHub,
}) {
  const isPhone = useMediaQuery(PHONE_QUERY);
  const subpage = SUBPAGES[mode];
  const layout = isPhone ? LAYOUTS[mode].phone : LAYOUTS[mode].desktop;
  const { W, H, islands } = layout;
  const logicDone = LOGIC_PATH.filter(level => isLevelDone(scores, level)).length;
  const lessonDone = factor => LESSON_PATHS[factor].filter(level => isLevelDone(scores, level)).length;
  const LESSON_CARDS = {
    2: { icon: '🛷', cta: 'two' },
    3: { icon: '⛄', cta: 'three' },
    4: { icon: '🐻‍❄️', cta: 'four' },
    5: { icon: '🖐️', cta: 'five' },
    6: { icon: '🔋', cta: 'six' },
    7: { icon: '🪙', cta: 'seven' },
    8: { icon: '🐙', cta: 'eight' },
    9: { icon: '🎈', cta: 'nine' },
  };

  const lessonsDone = LESSON_FACTORS.filter(f => lessonDone(f) === LESSON_PATHS[f].length).length;

  const lessonOnlyDone = DIVISION_PATH.filter(level => isLevelDone(scores, level)).length;
  const halfDone = HALF_PATH.filter(level => isLevelDone(scores, level)).length;
  const thirdDone = THIRD_PATH.filter(level => isLevelDone(scores, level)).length;
  const quarterDone = QUARTER_PATH.filter(level => isLevelDone(scores, level)).length;
  const fifthDone = FIFTH_PATH.filter(level => isLevelDone(scores, level)).length;
  const sixDone = DIV6_PATH.filter(level => isLevelDone(scores, level)).length;
  const sevenDone = DIV7_PATH.filter(level => isLevelDone(scores, level)).length;
  const eightDone = DIV8_PATH.filter(level => isLevelDone(scores, level)).length;
  const nineDone = DIV9_PATH.filter(level => isLevelDone(scores, level)).length;
  const divisionDone = lessonOnlyDone + halfDone + thirdDone + quarterDone + fifthDone + sixDone + sevenDone
    + eightDone + nineDone;
  const divisionTotal = DIVISION_PATH.length + HALF_PATH.length + THIRD_PATH.length + QUARTER_PATH.length
    + FIFTH_PATH.length + DIV6_PATH.length + DIV7_PATH.length + DIV8_PATH.length + DIV9_PATH.length;
  const schoolDone = logicDone + divisionDone
    + LESSON_FACTORS.reduce((sum, f) => sum + lessonDone(f), 0);
  const schoolTotal = LOGIC_PATH.length + divisionTotal
    + LESSON_FACTORS.reduce((sum, f) => sum + LESSON_PATHS[f].length, 0);

  const allCards = [
    {
      key: 'school',
      title: tr('INSULA ÎNVĂȚĂRII'),
      subtitle: tr('🎒 {schoolDone} / {schoolTotal} niveluri · isteți, lecții, împărțire, evaluare', { schoolDone, schoolTotal }),
      cta: tr('🎒 Hai să învățăm!'),
      onClick: onOpenSchool,
    },
    {
      key: 'arena',
      title: tr('ARENA CONCURSULUI'),
      subtitle: tr('Concurează cu alți jucători'),
      cta: tr('🏁 Intră în arenă'),
      onClick: () => onOpenPanel('contest'),
    },
    {
      key: 'termeni46',
      ctaClass: 'terms',
      title: tr('TERMENII NECUNOSCUȚI'),
      subtitle: scores.termeni46
        ? tr('✏️ Cel mai bun: {v0} / {v1} · fără cronometru', { v0: scores.termeni46.correct, v1: questionCount('termeni46') })
        : tr('✏️ a + 34 = 62 · {v0} exerciții · fără cronometru', { v0: questionCount('termeni46') }),
      cta: tr('✏️ Află termenii'),
      onClick: () => onOpenNational('termeni46'),
    },
    {
      key: 'national',
      ctaClass: 'national',
      title: tr('EVALUAREA NAȚIONALĂ'),
      subtitle: tr('🎓 {v0} / {v1} teste date · clasa a II-a', { v0: NATIONAL_LEVELS.filter(level => scores[level]).length, v1: NATIONAL_LEVELS.length }),
      cta: tr('🎓 Alege testul'),
      onClick: onOpenNationalHub,
    },
    {
      key: 'recap1',
      ctaClass: 'recap',
      title: tr('PROBLEME DE RECAPITULARE'),
      subtitle: scores.recap1
        ? tr('🌳 Cel mai bun: {v0} / 10 · probleme pe pași', { v0: scores.recap1.correct })
        : tr('🌳 Urși, copaci, veverițe, postere · pe pași'),
      cta: tr('🌳 Rezolvă problemele'),
      onClick: () => onOpenNational('recap1'),
    },
    // Câte o insulă pentru fiecare test de Evaluare Națională (în pagina „Evaluarea Națională”).
    ...NATIONAL_LEVELS.map(level => ({
      key: level,
      ctaClass: 'national',
      title: tr('EVALUAREA NAȚIONALĂ {v0}', { v0: nationalYear(level) }),
      subtitle: scores[level]
        ? tr('🎓 {v0} · cel mai bun: {v1} / {v2}', { v0: nationalTheme(level), v1: scores[level].correct, v2: questionCount(level) })
        : tr('🎓 {v0} · {v1} itemi', { v0: nationalTheme(level), v1: questionCount(level) }),
      cta: tr('🎓 Începe testul'),
      onClick: () => onOpenNational(level),
    })),
    {
      key: 'logic',
      title: tr('INSULA ISTEȚILOR'),
      subtitle: logicDone === LOGIC_PATH.length
        ? tr('Ai terminat toate problemele! 🏆')
        : tr('🧩 {logicDone} / {v1} niveluri · de la ușor la avansat', { logicDone, v1: LOGIC_PATH.length }),
      cta: tr('🧩 Rezolvă probleme'),
      onClick: onOpenLogic,
    },
    {
      key: 'lessons',
      title: tr('TABLA ÎNMULȚIRII'),
      subtitle: tr('📘 {lessonsDone} / {v1} lecții terminate · de la 2 la 9', { lessonsDone, v1: LESSON_FACTORS.length }),
      cta: tr('📘 Alege lecția'),
      onClick: onOpenLessons,
    },
    ...LESSON_FACTORS.map(factor => ({
      key: `lesson${factor}`,
      ctaClass: LESSON_CARDS[factor].cta,
      title: tr('ÎNMULȚIREA CU {factor}', { factor }),
      subtitle: lessonDone(factor) === LESSON_PATHS[factor].length
        ? tr('Știi înmulțirea cu {factor}! 🏆', { factor })
        : tr('{v0} {v1} / {v2} · lecția din manual', { v0: LESSON_CARDS[factor].icon, v1: lessonDone(factor), v2: LESSON_PATHS[factor].length }),
      cta: tr('{v0} Învață cu {factor}', { v0: LESSON_CARDS[factor].icon, factor }),
      onClick: () => onOpenLesson(factor),
    })),
    {
      key: 'division',
      title: tr('TABLA ÎMPĂRȚIRII'),
      subtitle: tr('➗ {divisionDone} / {divisionTotal} niveluri · lecțiile despre împărțire', { divisionDone, divisionTotal }),
      cta: tr('➗ Învață împărțirea'),
      onClick: onOpenDivision,
    },
    {
      key: 'div1',
      ctaClass: 'division',
      title: tr('ÎMPĂRȚIREA'),
      subtitle: lessonOnlyDone === DIVISION_PATH.length
        ? tr('Știi ce este împărțirea! 🏆')
        : tr('➗ {lessonOnlyDone} / {v1} · cazuri speciale, proba', { lessonOnlyDone, v1: DIVISION_PATH.length }),
      cta: tr('➗ Începe lecția'),
      onClick: onOpenDivisionLesson,
    },
    {
      key: 'div2',
      ctaClass: 'half',
      title: tr('ÎMPĂRȚIREA LA 2'),
      subtitle: halfDone === HALF_PATH.length
        ? tr('Știi împărțirea la 2! 🏆')
        : tr('✌️ {halfDone} / {v1} · jumătatea, numere pare', { halfDone, v1: HALF_PATH.length }),
      cta: tr('✌️ Începe lecția'),
      onClick: onOpenHalfLesson,
    },
    {
      key: 'div3',
      ctaClass: 'third',
      title: tr('ÎMPĂRȚIREA LA 3'),
      subtitle: thirdDone === THIRD_PATH.length
        ? tr('Știi împărțirea la 3! 🏆')
        : tr('🐦 {thirdDone} / {v1} · de 3 ori mai mic', { thirdDone, v1: THIRD_PATH.length }),
      cta: tr('🐦 Începe lecția'),
      onClick: onOpenThirdLesson,
    },
    {
      key: 'div4',
      ctaClass: 'quarter',
      title: tr('ÎMPĂRȚIREA LA 4'),
      subtitle: quarterDone === QUARTER_PATH.length
        ? tr('Știi împărțirea la 4! 🏆')
        : tr('🍀 {quarterDone} / {v1} · sfertul, de 4 ori mai mic', { quarterDone, v1: QUARTER_PATH.length }),
      cta: tr('🍀 Începe lecția'),
      onClick: onOpenQuarterLesson,
    },
    {
      key: 'div5',
      ctaClass: 'fifth',
      title: tr('ÎMPĂRȚIREA LA 5'),
      subtitle: fifthDone === FIFTH_PATH.length
        ? tr('Știi împărțirea la 5! 🏆')
        : tr('🏮 {fifthDone} / {v1} · de 5 ori mai mic', { fifthDone, v1: FIFTH_PATH.length }),
      cta: tr('🏮 Începe lecția'),
      onClick: onOpenFifthLesson,
    },
    {
      key: 'div6',
      ctaClass: 'six',
      title: tr('ÎMPĂRȚIREA LA 6'),
      subtitle: sixDone === DIV6_PATH.length
        ? tr('Știi împărțirea la 6! 🏆')
        : tr('🍬 {sixDone} / {v1} · de 6 ori mai mic', { sixDone, v1: DIV6_PATH.length }),
      cta: tr('🍬 Începe lecția'),
      onClick: onOpenSixLesson,
    },
    {
      key: 'div7',
      ctaClass: 'seven',
      title: tr('ÎMPĂRȚIREA LA 7'),
      subtitle: sevenDone === DIV7_PATH.length
        ? tr('Știi împărțirea la 7! 🏆')
        : tr('📅 {sevenDone} / {v1} · de 7 ori mai mic', { sevenDone, v1: DIV7_PATH.length }),
      cta: tr('📅 Începe lecția'),
      onClick: onOpenSevenLesson,
    },
    {
      key: 'div8',
      ctaClass: 'eight',
      title: tr('ÎMPĂRȚIREA LA 8'),
      subtitle: eightDone === DIV8_PATH.length
        ? tr('Știi împărțirea la 8! 🏆')
        : tr('🐙 {eightDone} / {v1} · de 8 ori mai mic', { eightDone, v1: DIV8_PATH.length }),
      cta: tr('🐙 Începe lecția'),
      onClick: onOpenEightLesson,
    },
    {
      key: 'div9',
      ctaClass: 'nine',
      title: tr('ÎMPĂRȚIREA LA 9'),
      subtitle: nineDone === DIV9_PATH.length
        ? tr('Știi împărțirea la 9! 🏆')
        : tr('🎯 {nineDone} / {v1} · de 9 ori mai mic', { nineDone, v1: DIV9_PATH.length }),
      cta: tr('🎯 Începe lecția'),
      onClick: onOpenNineLesson,
    },
  ];
  const keys = { home: HOME_KEYS, school: SCHOOL_KEYS, lessons: LESSON_KEYS, division: DIVISION_KEYS, national: [...NATIONAL_LEVELS, ...REVIEW_LEVELS] }[mode];
  const cards = keys.map(key => allCards.find(card => card.key === key));
  const greeting = subpage ? tr(subpage.greeting)
    : (name ? tr('Bine ai venit, {name}! Alege o insulă! 🏝️', { name }) : tr('Bine ai venit! Alege o insulă! 🏝️'));

  // Butoanele Clasament, Chat (și pe prima pagină: Despre joc, Instalează).
  // Pe telefon stau jos, într-un chenar separat, pe toate paginile cu insule.
  const panelButtons = (
    <>
      {/* Pe prima pagină: prezentarea jocului (PDF), pentru părinți și învățători. */}
      {mode === 'home' && (
        <button onClick={() => window.open(`${process.env.PUBLIC_URL}/despre-joc.pdf`, '_blank', 'noopener')}>
          <span>📄</span>{tr('Despre joc')}
        </button>
      )}
      {mode === 'home' && <InstallButton />}
      <button onClick={() => onOpenPanel('leaderboard')}><span>🏆</span>{tr('Clasament')}</button>
      <button onClick={() => onOpenPanel('chat')}>
        <span>💬</span>{tr('Chat')}
        {chatUnread > 0 && <b className="level-badge">{chatUnread}</b>}
      </button>
    </>
  );
  const navButtons = (
    <nav className={`map-side${mode === 'home' ? ' home-nav' : ''}`}>
      {subpage && isPhone && <button className="map-home-back" onClick={onBack}>{tr(subpage.back)}</button>}
      {!isPhone && panelButtons}
    </nav>
  );

  return (
    <section className={`map-home home-islands${subpage ? ' lessons-hub' : ''}`}>
      {isPhone && (
        <div className="map-mobile-owl">
          <span className="map-owl-emoji" aria-hidden="true">🦉</span>
          <div className="map-owl-bubble">{greeting}</div>
        </div>
      )}
      <div className="map-scroll home-frame">
        <div className="map-canvas home-canvas" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg className="map-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <defs>
              <linearGradient id="home-ocean" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2fb6e4" />
                <stop offset="0.55" stopColor="#1b93cf" />
                <stop offset="1" stopColor="#0f6fa8" />
              </linearGradient>
            </defs>
            <rect width={W} height={H} fill="url(#home-ocean)" />
            <Waves />
            {layout.extras.map(([emoji, x, y, size]) => (
              <text key={`${emoji}-${x}`} x={x} y={y} fontSize={size} textAnchor="middle" dominantBaseline="middle">{emoji}</text>
            ))}
            {cards.map(card => <Island key={card.key} {...islands[card.key]} />)}
            {cards.flatMap(card => islands[card.key].decor.map(([emoji, x, y, size]) => (
              <text key={`${card.key}-${emoji}-${x}`} x={x} y={y} fontSize={size} textAnchor="middle"
                dominantBaseline="middle">{emoji}</text>
            )))}
          </svg>

          {subpage && !isPhone && (
            <>
              <button className="map-home-back logic-back" onClick={onBack}>{tr(subpage.back)}</button>
              <div className="logic-title lessons-title">{tr(subpage.title)}</div>
            </>
          )}
          {/* Pe telefon butonul de întoarcere stă în bara de sus, lângă Clasament și Chat, iar titlul
              vine imediat sub bară, ca să nu fie acoperit când butoanele trec pe două rânduri. */}
          {/* Pe telefon, pe prima pagină, butoanele stau sub hartă (după insule). */}
          {!(isPhone && mode === 'home') && (
            <div className={isPhone ? 'phone-top' : undefined}>
              {navButtons}
              {subpage && isPhone && <div className="logic-title lessons-title">{tr(subpage.title)}</div>}
            </div>
          )}

          {cards.map(card => {
            const island = islands[card.key];
            return (
              <div key={card.key}>
                {/* Toată insula e clicabilă, nu doar butonul de sub ea. */}
                <button
                  className="home-island-hit"
                  style={{
                    left: pct(island.cx, W), top: pct(island.cy, H),
                    width: pct(island.rx * 2, W), height: pct(island.ry * 2.2, H),
                  }}
                  onClick={card.onClick}
                  aria-label={card.title}
                />
                <div className="home-island-sign" style={{ left: pct(island.cx, W), top: pct(island.cy + island.ry + 18, H) }}>
                  <div className={`home-island-title${card.title.length > 12 ? ' long' : ''}`}>{card.title}</div>
                  <div className="home-island-subtitle">{card.subtitle}</div>
                  <button className={`home-island-cta ${card.ctaClass || card.key}`} onClick={card.onClick}>{card.cta}</button>
                </div>
              </div>
            );
          })}

          {!isPhone && (
            <div className="map-owl home-owl">
              <div className="map-owl-bubble">{greeting}</div>
              <span className="map-owl-emoji" aria-hidden="true">🦉</span>
            </div>
          )}
        </div>
      </div>
      {/* Pe telefon, butoanele stau sub insule, într-un chenar separat, pe toate paginile. */}
      {isPhone && <div className="home-phone-nav"><nav className="map-side home-nav">{panelButtons}</nav></div>}
    </section>
  );
}
