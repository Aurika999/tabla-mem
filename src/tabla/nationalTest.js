import { tr } from './i18n';
// Testele „Evaluarea Națională la finalul clasei a II-a” la Matematică și Explorarea mediului:
// 2026 („Animale de companie”, 18 itemi) și cele două din 2025 („Medii de viață” și „Animale polare”),
// fiecare cu toți itemii,
// în ordinea și cu punctajul din test. Itemii la care elevul scrie rezolvarea sunt împărțiți
// pe pași, cu variante de răspuns.

export const NATIONAL_LEVELS = ['en2026', 'en2025', 'en2025b'];

const ROUND_LENGTH = 10;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Tabelul cu animalele îngrijite la adăpost (apare la itemii care folosesc numerele lui).
const ANIMALS_TABLE = {
  type: 'table',
  caption: 'Animalele îngrijite la adăpost în ultimul an',
  rows: [['🐶', 'câini', 176], ['🐱', 'pisici', 139], ['🐰', 'iepuri', 85], ['🦜', 'papagali', 206]],
};

const PRICES_TABLE = {
  type: 'table',
  caption: 'Prețurile lucrurilor pentru Azorel',
  rows: [['🦮', 'Zgardă', '5 lei'], ['🪢', 'Lesă', '15 lei'], ['🥣', 'Castron', '13 lei'], ['🧶', 'Păturică', '34 lei']],
};

const POSTER = { type: 'poster', title: ['ADOPTĂ', 'UN', 'PRIETEN!'], cells: ['🐱', '🐶', '🐰', '🦜🦜'] };
const SHAPES = { type: 'shapes', items: [['circle', '🦜'], ['rectangle', '🐱'], ['triangle', '🐰'], ['square', '🐶']] };

const step = (question, answer, choices) => ({ question, answer, choices: shuffle(choices) });

