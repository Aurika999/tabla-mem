import { useEffect, useState } from 'react';
import './TablaInmultirii.css';
import { useTablaGame } from './useTablaGame';
import { usePlayerProfile } from './usePlayerProfile';
import { submitScore, addPlayerPoints } from './useLeaderboard';
import Header from './components/Header';
import LevelPanel from './components/LevelPanel';
import GameCard from './components/GameCard';
import StatsPanel from './components/StatsPanel';
import Leaderboard from './components/Leaderboard';
import ResultModal from './components/ResultModal';
import NameGate from './components/NameGate';

export default function TablaInmultirii() {
  const [openPanel, setOpenPanel] = useState(null);
  const togglePanel = key => setOpenPanel(prev => (prev === key ? null : key));

  const {
    stats, current, time, answered, selected, hintOpen, feedback, modal, toast,
    questionsPerLevel, selectLevel, restartLevel, goToNextLevel,
    handleAnswer, toggleHint, goToNextQuestionOrFinish,
  } = useTablaGame(1, openPanel !== null);

  const { uid, name, ready, saveName, firebaseEnabled } = usePlayerProfile();
  const handleSelectLevel = level => {
    setOpenPanel(null);
    selectLevel(level);
  };

  useEffect(() => {
    if (!modal || !uid || !name) return;
    submitScore({
      uid, name, level: stats.level,
      points: stats.points, correct: stats.correct, bestCombo: stats.bestCombo,
    });
    addPlayerPoints({ uid, name, pointsEarned: stats.points });
  }, [modal, uid, name, stats.level, stats.points, stats.correct, stats.bestCombo]);

  const showNameGate = firebaseEnabled && ready && !name;

  return (
    <div className="tabla-inmultirii">
      <div className="app">
        <Header points={stats.points} lives={stats.lives} combo={stats.combo} time={time} playerName={name} />

        <div className="main">
          <LevelPanel
            activeLevel={stats.level}
            onSelectLevel={handleSelectLevel}
            openPanel={openPanel}
            onTogglePanel={togglePanel}
          />

          {openPanel ? (
            <div className="info-view">
              {openPanel === 'stats' && <StatsPanel stats={stats} />}
              {openPanel === 'leaderboard' && (
                <Leaderboard uid={uid} firebaseEnabled={firebaseEnabled} />
              )}
              <button className="bigbtn" onClick={() => setOpenPanel(null)}>▶ Înapoi la exercițiu</button>
            </div>
          ) : (
            <GameCard
              current={current}
              stats={stats}
              questionsPerLevel={questionsPerLevel}
              answered={answered}
              selected={selected}
              hintOpen={hintOpen}
              feedback={feedback}
              toast={toast}
              onAnswer={handleAnswer}
              onToggleHint={toggleHint}
              onNext={goToNextQuestionOrFinish}
              onRestart={restartLevel}
            />
          )}
        </div>
      </div>

      <ResultModal modal={modal} onRestart={restartLevel} onNextLevel={goToNextLevel} />
      {showNameGate && <NameGate onSubmit={saveName} />}
    </div>
  );
}
