import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';
import DailySummary from './components/DailySummary.jsx';
import EntryList from './components/EntryList.jsx';
import AddEntryForm from './components/AddEntryForm.jsx';
import FoodManager from './components/FoodManager.jsx';

const todayStr = () => new Date().toISOString().slice(0, 10);

// Default daily calorie goal; persisted in localStorage.
const STORED_GOAL = Number(localStorage.getItem('calorieGoal')) || 2000;

export default function App() {
  const [date, setDate] = useState(todayStr);
  const [goal, setGoal] = useState(STORED_GOAL);
  const [foods, setFoods] = useState([]);
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [showFoods, setShowFoods] = useState(false);

  const loadFoods = useCallback(async () => {
    setFoods(await api.listFoods());
  }, []);

  const loadDay = useCallback(async () => {
    const [e, s] = await Promise.all([api.listEntries(date), api.getSummary(date)]);
    setEntries(e);
    setSummary(s);
  }, [date]);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      await Promise.all([loadFoods(), loadDay()]);
    } catch (err) {
      setError(err.message);
    }
  }, [loadFoods, loadDay]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    localStorage.setItem('calorieGoal', String(goal));
  }, [goal]);

  const run = async (fn) => {
    setError(null);
    try {
      await fn();
      await loadDay();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🥗 Kalorien App</h1>
        <div className="header-controls">
          <label>
            Datum
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label>
            Tagesziel (kcal)
            <input
              type="number"
              min="0"
              step="50"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value) || 0)}
            />
          </label>
        </div>
      </header>

      {error && <div className="error">⚠️ {error}</div>}

      <DailySummary summary={summary} goal={goal} />

      <section className="card">
        <h2>Mahlzeit hinzufügen</h2>
        <AddEntryForm
          foods={foods}
          onAdd={(entry) => run(() => api.addEntry({ ...entry, date }))}
        />
      </section>

      <section className="card">
        <h2>Einträge für {date}</h2>
        <EntryList entries={entries} onDelete={(id) => run(() => api.deleteEntry(id))} />
      </section>

      <section className="card">
        <button className="link-button" onClick={() => setShowFoods((v) => !v)}>
          {showFoods ? '▾ Lebensmittel verbergen' : '▸ Lebensmittel verwalten'}
        </button>
        {showFoods && (
          <FoodManager
            foods={foods}
            onCreate={(food) => run(async () => { await api.createFood(food); await loadFoods(); })}
            onDelete={(id) => run(async () => { await api.deleteFood(id); await loadFoods(); })}
          />
        )}
      </section>

      <footer className="footer">Kalorien App · React + Express + SQLite</footer>
    </div>
  );
}
