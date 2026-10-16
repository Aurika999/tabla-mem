import { useEffect, useRef, useState } from 'react';
import './TablaInmultirii.css';
import { useTablaGame, REVIVE_COST } from './useTablaGame';
import { usePlayerProfile } from './usePlayerProfile';
import { submitScore, addPlayerPoints, useMyTotalPoints, useMyScores } from './useLeaderboard';
import { isLevelUnlocked, mapViewOf } from './mapProgress';
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
import HomeIslands from './components/HomeIslands';
import LogicMap from './components/LogicMap';
import EvalMap from './components/EvalMap';
import DivisionMap from './components/DivisionMap';
import HalfMap from './components/HalfMap';
import ThirdMap from './components/ThirdMap';
import QuarterMap from './components/QuarterMap';
import FifthMap from './components/FifthMap';
import { SixMap, SevenMap, EightMap, NineMap } from './components/DivisorMaps';
import LessonMap from './components/LessonMap';

const PAGE_TITLE = 'Tabla Înmulțirii';
// Sub această lățime coloanele stau una sub alta (vezi .main în CSS).
const STACKED_LAYOUT_QUERY = '(max-width: 900px)';

export default function TablaInmultirii() {
  // 'map' = prima pagină (harta aventurii); 'game' = exercițiile și panourile.
  // 'home' = prima pagină (Arena, Învață, Insula Isteților), 'map' = harta nivelurilor
  // de înmulțire, 'logic' = harta Insulei Isteților, 'game' = exercițiu/panouri.
  const [view, setView] = useState('home');
  const [openPanel, setOpenPanel] = useState(null);

  // Pe mobil, conținutul (exercițiul sau panoul deschis) e sub lista de niveluri;
  // după fiecare alegere a utilizatorului derulăm până la el.
  const contentRef = useRef(null);
  const [scrollRequest, setScrollRequest] = useState(0);
  const scrollToContent = () => setScrollRequest(n => n + 1);

  useEffect(() => {
    if (scrollRequest === 0 || !window.matchMedia(STACKED_LAYOUT_QUERY).matches) return;
    // Instant, nu lin: pe telefoanele lente derularea lină se putea opri la jumătate.
    contentRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
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
    questionsPerLevel, selectLevel, restartLevel, goToNextLevel, reviveWithLife, skipItem, goToItem, isExam,
    handleAnswer, toggleHint, goToNextQuestionOrFinish,
  } = useTablaGame(
    // Nivelul de pornire: prima insulă din Insula Isteților (nivelurile vechi 1–5 nu se mai joacă).
    'ist1',
    view !== 'game' || openPanel !== null || showAuthGate || showNameGate || (firebaseEnabled && !ready),
  );

  // Nivelurile terminate deblochează nivelurile următoare (harta progresivă).
  const { scores: myScores } = useMyScores(uid);
  const canPlay = level => !firebaseEnabled || isLevelUnlocked(myScores, level);

  // Punctele rundei se adaugă la total abia la final (când apare rezultatul);
  // până atunci le arătăm separat, ca să nu fie numărate de două ori.
  const savedTotalPoints = useMyTotalPoints(uid);
  // Punctele deja trecute în total din runda curentă (după o viață cumpărată
  // runda continuă, iar la final adăugăm doar ce s-a câștigat de atunci).
  const savedRoundRef = useRef({ roundId: null, points: 0 });
  const alreadySaved = savedRoundRef.current.roundId === stats.roundId ? savedRoundRef.current.points : 0;
  const roundPoints = modal ? 0 : stats.points - alreadySaved;

  // De unde a fost deschis panoul ('home' sau 'map'): atunci „înapoi” duce
  // acolo, nu la un exercițiu pe care jucătorul nici nu l-a început.
  const [panelOrigin, setPanelOrigin] = useState(null);

  const handleSelectLevel = level => {
    if (!canPlay(level)) return;
    setPanelOrigin(null);
    setView('game');
    setOpenPanel(null);
    selectLevel(level);
    scrollToContent();
  };

  const goToView = target => {
    setPanelOrigin(null);
    setOpenPanel(null);
    setView(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // „Harta” din exercițiu duce pe harta insulei din care face parte nivelul.
  const goToMap = () => goToView(mapViewOf(stats.level));
  const goToLearnMap = () => goToView('map');
  const goToLogicMap = () => goToView('logic');
  const goToEvalMap = () => goToView('eval');
  const goToLesson = factor => goToView(`lesson${factor}`);
  const goToLessonsHub = () => goToView('lessons');
  const goToSchool = () => goToView('school');
  const goToDivisionHub = () => goToView('division');
  const goToNationalHub = () => goToView('national');
  const goToDivisionLesson = () => goToView('divlesson');
  const goToHalfLesson = () => goToView('halflesson');
  const goToThirdLesson = () => goToView('thirdlesson');
  const goToQuarterLesson = () => goToView('quarterlesson');
  const goToFifthLesson = () => goToView('fifthlesson');
  const goToSixLesson = () => goToView('sixlesson');
  const goToSevenLesson = () => goToView('sevenlesson');
  const goToEightLesson = () => goToView('eightlesson');
  const goToNineLesson = () => goToView('ninelesson');
  const lessonFactor = view.startsWith('lesson') ? Number(view.slice(6)) : null;
  const goToHome = () => goToView('home');

  const closePanel = () => {
    if (panelOrigin) {
      goToView(panelOrigin);
      return;
    }
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

  const handleOpenPanel = key => {
    // Cererea de permisiune trebuie să vină dintr-un clic al utilizatorului.
    if (key === 'chat') requestSystemNotifications();
    if (view !== 'game') {
      // De pe prima pagină sau de pe hartă, panoul se deschide mereu.
      setPanelOrigin(view);
      setView('game');
      setOpenPanel(key);
    } else if (openPanel !== key) {
      // Clicurile repetate pe același meniu îl lasă deschis; ieșirea se face
      // doar din butoanele cu săgeată („Înapoi la hartă / la exercițiu”).
      setOpenPanel(key);
    }
    scrollToContent();
  };

  const openChatWith = peer => {
    setChatPeer(peer);
    if (view !== 'game') setPanelOrigin(view);
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
    // Doar o rundă dusă până la capăt contează ca nivel terminat (deblochează
    // nivelul următor); dacă s-au terminat viețile, păstrăm doar punctele.
    if (!modal.outOfLives) submitScore({
      uid, name, level: stats.level,
      points: stats.points, correct: stats.correct, bestCombo: stats.bestCombo,
    });
    const saved = savedRoundRef.current.roundId === stats.roundId ? savedRoundRef.current.points : 0;
    addPlayerPoints({ uid, name, pointsEarned: stats.points - saved });
    savedRoundRef.current = { roundId: stats.roundId, points: stats.points };
  }, [modal, uid, name, stats.level, stats.points, stats.correct, stats.bestCombo, stats.roundId]);

  // O viață costă puncte din total; runda continuă de unde a rămas.
  const handleRevive = () => {
    if (savedTotalPoints < REVIVE_COST) return;
    addPlayerPoints({ uid, name, pointsEarned: -REVIVE_COST });
    reviveWithLife();
  };

  const handleLogout = async () => {
    if (!window.confirm('Sigur vrei să ieși din cont?')) return;
    hangUp();
    setOpenPanel(null);
    setChatPeer(null);
    setContestId(null);
    setPanelOrigin(null);
    setView('home');
    await logout();
  };

  return (
    <div className="tabla-inmultirii">
      <div className="app">
        <Header totalPoints={savedTotalPoints + roundPoints} roundPoints={roundPoints} lives={stats.lives} combo={stats.combo} time={isExam ? null : time}
          inGame={view === 'game' && !openPanel} playerName={name} playerCountry={country}
          playerAvatar={avatar} accountEmail={isAnonymous ? '' : email}
          onOpenProfile={() => handleOpenPanel('profile')} profileOpen={openPanel === 'profile'}
          onHome={goToHome} />

        {view === 'home' && (
          <HomeIslands
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onOpenSchool={goToSchool}
            onOpenNational={level => handleSelectLevel(level)}
            onOpenPanel={handleOpenPanel}
            chatUnread={unreadCount}
          />
        )}
        {view === 'school' && (
          <HomeIslands
            mode="school"
            onOpenNationalHub={goToNationalHub}
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onOpenLearn={goToLearnMap}
            onOpenLogic={goToLogicMap}
            onOpenEval={goToEvalMap}
            onOpenLessons={goToLessonsHub}
            onOpenDivision={goToDivisionHub}
            onOpenPanel={handleOpenPanel}
            onBack={goToHome}
            chatUnread={unreadCount}
          />
        )}
        {view === 'map' && (
          <MapHome
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onPlayLevel={handleSelectLevel}
            onOpenPanel={handleOpenPanel}
            chatUnread={unreadCount}
            onBack={goToSchool}
          />
        )}
        {view === 'lessons' && (
          <HomeIslands
            mode="lessons"
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onOpenLesson={goToLesson}
            onOpenPanel={handleOpenPanel}
            onBack={goToSchool}
            chatUnread={unreadCount}
          />
        )}
        {view === 'national' && (
          <HomeIslands
            mode="national"
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onOpenNational={level => handleSelectLevel(level)}
            onOpenPanel={handleOpenPanel}
            onBack={goToSchool}
            chatUnread={unreadCount}
          />
        )}
        {view === 'division' && (
          <HomeIslands
            mode="division"
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onOpenDivisionLesson={goToDivisionLesson}
            onOpenHalfLesson={goToHalfLesson}
            onOpenThirdLesson={goToThirdLesson}
            onOpenQuarterLesson={goToQuarterLesson}
            onOpenFifthLesson={goToFifthLesson}
            onOpenSixLesson={goToSixLesson}
            onOpenSevenLesson={goToSevenLesson}
            onOpenEightLesson={goToEightLesson}
            onOpenNineLesson={goToNineLesson}
            onOpenPanel={handleOpenPanel}
            onBack={goToSchool}
            chatUnread={unreadCount}
          />
        )}
        {view === 'divlesson' && (
          <DivisionMap
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onPlayLevel={handleSelectLevel}
            onBack={goToDivisionHub}
          />
        )}
        {view === 'halflesson' && (
          <HalfMap
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onPlayLevel={handleSelectLevel}
            onBack={goToDivisionHub}
          />
        )}
        {view === 'thirdlesson' && (
          <ThirdMap
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onPlayLevel={handleSelectLevel}
            onBack={goToDivisionHub}
          />
        )}
        {view === 'quarterlesson' && (
          <QuarterMap
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onPlayLevel={handleSelectLevel}
            onBack={goToDivisionHub}
          />
        )}
        {view === 'fifthlesson' && (
          <FifthMap
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onPlayLevel={handleSelectLevel}
            onBack={goToDivisionHub}
          />
        )}
        {view === 'sixlesson' && (
          <SixMap
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onPlayLevel={handleSelectLevel}
            onBack={goToDivisionHub}
          />
        )}
        {view === 'sevenlesson' && (
          <SevenMap
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onPlayLevel={handleSelectLevel}
            onBack={goToDivisionHub}
          />
        )}
        {view === 'eightlesson' && (
          <EightMap
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onPlayLevel={handleSelectLevel}
            onBack={goToDivisionHub}
          />
        )}
        {view === 'ninelesson' && (
          <NineMap
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onPlayLevel={handleSelectLevel}
            onBack={goToDivisionHub}
          />
        )}
        {view === 'eval' && (
          <EvalMap
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onPlayLevel={handleSelectLevel}
            onBack={goToSchool}
          />
        )}
        {view === 'logic' && (
          <LogicMap
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onPlayLevel={handleSelectLevel}
            onBack={goToSchool}
          />
        )}
        {lessonFactor && (
          <LessonMap
            key={lessonFactor}
            factor={lessonFactor}
            name={name}
            scores={firebaseEnabled ? myScores : {}}
            onPlayLevel={handleSelectLevel}
            onBack={goToLessonsHub}
          />
        )}
        {view === 'game' && (
        <div className="main">
          <LevelPanel
            activeLevel={stats.level}
            onSelectLevel={handleSelectLevel}
            isLocked={level => !canPlay(level)}
            onOpenMap={goToMap}
            openPanel={openPanel}
            onTogglePanel={handleOpenPanel}
            badges={{ chat: unreadCount }}
          />

          <div className="main-content" ref={contentRef}>
            {/* Pe telefon lista de niveluri e ascunsă (nivelurile se aleg de pe hartă). */}
            <button className="map-back-btn phone-only" onClick={goToMap}>🗺️ HARTA AVENTURII</button>
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
                <button className="bigbtn" onClick={closePanel}>
                  {{
                    home: '🏝️ Înapoi la prima pagină', map: '🗺️ Înapoi la hartă', logic: '🧩 Înapoi la insulă', eval: '📝 Înapoi la insulă',
                    lessons: '📘 Înapoi la Tabla înmulțirii', school: '🎒 Înapoi la Insula Învățării',
                    division: '➗ Înapoi la Tabla împărțirii', national: '🎓 Înapoi la Evaluarea Națională', divlesson: '➗ Înapoi la insulă', halflesson: '✌️ Înapoi la insulă', thirdlesson: '🐦 Înapoi la insulă', quarterlesson: '🍀 Înapoi la insulă', fifthlesson: '🏮 Înapoi la insulă', sixlesson: '🍬 Înapoi la insulă', sevenlesson: '📅 Înapoi la insulă', eightlesson: '🐙 Înapoi la insulă', ninelesson: '🎯 Înapoi la insulă',
                  }[panelOrigin] || (panelOrigin?.startsWith('lesson') && '📖 Înapoi la insulă')
                    || '▶ Înapoi la exercițiu'}
                </button>
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
                isExam={isExam}
                onSkip={skipItem}
                onGoToItem={goToItem}
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
        onRevive={handleRevive}
        reviveCost={REVIVE_COST}
        canRevive={firebaseEnabled && savedTotalPoints >= REVIVE_COST}
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