const ITEMS_2026 = [
  // 1. (5p.)
  {
    points: 5,
    text: 'ANIMALE DE COMPANIE. Radu, Maria, Ionuț și Dana, elevi în clasa a II-a, ajută ca voluntari la un adăpost de animale. '
      + 'Maria le-a spus colegilor de ce au nevoie animalele pentru a trăi. Care sunt nevoile de bază ale animalelor?',
    answer: 'B. apă, aer și hrană',
    choices: ['A. aer, căldură și hrană', 'B. apă, aer și hrană', 'C. apă, aer și sol hrănitor', 'D. apă, lumină și aer'],
    explanation: 'Animalele au nevoie de apă, aer și hrană. Solul hrănitor și lumina sunt nevoile plantelor.',
    visual: ANIMALS_TABLE,
  },
  // 2. (5p.)
  {
    points: 5,
    text: 'Radu a comparat numărul pisicilor cu numărul câinilor pe care i-au îngrijit copiii. Ce semn pui? 139 ○ 176',
    answer: '<',
    choices: ['<', '>', '='],
    explanation: 'Comparăm sutele (1 = 1), apoi zecile: 3 < 7, deci 139 < 176.',
    visual: ANIMALS_TABLE,
  },
  // 3. (8p.) — rezolvarea scrisă, pe pași.
  {
    points: 8,
    text: 'Dana a calculat câte animale au îngrijit în total cei patru prieteni în ultimul an. Calculează și tu!',
    steps: [
      step('Câini și pisici: 176 + 139 = ?', 315, [315, 305, 215, 325]),
      step('Adaugă iepurii: 315 + 85 = ?', 400, [400, 390, 410, 300]),
      step('Adaugă papagalii: 400 + 206 = ?', 606, [606, 616, 506, 604]),
    ],
    explanation: '176 + 139 = 315; 315 + 85 = 400; 400 + 206 = 606. În total au îngrijit 606 animale.',
    visual: ANIMALS_TABLE,
  },
  // 4. (5p.)
  {
    points: 5,
    text: 'Ionuț a observat că la adăpost au fost îngrijiți 206 papagali. Care sunt vecinii acestui număr?',
    answer: 'B. 205 și 207',
    choices: ['A. 205 și 206', 'B. 205 și 207', 'C. 204 și 205', 'D. 206 și 207'],
    explanation: 'Vecinii unui număr sunt numărul dinaintea lui și cel de după el: 205 și 207.',
  },
  // 5. (5p.)
  {
    points: 5,
    text: 'Cei patru copii au discutat despre modul în care se înmulțesc animalele de care au avut grijă. Care animal se înmulțește prin ouă?',
    answer: 'C. papagalul',
    choices: ['A. câinele', 'B. iepurele', 'C. papagalul', 'D. pisica'],
    explanation: 'Păsările, deci și papagalul, se înmulțesc prin ouă. Câinele, iepurele și pisica nasc pui vii.',
  },
  // 6. (6p.) — verificarea prin operația inversă.
  {
    points: 6,
    text: 'Dana a calculat câți papagali și iepuri au fost în total la adăpost: 206 + 85 = 291. Verifică tu, prin operație inversă, dacă ea a calculat corect.',
    steps: [
      step('Adunarea se verifică prin scădere: 291 − 85 = ?', 206, [206, 216, 196, 106]),
      step('Am obținut primul termen. A calculat Dana corect?', 'Da, corect', ['Da, corect', 'Nu, greșit']),
    ],
    explanation: 'Verificare: 291 − 85 = 206, adică primul termen. Dana a calculat corect.',
    visual: ANIMALS_TABLE,
  },
  // 7. (7p.) — adunare repetată.
  {
    points: 7,
    text: 'Într-o zi, Radu a avut grijă de 4 iepurași, așa că a adus câte 3 morcovi pentru fiecare iepuraș. Câți morcovi a adus Radu în total? Calculează prin adunare repetată de termeni egali.',
    steps: [
      step('Ce adunare repetată scrii?', '3 + 3 + 3 + 3', ['3 + 3 + 3 + 3', '4 + 4 + 4', '3 + 3 + 3', '4 + 3']),
      step('3 + 3 + 3 + 3 = ?', 12, [12, 7, 9, 15]),
    ],
    explanation: 'Fiecare dintre cei 4 iepurași primește 3 morcovi: 3 + 3 + 3 + 3 = 12 morcovi.',
    picture: { icon: '🥕', groups: 4, per: 3, holder: '🐰' },
  },
  // 8. (5p.)
  {
    points: 5,
    text: 'Maria a îngrijit papagalii din 6 colivii. În fiecare colivie erau câte 3 papagali. Câți papagali a îngrijit Maria în total?',
    answer: 'D. 18',
    choices: ['A. 3', 'B. 6', 'C. 9', 'D. 18'],
    explanation: '6 colivii cu câte 3 papagali: 6 × 3 = 18 papagali.',
  },
  // 9. (7p.) — scădere repetată.
  {
    points: 7,
    text: 'Ionuț a avut 20 de biscuiți, pe care i-a împărțit în mod egal câinilor care se jucau în curte. Fiecare câine a primit câte 4 biscuiți. Câți câini se jucau în curte? Calculează prin scădere repetată.',
    steps: [
      step('Ce scădere repetată scrii?', '20 − 4 − 4 − 4 − 4 − 4 = 0',
        ['20 − 4 − 4 − 4 − 4 − 4 = 0', '20 − 5 − 5 − 5 − 5 = 0', '20 − 4 = 16', '20 − 4 − 4 − 4 = 8']),
      step('De câte ori ai scăzut 4? Atâția câini erau.', 5, [5, 4, 16, 6]),
    ],
    explanation: '20 − 4 − 4 − 4 − 4 − 4 = 0. Am scăzut de 5 ori câte 4, deci erau 5 câini (20 : 4 = 5).',
  },
  // 10. (5p.)
  {
    points: 5,
    text: 'Cei patru copii au realizat un afiș pentru adăpost. Cu ce figură geometrică se aseamănă rama afișului?',
    answer: 'B. dreptunghi',
    choices: ['A. cerc', 'B. dreptunghi', 'C. pătrat', 'D. triunghi'],
    explanation: 'Rama are 4 laturi, două lungi și două scurte, deci se aseamănă cu un dreptunghi.',
    visual: POSTER,
  },
  // 11. (5p.)
  {
    points: 5,
    text: 'Afișul a atras atenția unui băiețel care îndrăgește papagalii. În ce parte a imaginii se află cei doi papagali?',
    answer: 'A. în dreapta jos',
    choices: ['A. în dreapta jos', 'B. în dreapta sus', 'C. în stânga jos', 'D. în stânga sus'],
    explanation: 'Papagalii sunt pe rândul de jos, în partea dreaptă: în dreapta jos.',
    visual: POSTER,
  },
  // 12. (5p.)
  {
    points: 5,
    text: 'Castroanele cu mâncare au fost așezate în fața fiecărui animal, după o regulă: 🐶 🐱 🐰 🐶 🐱 🐰 🐶 … Ce animale urmează în șir?',
    answer: 'D. 🐱 🐰',
    choices: ['A. 🐶 🐰', 'B. 🐰 🐱', 'C. 🐱 🐶', 'D. 🐱 🐰'],
    explanation: 'Regula se repetă: câine, pisică, iepure. După câine urmează pisica, apoi iepurele.',
  },
  // 13. (5p.)
  {
    points: 5,
    text: 'Într-o zi, la adăpost au ajuns 15 iepurași. Aceștia erau așezați, în mod egal, în 5 cuști. Câți iepurași erau într-o cușcă?',
    answer: 'A. 3',
    choices: ['A. 3', 'B. 10', 'C. 15', 'D. 20'],
    explanation: '15 iepurași împărțiți în mod egal în 5 cuști: 15 : 5 = 3 iepurași într-o cușcă.',
  },
  // 14. (6p.) — verificarea prin operația inversă.
  {
    points: 6,
    text: 'Dana a vrut să știe cu cât este mai mare numărul câinilor decât numărul pisicilor: 176 − 139 = 37. Verifică tu, prin operație inversă, dacă ea a calculat corect.',
    steps: [
      step('Scăderea se verifică prin adunare: 37 + 139 = ?', 176, [176, 166, 186, 167]),
      step('Am obținut descăzutul. A calculat Dana corect?', 'Da, corect', ['Da, corect', 'Nu, greșit']),
    ],
    explanation: 'Verificare: 37 + 139 = 176, adică descăzutul. Dana a calculat corect.',
    visual: ANIMALS_TABLE,
  },
  // 15. (5p.)
  {
    points: 5,
    text: 'Sâmbătă, colegii celor patru copii au venit la adăpost. Ei au sosit la ora 10:30 🕥 și au stat acolo timp de 3 ore. La ce oră au plecat?',
    answer: 'B. ora 13:30',
    choices: ['A. ora 13:00', 'B. ora 13:30', 'C. ora 14:00', 'D. ora 14:30'],
    explanation: '10:30 + 3 ore = 13:30 (11:30, 12:30, 13:30).',
  },
  // 16. (3p.)
  {
    points: 3,
    text: 'Copiii au așezat pe ușa căsuței fiecărui animal câte o plăcuță. Ce formă are plăcuța pentru căsuța iepurașului?',
    answer: 'triunghi',
    choices: ['cerc', 'dreptunghi', 'triunghi', 'pătrat'],
    explanation: 'Plăcuța iepurașului are 3 laturi și 3 colțuri: are formă de triunghi.',
    visual: SHAPES,
  },
  // 17. (5p.)
  {
    points: 5,
    text: 'Radu a măsurat distanța de la căsuța iepurașului până la căsuța papagalilor. Cu ce unitate de măsură a măsurat distanța?',
    answer: 'D. metrul',
    choices: ['A. gramul', 'B. kilogramul', 'C. litrul', 'D. metrul'],
    explanation: 'Distanțele (lungimile) se măsoară în metri. Gramul și kilogramul sunt pentru masă, litrul pentru lichide.',
  },
  // 18. (8p.)
  {
    points: 8,
    text: 'Radu a adoptat un câțeluș, pe Azorel. Vrea să-i cumpere o zgardă, o lesă, două castroane și o păturică. Radu are în pușculiță 80 de lei. Îi ajung banii să cumpere tot ce își dorește?',
    steps: [
      step('Cât costă cele două castroane? 13 + 13 = ?', 26, [26, 23, 16, 36]),
      step('Cât costă tot? 5 + 15 + 26 + 34 = ?', 80, [80, 70, 67, 90]),
      step('Radu are 80 de lei. Îi ajung banii?', 'Da, îi ajung exact',
        ['Da, îi ajung exact', 'Nu, îi lipsesc bani', 'Da, îi mai rămân 13 lei']),
    ],
    explanation: 'Două castroane: 13 + 13 = 26 de lei. Totul: 5 + 15 + 26 + 34 = 80 de lei. Da, îi ajung banii, exact cât are în pușculiță.',
    visual: PRICES_TABLE,
  },
];

// ================= Evaluarea Națională 2025: „Medii de viață” =================
const DRAWINGS_TABLE = {
  type: 'table',
  caption: 'Numărul desenelor alese pentru fiecare mediu de viață',
  rows: [['🌳', 'Pădurea', 173], ['🏜️', 'Deșertul', 87], ['🦢', 'Delta Dunării', 95], ['🐧', 'Polul Sud', 102]],
};

