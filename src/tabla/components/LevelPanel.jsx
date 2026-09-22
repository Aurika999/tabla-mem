import { LEVELS, LEVEL_ORDER, PROBLEME_LEVEL, AVANSATE_LEVEL } from '../data';

const MODE_KEYS = [PROBLEME_LEVEL, AVANSATE_LEVEL];

export default function LevelPanel({ activeLevel, onSelectLevel, children }) {
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

      <h2>📖 MOD</h2>
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

      {children}
    </section>
  );
}
