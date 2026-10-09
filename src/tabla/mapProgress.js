import { PROBLEME_LEVEL, AVANSATE_LEVEL, LOGIC_LEVELS } from './data';

// Drumul de pe hartă: fiecare nivel se deblochează după ce îl termini pe cel dinainte.
export const LEVEL_PATH = [1, 2, 3, 4, 5, PROBLEME_LEVEL, AVANSATE_LEVEL];
// Drumul de pe Insula Isteților (probleme fără înmulțire).
export const LOGIC_PATH = LOGIC_LEVELS;

export function isLogicLevel(level) {
  return LOGIC_PATH.includes(level);
}

function pathOf(level) {
  return isLogicLevel(level) ? LOGIC_PATH : LEVEL_PATH;
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
