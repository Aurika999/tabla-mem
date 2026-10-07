import { LEVELS, LEVEL_ORDER, PROBLEME_LEVEL, AVANSATE_LEVEL } from '../data';

const MODE_KEYS = [PROBLEME_LEVEL, AVANSATE_LEVEL];

const INFO_PANELS = [
  { key: 'stats', label: '📊 STATISTICI', hint: 'Cum te descurci', className: 'ls' },
  { key: 'leaderboard', label: '🏅 CLASAMENT', hint: 'Cei mai buni jucători', className: 'lb' },
];

export default function LevelPanel({ activeLevel, onSelectLevel, openPanel, onTogglePanel }) {
  return (
    <section className="panel">
      <h2>🏆 NIVELURI</h2>
      <div id="levels">
        {LEVEL_ORDER.map(key => {
          const level = LEVELS[key];
          return (
            <button
              key={key}
              className={`level ${level.className}${activeLevel === key ? ' active' : ''}`}
              onClick={() => onSelectLevel(key)}
            >
              {level.label}
              <small>{level.hint}</small>
            </button>
          );
        })}
      </div>

      <div id="modes">
        {MODE_KEYS.map(key => {
          const mode = LEVELS[key];
          return (
            <button
              key={key}
              className={`level ${mode.className}${activeLevel === key ? ' active' : ''}`}
              onClick={() => onSelectLevel(key)}
            >
              {mode.label}
              <small>{mode.hint}</small>
            </button>
          );
        })}
      </div>

      <div id="info-panels">
        {INFO_PANELS.map(panel => (
          <button
            key={panel.key}
            className={`level ${panel.className}${openPanel === panel.key ? ' active' : ''}`}
            onClick={() => onTogglePanel(panel.key)}
          >
            {panel.label}
            <small>{panel.hint}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
