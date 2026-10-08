import { useEffect, useState } from 'react';
import './TablaInmultirii.css';
import { useTablaGame } from './useTablaGame';
import { usePlayerProfile } from './usePlayerProfile';
import { submitScore, addPlayerPoints } from './useLeaderboard';
import Header from './components/Header';
import LevelPanel from './components/LevelPanel';
import GameCard from './components/GameCard';
import Leaderboard from './components/Leaderboard';
import Chat from './components/Chat';
import ChatToast from './components/ChatToast';
import CallOverlay from './components/CallOverlay';
import ContestPanel from './components/ContestPanel';
import { useCall } from './useCall';
import { useChatNotifications, privateChatId, requestSystemNotifications } from './useChat';
import ResultModal from './components/ResultModal';
import NameGate from './components/NameGate';
import AuthGate from './components/AuthGate';
import ProfilePanel from './components/ProfilePanel';

const PAGE_TITLE = 'Tabla Înmulțirii';

export default function TablaInmultirii() {
  const [openPanel, setOpenPanel] = useState(null);
  const togglePanel = key => setOpenPanel(prev => (prev === key ? null : key));

  const {
    uid, name, country, email, isAnonymous, ready, avatar, account,
    saveProfile, register, login, logout, resetPassword, updateAvatar, changePassword, firebaseEnabled,
  } = usePlayerProfile();

  // Fără cont → înregistrare/logare; cont fără nume sau țară → completare profil.
  const showAuthGate = firebaseEnabled && ready && isAnonymous;
  const showNameGate = firebaseEnabled && ready && !isAnonymous && (!name || !country);

  // Jocul stă pe pauză cât timp e deschis un panou sau ecranul de cont.
  const {
    stats, current, time, answered, selected, hintOpen, feedback, modal, toast,
    questionsPerLevel, selectLevel, restartLevel, goToNextLevel,
    handleAnswer, toggleHint, goToNextQuestionOrFinish,
  } = useTablaGame(1, openPanel !== null || showAuthGate || showNameGate || (firebaseEnabled && !ready));

  const handleSelectLevel = level => {
    setOpenPanel(null);
    selectLevel(level);
  };

  const [chatPeer, setChatPeer] = useState(null);
  const [contestId, setContestId] = useState(null);
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

  const handleLogout = async () => {
    if (!window.confirm('Sigur vrei să ieși din cont?')) return;
    hangUp();
    setOpenPanel(null);
    setChatPeer(null);
    setContestId(null);
    await logout();
  };

  return (
    <div className="tabla-inmultirii">
      <div className="app">
        <Header points={stats.points} lives={stats.lives} combo={stats.combo} time={time} playerName={name} playerCountry={country}
          playerAvatar={avatar} accountEmail={isAnonymous ? '' : email}
          onOpenProfile={() => handleTogglePanel('profile')} profileOpen={openPanel === 'profile'} />

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
              {openPanel === 'leaderboard' && (
                <Leaderboard uid={uid} firebaseEnabled={firebaseEnabled} />
              )}
              {openPanel === 'profile' && (
                <ProfilePanel
                  uid={uid}
                  name={name}
                  country={country}
                  email={email}
                  isAnonymous={isAnonymous}
                  avatar={avatar}
                  account={account}
                  onSaveDetails={saveProfile}
                  onUpdateAvatar={updateAvatar}
                  onChangePassword={changePassword}
                  onLogout={isAnonymous ? null : handleLogout}
                />
              )}
              {openPanel === 'contest' && (
                <ContestPanel
                  uid={uid}
                  name={name}
                  country={country}
                  firebaseEnabled={firebaseEnabled}
                  contestId={contestId}
                  onContestChange={setContestId}
                />
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
      {showAuthGate && (
        <AuthGate initialName={name} initialCountry={country} onRegister={register} onLogin={login}
          onResetPassword={resetPassword} />
      )}
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
