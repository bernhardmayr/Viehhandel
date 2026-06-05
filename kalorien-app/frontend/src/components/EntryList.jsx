export default function EntryList({ entries, onDelete }) {
  if (!entries.length) {
    return <p className="empty">Noch keine Einträge für diesen Tag.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Lebensmittel</th>
          <th className="num">Menge</th>
          <th className="num">kcal</th>
          <th className="num">E</th>
          <th className="num">KH</th>
          <th className="num">F</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {entries.map((e) => (
          <tr key={e.id}>
            <td>{e.food.name}</td>
            <td className="num">{e.grams} g</td>
            <td className="num">{e.calories}</td>
            <td className="num">{e.protein}</td>
            <td className="num">{e.carbs}</td>
            <td className="num">{e.fat}</td>
            <td className="num">
              <button
                className="icon-button"
                title="Eintrag löschen"
                onClick={() => onDelete(e.id)}
              >
                ✕
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
