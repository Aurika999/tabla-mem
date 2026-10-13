import {
  PROBLEME_LEVEL, AVANSATE_LEVEL, LOGIC_LEVELS, EVAL_LEVELS, DIVISION_LEVELS, TWO_LEVELS, THREE_LEVELS, FOUR_LEVELS, FIVE_LEVELS, SIX_LEVELS, SEVEN_LEVELS, EIGHT_LEVELS,
  NINE_LEVELS,
} from './data';

// Drumul de pe hartă: fiecare nivel se deblochează după ce îl termini pe cel dinainte.
export const LEVEL_PATH = [1, 2, 3, 4, 5, PROBLEME_LEVEL, AVANSATE_LEVEL];
// Drumul de pe Insula Isteților (probleme fără înmulțire).
export const LOGIC_PATH = LOGIC_LEVELS;

// Drumurile insulelor-lecție „Înmulțirea cu 5 / 6 / 7”.
export const FIVE_PATH = FIVE_LEVELS;
export const LESSON_PATHS = {
  2: TWO_LEVELS, 3: THREE_LEVELS, 4: FOUR_LEVELS, 5: FIVE_LEVELS, 6: SIX_LEVELS, 7: SEVEN_LEVELS, 8: EIGHT_LEVELS, 9: NINE_LEVELS,
};

// Cu ce număr e lecția din care face parte nivelul (5, 6, 7) sau null.
export function lessonFactorOfLevel(level) {
  const entry = Object.entries(LESSON_PATHS).find(([, path]) => path.includes(level));
  return entry ? Number(entry[0]) : null;
}

// Drumul de pe insula „Evaluare”.
export const EVAL_PATH = EVAL_LEVELS;
// Drumul lecției „Împărțirea” (din Tabla împărțirii).
export const DIVISION_PATH = DIVISION_LEVELS;

export function isLogicLevel(level) {
  return LOGIC_PATH.includes(level);
}

export function isFiveLevel(level) {
  return FIVE_PATH.includes(level);
}

// Pe ce hartă e nivelul: 'logic', 'lesson5/6/7' sau 'map' (tabla înmulțirii).
export function mapViewOf(level) {
  if (isLogicLevel(level)) return 'logic';
  if (EVAL_PATH.includes(level)) return 'eval';
  if (DIVISION_PATH.includes(level)) return 'divlesson';
  const factor = lessonFactorOfLevel(level);
  if (factor) return `lesson${factor}`;
  return 'map';
}

function pathOf(level) {
  if (isLogicLevel(level)) return LOGIC_PATH;
  if (EVAL_PATH.includes(level)) return EVAL_PATH;
  if (DIVISION_PATH.includes(level)) return DIVISION_PATH;
  const factor = lessonFactorOfLevel(level);
  if (factor) return LESSON_PATHS[factor];
  return LEVEL_PATH;
}

// scores = cel mai bun rezultat pe nivel (din useMyScores); un nivel e „terminat”
// dacă are un scor salvat, adică jucătorul a ajuns la finalul rundei.
export function isLevelDone(scores, level) {
  return Boolean(scores[level]);
}

export function isLevelUnlocked(scores, level) {
  const path = pathOf(level);
  const index = path.indexOf(level);
  return index <= 0 || isLevelDone(scores, path[index - 1]);
}

// 1–3 stele după răspunsurile corecte dintr-o rundă terminată.
export function starsForCorrect(correct) {
  if (correct >= 9) return 3;
  if (correct >= 6) return 2;
  return 1;
}

// Stelele de pe hartă: după cea mai bună rundă terminată la nivelul respectiv.
export function levelStars(scores, level) {
  if (!isLevelDone(scores, level)) return 0;
  return starsForCorrect(scores[level]?.correct ?? 0);
}

// Primul nivel deblocat și neterminat — „aici ești” pe hartă.
export function currentLevel(scores, path = LEVEL_PATH) {
  return path.find(level => !isLevelDone(scores, level) && isLevelUnlocked(scores, level))
    ?? path[path.length - 1];
}

export function previousLevel(level) {
  const path = pathOf(level);
  const index = path.indexOf(level);
  return index > 0 ? path[index - 1] : null;
}

export function nextLevelInPath(level) {
  const path = pathOf(level);
  const index = path.indexOf(level);
  return index >= 0 && index < path.length - 1 ? path[index + 1] : null;
}