const ITEMS_2025 = [
  // 1. (5p.)
  {
    points: 5,
    text: 'MEDII DE VIAȚĂ. De Ziua Mondială a Mediului (5 iunie), elevii clasei a II-a organizează o expoziție cu desene. '
      + 'Ana, David, Miruna și Tudor așază desenele în patru grupe, după mediul de viață. '
      + 'Ana a comparat numărul desenelor pentru Pădurea cu cele pentru Polul Sud. Ce semn pui? 173 ○ 102',
    answer: '>',
    choices: ['<', '=', '>'],
    explanation: 'Comparăm sutele (1 = 1), apoi zecile: 7 > 0, deci 173 > 102.',
    visual: DRAWINGS_TABLE,
  },
  // 2. (20p.)
  {
    points: 20,
    text: 'David a calculat suma dintre numărul desenelor alese pentru Deșert și cele alese pentru Delta Dunării. Calculează și tu!',
    steps: [
      step('Ce operație scrii?', '87 + 95', ['87 + 95', '95 − 87', '173 + 102', '87 + 102']),
      step('87 + 95 = ?', 182, [182, 172, 192, 183]),
    ],
    explanation: 'Suma înseamnă adunare: 87 + 95 = 182 de desene.',
    visual: DRAWINGS_TABLE,
  },
  // 3. (10p.) — adunare repetată.
  {
    points: 10,
    text: 'Tudor a observat că pe o planșă pentru Deșert erau desenați mai mulți palmieri, ca în imagine. Câți palmieri erau în total? Calculează prin adunare repetată de termeni egali.',
    steps: [
      step('Ce adunare repetată scrii?', '4 + 4 + 4 + 4', ['4 + 4 + 4 + 4', '4 + 4 + 4', '4 + 4', '4 × 4 × 4']),
      step('4 + 4 + 4 + 4 = ?', 16, [16, 12, 8, 20]),
    ],
    explanation: 'Sunt 4 grupe a câte 4 palmieri: 4 + 4 + 4 + 4 = 16 palmieri.',
    picture: { icon: '🌴', groups: 4, per: 4 },
  },
  // 4. (5p.)
  {
    points: 5,
    text: 'Miruna le-a spus colegilor că un pinguin poate mânca, într-o zi, 3 kg de pește. Câte kg de pește poate mânca un pinguin în 7 zile?',
    answer: 'D. 21 kg',
    choices: ['A. 3 kg', 'B. 4 kg', 'C. 10 kg', 'D. 21 kg'],
    explanation: '7 zile câte 3 kg: 7 × 3 = 21 kg de pește.',
  },
  // 5. (12p.) — scădere repetată.
  {
    points: 12,
    text: 'Ana a aranjat pe panouri 28 de desene cu animale de la Polul Sud. Pe fiecare panou erau câte 7 desene. Câte panouri a folosit Ana? Calculează prin scăderea repetată a aceluiași număr.',
    steps: [
      step('Ce scădere repetată scrii?', '28 − 7 − 7 − 7 − 7 = 0',
        ['28 − 7 − 7 − 7 − 7 = 0', '28 − 4 − 4 − 4 − 4 = 12', '28 − 7 = 21', '28 − 7 − 7 − 7 = 7']),
      step('De câte ori ai scăzut 7? Atâtea panouri a folosit.', 4, [4, 7, 21, 3]),
    ],
    explanation: '28 − 7 − 7 − 7 − 7 = 0. Am scăzut de 4 ori câte 7, deci Ana a folosit 4 panouri (28 : 7 = 4).',
  },
  // 6. (5p.)
  {
    points: 5,
    text: 'David a realizat un desen cu animale din Delta Dunării. Cu ce figură geometrică se aseamănă foaia pe care a desenat?',
    answer: 'B. dreptunghi',
    choices: ['A. cerc', 'B. dreptunghi', 'C. pătrat', 'D. triunghi'],
    explanation: 'Foaia are 4 laturi: două lungi și două mai scurte. Se aseamănă cu un dreptunghi.',
    visual: { type: 'poster', wide: true, cells: ['🌅', '🌿', '🦢', '🦆'] },
  },
  // 7. (5p.)
  {
    points: 5,
    text: 'Miruna a așezat imagini cu păsări din Delta Dunării după o regulă: barză, rață, pelican, lebădă, barză, rață, pelican, lebădă, barză, … Ce imagini urmează în șir?',
    answer: 'D. rață, pelican',
    choices: ['A. pelican, lebădă', 'B. rață, lebădă', 'C. barză, rață', 'D. rață, pelican'],
    explanation: 'Regula se repetă: barză, rață, pelican, lebădă. După barză urmează rața, apoi pelicanul.',
  },
  // 8. (5p.)
  {
    points: 5,
    text: 'Câți pereți vor fi acoperiți cu 24 de desene din Deșert, știind că pe fiecare perete încap câte 6 desene?',
    answer: 'A. 4',
    choices: ['A. 4', 'B. 10', 'C. 18', 'D. 30'],
    explanation: '24 de desene, câte 6 pe un perete: 24 : 6 = 4 pereți (6 + 6 + 6 + 6 = 24).',
  },
  // 9. (5p.)
  {
    points: 5,
    text: 'Tudor a realizat afișul pentru Pădure. În ce parte a afișului se află iepurașii?',
    answer: 'B. în dreapta jos',
    choices: ['A. în dreapta sus', 'B. în dreapta jos', 'C. în stânga sus', 'D. în stânga jos'],
    explanation: 'Iepurașii sunt pe rândul de jos, în partea dreaptă a afișului: în dreapta jos.',
    visual: { type: 'poster', wide: true, cells: ['🐻', '🦌', '🦊', '🐰🐰'] },
  },
  // 10. (3p.)
  {
    points: 3,
    text: 'Copiii au lipit pe cartonașe de forme diferite câte o imagine cu un animal. Ce formă are cartonașul cu imaginea cămilei, animalul care trăiește în Deșert?',
    answer: 'cerc',
    choices: ['pătrat', 'triunghi', 'cerc', 'dreptunghi'],
    explanation: 'Cartonașul cămilei este rotund, fără colțuri: are formă de cerc.',
    visual: { type: 'shapes', items: [['square', '🐧'], ['triangle', '🦊'], ['circle', '🐫'], ['rectangle-wide', '🦢']] },
  },
  // 11. (5p.)
  {
    points: 5,
    text: 'Părinții pot vizita expoziția zilnic, între orele 18:30 și 20:30. Câte ore au la dispoziție, în fiecare zi?',
    answer: 'A. 2 ore',
    choices: ['A. 2 ore', 'B. 3 ore', 'C. 18 ore', 'D. 20 ore'],
    explanation: 'De la 18:30 la 19:30 este o oră, de la 19:30 la 20:30 încă o oră: în total 2 ore.',
  },
  // 12. (20p.)
  {
    points: 20,
    text: 'Pe fiecare desen din expoziție a fost lipită o steluță cu numele elevului. Organizatorii au pregătit 450 de steluțe. Sunt suficiente steluțe pentru toate desenele alese pentru cele patru medii de viață?',
    steps: [
      step('Pădurea și Deșertul: 173 + 87 = ?', 260, [260, 250, 160, 270]),
      step('Adaugă Delta Dunării: 260 + 95 = ?', 355, [355, 345, 365, 255]),
      step('Adaugă Polul Sud: 355 + 102 = ?', 457, [457, 447, 467, 357]),
      step('Sunt 457 de desene și 450 de steluțe. Sunt suficiente?', 'Nu, lipsesc 7 steluțe',
        ['Nu, lipsesc 7 steluțe', 'Da, ajung exact', 'Da, rămân 7 steluțe']),
    ],
    explanation: '173 + 87 + 95 + 102 = 457 de desene. 457 > 450, deci nu sunt suficiente: lipsesc 457 − 450 = 7 steluțe.',
    visual: DRAWINGS_TABLE,
  },
];

