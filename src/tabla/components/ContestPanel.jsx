import { useEffect, useRef, useState } from 'react';
import {
  useOpenContests, useContest, createContest, joinContest, leaveContest, startContest, recordContestResult,
  saveContestProgress, rankResults, contestDeadline, contestTitle, MAX_TITLE_LENGTH,
  MAX_PLAYERS, MIN_PLAYERS, CONTEST_QUESTIONS, QUESTION_SECONDS, COUNTDOWN_SECONDS, PRIZE_POINTS,
} from '../useContest';
import { addPlayerPoints } from '../useLeaderboard';
import QuestionDisplay from './QuestionDisplay';
import AnswerGrid from './AnswerGrid';
import Flag from './Flag';

const MEDALS = ['🥇', '🥈', '🥉'];
const PRIZE_STORAGE_PREFIX = 'tabla-inmultirii:contestPrize:';
const FEEDBACK_MS = 900;

function formatSeconds(ms) {
  return `${(ms / 1000).toFixed(1)}s`;
}

function errorText(err) {
  return err?.code === 'permission-denied'
    ? 'Concursurile nu sunt activate încă în Firebase (regulile pentru concursuri).'
    : 'Ceva n-a mers. Mai încearcă!';
}

function useNow(intervalMs, active = true) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, active]);
  return now;
}

// Jucătorii din concurs, cu progresul lor, ordonați după clasament.
function standingsOf(contest, results) {
  const byUid = Object.fromEntries(results.map(r => [r.uid, r]));
  const rows = Object.entries(contest.players || {}).map(([uid, p]) => {
    const r = byUid[uid];
    return {
      uid,
      name: p.name,
      country: p.country,
      answered: r?.answered ?? 0,
      correct: r?.correct ?? 0,
      timeMs: r?.timeMs ?? Number.MAX_SAFE_INTEGER,
      finished: Boolean(r?.finished),
    };
  });
  return rankResults(rows);
}

