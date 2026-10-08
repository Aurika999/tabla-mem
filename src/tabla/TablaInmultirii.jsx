import { useEffect, useRef, useState } from 'react';
import './TablaInmultirii.css';
import { useTablaGame } from './useTablaGame';
import { usePlayerProfile } from './usePlayerProfile';
import { submitScore, addPlayerPoints, useMyTotalPoints, useMyScores } from './useLeaderboard';
import { isLevelUnlocked } from './mapProgress';
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
import MapHome from './components/MapHome';

const PAGE_TITLE = 'Tabla Înmulțirii';
// Sub această lățime coloanele stau una sub alta (vezi .main în CSS).
const STACKED_LAYOUT_QUERY = '(max-width: 900px)';

export default function TablaInmultirii() {
  // 'map' = prima pagină (harta aventurii); 'game' = exercițiile și panourile.
  const [view, setView] = useState('map');
  const [openPanel, setOpenPanel] = useState(null);
  const togglePanel = key => setOpenPanel(prev => (prev === key ? null : key));

  // Pe mobil, conținutul (exercițiul sau panoul deschis) e sub lista de niveluri;
  // după fiecare alegere a utilizatorului derulăm până la el.
  const contentRef = useRef(null);
  const [scrollRequest, setScrollRequest] = useState(0);
  const scrollToContent = () => setScrollRequest(n => n + 1);

  useEffect(() => {
    if (scrollRequest === 0 || !window.matchMedia(STACKED_LAYOUT_QUERY).matches) return;
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [scrollRequest]);

  const {
    uid, name, country, email, isAnonymous, ready, avatar, account,
    saveProfile, register, login, logout, resetPassword, updateAvatar, changePassword, firebaseEnabled,
  } = usePlayerProfile();

  // Fără cont → înregistrare/logare; cont fără nume sau țară → completare profil.
  const showAuthGate = firebaseEnabled && ready && isAnonymous;
  const showNameGate = firebaseEnabled && ready && !isAnonymous && (!name || !country);

  // Jocul stă pe pauză pe hartă, cât timp e deschis un panou sau ecranul de cont.
  const {
    stats, current, time, answered, selected, hintOpen, feedback, modal, toast,
    questionsPerLevel, selectLevel, restartLevel, goToNextLevel,
    handleAnswer, toggleHint, goToNextQuestionOrFinish,
  } = useTablaGame(
    1,
    view === 'map' || openPanel !== null || showAuthGate || showNameGate || (firebaseEnabled && !ready),
  );

  // Nivelurile terminate deblochează nivelurile următoare (harta progresivă).
  const { scores: myScores } = useMyScores(uid);
  const canPlay = level => !firebaseEnabled || isLevelUnlocked(myScores, level);

  // Punctele rundei se adaugă la total abia la final (când apare rezultatul);
  // până atunci le arătăm separat, ca să nu fie numărate de două ori.
  const savedTotalPoints = useMyTotalPoints(uid);
  const roundPoints = modal ? 0 : stats.points;

  const handleSelectLevel = level => {
    if (!canPlay(level)) return;
    setView('game');
    setOpenPanel(null);
    selectLevel(level);
    scrollToContent();
  };

  const goToMap = () => {
    setOpenPanel(null);
    setView('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closePanel = () => {
    setOpenPanel(null);
    scrollToContent();
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
    if (view === 'map') {
      // De pe hartă, panoul se deschide mereu (nu se închide la al doilea clic).
      setView('game');
      setOpenPanel(key);
    } else {
      togglePanel(key);
    }
    scrollToContent();
  };

  const openChatWith = peer => {
    setChatPeer(peer);
    setView('game');
    setOpenPanel('chat');
    dismissIncoming();
    scrollToContent();
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
    setView('map');
    await logout();
  };

  return (
    <div className="tabla-inmultirii">
      <div className="app">
        <Header totalPoints={savedTotalPoints + roundPoints} roundPoints={roundPoints} lives={stats.lives} combo={stats.combo} time={time} playerName={name} playerCountry={country}
          playerAvatar={avatar} accountEmail={isAnonymous ? '' : email}
          onOpenProfile={() => handleTogglePanel('profile')} profileOpen={openPanel === 'profile'} />

        {view === 'map' ? (
          <MapHome
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onPlayLevel={handleSelectLevel}
            onOpenPanel={handleTogglePanel}
            chatUnread={unreadCount}
          />
        ) : (
        <div className="main">
          <LevelPanel
            activeLevel={stats.level}
            onSelectLevel={handleSelectLevel}
            isLocked={level => !canPlay(level)}
            onOpenMap={goToMap}
            openPanel={openPanel}
            onTogglePanel={handleTogglePanel}
            badges={{ chat: unreadCount }}
          />

          <div className="main-content" ref={contentRef}>
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
                <button className="bigbtn" onClick={closePanel}>▶ Înapoi la exercițiu</button>
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
        )}
      </div>

      <ResultModal
        modal={modal}
        onRestart={restartLevel}
        onNextLevel={goToNextLevel}
        onMap={() => { restartLevel(); goToMap(); }}
      />
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
