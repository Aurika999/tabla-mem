import { PROBLEME_LEVEL, AVANSATE_LEVEL } from './data';

// Drumul de pe hartă: fiecare nivel se deblochează după ce îl termini pe cel dinainte.
export const LEVEL_PATH = [1, 2, 3, 4, 5, PROBLEME_LEVEL, AVANSATE_LEVEL];

// scores = cel mai bun rezultat pe nivel (din useMyScores); un nivel e „terminat”
// dacă are un scor salvat, adică jucătorul a ajuns la finalul rundei.
export function isLevelDone(scores, level) {
  return Boolean(scores[level]);
}

export function isLevelUnlocked(scores, level) {
  const index = LEVEL_PATH.indexOf(level);
  return index <= 0 || isLevelDone(scores, LEVEL_PATH[index - 1]);
}

// 1–3 stele după răspunsurile corecte din cea mai bună rundă.
export function levelStars(scores, level) {
  const correct = scores[level]?.correct ?? 0;
  if (!isLevelDone(scores, level)) return 0;
  if (correct >= 9) return 3;
  if (correct >= 6) return 2;
  return 1;
}

// Primul nivel deblocat și neterminat — „aici ești” pe hartă.
export function currentLevel(scores) {
  return LEVEL_PATH.find(level => !isLevelDone(scores, level) && isLevelUnlocked(scores, level))
    ?? LEVEL_PATH[LEVEL_PATH.length - 1];
}

export function previousLevel(level) {
  const index = LEVEL_PATH.indexOf(level);
  return index > 0 ? LEVEL_PATH[index - 1] : null;
}
