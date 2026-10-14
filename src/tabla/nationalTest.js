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

const TESTS = {
  en2026: { year: 2026, theme: 'Animale de companie', items: ITEMS_2026 },
  en2025: { year: 2025, theme: 'Medii de viață', items: ITEMS_2025 },
  en2025b: { year: 2025, theme: 'Animale polare', items: ITEMS_2025_POLAR },
};

export function isNationalLevel(level) {
  return NATIONAL_LEVELS.includes(level);
}

export function nationalYear(level) {
  return TESTS[level]?.year;
}

// Tema testului, ca să deosebim testele din același an.
export function nationalTheme(level) {
  return TESTS[level]?.theme;
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
  return { ...item, badge: `🎓 Itemul ${index + 1} din ${items.length} · ${item.points}p.` };
}
