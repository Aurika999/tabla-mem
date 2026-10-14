import { useState } from 'react';
import {
  LEVELS, LEVEL_ORDER, PROBLEME_LEVEL, AVANSATE_LEVEL, LOGIC_LEVELS, FIVE_LEVELS, SIX_LEVELS, SEVEN_LEVELS,
  EIGHT_LEVELS, NINE_LEVELS, FOUR_LEVELS, THREE_LEVELS, TWO_LEVELS, EVAL_LEVELS, OLD_LOGIC_LEVELS, DIVISION_LEVELS, HALF_LEVELS, THIRD_LEVELS, QUARTER_LEVELS, FIFTH_LEVELS, DIV6_LEVELS, DIV7_LEVELS, DIV8_LEVELS, DIV9_LEVELS,
} from '../data';
import { useGlobalLeaderboard, useMyScores } from '../useLeaderboard';
import { NATIONAL_LEVELS, questionCount } from '../nationalTest';
import Flag from './Flag';
import Avatar from './Avatar';
import ContestHistory from './ContestHistory';

const MEDALS = ['🥇', '🥈', '🥉'];
// Scorurile grupate pe insule, în ordinea din joc.
const SCORE_GROUPS = [
  { icon: '🛷', name: 'Înmulțirea cu 2', levels: TWO_LEVELS },
  { icon: '⛄', name: 'Înmulțirea cu 3', levels: THREE_LEVELS },
  { icon: '🐻‍❄️', name: 'Înmulțirea cu 4', levels: FOUR_LEVELS },
  { icon: '🖐️', name: 'Înmulțirea cu 5', levels: FIVE_LEVELS },
  { icon: '🔋', name: 'Înmulțirea cu 6', levels: SIX_LEVELS },
  { icon: '🪙', name: 'Înmulțirea cu 7', levels: SEVEN_LEVELS },
  { icon: '🐙', name: 'Înmulțirea cu 8', levels: EIGHT_LEVELS },
  { icon: '🎈', name: 'Înmulțirea cu 9', levels: NINE_LEVELS },
  { icon: '➗', name: 'Împărțirea', levels: DIVISION_LEVELS },
  { icon: '✌️', name: 'Împărțirea la 2', levels: HALF_LEVELS },
  { icon: '🐦', name: 'Împărțirea la 3', levels: THIRD_LEVELS },
  { icon: '🍀', name: 'Împărțirea la 4', levels: QUARTER_LEVELS },
  { icon: '🏮', name: 'Împărțirea la 5', levels: FIFTH_LEVELS },
  { icon: '🍬', name: 'Împărțirea la 6', levels: DIV6_LEVELS },
  { icon: '📅', name: 'Împărțirea la 7', levels: DIV7_LEVELS },
  { icon: '🐙', name: 'Împărțirea la 8', levels: DIV8_LEVELS },
  { icon: '🎯', name: 'Împărțirea la 9', levels: DIV9_LEVELS },
  { icon: '🧩', name: 'Insula Isteților', levels: LOGIC_LEVELS },
  { icon: '📝', name: 'Evaluare (veche)', levels: EVAL_LEVELS, onlyIfPlayed: true },
  { icon: '🎓', name: 'Evaluarea Națională', levels: NATIONAL_LEVELS },
  // Nivelurile de dinainte de împărțirea pe dificultate: apar doar dacă ai jucat pe ele.
  { icon: '📦', name: 'Niveluri vechi', levels: [...LEVEL_ORDER, PROBLEME_LEVEL, AVANSATE_LEVEL, ...OLD_LOGIC_LEVELS], onlyIfPlayed: true },
];

// Eticheta nivelului fără iconița insulei de la început (ea apare deja în titlul grupului).
function levelName(key) {
  return LEVELS[key].label.replace(/^[^\p{L}\p{N}]+/u, '');
}

