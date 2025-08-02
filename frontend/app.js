const { useState, useEffect } = React;

function AnimalList({ animals }) {
  return (
    <ul>
      {animals.map(a => (
        <li key={a.id}>{a.type} {a.name} - {a.price}€</li>
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
    fetch('http://localhost:3000/api/animals')
      .then(res => res.json())
      .then(setAnimals);
  };

  useEffect(() => {
    loadAnimals();
  }, []);

  const addAnimal = animal => {
    fetch('http://localhost:3000/api/animals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(animal)
    })
      .then(res => res.json())
      .then(newAnimal => setAnimals([...animals, newAnimal]));
  };

  return (
    <div>
      <AnimalList animals={animals} />
      <AddAnimalForm onAdd={addAnimal} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
