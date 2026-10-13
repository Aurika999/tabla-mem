import { LEVELS } from '../data';
import {
  LEVEL_PATH, LOGIC_PATH, LESSON_PATHS, EVAL_PATH, DIVISION_PATH, HALF_PATH, THIRD_PATH, QUARTER_PATH, FIFTH_PATH, DIV6_PATH, DIV7_PATH, DIV8_PATH, DIV9_PATH, isLevelDone, currentLevel,
} from '../mapProgress';
import { Island, Waves, useMediaQuery, PHONE_QUERY } from './MapHome';

// Prima pagină (Arena Concursului și Insula Învățării), pagina „Insula Învățării”
// (Învață, Insula Isteților, Înmulțirea pe rând, Evaluare) și pagina
// „Înmulțirea pe rând”, cu lecțiile din manual de la 2 la 9.
// Decorurile fiecărei insule, relativ la centrul ei: [emoji, dx, dy, mărime].
const DECOR = {
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

const HOME_KEYS = ['arena', 'school'];
const SCHOOL_KEYS = ['learn', 'logic', 'lessons', 'division', 'eval'];
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
  const phoneH = phoneTop + 60 + keys.length * 410;
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
      islands: Object.fromEntries(keys.map((key, i) => [key, place(key, 300, phoneTop - 50 + i * 410, 230, 102, 1.35)])),
      extras: [['⛵', 40, phoneTop + 150, 34], ['🐬', 470, phoneTop + 170, 44], ['🐳', 520, phoneH - 50, 32], ['☁️', 30, 40, 28]],
    },
  };
}

function buildTwoColumnLayouts(keys, top) {
  const rows = Math.ceil(keys.length / 2);
  const deskH = top + rows * 380;
  const phoneTop = top + 90;
  const phoneH = phoneTop + 60 + keys.length * 410;
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
      islands: Object.fromEntries(keys.map((key, i) => [key, place(key, 300, phoneTop - 50 + i * 410, 230, 102, 1.35)])),
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
      islands: { arena: place('arena', 280, 320, 190, 92, 1.3), school: place('school', 720, 320, 190, 92, 1.3) },
      extras: [['⛵', 70, 110, 34], ['🐬', 500, 520, 42], ['🐟', 545, 555, 22], ['🐳', 940, 580, 32], ['☁️', 40, 40, 30],
        ['🐠', 120, 560, 24]],
    },
    phone: {
      W: 600,
      H: 1000,
      islands: { arena: place('arena', 300, 220, 230, 102, 1.4), school: place('school', 300, 700, 230, 102, 1.4) },
      extras: [['⛵', 40, 470, 34], ['🐬', 480, 490, 44], ['🐳', 520, 960, 32], ['☁️', 30, 40, 28]],
    },
  };
}

const LAYOUTS = {
  home: buildHomeLayouts(),
  school: buildLayouts(SCHOOL_KEYS, 300),
  lessons: buildLayouts(LESSON_KEYS, 300),
  division: buildLayouts(DIVISION_KEYS, 300),
};

// Titlul de sus și butonul „înapoi” pentru paginile din interiorul insulelor.
const SUBPAGES = {
  school: { title: '🎒 INSULA ÎNVĂȚĂRII', back: '← Prima pagină', greeting: 'Aici înveți! Alege: tabla înmulțirii, lecțiile din manual, împărțirea, probleme de gândire sau evaluarea. 🎒' },
  division: { title: '➗ TABLA ÎMPĂRȚIRII', back: '← Insula Învățării', greeting: 'Aici înveți împărțirea! Alege lecția. ➗' },
  lessons: { title: '📘 ÎNMULȚIREA PE RÂND', back: '← Insula Învățării', greeting: 'Alege lecția! Fiecare are „📖 Reține” și exerciții din manual. 📘' },
};

function pct(value, total) {
  return `${(value / total) * 100}%`;
}

