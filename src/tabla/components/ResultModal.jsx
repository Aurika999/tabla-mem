import { tr } from '../i18n';
export default function ResultModal({
  modal, onRestart, onNextLevel, onMap, onRevive, reviveCost, canRevive,
}) {
  if (!modal) return null;
  return (
    <div className="overlay">
      <div className="modal">
        <div className="reward">🏆</div>
        <h2>{modal.title}</h2>
        <p dangerouslySetInnerHTML={{ __html: modal.text }} />
        {modal.outOfLives && onRevive && (
          <div className="revive-box">
            <button className="bigbtn revive-btn" onClick={onRevive} disabled={!canRevive}>
              {tr('❤️ Continuă cu o viață (−{n} puncte)', { n: reviveCost })}
            </button>
            {!canRevive && <small>{tr('Ai nevoie de cel puțin {n} puncte în total.', { n: reviveCost })}</small>}
          </div>
        )}
        <button className="bigbtn" onClick={onRestart}>{tr('Joacă din nou')}</button>
        {modal.showNext && (
          <button className="bigbtn blue" onClick={onNextLevel}>{tr('Următorul nivel')}</button>
        )}
        {onMap && <button className="bigbtn map-modal-btn" onClick={onMap}>{tr('🗺️ Harta')}</button>}
      </div>
    </div>
  );
}
