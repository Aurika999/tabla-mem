// „Insula Isteților”: paisprezece insule, de la ușor la avansat. Fiecare insulă are un singur fel
// de exerciții (adunări și scăderi, înmulțiri, probleme…), toate de aceeași dificultate.
import { buildLogicProblem } from './logicProblems';
import { buildWordProblem } from './multiplicationProblems';
import { buildAdvancedProblem } from './advancedProblems';
import { buildEvalProblem } from './evaluationProblems';
import { makeAnswers } from './data';

export const SMART_LEVELS = ['ist1', 'ist2', 'ist3', 'ist4', 'ist5', 'ist6', 'ist7', 'ist8', 'ist9', 'ist10', 'ist11', 'ist12', 'ist13', 'ist14'];
// Insula la care, la final, primești și calificativ (ca la testul de la școală).
export const GRADED_SMART_LEVELS = ['ist14'];

const BADGES = {
  ist1: '➕ Adunări și scăderi · 🟢 Ușor',
  ist2: '✖️ Înmulțiri ușoare · 🟢 Ușor',
  ist3: '💰 Mai mult, mai puțin · 🟡 Mediu',
  ist4: '✖️ Tabla până la 10 · 🟡 Mediu',
  ist5: '📖 Probleme cu înmulțire · 🟡 Mediu',
  ist6: '📝 Calculez · 🟡 Mediu',
  ist7: '🧠 Probleme în doi pași · 🟠 Greu',
  ist8: '🔟 Înmulțiri cu 11 și 12 · 🟠 Greu',
  ist9: '📒 Exersez ca în manual · 🟠 Greu',
  ist10: '🪜 Probleme pe pași · 🟠 Greu',
  ist11: '🤖 Exersez și rezolv · 🟠 Greu',
  ist12: '💪 Înmulțiri mari · 🔴 Avansat',
  ist13: '🏆 Provocări · 🔴 Avansat',
  ist14: '🏔️ Testul final · 🔴 Avansat',
};

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// O înmulțire din tabla înmulțirii: a din [amin, amax], b din [bmin, bmax], în orice ordine.
function mult(amin, amax, bmin, bmax) {
  return () => {
    const a = randInt(amin, amax); const b = randInt(bmin, bmax);
    return Math.random() < 0.5 ? { kind: 'mult', a, b } : { kind: 'mult', a: b, b: a };
  };
}

// O problemă cu înmulțire („3 pachete a câte 5 creioane”), cu factorii pentru explicație.
function wordProblem() {
  const wp = buildWordProblem();
  return { text: wp.text, answer: wp.answer, choices: makeAnswers(wp.answer), factors: wp.factors };
}

const logic = level => () => buildLogicProblem(level);
// Exercițiile din fosta insulă „Evaluare” (recapitularea din manual).
const evaluation = level => () => buildEvalProblem(level);

// Sursa exercițiilor pentru fiecare insulă.
const SOURCES = {
  ist1: [logic('logica1')], // adunări și scăderi
  ist2: [mult(1, 5, 1, 5)], // înmulțiri ușoare
  ist3: [logic('logica2')], // mai mult, mai puțin
  ist4: [mult(1, 5, 6, 10), mult(6, 10, 1, 10)], // tabla până la 10
  ist5: [wordProblem], // probleme cu înmulțire
  ist6: [evaluation('eval1')], // calculez
  ist7: [logic('logica3')], // probleme în doi pași
  ist8: [mult(11, 12, 1, 12)], // înmulțiri cu 11 și 12
  ist9: [logic('logica4')], // exersez ca în manual
  ist10: [evaluation('eval2')], // probleme pe pași
  ist11: [evaluation('eval4')], // exersez și rezolv
  ist12: [mult(6, 12, 6, 12)], // înmulțiri mari
  ist13: [buildAdvancedProblem], // provocări
  ist14: [evaluation('eval3')], // testul final
};

// Româna cere „de” după numerele care se termină în 00 sau 20–99: „20 de mere”, „31 de pasageri”
// (dar „13 mere”, „105 mere”). Problemele mai vechi nu-l puneau, așa că îl adăugăm aici.
const NOT_NOUNS = new Set(['și', 'sau', 'la', 'din', 'în', 'decât', 'cu', 'pe', 'iar', 'apoi', 'este', 'sunt', 'a', 'are',
  'cm', 'm', 'kg', 'l', 'de', 'dintre', 'ori', 'ca', 'unei', 'unui', 'mai', 'pentru', 'după', 'fiecare', 'se']);
function needsDe(n) {
  const lastTwo = n % 100;
  return n >= 20 && (lastTwo === 0 || lastTwo >= 20);
}
function addDe(text) {
  return text.replace(/(^|[^\d:])(\d+) ([a-zăâîșț]+)/g, (match, before, num, word, offset) => (
    needsDe(Number(num)) && !NOT_NOUNS.has(word) && !/ora\s*$/.test(text.slice(0, offset + before.length))
      ? `${before}${num} de ${word}` : match
  ));
}

export function isSmartLevel(level) {
  return SMART_LEVELS.includes(level);
}

export function buildSmartProblem(level) {
  const q = pick(SOURCES[level])();
  return { ...q, ...(q.text ? { text: addDe(q.text) } : {}), badge: BADGES[level] };
}
