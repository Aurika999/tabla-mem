import { tr } from '../i18n';
export default function GameControls({ onNext, onRestart, onSkip }) {
  return (
    <div>
      {onSkip
        ? <button className="bigbtn orange" onClick={onSkip}>{tr('⏭ Sar peste, revin mai târziu')}</button>
        : <button className="bigbtn" onClick={onNext}>{tr('▶ Următoarea întrebare')}</button>}
      <button className="bigbtn blue" onClick={onRestart}>{tr('↻ Reîncearcă nivelul')}</button>
    </div>
  );
}
