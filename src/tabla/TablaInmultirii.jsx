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
import Chat from './components/Chat';
import ChatToast from './components/ChatToast';
import CallOverlay from './components/CallOverlay';
import { useCall } from './useCall';
import { useChatNotifications, privateChatId, requestSystemNotifications } from './useChat';
import ResultModal from './components/ResultModal';
import NameGate from './components/NameGate';

const PAGE_TITLE = 'Tabla Înmulțirii';

export default function TablaInmultirii() {
  const [openPanel, setOpenPanel] = useState(null);
  const togglePanel = key => setOpenPanel(prev => (prev === key ? null : key));

  const {
    stats, current, time, answered, selected, hintOpen, feedback, modal, toast,
    questionsPerLevel, selectLevel, restartLevel, goToNextLevel,
    handleAnswer, toggleHint, goToNextQuestionOrFinish,
  } = useTablaGame(1, openPanel !== null);

  const { uid, name, country, ready, saveProfile, firebaseEnabled } = usePlayerProfile();
  const handleSelectLevel = level => {
    setOpenPanel(null);
    selectLevel(level);
  };

  const [chatPeer, setChatPeer] = useState(null);
  const activeChatId = openPanel === 'chat' && chatPeer && uid ? privateChatId(uid, chatPeer.uid) : null;
  const {
    conversations, isUnread, unreadCount, incoming, dismissIncoming,
  } = useChatNotifications(uid, activeChatId);

  const {
    call, incoming: incomingCall, muted, notice: callNotice, remoteAudioRef,
    startCall, acceptCall, declineCall, hangUp, toggleMute,
  } = useCall({ uid, name });

  const handleTogglePanel = key => {
    // Cererea de permisiune trebuie să vină dintr-un clic al utilizatorului.
    if (key === 'chat') requestSystemNotifications();
    togglePanel(key);
  };

  const openChatWith = peer => {
    setChatPeer(peer);
    setOpenPanel('chat');
    dismissIncoming();
  };

  useEffect(() => {
    document.title = unreadCount > 0 ? `(${unreadCount}) ${PAGE_TITLE}` : PAGE_TITLE;
  }, [unreadCount]);

  useEffect(() => {
    if (!modal || !uid || !name) return;
    submitScore({
      uid, name, level: stats.level,
      points: stats.points, correct: stats.correct, bestCombo: stats.bestCombo,
    });
    addPlayerPoints({ uid, name, pointsEarned: stats.points });
  }, [modal, uid, name, stats.level, stats.points, stats.correct, stats.bestCombo]);

  const showNameGate = firebaseEnabled && ready && (!name || !country);

  return (
    <div className="tabla-inmultirii">
      <div className="app">
        <Header points={stats.points} lives={stats.lives} combo={stats.combo} time={time} playerName={name} playerCountry={country} />

        <div className="main">
          <LevelPanel
            activeLevel={stats.level}
            onSelectLevel={handleSelectLevel}
            openPanel={openPanel}
            onTogglePanel={handleTogglePanel}
            badges={{ chat: unreadCount }}
          />

          {openPanel ? (
            <div className="info-view">
              {openPanel === 'stats' && <StatsPanel stats={stats} />}
              {openPanel === 'leaderboard' && (
                <Leaderboard uid={uid} firebaseEnabled={firebaseEnabled} />
              )}
              {openPanel === 'chat' && (
                <Chat
                  uid={uid}
                  name={name}
                  firebaseEnabled={firebaseEnabled}
                  peer={chatPeer}
                  onSelectPeer={setChatPeer}
                  conversations={conversations}
                  isUnread={isUnread}
                  onCall={startCall}
                  callBusy={Boolean(call)}
                />
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
      {showNameGate && <NameGate initialName={name} initialCountry={country} onSubmit={saveProfile} />}
      <ChatToast incoming={incoming} onOpen={openChatWith} onDismiss={dismissIncoming} />
      <CallOverlay
        call={call}
        incoming={incomingCall}
        muted={muted}
        notice={callNotice}
        remoteAudioRef={remoteAudioRef}
        onAccept={acceptCall}
        onDecline={declineCall}
        onHangUp={hangUp}
        onToggleMute={toggleMute}
      />
    </div>
  );
}