// ================= Evaluarea Națională 2025: „Animale de la Polul Sud și de la Polul Nord” =================
const PHOTOS_TABLE = {
  type: 'table',
  caption: 'Pozele cu animale din zonele polare strânse de fiecare copil',
  rows: [['👧', 'Iulia', 145], ['👦', 'Sorin', 116], ['👧', 'Simona', 73], ['👦', 'Adrian', 92]],
};

const FOOD_TABLE = {
  type: 'table',
  caption: 'Câte kg de hrană consumă animalul într-o zi',
  rows: [['🐇', 'Iepure polar', '2 kg'], ['🦊', 'Vulpe polară', '5 kg'], ['🐺', 'Lup polar', '10 kg'], ['🐻‍❄️', 'Urs polar', '70 kg']],
};

const ITEMS_2025_POLAR = [
  // 1. (5p.)
  {
    points: 5,
    text: 'ANIMALE DE LA POLUL SUD ȘI DE LA POLUL NORD. Iulia, Sorin, Simona și Adrian au strâns poze cu animale din zonele polare. '
      + 'Sorin a comparat numărul pozelor lui cu numărul pozelor strânse de Iulia. Ce semn pui? 116 ○ 145',
    answer: '<',
    choices: ['<', '>', '='],
    explanation: 'Comparăm sutele (1 = 1), apoi zecile: 1 < 4, deci 116 < 145.',
    visual: PHOTOS_TABLE,
  },
  // 2. (20p.)
  {
    points: 20,
    text: 'Simona a calculat diferența dintre cel mai mare și cel mai mic număr de poze strânse de cei patru copii. Calculează și tu!',
    steps: [
      step('Care este cel mai mare număr de poze?', 145, [145, 116, 92, 73]),
      step('Care este cel mai mic număr de poze?', 73, [73, 92, 116, 145]),
      step('Diferența: 145 − 73 = ?', 72, [72, 82, 62, 218]),
    ],
    explanation: 'Cel mai mare număr este 145 (Iulia), cel mai mic este 73 (Simona). Diferența: 145 − 73 = 72 de poze.',
    visual: PHOTOS_TABLE,
  },
  // 3. (10p.) — adunare repetată.
  {
    points: 10,
    text: 'Pentru un joc, Adrian a așezat câteva poze cu pinguini, ca în imagine. Câte poze a așezat Adrian în total? Calculează prin adunare repetată de termeni egali.',
    steps: [
      step('Ce adunare repetată scrii?', '4 + 4 + 4 + 4', ['4 + 4 + 4 + 4', '4 + 4 + 4', '4 + 4', '4 × 4 × 4']),
      step('4 + 4 + 4 + 4 = ?', 16, [16, 12, 8, 20]),
    ],
    explanation: 'Sunt 4 grupe a câte 4 pinguini: 4 + 4 + 4 + 4 = 16 poze.',
    picture: { icon: '🐧', groups: 4, per: 4 },
  },
  // 4. (5p.)
  {
    points: 5,
    text: 'Sorin le-a spus colegilor că lupul polar poate mânca, într-o zi, 10 kg de carne. Câte kg de carne poate mânca un lup polar în 4 zile?',
    answer: 'D. 40 kg',
    choices: ['A. 6 kg', 'B. 10 kg', 'C. 14 kg', 'D. 40 kg'],
    explanation: '4 zile câte 10 kg: 4 × 10 = 40 kg de carne.',
  },
  // 5. (12p.) — scădere repetată.
  {
    points: 12,
    text: 'Iulia le-a pregătit colegilor 35 de poze cu animale de la Polul Sud și de 5 ori mai puține poze cu animale de la Polul Nord. Câte poze cu animale de la Polul Nord a pregătit Iulia? Calculează prin scădere repetată.',
    steps: [
      step('„De 5 ori mai puține” înseamnă 35 : 5. Ce scădere repetată scrii?', '35 − 5 − 5 − 5 − 5 − 5 − 5 − 5 = 0',
        ['35 − 5 − 5 − 5 − 5 − 5 − 5 − 5 = 0', '35 − 5 − 5 − 5 − 5 − 5 = 10', '35 − 5 = 30', '35 + 5 + 5 = 45']),
      step('De câte ori ai scăzut 5? Atâtea poze de la Polul Nord.', 7, [7, 5, 30, 6]),
    ],
    explanation: '35 − 5 − 5 − 5 − 5 − 5 − 5 − 5 = 0. Am scăzut de 7 ori câte 5, deci Iulia a pregătit 7 poze (35 : 5 = 7).',
  },
  // 6. (5p.)
  {
    points: 5,
    text: 'Adrian le-a arătat colegilor o planșă cu informații despre iepurele polar. Cu ce figură geometrică se aseamănă planșa?',
    answer: 'B. dreptunghi',
    choices: ['A. cerc', 'B. dreptunghi', 'C. pătrat', 'D. triunghi'],
    explanation: 'Planșa are 4 laturi: două lungi și două mai scurte. Se aseamănă cu un dreptunghi.',
    visual: { type: 'poster', wide: true, cells: ['🐇', '📝'] },
  },
  // 7. (5p.)
  {
    points: 5,
    text: 'Simona a așezat timbre cu animale de la Polul Nord după o regulă: 🐻‍❄️ 🦉 🦊 🐇 🐻‍❄️ 🦉 🦊 🐇 🐻‍❄️ … Ce timbre urmează în șir?',
    answer: 'B. 🦉 🦊',
    choices: ['A. 🐻‍❄️ 🦉', 'B. 🦉 🦊', 'C. 🦊 🐇', 'D. 🐻‍❄️ 🐇'],
    explanation: 'Regula se repetă: urs polar, bufniță, vulpe, iepure. După urs urmează bufnița, apoi vulpea.',
  },
  // 8. (5p.)
  {
    points: 5,
    text: 'Sorin a ales 24 de poze cu animalele preferate de la Polul Nord și a dat câte 6 poze colegilor săi. Câți copii au primit poze?',
    answer: 'A. 4 copii',
    choices: ['A. 4 copii', 'B. 6 copii', 'C. 18 copii', 'D. 30 copii'],
    explanation: '24 de poze, câte 6 la fiecare copil: 24 : 6 = 4 copii (6 + 6 + 6 + 6 = 24).',
  },
  // 9. (5p.)
  {
    points: 5,
    text: 'Iulia a așezat într-o fotografie patru timbre cu animale de la Polul Nord. În ce parte a fotografiei se află iepurele polar?',
    answer: 'D. în stânga sus',
    choices: ['A. în dreapta jos', 'B. în dreapta sus', 'C. în stânga jos', 'D. în stânga sus'],
    explanation: 'Iepurele polar este pe rândul de sus, în partea stângă: în stânga sus.',
    visual: { type: 'poster', wide: true, cells: ['🐇', '🦊', '🦉', '🐺'] },
  },
  // 10. (3p.)
  {
    points: 3,
    text: 'Fiecare copil a lipit câte o imagine cu animalul preferat pe cartonașe de forme diferite. Ce formă are cartonașul cu imaginea iepurelui polar?',
    answer: 'cerc',
    choices: ['dreptunghi', 'pătrat', 'triunghi', 'cerc'],
    explanation: 'Cartonașul iepurelui polar este rotund, fără colțuri: are formă de cerc.',
    visual: { type: 'shapes', items: [['rectangle', '🦉'], ['square', '🐻‍❄️'], ['triangle', '🦊'], ['circle', '🐇']] },
  },
  // 11. (5p.)
  {
    points: 5,
    text: 'Simona a strâns poze cu animale, într-o zi, de la ora 9:00 până la ora 11:00. Câte ore a strâns ea poze în acea zi?',
    answer: 'A. 2 ore',
    choices: ['A. 2 ore', 'B. 3 ore', 'C. 11 ore', 'D. 20 ore'],
    explanation: 'De la 9:00 la 10:00 este o oră, de la 10:00 la 11:00 încă o oră: în total 2 ore.',
  },
  // 12. (20p.)
  {
    points: 20,
    text: 'Copiii consideră că, în fiecare zi, pentru 2 iepuri polari, 1 vulpe polară, 1 urs polar și 1 lup polar este nevoie de 80 de kg de hrană. Crezi că au dreptate?',
    steps: [
      step('Hrana pentru 2 iepuri polari: 2 + 2 = ?', 4, [4, 2, 6, 8]),
      step('Toată hrana: 4 + 5 + 70 + 10 = ?', 89, [89, 87, 80, 99]),
      step('Au dreptate copiii că trebuie 80 de kg?', 'Nu, trebuie 89 kg', ['Nu, trebuie 89 kg', 'Da, trebuie 80 kg', 'Nu, trebuie 70 kg']),
    ],
    explanation: '2 iepuri: 2 + 2 = 4 kg. În total: 4 + 5 + 70 + 10 = 89 kg. Copiii nu au dreptate: este nevoie de 89 de kg, nu de 80.',
    visual: FOOD_TABLE,
  },
];