export default function HomeIslands({
  mode = 'home', name, scores, onOpenLearn, onOpenLogic, onOpenLessons, onOpenLesson, onOpenEval, onOpenSchool,
  onOpenDivision, onOpenDivisionLesson, onOpenHalfLesson, onOpenThirdLesson, onOpenQuarterLesson, onOpenFifthLesson, onOpenSixLesson, onOpenSevenLesson, onOpenEightLesson, onOpenNineLesson,
  onOpenPanel, onBack, chatUnread,
}) {
  const isPhone = useMediaQuery(PHONE_QUERY);
  const subpage = SUBPAGES[mode];
  const layout = isPhone ? LAYOUTS[mode].phone : LAYOUTS[mode].desktop;
  const { W, H, islands } = layout;
  const doneCount = LEVEL_PATH.filter(level => isLevelDone(scores, level)).length;
  const current = currentLevel(scores);
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

  const evalDone = EVAL_PATH.filter(level => isLevelDone(scores, level)).length;
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
  const schoolDone = doneCount + logicDone + evalDone + divisionDone
    + LESSON_FACTORS.reduce((sum, f) => sum + lessonDone(f), 0);
  const schoolTotal = LEVEL_PATH.length + LOGIC_PATH.length + EVAL_PATH.length + divisionTotal
    + LESSON_FACTORS.reduce((sum, f) => sum + LESSON_PATHS[f].length, 0);

  const allCards = [
    {
      key: 'school',
      title: 'INSULA ÎNVĂȚĂRII',
      subtitle: `🎒 ${schoolDone} / ${schoolTotal} niveluri · tabla înmulțirii, lecții, probleme, evaluare`,
      cta: '🎒 Hai să învățăm!',
      onClick: onOpenSchool,
    },
    {
      key: 'arena',
      title: 'ARENA CONCURSULUI',
      subtitle: 'Concurează cu alți jucători',
      cta: '🏁 Intră în arenă',
      onClick: () => onOpenPanel('contest'),
    },
    {
      key: 'learn',
      title: 'TABLA ÎNMULȚIRII',
      subtitle: doneCount === LEVEL_PATH.length
        ? 'Ai terminat toate nivelurile! 🏆'
        : `⭐ ${doneCount} / ${LEVEL_PATH.length} niveluri · urmează ${LEVELS[current].label}`,
      cta: '📚 Exersează',
      onClick: onOpenLearn,
    },
    {
      key: 'logic',
      title: 'INSULA ISTEȚILOR',
      subtitle: logicDone === LOGIC_PATH.length
        ? 'Ai terminat toate problemele! 🏆'
        : `🧩 ${logicDone} / ${LOGIC_PATH.length} niveluri · probleme de gândire`,
      cta: '🧩 Rezolvă probleme',
      onClick: onOpenLogic,
    },
    {
      key: 'lessons',
      title: 'ÎNMULȚIREA PE RÂND',
      subtitle: `📘 ${lessonsDone} / ${LESSON_FACTORS.length} lecții terminate · de la 2 la 9`,
      cta: '📘 Alege lecția',
      onClick: onOpenLessons,
    },
    ...LESSON_FACTORS.map(factor => ({
      key: `lesson${factor}`,
      ctaClass: LESSON_CARDS[factor].cta,
      title: `ÎNMULȚIREA CU ${factor}`,
      subtitle: lessonDone(factor) === LESSON_PATHS[factor].length
        ? `Știi înmulțirea cu ${factor}! 🏆`
        : `${LESSON_CARDS[factor].icon} ${lessonDone(factor)} / ${LESSON_PATHS[factor].length} · lecția din manual`,
      cta: `${LESSON_CARDS[factor].icon} Învață cu ${factor}`,
      onClick: () => onOpenLesson(factor),
    })),
    {
      key: 'division',
      title: 'TABLA ÎMPĂRȚIRII',
      subtitle: `➗ ${divisionDone} / ${divisionTotal} niveluri · lecțiile despre împărțire`,
      cta: '➗ Învață împărțirea',
      onClick: onOpenDivision,
    },
    {
      key: 'div1',
      ctaClass: 'division',
      title: 'ÎMPĂRȚIREA',
      subtitle: lessonOnlyDone === DIVISION_PATH.length
        ? 'Știi ce este împărțirea! 🏆'
        : `➗ ${lessonOnlyDone} / ${DIVISION_PATH.length} · scădere repetată, inversa înmulțirii`,
      cta: '➗ Începe lecția',
      onClick: onOpenDivisionLesson,
    },
    {
      key: 'div2',
      ctaClass: 'half',
      title: 'ÎMPĂRȚIREA LA 2',
      subtitle: halfDone === HALF_PATH.length
        ? 'Știi împărțirea la 2! 🏆'
        : `✌️ ${halfDone} / ${HALF_PATH.length} · jumătatea, numere pare`,
      cta: '✌️ Începe lecția',
      onClick: onOpenHalfLesson,
    },
    {
      key: 'div3',
      ctaClass: 'third',
      title: 'ÎMPĂRȚIREA LA 3',
      subtitle: thirdDone === THIRD_PATH.length
        ? 'Știi împărțirea la 3! 🏆'
        : `🐦 ${thirdDone} / ${THIRD_PATH.length} · de 3 ori mai mic`,
      cta: '🐦 Începe lecția',
      onClick: onOpenThirdLesson,
    },
    {
      key: 'div4',
      ctaClass: 'quarter',
      title: 'ÎMPĂRȚIREA LA 4',
      subtitle: quarterDone === QUARTER_PATH.length
        ? 'Știi împărțirea la 4! 🏆'
        : `🍀 ${quarterDone} / ${QUARTER_PATH.length} · sfertul, de 4 ori mai mic`,
      cta: '🍀 Începe lecția',
      onClick: onOpenQuarterLesson,
    },
    {
      key: 'div5',
      ctaClass: 'fifth',
      title: 'ÎMPĂRȚIREA LA 5',
      subtitle: fifthDone === FIFTH_PATH.length
        ? 'Știi împărțirea la 5! 🏆'
        : `🏮 ${fifthDone} / ${FIFTH_PATH.length} · de 5 ori mai mic`,
      cta: '🏮 Începe lecția',
      onClick: onOpenFifthLesson,
    },
    {
      key: 'div6',
      ctaClass: 'six',
      title: 'ÎMPĂRȚIREA LA 6',
      subtitle: sixDone === DIV6_PATH.length
        ? 'Știi împărțirea la 6! 🏆'
        : `🍬 ${sixDone} / ${DIV6_PATH.length} · de 6 ori mai mic`,
      cta: '🍬 Începe lecția',
      onClick: onOpenSixLesson,
    },
    {
      key: 'div7',
      ctaClass: 'seven',
      title: 'ÎMPĂRȚIREA LA 7',
      subtitle: sevenDone === DIV7_PATH.length
        ? 'Știi împărțirea la 7! 🏆'
        : `📅 ${sevenDone} / ${DIV7_PATH.length} · de 7 ori mai mic`,
      cta: '📅 Începe lecția',
      onClick: onOpenSevenLesson,
    },
    {
      key: 'div8',
      ctaClass: 'eight',
      title: 'ÎMPĂRȚIREA LA 8',
      subtitle: eightDone === DIV8_PATH.length
        ? 'Știi împărțirea la 8! 🏆'
        : `🐙 ${eightDone} / ${DIV8_PATH.length} · de 8 ori mai mic`,
      cta: '🐙 Începe lecția',
      onClick: onOpenEightLesson,
    },
    {
      key: 'div9',
      ctaClass: 'nine',
      title: 'ÎMPĂRȚIREA LA 9',
      subtitle: nineDone === DIV9_PATH.length
        ? 'Știi împărțirea la 9! 🏆'
        : `🎯 ${nineDone} / ${DIV9_PATH.length} · de 9 ori mai mic`,
      cta: '🎯 Începe lecția',
      onClick: onOpenNineLesson,
    },
    {
      key: 'eval',
      title: 'EVALUARE',
      subtitle: `📝 ${EVAL_PATH.filter(level => isLevelDone(scores, level)).length} / ${EVAL_PATH.length} · recapitulare cu calificativ`,
      cta: '📝 Dă evaluarea',
      onClick: onOpenEval,
    },
  ];
  const keys = { home: HOME_KEYS, school: SCHOOL_KEYS, lessons: LESSON_KEYS, division: DIVISION_KEYS }[mode];
  const cards = keys.map(key => allCards.find(card => card.key === key));
  const greeting = subpage ? subpage.greeting : `Bine ai venit${name ? `, ${name}` : ''}! Alege o insulă! 🏝️`;

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

          {subpage && (
            <>
              {/* Pe telefon butonul de întoarcere stă în bara de sus, lângă Clasament și Chat. */}
              {!isPhone && <button className="map-home-back logic-back" onClick={onBack}>{subpage.back}</button>}
              <div className="logic-title lessons-title">{subpage.title}</div>
            </>
          )}
          <nav className="map-side">
            {subpage && isPhone && <button className="map-home-back" onClick={onBack}>{subpage.back}</button>}
            <button onClick={() => onOpenPanel('leaderboard')}><span>🏆</span>Clasament</button>
            <button onClick={() => onOpenPanel('chat')}>
              <span>💬</span>Chat
              {chatUnread > 0 && <b className="level-badge">{chatUnread}</b>}
            </button>
          </nav>

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
    </section>
  );
}
