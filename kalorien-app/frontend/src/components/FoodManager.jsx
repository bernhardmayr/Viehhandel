import { useState } from 'react';

const EMPTY = { name: '', calories: '', protein: '', carbs: '', fat: '' };

export default function FoodManager({ foods, onCreate, onDelete }) {
  const [form, setForm] = useState(EMPTY);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.calories === '') return;
    onCreate({
      name: form.name.trim(),
      calories: Number(form.calories),
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0
    });
    setForm(EMPTY);
  };

  return (
    <div className="food-manager">
      <form className="food-form" onSubmit={submit}>
        <input placeholder="Name" value={form.name} onChange={update('name')} />
        <input type="number" min="0" placeholder="kcal" value={form.calories} onChange={update('calories')} />
        <input type="number" min="0" placeholder="Eiweiß" value={form.protein} onChange={update('protein')} />
        <input type="number" min="0" placeholder="KH" value={form.carbs} onChange={update('carbs')} />
        <input type="number" min="0" placeholder="Fett" value={form.fat} onChange={update('fat')} />
        <button type="submit">Speichern</button>
      </form>
      <p className="hint">Werte jeweils pro 100 g.</p>

      <ul className="food-list">
        {foods.map((f) => (
          <li key={f.id}>
            <span>
              <strong>{f.name}</strong> – {f.calories} kcal
              <span className="food-macros">
                {' '}(E {f.protein} · KH {f.carbs} · F {f.fat})
              </span>
            </span>
            <button className="icon-button" title="Löschen" onClick={() => onDelete(f.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
