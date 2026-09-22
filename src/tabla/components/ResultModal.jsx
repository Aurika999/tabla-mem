export default function ResultModal({ modal, onRestart, onNextLevel }) {
  if (!modal) return null;
  return (
    <div className="overlay">
      <div className="modal">
        <div className="reward">🏆</div>
        <h2>{modal.title}</h2>
        <p dangerouslySetInnerHTML={{ __html: modal.text }} />
        <button className="bigbtn" onClick={onRestart}>Joacă din nou</button>
        {modal.showNext && (
          <button className="bigbtn blue" onClick={onNextLevel}>Următorul nivel</button>
        )}
      </div>
    </div>
  );
}