// ================= Exercițiul 46: „Află termenii necunoscuți” =================
// Itemi simpli: [ecuația, necunoscuta, răspunsul, greșeli tipice, regula].
// Itemi cu paranteză sau cu trei termeni: întâi calculăm ce se poate, apoi aflăm necunoscuta.
const SUM_RULE = 'Un termen necunoscut al adunării se află scăzând din sumă termenul cunoscut.';
const SUB_START_RULE = 'Descăzutul se află adunând diferența cu scăzătorul.';
const SUB_MINUS_RULE = 'Scăzătorul se află scăzând diferența din descăzut.';

const simple = (eq, x, answer, mistakes, rule, check) => ({
  points: 1,
  get text() { return tr('Află termenul necunoscut: {eq}. Cât este {x}?', { eq, x }); },
  answer,
  choices: shuffle([answer, ...mistakes]),
  get explanation() { return `${tr(rule)} ${tr(check)}`; },
});

const twoStep = (eq, first, firstAnswer, firstMistakes, second, answer, mistakes, rule, check) => ({
  points: 1,
  get text() { return tr('Află termenul necunoscut: {eq}', { eq }); },
  steps: [
    step(first, firstAnswer, [firstAnswer, ...firstMistakes]),
    step(second, answer, [answer, ...mistakes]),
  ],
  get explanation() { return `${tr(rule)} ${tr(check)}`; },
});

const ITEMS_TERMS = [
  simple('a + 34 = 62', 'a', 28, [96, 38, 18], SUM_RULE, 'a = 62 − 34 = 28. Verificare: 28 + 34 = 62.'),
  simple('b − 68 = 19', 'b', 87, [49, 77, 97], SUB_START_RULE, 'b = 19 + 68 = 87. Verificare: 87 − 68 = 19.'),
  simple('28 + c = 91', 'c', 63, [119, 73, 53], SUM_RULE, 'c = 91 − 28 = 63. Verificare: 28 + 63 = 91.'),
  simple('45 − d = 26', 'd', 19, [71, 29, 21], SUB_MINUS_RULE, 'd = 45 − 26 = 19. Verificare: 45 − 19 = 26.'),
  twoStep('x − (23 + 48) = 18', 'Calculează paranteza: 23 + 48 = ?', 71, [61, 25, 81],
    'Acum x − 71 = 18. x = ?', 89, [53, 79, 99], SUB_START_RULE, 'x = 18 + 71 = 89. Verificare: 89 − 71 = 18.'),
  twoStep('y − (78 − 64) = 47', 'Calculează paranteza: 78 − 64 = ?', 14, [24, 142, 16],
    'Acum y − 14 = 47. y = ?', 61, [33, 51, 71], SUB_START_RULE, 'y = 47 + 14 = 61. Verificare: 61 − 14 = 47.'),
  twoStep('m + (43 − 27) = 52', 'Calculează paranteza: 43 − 27 = ?', 16, [26, 70, 14],
    'Acum m + 16 = 52. m = ?', 36, [68, 46, 26], SUM_RULE, 'm = 52 − 16 = 36. Verificare: 36 + 16 = 52.'),
  twoStep('n − (56 − 25) = 59', 'Calculează paranteza: 56 − 25 = ?', 31, [81, 41, 21],
    'Acum n − 31 = 59. n = ?', 90, [28, 80, 100], SUB_START_RULE, 'n = 59 + 31 = 90. Verificare: 90 − 31 = 59.'),
  twoStep('63 − 49 + f = 71', 'Calculează întâi 63 − 49 = ?', 14, [24, 112, 16],
    'Acum 14 + f = 71. f = ?', 57, [85, 67, 47], SUM_RULE, 'f = 71 − 14 = 57. Verificare: 63 − 49 + 57 = 14 + 57 = 71.'),
  twoStep('91 − 36 − g = 27', 'Calculează întâi 91 − 36 = ?', 55, [65, 127, 45],
    'Acum 55 − g = 27. g = ?', 28, [82, 38, 18], SUB_MINUS_RULE, 'g = 55 − 27 = 28. Verificare: 91 − 36 − 28 = 55 − 28 = 27.'),
  twoStep('t − (28 − 9) = 16', 'Calculează paranteza: 28 − 9 = ?', 19, [37, 29, 21],
    'Acum t − 19 = 16. t = ?', 35, [3, 25, 45], SUB_START_RULE, 't = 16 + 19 = 35. Verificare: 35 − 19 = 16.'),
  simple('r − 37 = 26', 'r', 63, [11, 53, 73], SUB_START_RULE, 'r = 26 + 37 = 63. Verificare: 63 − 37 = 26.'),
];
// Videourile sunt scoase deocamdată de pe site (fișierele rămân în public/video/termeni-1…12.mp4).
// Ca să apară din nou, înlocuiește „];” de mai sus cu rândurile de mai jos:
// Fiecare exercițiu are un video: învățătoarea îl rezolvă la tablă (public/video/termeni-1…12.mp4).
// ].map((item, i) => ({ ...item, video: tr('termeni-{v0}.mp4', { v0: i + 1 }) }));