function ScoreGroup({ group, scores }) {
  const played = group.levels.filter(key => scores[key]);
  const points = played.reduce((sum, key) => sum + scores[key].points, 0);
  const allDone = played.length === group.levels.length;
  // Toate insulele pornesc închise; se deschid la clic.
  const [open, setOpen] = useState(false);
  return (
    <li className={`score-group${played.length ? '' : ' empty'}${open ? ' open' : ''}`}>
      <button className="score-group-head" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="score-group-arrow" aria-hidden="true">{open ? '▾' : '▸'}</span>
        <span className="score-group-icon" aria-hidden="true">{group.icon}</span>
        <span className="score-group-name">{group.name}</span>
        <span className="score-group-summary">
          {played.length ? `${played.length}/${group.levels.length} ${allDone ? '🏆' : '✅'} · ${points} pct` : 'neînceput'}
        </span>
      </button>
      {open && (
        <ol className="leaderboard-list score-group-levels">
          {group.levels.map(key => {
            const score = scores[key];
            return (
              <li key={key} className="leaderboard-row">
                <span className="name">{levelName(key)}</span>
                <span className="points">{score ? `${score.points} pct · ${score.correct}/${questionCount(key)} ✅` : '—'}</span>
              </li>
            );
          })}
        </ol>
      )}
    </li>
  );
}

function MyScoresList({ scores, loading }) {
  if (loading) return <p className="leaderboard-empty">Se încarcă…</p>;
  // Întâi insulele în care ai jucat, apoi cele neîncepute.
  const sorted = SCORE_GROUPS.filter(g => !g.onlyIfPlayed || g.levels.some(k => scores[k])).sort((a, b) =>
    Number(b.levels.some(k => scores[k])) - Number(a.levels.some(k => scores[k])));
  return (
    <ol className="score-groups">
      {sorted.map(group => <ScoreGroup key={group.name} group={group} scores={scores} />)}
    </ol>
  );
}

function LeaderboardList({ entries, loading, uid, pointsField, emptyText }) {
  if (loading) return <p className="leaderboard-empty">Se încarcă…</p>;
  if (entries.length === 0) return <p className="leaderboard-empty">{emptyText}</p>;
  return (
    <ol className="leaderboard-list">
      {entries.map((entry, i) => (
        <li key={entry.id} className={`leaderboard-row${entry.uid === uid || entry.id === uid ? ' me' : ''}`}>
          <span className="rank">{MEDALS[i] || `${i + 1}.`}</span>
          <Avatar src={entry.avatar} name={entry.name} size={28} />
          <span className="name">{entry.name} <Flag code={entry.country} /></span>
          <span className="points">{entry[pointsField]} pct</span>
        </li>
      ))}
    </ol>
  );
}

export default function Leaderboard({ uid, firebaseEnabled }) {
  const [tab, setTab] = useState('mine');
  const { scores: myScores, loading: myLoading } = useMyScores(uid);
  const { entries: globalEntries, loading: globalLoading } = useGlobalLeaderboard();

  if (!firebaseEnabled) {
    return (
      <aside className="panel leaderboard">
        <h2>🏅 CLASAMENT</h2>
        <p className="leaderboard-empty">
          Clasamentul online nu este configurat. Adaugă cheile Firebase în <code>.env.local</code> pentru a-l activa.
        </p>
      </aside>
    );
  }

  return (
    <aside className="panel leaderboard">
      <h2>🏅 CLASAMENT</h2>
      <div className="leaderboard-tabs">
        <button
          className={`leaderboard-tab${tab === 'mine' ? ' active' : ''}`}
          onClick={() => setTab('mine')}
        >
          ⭐ Scorurile mele
        </button>
        <button
          className={`leaderboard-tab${tab === 'global' ? ' active' : ''}`}
          onClick={() => setTab('global')}
        >
          🌍 Toți jucătorii
        </button>
        <button
          className={`leaderboard-tab${tab === 'contests' ? ' active' : ''}`}
          onClick={() => setTab('contests')}
        >
          🏁 Concursurile mele
        </button>
      </div>

      {tab === 'mine' ? (
        <>
          <p className="leaderboard-sub">Cel mai bun scor al tău pe fiecare nivel</p>
          <MyScoresList scores={myScores} loading={myLoading} />
        </>
      ) : tab === 'contests' ? (
        <ContestHistory uid={uid} />
      ) : (
        <>
          {!globalLoading && (
            <p className="leaderboard-count">
              👥 {globalEntries.length} {globalEntries.length === 1 ? 'jucător înregistrat' : 'jucători înregistrați'}
            </p>
          )}
          <p className="leaderboard-sub">Punctaj total, toate nivelurile</p>
          <LeaderboardList
            entries={globalEntries}
            loading={globalLoading}
            uid={uid}
            pointsField="totalPoints"
            emptyText="Nimeni n-a jucat încă. Fii primul! 🚀"
          />
        </>
      )}
    </aside>
  );
}