function Standings({ rows, uid, final }) {
  return (
    <ol className="leaderboard-list contest-standings">
      {rows.map((row, i) => (
        <li key={row.uid} className={`leaderboard-row${row.uid === uid ? ' me' : ''}`}>
          <span className="rank">{final ? (MEDALS[i] || `${i + 1}.`) : `${i + 1}.`}</span>
          <span className="name">{row.name} <Flag code={row.country} /></span>
          <span className="contest-progress">
            {row.finished || final
              ? `${row.correct}/${CONTEST_QUESTIONS} ✅ · ${row.answered ? formatSeconds(row.timeMs) : '—'}`
              : `întrebarea ${Math.min(row.answered + 1, CONTEST_QUESTIONS)}/${CONTEST_QUESTIONS} · ${row.correct} ✅`}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Lobby({ uid, name, country, onEnter }) {
  const contests = useOpenContests();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');

  const run = async (action) => {
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (err) {
      console.error('Acțiune concurs eșuată', err);
      setError(errorText(err));
    }
    setBusy(false);
  };

  const handleCreate = () => run(async () => {
    const id = await createContest({ uid, name, country, title });
    onEnter(id);
  });

  const handleJoin = (contest) => run(async () => {
    if (!contest.players?.[uid]) await joinContest(contest.id, { uid, name, country });
    onEnter(contest.id);
  });

  return (
    <>
      <p className="contest-intro">
        Concurează cu alți jucători (minimum 2, maximum {MAX_PLAYERS}): <b>{CONTEST_QUESTIONS} întrebări</b> din toate nivelurile,
        {' '}<b>{QUESTION_SECONDS} secunde</b> pe întrebare. Câștigă cine are cele mai multe răspunsuri corecte;
        la egalitate, cel mai rapid. Premii: 🥇 +{PRIZE_POINTS[0]}, 🥈 +{PRIZE_POINTS[1]}, 🥉 +{PRIZE_POINTS[2]} puncte.
      </p>
      <form
        className="contest-create"
        onSubmit={(e) => { e.preventDefault(); if (!busy && name) handleCreate(); }}
      >
        <input
          className="name-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={MAX_TITLE_LENGTH}
          placeholder={`Numele concursului (ex. Campionii clasei a III-a)`}
          aria-label="Numele concursului"
        />
        <button className="bigbtn" type="submit" disabled={busy || !name}>➕ Creează concursul</button>
      </form>
      {error && <p className="chat-error">{error}</p>}

      <h3 className="contest-subtitle">Concursuri care așteaptă jucători</h3>
      {contests.length === 0 && (
        <p className="leaderboard-empty">Niciun concurs deschis. Creează tu unul și cheamă-ți prietenii! 🚀</p>
      )}
      <ol className="leaderboard-list">
        {contests.map(contest => {
          const players = Object.values(contest.players || {});
          const isMember = Boolean(contest.players?.[uid]);
          const full = players.length >= MAX_PLAYERS;
          return (
            <li key={contest.id} className="leaderboard-row contest-room">
              <span className="name">
                🏁 {contestTitle(contest)}
                <small>👑 {contest.hostName} · {players.map(p => p.name).join(', ')}</small>
              </span>
              <span className="contest-count">{players.length}/{MAX_PLAYERS}</span>
              <button
                className="chat-call-btn"
                onClick={() => handleJoin(contest)}
                disabled={busy || !name || (full && !isMember)}
              >
                {isMember ? 'Revino' : full ? 'Plin' : 'Intră'}
              </button>
            </li>
          );
        })}
      </ol>
    </>
  );
}

function WaitingRoom({ contest, uid, onLeave }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const players = Object.entries(contest.players || {});
  const isHost = contest.host === uid;

  const handleStart = async () => {
    setBusy(true);
    setError('');
    try {
      await startContest(contest.id);
    } catch (err) {
      console.error('Nu am putut porni concursul', err);
      setError(errorText(err));
      setBusy(false);
    }
  };

  return (
    <>
      <h3 className="contest-subtitle">🏁 {contestTitle(contest)}</h3>
      <p className="contest-intro">
        {players.length} {players.length === 1 ? 'jucător' : 'jucători'} · mai pot intra {MAX_PLAYERS - players.length}
      </p>
      <ol className="leaderboard-list">
        {players.map(([playerUid, p]) => (
          <li key={playerUid} className={`leaderboard-row${playerUid === uid ? ' me' : ''}`}>
            <span className="rank">{playerUid === contest.host ? '👑' : '🙂'}</span>
            <span className="name">{p.name} <Flag code={p.country} /></span>
          </li>
        ))}
        {players.length < MAX_PLAYERS && (
          <li className="leaderboard-row contest-empty-slot">
            <span className="rank">⏳</span>
            <span className="name">Se așteaptă jucători…</span>
          </li>
        )}
      </ol>
      <p className="contest-intro">
        {isHost
          ? (players.length < MIN_PLAYERS
            ? 'Așteptăm încă un jucător ca să poți începe…'
            : 'Poți începe acum sau poți aștepta să mai intre jucători.')
          : `Așteptăm ca ${contest.hostName} să înceapă concursul…`}
      </p>
      <div className="call-actions">
        {isHost && (
          <button className="bigbtn" onClick={handleStart} disabled={busy || players.length < MIN_PLAYERS}>
            ▶ Începe concursul
          </button>
        )}
        <button className="bigbtn blue" onClick={onLeave}>
          {isHost ? '✖ Anulează concursul' : '← Ieși'}
        </button>
      </div>
      {error && <p className="chat-error">{error}</p>}
    </>
  );
}

function Play({ contest, uid, name, country, myResult, startAt, standings }) {
  const questions = contest.questions || [];
  const [index, setIndex] = useState(myResult?.answered ?? 0);
  const [correct, setCorrect] = useState(myResult?.correct ?? 0);
  const [timeMs, setTimeMs] = useState(myResult?.timeMs ?? 0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const questionStartRef = useRef(null);
  const now = useNow(200);

  const countdownLeft = Math.ceil((startAt - now) / 1000);
  const inCountdown = countdownLeft > 0;

  // Ne anunțăm prezența, ca adversarii să ne vadă în clasament de la început.
  useEffect(() => {
    if (myResult) return;
    saveContestProgress(contest.id, uid, {
      name, country: country || '', answered: 0, correct: 0, timeMs: 0, finished: false,
    }).catch(err => console.error('Nu am putut salva progresul', err));
  }, [contest.id, uid, name, country, myResult]);

  useEffect(() => {
    if (!inCountdown && questionStartRef.current === null) questionStartRef.current = Date.now();
  }, [inCountdown]);

  const handleAnswer = (value) => {
    if (answered || inCountdown || index >= questions.length) return;
    const question = questions[index];
    const spent = Math.min(Date.now() - (questionStartRef.current ?? Date.now()), QUESTION_SECONDS * 1000);
    const isCorrect = value === question.correct;
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    const nextTime = timeMs + spent;
    const nextAnswered = index + 1;

    setAnswered(true);
    setSelected(value);
    setCorrect(nextCorrect);
    setTimeMs(nextTime);
    saveContestProgress(contest.id, uid, {
      name, country: country || '',
      answered: nextAnswered, correct: nextCorrect, timeMs: nextTime,
      finished: nextAnswered >= questions.length,
    }).catch(err => console.error('Nu am putut salva progresul', err));

    setTimeout(() => {
      setIndex(nextAnswered);
      setAnswered(false);
      setSelected(null);
      questionStartRef.current = Date.now();
    }, FEEDBACK_MS);
  };

  const secondsLeft = questionStartRef.current === null
    ? QUESTION_SECONDS
    : Math.max(0, QUESTION_SECONDS - Math.floor((now - questionStartRef.current) / 1000));

  // Timpul expirat contează ca răspuns greșit.
  useEffect(() => {
    if (!inCountdown && !answered && secondsLeft === 0 && index < questions.length) handleAnswer(null);
  });

  if (inCountdown) {
    return (
      <div className="contest-countdown">
        <p>Concursul începe în</p>
        <div className="contest-countdown-number">{countdownLeft}</div>
        <p>Pregătește-te! 🚀</p>
      </div>
    );
  }

  const question = questions[index];
  if (!question) return null;

  return (
    <div className="contest-play">
      <div className="contest-play-main">
        <div className="ribbon">ÎNTREBAREA {index + 1} / {questions.length}</div>
        <div className={`contest-timer${secondsLeft <= 5 ? ' low' : ''}`}>⏱️ {secondsLeft}s</div>
        <div className="contest-timer-bar">
          <span style={{ width: `${(secondsLeft / QUESTION_SECONDS) * 100}%` }} />
        </div>
        <QuestionDisplay current={question} />
        <AnswerGrid current={question} answered={answered} selected={selected} onAnswer={handleAnswer} />
      </div>
      <div className="contest-play-side">
        <h3 className="contest-subtitle">Adversari</h3>
        <Standings rows={standings} uid={uid} final={false} />
      </div>
    </div>
  );
}

function Results({ contest, uid, name, standings, final, onExit }) {
  const recordedRef = useRef(false);
  const myRank = standings.findIndex(r => r.uid === uid);
  const awardedRef = useRef(false);

  // Premiul se acordă o singură dată per concurs, chiar dacă redeschizi panoul.
  useEffect(() => {
    if (!final || awardedRef.current || myRank < 0 || myRank >= PRIZE_POINTS.length) return;
    awardedRef.current = true;
    const key = PRIZE_STORAGE_PREFIX + contest.id;
    try {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, '1');
    } catch {
      // Fără localStorage acordăm totuși premiul; protecția e doar awardedRef.
    }
    addPlayerPoints({ uid, name, pointsEarned: PRIZE_POINTS[myRank] });
  }, [final, myRank, contest.id, uid, name]);

  useEffect(() => {
    if (!final || recordedRef.current || contest.status !== 'running') return;
    recordedRef.current = true;
    recordContestResult(contest.id, standings)
      .catch(err => console.error('Nu am putut salva rezultatul concursului', err));
  }, [final, contest.status, contest.id, standings]);

  return (
    <>
      {final ? (
        <div className="contest-final">
          <div className="reward">{myRank >= 0 && myRank < 3 ? MEDALS[myRank] : '👏'}</div>
          <h3>
            {myRank === 0 ? 'Ai câștigat locul 1! 🏆' : myRank > 0 ? `Ai terminat pe locul ${myRank + 1}!` : 'Concurs încheiat!'}
          </h3>
          {myRank >= 0 && myRank < PRIZE_POINTS.length && <p>Premiu: <b>+{PRIZE_POINTS[myRank]} puncte</b> în clasament ⭐</p>}
        </div>
      ) : (
        <p className="contest-intro">Ai terminat! ⏳ Așteptăm să termine și ceilalți…</p>
      )}
      <Standings rows={standings} uid={uid} final={final} />
      {final && <button className="bigbtn" onClick={onExit}>🏁 Înapoi la concursuri</button>}
    </>
  );
}

export default function ContestPanel({ uid, name, country, firebaseEnabled, contestId, onContestChange }) {
  const { contest, results, loaded, contestLoaded } = useContest(contestId);
  const [seenRunningAt, setSeenRunningAt] = useState(null);
  const now = useNow(1000, Boolean(contest && contest.status !== 'waiting'));

  useEffect(() => {
    setSeenRunningAt(null);
  }, [contestId]);

  useEffect(() => {
    if (contest?.status === 'running' && !seenRunningAt) setSeenRunningAt(Date.now());
  }, [contest?.status, seenRunningAt]);

  const exit = () => onContestChange(null);

  const handleLeave = async () => {
    if (contest && contest.status === 'waiting') {
      try {
        await leaveContest(contest, uid);
      } catch (err) {
        console.error('Nu am putut ieși din concurs', err);
      }
    }
    exit();
  };

  let body;
  if (!firebaseEnabled) {
    body = <p className="leaderboard-empty">Concursul are nevoie de Firebase configurat.</p>;
  } else if (!uid || !name) {
    body = <p className="leaderboard-empty">Alege-ți un nume ca să participi.</p>;
  } else if (!contestId) {
    body = <Lobby uid={uid} name={name} country={country} onEnter={onContestChange} />;
  } else if (!contestLoaded || (!loaded && contest?.status !== 'waiting')) {
    body = <p className="leaderboard-empty">Se încarcă…</p>;
  } else if (!contest || contest.status === 'cancelled') {
    body = (
      <>
        <p className="leaderboard-empty">Concursul a fost anulat.</p>
        <button className="bigbtn" onClick={exit}>🏁 Înapoi la concursuri</button>
      </>
    );
  } else if (!contest.players?.[uid]) {
    body = (
      <>
        <p className="leaderboard-empty">
          {contest.status === 'waiting' ? 'Nu mai ești în acest concurs.' : 'Concursul a început fără tine.'}
        </p>
        <button className="bigbtn" onClick={exit}>🏁 Înapoi la concursuri</button>
      </>
    );
  } else if (contest.status === 'waiting') {
    body = <WaitingRoom contest={contest} uid={uid} onLeave={handleLeave} />;
  } else {
    const standings = standingsOf(contest, results);
    const myResult = results.find(r => r.uid === uid);
    const deadline = contestDeadline(contest, seenRunningAt);
    const allFinished = standings.every(r => r.finished);
    const final = contest.status === 'finished' || allFinished || (deadline !== null && now > deadline);
    const startAt = (contest.startedAt?.toMillis() ?? seenRunningAt ?? now) + COUNTDOWN_SECONDS * 1000;

    body = myResult?.finished || final
      ? <Results contest={contest} uid={uid} name={name} standings={standings} final={final} onExit={exit} />
      : (
        <Play
          contest={contest}
          uid={uid}
          name={name}
          country={country}
          myResult={myResult}
          startAt={startAt}
          standings={standings}
        />
      );
  }

  return (
    <aside className="panel contest">
      <h2>🏁 CONCURS TEST</h2>
      {body}
    </aside>
  );
}