// ================= Scăderi în coloană: „Calculează.” (exercițiul 2 din manual) =================
// Scăderea se scrie pe verticală, ca în caiet: unitățile sub unități, zecile sub zeci.
// Greșelile tipice: scazi cifra mică din cea mare fără să te împrumuți, sau uiți zecea împrumutată.
function columnItem(a, b, letter) {
  const answer = a - b;
  const [ta, ua, tb, ub] = [Math.floor(a / 10), a % 10, Math.floor(b / 10), b % 10];
  const borrow = ua < ub;
  const noBorrow = Math.abs(ta - tb) * 10 + Math.abs(ua - ub);
  const mistakes = [...new Set([noBorrow, answer + 10, answer - 10, answer + 1, answer - 1, answer + 2])]
    .filter(n => n > 0 && n !== answer && n < 100)
    .slice(0, 3);
  return {
    points: 1,
    get text() { return tr('Calculează în coloană: {a} − {b}', { a, b }); },
    visual: { type: 'column', a, b, op: '−', letter },
    answer,
    choices: shuffle([answer, ...mistakes]),
    get explanation() {
      const units = borrow
        ? tr('Unitățile: {ua} − {ub} nu se poate, așa că împrumutăm o zece: {ua10} − {ub} = {ru}.', { ua, ub, ua10: ua + 10, ru: ua + 10 - ub })
        : tr('Unitățile: {ua} − {ub} = {ru}.', { ua, ub, ru: ua - ub });
      const tens = borrow
        ? tr('Zecile: {ta} − 1 (zecea împrumutată) − {tb} = {rt}.', { ta, tb, rt: ta - 1 - tb })
        : tr('Zecile: {ta} − {tb} = {rt}.', { ta, tb, rt: ta - tb });
      return `${units} ${tens} ${tr('Rezultatul: {c}. Verificare: {c} + {b} = {a}.', { c: answer, a, b })}`;
    },
  };
}


// ================= Scăderi în coloană cu numere de 3 cifre („A. Calculează:”) =================
// Explicația merge pe coloane, de la unități spre sute, cu împrumutul de la coloana din stânga.
const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const PLACES = ['Unitățile', 'Zecile', 'Sutele'];
const FROM_PLACE = ['de la zeci', 'de la sute', 'de la mii'];

function columnSubItem(a, b) {
  const answer = a - b;
  return {
    points: 1,
    get text() { return tr('Calculează în coloană: {a} − {b}', { a, b }); },
    visual: { type: 'column', a, b, op: '−' },
    answer,
    choices: [answer],
    get explanation() {
      const steps = [];
      let borrowed = 0;
      for (let i = 0; i < String(a).length; i++) {
        const x = Math.floor(a / 10 ** i) % 10;
        const y = Math.floor(b / 10 ** i) % 10;
        const top = x - borrowed;
        const borrow = top < y;
        const vars = { place: PLACES[i], x, y, x1: top, x10: top + 10, r: (borrow ? top + 10 : top) - y, next: FROM_PLACE[i] };
        // Un 0 nu are ce da împrumut: se împrumută el însuși de la coloana din stânga (10 − 1 = 9).
        if (borrowed && x === 0) steps.push(tr('{place}: 0 nu poate da împrumut, așa că ne împrumutăm 1 {next}: 10 − 1 (dat împrumut) = 9; 9 − {y} = {r}.', vars));
        else if (borrowed && borrow) steps.push(tr('{place}: {x} − 1 (dat împrumut) = {x1}; {x1} − {y} nu se poate, așa că ne împrumutăm 1 {next}: {x10} − {y} = {r}.', vars));
        else if (borrowed) steps.push(tr('{place}: {x} − 1 (dat împrumut) − {y} = {r}.', vars));
        else if (borrow) steps.push(tr('{place}: {x} − {y} nu se poate, așa că ne împrumutăm 1 {next}: {x10} − {y} = {r}.', vars));
        else steps.push(tr('{place}: {x} − {y} = {r}.', vars));
        borrowed = borrow ? 1 : 0;
      }
      return `${steps.join(' ')} ${tr('Rezultatul: {c}. Verificare: {c} + {b} = {a}.', { c: answer, a, b })}`;
    },
  };
}

// Prima rundă: cele 4 scăderi din carte, apoi încă 6 noi; la fiecare rundă nouă, toate 10 sunt noi.
const SUB3_BOOK = [[258, 137], [478, 76], [729, 717], [567, 562]];
function randomSub3() {
  const a = randInt(200, 999);
  // Uneori scăzătorul are doar 2 cifre (ca 478 − 76).
  const b = Math.random() < 0.25 ? randInt(11, 99) : randInt(100, a - 1);
  return [a, b];
}
function buildSub3Round(first) {
  const pairs = first ? [...SUB3_BOOK] : [];
  while (pairs.length < 10) {
    const [a, b] = randomSub3();
    if (!pairs.some(([x, y]) => x === a && y === b)) pairs.push([a, b]);
  }
  return pairs.map(([a, b]) => columnSubItem(a, b));
}
let sub3Rounds = 0;
let ITEMS_SUB3 = buildSub3Round(true);

// ================= Adunări în coloană cu numere de 3 cifre („C. Efectuează:”) =================
// Pe coloane, de la unități spre sute: când suma unei coloane trece de 9, scriem unitățile ei
// și ținem minte 1 pentru coloana din stânga.
function columnAdd3Item(a, b) {
  const answer = a + b;
  return {
    points: 1,
    get text() { return tr('Calculează în coloană: {a} + {b}', { a, b }); },
    visual: { type: 'column', a, b, op: '+' },
    answer,
    choices: [answer],
    get explanation() {
      const steps = [];
      let carried = 0;
      for (let i = 0; i < String(answer).length && i < PLACES.length; i++) {
        const x = Math.floor(a / 10 ** i) % 10;
        const y = Math.floor(b / 10 ** i) % 10;
        const s = x + y + carried;
        const vars = { place: PLACES[i], x, y, s, u: s % 10 };
        if (carried && s >= 10) steps.push(tr('{place}: {x} + {y} + 1 (ținut minte) = {s}: scriem {u} și ținem minte 1.', vars));
        else if (carried) steps.push(tr('{place}: {x} + {y} + 1 (ținut minte) = {s}.', vars));
        else if (s >= 10) steps.push(tr('{place}: {x} + {y} = {s}: scriem {u} și ținem minte 1.', vars));
        else steps.push(tr('{place}: {x} + {y} = {s}.', vars));
        carried = s >= 10 ? 1 : 0;
      }
      return `${steps.join(' ')} ${tr('Rezultatul: {c}. Verificare: {c} − {b} = {a}.', { c: answer, a, b })}`;
    },
  };
}

