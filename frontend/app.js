const { useState, useEffect } = React;

function AnimalList({ animals, onBuy }) {
  return (
    <ul>
      {animals.map(a => (
        <li key={a.id}>
          {a.type} {a.name} - {a.price}€
          <button onClick={() => onBuy(a.id)}>Kaufen</button>
        </li>
      ))}
    </ul>
  );
}

function AddAnimalForm({ onAdd }) {
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onAdd({ type, name, price: Number(price) });
    setType('');
    setName('');
    setPrice('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Typ:<input value={type} onChange={e => setType(e.target.value)} /></label>
      <label>Name:<input value={name} onChange={e => setName(e.target.value)} /></label>
      <label>Preis:<input type="number" value={price} onChange={e => setPrice(e.target.value)} /></label>
      <button type="submit">Angebot erstellen</button>
    </form>
  );
}

function App() {
  const [animals, setAnimals] = useState([]);

  const loadAnimals = () => {
    fetch('/api/animals')
      .then(res => res.json())
      .then(setAnimals);
  };

  useEffect(() => {
    loadAnimals();
  }, []);

  const addAnimal = animal => {
    fetch('/api/animals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(animal)
    })
      .then(res => res.json())
      .then(newAnimal => setAnimals(prev => [...prev, newAnimal]));
  };

  const buyAnimal = id => {
    if (!window.confirm('Direktkauf bestätigen?')) return;
    fetch(`/api/animals/${id}/buy`, { method: 'POST' })
      .then(() => loadAnimals());
  };

  return (
    <div>
      <h2>Aktuelle Tiere</h2>
      <AnimalList animals={animals} onBuy={buyAnimal} />
      <AddAnimalForm onAdd={addAnimal} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
