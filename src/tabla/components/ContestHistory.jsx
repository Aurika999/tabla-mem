import { useContestHistory, contestTitle, CONTEST_QUESTIONS } from '../useContest';
import Flag from './Flag';

const MEDALS = ['🥇', '🥈', '🥉'];
const SHOWN = 10;

function formatDate(timestamp) {
  if (!timestamp) return '';
  return timestamp.toDate().toLocaleString('ro-RO', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export default function ContestHistory({ uid }) {
  const { contests, loading } = useContestHistory(uid);

  if (loading) return <p className="leaderboard-empty">Se încarcă…</p>;
  if (contests.length === 0) {
    return <p className="leaderboard-empty">Încă n-ai terminat niciun concurs. Intră la 🏁 CONCURS TEST! 🚀</p>;
  }

  const wins = contests.filter(c => c.ranking?.[0]?.uid === uid).length;
  return (
    <>
      <p className="leaderboard-sub">
        {contests.length} {contests.length === 1 ? 'concurs jucat' : 'concursuri jucate'} · 🥇 {wins} {wins === 1 ? 'victorie' : 'victorii'}
      </p>
      <div className="contest-history">
        {contests.slice(0, SHOWN).map(contest => {
          const ranking = contest.ranking || [];
          const winner = ranking[0];
          const myPlace = ranking.findIndex(r => r.uid === uid);
          return (
            <div key={contest.id} className="contest-history-card">
              <div className="contest-history-title">🏁 {contestTitle(contest)}</div>
              <div className="contest-history-head">
                <span>📅 {formatDate(contest.finishedAt)}</span>
                <span>👥 {ranking.length} jucători</span>
              </div>
              {winner && (
                <div className="contest-history-winner">
                  🏆 Locul 1: <b>{winner.name}</b> <Flag code={winner.country} />
                  {winner.uid === uid && <span className="contest-history-me"> (tu!)</span>}
                </div>
              )}
              <ol className="contest-history-list">
                {ranking.map((r, i) => (
                  <li key={r.uid} className={r.uid === uid ? 'me' : ''}>
                    <span>{MEDALS[i] || `${i + 1}.`}</span>
                    <span className="name">{r.name} <Flag code={r.country} /></span>
                    <span>
                      {r.correct}/{CONTEST_QUESTIONS} ✅{r.timeMs !== null && r.timeMs !== undefined ? ` · ${(r.timeMs / 1000).toFixed(1)}s` : ''}
                    </span>
                  </li>
                ))}
              </ol>
              {myPlace > 0 && <div className="contest-history-place">Tu ai fost pe locul {myPlace + 1}.</div>}
            </div>
          );
        })}
      </div>
    </>
  );
}
