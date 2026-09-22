import { useState } from 'react';
import { LEVELS } from '../data';
import { useLeaderboard, useGlobalLeaderboard } from '../useLeaderboard';

const MEDALS = ['🥇', '🥈', '🥉'];

function LeaderboardList({ entries, loading, uid, pointsField, emptyText }) {
  if (loading) return <p className="leaderboard-empty">Se încarcă…</p>;
  if (entries.length === 0) return <p className="leaderboard-empty">{emptyText}</p>;
  return (
    <ol className="leaderboard-list">
      {entries.map((entry, i) => (
        <li key={entry.id} className={`leaderboard-row${entry.uid === uid || entry.id === uid ? ' me' : ''}`}>
          <span className="rank">{MEDALS[i] || `${i + 1}.`}</span>
          <span className="name">{entry.name}</span>
          <span className="points">{entry[pointsField]} pct</span>
        </li>
      ))}
    </ol>
  );
}

export default function Leaderboard({ level, uid, firebaseEnabled }) {
  const [tab, setTab] = useState('level');
  const { entries: levelEntries, loading: levelLoading } = useLeaderboard(level);
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
          className={`leaderboard-tab${tab === 'level' ? ' active' : ''}`}
          onClick={() => setTab('level')}
        >
          Nivel {level}
        </button>
        <button
          className={`leaderboard-tab${tab === 'global' ? ' active' : ''}`}
          onClick={() => setTab('global')}
        >
          🌍 Toți jucătorii
        </button>
      </div>

      {tab === 'level' ? (
        <>
          <p className="leaderboard-sub">{LEVELS[level].label}</p>
          <LeaderboardList
            entries={levelEntries}
            loading={levelLoading}
            uid={uid}
            pointsField="points"
            emptyText="Niciun scor încă. Fii primul! 🚀"
          />
        </>
      ) : (
        <>
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
