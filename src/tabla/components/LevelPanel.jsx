import { LEVELS, LEVEL_ORDER, PROBLEME_LEVEL, AVANSATE_LEVEL, LOGIC_LEVELS } from '../data';

const MODE_KEYS = [PROBLEME_LEVEL, AVANSATE_LEVEL];

const INFO_PANELS = [
  { key: 'contest', label: '🏁 CONCURS TEST', hint: 'Minimum 2 jucători, 10 întrebări', className: 'lt' },
  { key: 'leaderboard', label: '🏅 CLASAMENT', hint: 'Cei mai buni jucători', className: 'lb' },
  { key: 'chat', label: '💬 CHAT', hint: 'Vorbește cu ceilalți jucători', className: 'lc' },
];

export default function LevelPanel({
  activeLevel, onSelectLevel, isLocked = () => false, onOpenMap, openPanel, onTogglePanel, badges = {},
}) {
  // În timpul unei probleme de pe Insula Isteților arătăm nivelurile acelei insule.
  const isLogic = LOGIC_LEVELS.includes(activeLevel);
  return (
    <section className="panel level-panel">
      {onOpenMap && (
        <button className="map-back-btn" onClick={onOpenMap}>{isLogic ? '🧩 HARTA INSULEI' : '🗺️ HARTA AVENTURII'}</button>
      )}
      <h2>{isLogic ? '🧩 ISTEȚI' : '🏆 NIVELURI'}</h2>
      <div id="levels">
        {(isLogic ? LOGIC_LEVELS : LEVEL_ORDER).map(key => {
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
