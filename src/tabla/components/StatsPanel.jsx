import { LEVELS } from '../data';

export default function StatsPanel({ stats }) {
  return (
    <aside className="panel">
      <h2>📊 STATISTICI</h2>
      <div className="stat">✅ Corecte <span>{stats.correct}</span></div>
      <div className="stat">❌ Greșite <span>{stats.wrong}</span></div>
      <div className="stat">⭐ Puncte <span>{stats.points}</span></div>
      <div className="stat">🔥 Cel mai mare combo <span>{stats.bestCombo}</span></div>
      <div className="stat">🏆 Nivel <span>{LEVELS[stats.level].label}</span></div>
      <div className="reward">🎁</div>
      <p><b>Recompense:</b><br />Fă 3 răspunsuri corecte la rând pentru un combo!</p>
    </aside>
  );
}
