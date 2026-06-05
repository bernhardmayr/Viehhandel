export default function DailySummary({ summary, goal }) {
  if (!summary) return null;

  const { calories, protein, carbs, fat } = summary;
  const pct = goal > 0 ? Math.min(100, Math.round((calories / goal) * 100)) : 0;
  const remaining = Math.round((goal - calories) * 10) / 10;
  const over = remaining < 0;

  return (
    <section className="card summary">
      <div className="summary-head">
        <div>
          <span className="summary-kcal">{calories}</span>
          <span className="summary-unit"> / {goal} kcal</span>
        </div>
        <div className={over ? 'remaining over' : 'remaining'}>
          {over ? `${Math.abs(remaining)} kcal über dem Ziel` : `${remaining} kcal übrig`}
        </div>
      </div>

      <div className="progress">
        <div
          className={over ? 'progress-bar over' : 'progress-bar'}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="macros">
        <Macro label="Eiweiß" value={protein} />
        <Macro label="Kohlenhydrate" value={carbs} />
        <Macro label="Fett" value={fat} />
      </div>
    </section>
  );
}

function Macro({ label, value }) {
  return (
    <div className="macro">
      <span className="macro-value">{value} g</span>
      <span className="macro-label">{label}</span>
    </div>
  );
}
