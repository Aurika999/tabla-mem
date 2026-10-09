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
              ❤️ Continuă cu o viață (−{reviveCost} puncte)
            </button>
            {!canRevive && <small>Ai nevoie de cel puțin {reviveCost} puncte în total.</small>}
          </div>
        )}
        <button className="bigbtn" onClick={onRestart}>Joacă din nou</button>
        {modal.showNext && (
          <button className="bigbtn blue" onClick={onNextLevel}>Următorul nivel</button>
        )}
        {onMap && <button className="bigbtn map-modal-btn" onClick={onMap}>🗺️ Harta</button>}
      </div>
    </div>
  );
}