// Prima rundă: cele 4 adunări din carte, apoi încă 6 noi; la fiecare rundă nouă, toate 10 sunt noi.
// Suma rămâne cel mult 999, ca rezultatul să aibă tot 3 cifre.
const ADD3_BOOK = [[648, 234], [421, 59], [808, 8], [375, 116]];
function randomAdd3() {
  const a = randInt(100, 899);
  const r = Math.random();
  // Uneori al doilea număr are 2 cifre sau doar una (ca 421 + 59 și 808 + 8).
  const b = r < 0.15 ? randInt(2, 9) : r < 0.35 ? randInt(11, 99) : randInt(100, 999 - a);
  return a + b <= 999 ? [a, b] : [a, 999 - a];
}
function buildAdd3Round(first) {
  const pairs = first ? [...ADD3_BOOK] : [];
  while (pairs.length < 10) {
    const [a, b] = randomAdd3();
    if (b >= 1 && !pairs.some(([x, y]) => x === a && y === b)) pairs.push([a, b]);
  }
  return pairs.map(([a, b]) => columnAdd3Item(a, b));
}
let add3Rounds = 0;
let ITEMS_ADD3 = buildAdd3Round(true);

// ================= Adunări în coloană: exercițiul 8 din manual =================
// „Calculează, apoi ordonează crescător rezultatele. Scrie literele corespunzătoare numerelor
// pentru a descoperi o pasăre care se hrănește cu pește.” Fiecare adunare are litera ei, ca în carte.
function columnSumItem(a, b, letter) {
  const answer = a + b;
  const [ta, ua, tb, ub] = [Math.floor(a / 10), a % 10, Math.floor(b / 10), b % 10];
  const carry = ua + ub >= 10;
  return {
    points: 1,
    get text() { return tr('Calculează în coloană: {a} + {b}', { a, b }); },
    visual: { type: 'column', a, b, op: '+', letter },
    answer,
    choices: [answer],
    get explanation() {
      const units = carry
        ? tr('Unitățile: {ua} + {ub} = {su}: scriem {u} și ținem minte o zece.', { ua, ub, su: ua + ub, u: (ua + ub) % 10 })
        : tr('Unitățile: {ua} + {ub} = {su}.', { ua, ub, su: ua + ub });
      const tens = carry
        ? tr('Zecile: {ta} + {tb} + 1 (zecea ținută minte) = {st}.', { ta, tb, st: ta + tb + 1 })
        : tr('Zecile: {ta} + {tb} = {st}.', { ta, tb, st: ta + tb });
      return `${units} ${tens} ${tr('Rezultatul: {c}. Verificare: {c} − {b} = {a}.', { c: answer, a, b })}`;
    },
  };
}

// Animalele ascunse în ghicitori: numele se scrie la fel în română și în engleză,
// ca literele să se potrivească în ambele limbi. La adunări, prima rundă e chiar exercițiul din carte (PELICAN).
const SUM_PUZZLES = [
  { word: 'PELICAN', clue: 'o pasăre care se hrănește cu pește',
    pairs: [[39, 15, 'E'], [24, 48, 'I'], [58, 17, 'C'], [7, 87, 'N'], [5, 55, 'L'], [42, 39, 'A'], [26, 26, 'P']] },
  { word: 'LEOPARD', clue: 'o felină mare, cu blana pătată' },
  { word: 'HAMSTER', clue: 'un rozător mic, animal de companie' },
  { word: 'JAGUAR', clue: 'o felină mare din pădurile Americii' },
  { word: 'IGUANA', clue: 'o șopârlă mare și verde' },
  { word: 'FLAMINGO', clue: 'o pasăre roz care stă într-un picior' },
  { word: 'CONDOR', clue: 'o pasăre uriașă din munții Anzi' },
  { word: 'ZEBRA', clue: 'un animal cu dungi albe și negre' },
  { word: 'KOALA', clue: 'un animal din Australia care mănâncă frunze de eucalipt' },
  { word: 'PANDA', clue: 'un urs alb-negru care mănâncă bambus' },
  { word: 'PUMA', clue: 'o felină sălbatică din munții Americii' },
  { word: 'COBRA', clue: 'un șarpe veninos care își umflă gâtul' },
];

// Ghicitoarea de la finalul rundei: rezultatele, ordonate crescător sau descrescător, dau numele animalului.
// entries: [a, b, literă]; value: rezultatul unei intrări.
function riddleItem(puzzle, entries, value, desc) {
  const order = [...entries].sort((x, y) => (desc ? value(y) - value(x) : value(x) - value(y)));
  const others = shuffle(SUM_PUZZLES.filter(p => p.word !== puzzle.word)).slice(0, 3).map(p => p.word);
  return {
    points: 1,
    get text() {
      return tr(desc
        ? 'Rezultatele tale: {list}. Ordonează-le descrescător și citește literele. Ce animal ai descoperit? Indiciu: {clue}.'
        : 'Rezultatele tale: {list}. Ordonează-le crescător și citește literele. Ce animal ai descoperit? Indiciu: {clue}.', {
        list: entries.map(e => `${e[2]} = ${value(e)}`).join(', '),
        clue: puzzle.clue,
      });
    },
    answer: puzzle.word,
    choices: shuffle([puzzle.word, ...others]),
    get explanation() {
      return tr(desc ? 'În ordine descrescătoare: {order}. Literele formează cuvântul {word}.'
        : 'În ordine crescătoare: {order}. Literele formează cuvântul {word}.', {
        order: order.map(e => `${value(e)} (${e[2]})`).join(desc ? ' > ' : ' < '),
        word: puzzle.word,
      });
    },
  };
}

// Rezultate diferite pentru literele cuvântului: crescător, a k-a literă primește al k-lea rezultat
// (descrescător, invers); apoi exercițiile se amestecă.
function lettersToResults(word, min, max, desc) {
  const results = new Set();
  while (results.size < word.length) results.add(randInt(min, max));
  const sorted = [...results].sort((x, y) => (desc ? y - x : x - y));
  return word.split('').map((letter, i) => [sorted[i], letter]);
}

// Două numere care adunate dau `sum`; de cele mai multe ori cu trecere peste zece, ca în carte.
function sumPair(sum) {
  const [t, u] = [Math.floor(sum / 10), sum % 10];
  for (let tries = 0; tries < 30; tries++) {
    const carry = u < 9 && Math.random() < 0.85;
    const ub = carry ? randInt(u + 1, 9) : randInt(0, u);
    const ua = carry ? u + 10 - ub : u - ub;
    const tens = carry ? t - 1 : t;
    const ta = randInt(0, tens);
    const [a, b] = [ta * 10 + ua, (tens - ta) * 10 + ub];
    if (a >= 2 && b >= 2) return Math.random() < 0.5 ? [a, b] : [b, a];
  }
  return [sum - 19, 19];
}

