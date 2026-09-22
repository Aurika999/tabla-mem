export default function GameControls({ onNext, onRestart }) {
  return (
    <div>
      <button className="bigbtn" onClick={onNext}>▶ Următoarea întrebare</button>
      <button className="bigbtn blue" onClick={onRestart}>↻ Reîncearcă nivelul</button>
    </div>
  );
}
