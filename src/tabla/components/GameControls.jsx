export default function GameControls({ onNext, onRestart, onSkip }) {
  return (
    <div>
      {onSkip
        ? <button className="bigbtn orange" onClick={onSkip}>⏭ Sar peste, revin mai târziu</button>
        : <button className="bigbtn" onClick={onNext}>▶ Următoarea întrebare</button>}
      <button className="bigbtn blue" onClick={onRestart}>↻ Reîncearcă nivelul</button>
    </div>
  );
}