// O rundă: câte o adunare pentru fiecare literă a animalului, apoi ghicitoarea.
function buildSumRound(puzzle) {
  const entries = puzzle.pairs
    || shuffle(lettersToResults(puzzle.word, 25, 99, false).map(([sum, letter]) => [...sumPair(sum), letter]));
  return [
    ...entries.map(([a, b, letter]) => columnSumItem(a, b, letter)),
    riddleItem(puzzle, entries, ([a, b]) => a + b, false),
  ];
}

// ---------- Scăderi în coloană (2 cifre), tot cu ghicitoare ----------
// Prima rundă: scăderile din carte cu rezultate diferite, iar descrescător dau HAMSTER.
const SUB2_BOOK = { word: 'HAMSTER', clue: 'un rozător mic, animal de companie', desc: true,
  pairs: [[73, 37, 'S'], [56, 29, 'E'], [91, 47, 'A'], [85, 38, 'H'], [52, 43, 'R'], [43, 14, 'T'], [64, 25, 'M']] };

// Două numere de 2 cifre a căror diferență e `diff`; de cele mai multe ori cu împrumut, ca în carte.
function subPair(diff) {
  for (let tries = 0; tries < 40; tries++) {
    const b = randInt(11, 99 - diff);
    const a = diff + b;
    if (a % 10 < b % 10 || Math.random() < 0.15) return [a, b];
  }
  return [diff + 11, 11];
}

function buildSub2Round(puzzle, desc) {
  const entries = puzzle.pairs
    || shuffle(lettersToResults(puzzle.word, 5, 80, desc).map(([diff, letter]) => [...subPair(diff), letter]));
  return [
    ...entries.map(([a, b, letter]) => columnItem(a, b, letter)),
    riddleItem(puzzle, entries, ([a, b]) => a - b, desc),
  ];
}

let sub2Puzzle = SUB2_BOOK;
let sub2Rounds = 0;
let ITEMS_COLUMN = buildSub2Round(SUB2_BOOK, true);

let sumPuzzle = SUM_PUZZLES[0];
let sumRounds = 0;
let ITEMS_COLUMN_SUM = buildSumRound(sumPuzzle);

// La fiecare rundă nouă de „Adunări în coloană”: alt animal și alte adunări.
export function newNationalRound(level) {
  if (level === 'scaderi2') {
    // Prima rundă e cea din carte; apoi alt animal, ordonat la întâmplare crescător sau descrescător.
    sub2Rounds += 1;
    if (sub2Rounds > 1) {
      const choices = SUM_PUZZLES.filter(p => p.word !== sub2Puzzle.word);
      sub2Puzzle = choices[Math.floor(Math.random() * choices.length)];
      ITEMS_COLUMN = buildSub2Round({ word: sub2Puzzle.word, clue: sub2Puzzle.clue }, Math.random() < 0.5);
    } else {
      ITEMS_COLUMN = buildSub2Round(SUB2_BOOK, true);
    }
    return;
  }
  if (level === 'adunari3') {
    add3Rounds += 1;
    ITEMS_ADD3 = buildAdd3Round(add3Rounds === 1);
    return;
  }
  if (level === 'scaderi3') {
    sub3Rounds += 1;
    ITEMS_SUB3 = buildSub3Round(sub3Rounds === 1);
    return;
  }
  if (level !== 'adunari8') return;
  sumRounds += 1;
  if (sumRounds > 1) {
    const choices = SUM_PUZZLES.filter(p => p !== sumPuzzle);
    sumPuzzle = choices[Math.floor(Math.random() * choices.length)];
  }
  ITEMS_COLUMN_SUM = buildSumRound(sumPuzzle);
}

const TESTS = {
  en2026: { year: 2026, theme: 'Animale de companie', items: ITEMS_2026 },
  en2025: { year: 2025, theme: 'Medii de viață', items: ITEMS_2025 },
  en2025b: { year: 2025, theme: 'Animale polare', items: ITEMS_2025_POLAR },
  // Exersare fără cronometru, de pe prima pagină (nu e test de Evaluare Națională).
  termeni46: { practice: true, title: 'Află termenii necunoscuți', items: ITEMS_TERMS },
  scaderi2: { practice: true, title: 'Scăderi în coloană', get items() { return ITEMS_COLUMN; } },
  adunari8: { practice: true, title: 'Adunări în coloană', get items() { return ITEMS_COLUMN_SUM; } },
  scaderi3: { practice: true, title: 'Scăderi cu numere de 3 cifre', get items() { return ITEMS_SUB3; } },
  adunari3: { practice: true, title: 'Adunări cu numere de 3 cifre', get items() { return ITEMS_ADD3; } },
};

// Exercițiile fără cronometru, cu itemi în ordine (testele și exersările de pe prima pagină).
export const PRACTICE_LEVELS = ['termeni46'];
export const COLUMN_LEVELS = ['scaderi2'];
export const COLUMN_SUM_LEVELS = ['adunari8'];
export const COLUMN3_LEVELS = ['scaderi3'];
export const ADD3_LEVELS = ['adunari3'];

// Un nivel cu itemi ficși, fără cronometru, la care poți sări peste un item și reveni la el.
export function isNationalLevel(level) {
  return Boolean(TESTS[level]);
}

// Exersare (nu test de examen): fără punctaj din 100 la final.
export function isPracticeTest(level) {
  return Boolean(TESTS[level]?.practice);
}

export function practiceTitle(level) {
  return TESTS[level]?.title;
}

export function nationalYear(level) {
  return TESTS[level]?.year;
}

// Tema testului, ca să deosebim testele din același an.
export function nationalTheme(level) {
  return TESTS[level]?.theme ? tr(TESTS[level].theme) : undefined;
}

// Punctajul maxim al testului (100 de puncte, ca la examen).
export function nationalMaxPoints(level) {
  return TESTS[level].items.reduce((sum, item) => sum + item.points, 0);
}

// Câte întrebări are o rundă: un test are toți itemii lui, celelalte niveluri câte 10.
export function questionCount(level) {
  return TESTS[level]?.items.length ?? ROUND_LENGTH;
}

// Itemul cu numărul `index` din testul nivelului, cu insigna lui.
export function buildNationalItem(level, index) {
  const { items } = TESTS[level];
  const item = items[Math.min(index, items.length - 1)];
  const badge = TESTS[level].practice
    ? tr('✏️ Exercițiul {i} din {n}', { i: index + 1, n: items.length })
    : tr('🎓 Itemul {i} din {n} · {p}p.', { i: index + 1, n: items.length, p: item.points });
  return { ...item, badge };
}
