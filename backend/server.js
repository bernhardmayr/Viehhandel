const express = require('express');
const cors = require('cors');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));


// In-memory data store
let animals = [
  { id: 1, type: 'Kuh', name: 'Berta', price: 1200 },
  { id: 2, type: 'Kalb', name: 'Max', price: 500 }
];

// List all animals
app.get('/api/animals', (req, res) => {
  res.json(animals);
});

// Add new animal
app.post('/api/animals', (req, res) => {
  const { type, name, price } = req.body;
  if (!type || !name || !price) {
    return res.status(400).json({ message: 'type, name, price required' });
  }
  const id = animals.length ? animals[animals.length - 1].id + 1 : 1;
  const animal = { id, type, name, price };
  animals.push(animal);
  res.status(201).json(animal);
});

// Simple health check
app.get('/', (req, res) => {
  res.send('Viehhandel API running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
