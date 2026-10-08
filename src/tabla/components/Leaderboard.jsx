import { useState } from 'react';
import { LEVELS, LEVEL_ORDER, PROBLEME_LEVEL, AVANSATE_LEVEL } from '../data';
import { useGlobalLeaderboard, useMyScores } from '../useLeaderboard';
import Flag from './Flag';
import Avatar from './Avatar';
import ContestHistory from './ContestHistory';

const MEDALS = ['🥇', '🥈', '🥉'];
const ALL_LEVELS = [...LEVEL_ORDER, PROBLEME_LEVEL, AVANSATE_LEVEL];

function MyScoresList({ scores, loading }) {
  if (loading) return <p className="leaderboard-empty">Se încarcă…</p>;
  return (
    <ol className="leaderboard-list">
      {ALL_LEVELS.map(key => {
        const score = scores[key];
        return (
          <li key={key} className="leaderboard-row">
            <span className="name">{LEVELS[key].label}</span>
            <span className="points">
              {score ? `${score.points} pct · ${score.correct}/10 ✅` : '—'}
            </span>
          </li>
        );
      })}
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
