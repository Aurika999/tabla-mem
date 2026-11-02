import {
  useContestHistory, contestTitle, contestLevelLabel, contestLevelOf, CONTEST_QUESTIONS,
} from '../useContest';
import Flag from './Flag';
import { tr, getLang } from '../i18n';

const MEDALS = ['🥇', '🥈', '🥉'];
const SHOWN = 10;

function formatDate(timestamp) {
  if (!timestamp) return '';
  return timestamp.toDate().toLocaleString(getLang() === 'en' ? 'en-GB' : 'ro-RO', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export default function ContestHistory({ uid }) {
  const { contests, loading } = useContestHistory(uid);

  if (loading) return <p className="leaderboard-empty">{tr('Se încarcă…')}</p>;
  if (contests.length === 0) {
    return <p className="leaderboard-empty">{tr('Încă n-ai terminat niciun concurs. Intră la 🏁 CONCURS TEST! 🚀')}</p>;
  }

  const wins = contests.filter(c => c.ranking?.[0]?.uid === uid).length;
  return (
    <>
      <p className="leaderboard-sub">
        {contests.length} {contests.length === 1 ? tr('concurs jucat') : tr('concursuri jucate')} · 🥇 {wins} {wins === 1 ? tr('victorie') : tr('victorii')}
      </p>
      <div className="contest-history">
        {contests.slice(0, SHOWN).map(contest => {
          const ranking = contest.ranking || [];
          const winner = ranking[0];
          const myPlace = ranking.findIndex(r => r.uid === uid);
          return (
            <div key={contest.id} className="contest-history-card">
              <div className="contest-history-title">🏁 {contestTitle(contest)}</div>
              <div className="contest-level-tag small">{contestLevelLabel(contestLevelOf(contest))}</div>
              <div className="contest-history-head">
                <span>📅 {formatDate(contest.finishedAt)}</span>
                <span>👥 {ranking.length} {tr('jucători')}</span>
              </div>
              {winner && (
                <div className="contest-history-winner">
                  🏆 {tr('Locul 1:')} <b>{winner.name}</b> <Flag code={winner.country} />
                  {winner.uid === uid && <span className="contest-history-me"> {tr('(tu!)')}</span>}
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
              {myPlace > 0 && <div className="contest-history-place">{tr('Tu ai fost pe locul {n}.', { n: myPlace + 1 })}</div>}
            </div>
          );
        })}
      </div>
    </>
  );
}
