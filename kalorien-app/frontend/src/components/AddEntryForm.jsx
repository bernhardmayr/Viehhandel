import { useEffect, useState } from 'react';

export default function AddEntryForm({ foods, onAdd }) {
  const [foodId, setFoodId] = useState('');
  const [grams, setGrams] = useState(100);

  // Default to the first food once the list loads.
  useEffect(() => {
    if (!foodId && foods.length) setFoodId(String(foods[0].id));
  }, [foods, foodId]);

  const selected = foods.find((f) => String(f.id) === String(foodId));
  const preview = selected ? Math.round((selected.calories * grams) / 100) : 0;

  const submit = (e) => {
    e.preventDefault();
    if (!foodId || !grams) return;
    onAdd({ food_id: Number(foodId), grams: Number(grams) });
    setGrams(100);
  };

  if (!foods.length) {
    return <p className="empty">Lege zuerst ein Lebensmittel an.</p>;
  }

  return (
    <form className="add-form" onSubmit={submit}>
      <select value={foodId} onChange={(e) => setFoodId(e.target.value)}>
        {foods.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name} ({f.calories} kcal/100g)
          </option>
        ))}
      </select>
      <input
        type="number"
        min="1"
        step="1"
        value={grams}
        onChange={(e) => setGrams(e.target.value)}
        aria-label="Menge in Gramm"
      />
      <span className="unit">g</span>
      <span className="preview">≈ {preview} kcal</span>
      <button type="submit">Hinzufügen</button>
    </form>
  );
}
