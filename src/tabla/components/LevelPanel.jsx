import {
  LEVELS, LEVEL_ORDER, PROBLEME_LEVEL, AVANSATE_LEVEL, LOGIC_LEVELS, FIVE_LEVELS, SIX_LEVELS, SEVEN_LEVELS,
  EIGHT_LEVELS, NINE_LEVELS, FOUR_LEVELS, THREE_LEVELS, TWO_LEVELS, EVAL_LEVELS, DIVISION_LEVELS, HALF_LEVELS, THIRD_LEVELS, QUARTER_LEVELS, FIFTH_LEVELS, DIV6_LEVELS, DIV7_LEVELS, DIV8_LEVELS, DIV9_LEVELS,
} from '../data';
import { NATIONAL_LEVELS } from '../nationalTest';
import { REVIEW_LEVELS } from '../reviewProblems';

const MODE_KEYS = [PROBLEME_LEVEL, AVANSATE_LEVEL];

const INFO_PANELS = [
  { key: 'contest', label: '🏁 CONCURS TEST', hint: 'Minimum 2 jucători, 10 întrebări', className: 'lt' },
  { key: 'leaderboard', label: '🏅 CLASAMENT', hint: 'Cei mai buni jucători', className: 'lb' },
  { key: 'chat', label: '💬 CHAT', hint: 'Vorbește cu ceilalți jucători', className: 'lc' },
];

export default function LevelPanel({
  activeLevel, onSelectLevel, isLocked = () => false, onOpenMap, openPanel, onTogglePanel, badges = {},
}) {
  // Pe Insula Isteților sau pe „Înmulțirea cu 5” arătăm nivelurile acelei insule.
  const island = [
    [LOGIC_LEVELS, '🧩', 'ISTEȚI'], [EVAL_LEVELS, '📝', 'EVALUARE'], [NATIONAL_LEVELS, '🎓', 'EVALUAREA NAȚIONALĂ'], [REVIEW_LEVELS, '🌳', 'RECAPITULARE'], [DIVISION_LEVELS, '➗', 'ÎMPĂRȚIRE'], [HALF_LEVELS, '✌️', 'LA 2'], [THIRD_LEVELS, '🐦', 'LA 3'], [QUARTER_LEVELS, '🍀', 'LA 4'], [FIFTH_LEVELS, '🏮', 'LA 5'], [DIV6_LEVELS, '🍬', 'LA 6'], [DIV7_LEVELS, '📅', 'LA 7'], [DIV8_LEVELS, '🐙', 'LA 8'], [DIV9_LEVELS, '🎯', 'LA 9'], [TWO_LEVELS, '🛷', 'CU 2'], [THREE_LEVELS, '⛄', 'CU 3'], [FOUR_LEVELS, '🐻‍❄️', 'CU 4'], [FIVE_LEVELS, '🖐️', 'CU 5'], [SIX_LEVELS, '🔋', 'CU 6'], [SEVEN_LEVELS, '🪙', 'CU 7'],
    [EIGHT_LEVELS, '🐙', 'CU 8'], [NINE_LEVELS, '🎈', 'CU 9'],
  ].find(([levels]) => levels.includes(activeLevel));
  const islandLevels = island ? island[0] : null;
  const isLogic = Boolean(island);
  const islandIcon = island ? island[1] : '';
  const islandTitle = island ? `${island[1]} ${island[2]}` : '';
  return (
    <section className="panel level-panel">
      {onOpenMap && (
        <button className="map-back-btn" onClick={onOpenMap}>{isLogic ? `${islandIcon} HARTA INSULEI` : '🗺️ HARTA AVENTURII'}</button>
      )}
      <h2>{isLogic ? islandTitle : '🏆 NIVELURI'}</h2>
      <div id="levels">
        {(islandLevels || LEVEL_ORDER).map(key => {
          const level = LEVELS[key];
          return (
            <button
              key={key}
              className={`level ${level.className}${activeLevel === key ? ' active' : ''}${isLocked(key) ? ' locked' : ''}`}
              onClick={() => onSelectLevel(key)}
              disabled={isLocked(key)}
              title={isLocked(key) ? 'Termină nivelul dinainte ca să-l deblochezi' : undefined}
            >
              {isLocked(key) && '🔒 '}{level.label}
              <small>{level.hint}</small>
            </button>
          );
        })}
      </div>

      {!isLogic && (
        <div id="modes">
          {MODE_KEYS.map(key => {
            const mode = LEVELS[key];
            return (
              <button
                key={key}
                className={`level ${mode.className}${activeLevel === key ? ' active' : ''}${isLocked(key) ? ' locked' : ''}`}
                onClick={() => onSelectLevel(key)}
                disabled={isLocked(key)}
                title={isLocked(key) ? 'Termină nivelul dinainte ca să-l deblochezi' : undefined}
              >
                {isLocked(key) && '🔒 '}{mode.label}
                <small>{mode.hint}</small>
              </button>
            );
          })}
        </div>
      )}

      <div id="info-panels">
        {INFO_PANELS.map(panel => (
          <button
            key={panel.key}
            className={`level ${panel.className}${openPanel === panel.key ? ' active' : ''}`}
            onClick={() => onTogglePanel(panel.key)}
          >
            {panel.label}
            {badges[panel.key] > 0 && <span className="level-badge">{badges[panel.key]}</span>}
            <small>{panel.hint}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
