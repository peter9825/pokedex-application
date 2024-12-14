const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for communication with React app
app.use(cors());

// Connect to the SQLite database
const db = new sqlite3.Database('./pokemon.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the database.');
  }
});

// Endpoint to fetch Pokémon data (ID, name, types, and abilities)
app.get('/pokemon', (req, res) => {
  const { search } = req.query;

  console.log(`Search query received: "${search}"`);

  const query = `
    SELECT pokemon_info.id, 
           pokemon_info.name, 
           GROUP_CONCAT(DISTINCT pokemon_types.type) AS types,
           GROUP_CONCAT(DISTINCT pokemon_abilities.ability) AS abilities
    FROM pokemon_info
    LEFT JOIN pokemon_types ON pokemon_info.id = pokemon_types.id
    LEFT JOIN pokemon_abilities ON pokemon_info.id = pokemon_abilities.id
    WHERE pokemon_info.name LIKE ? OR pokemon_info.id = ? OR pokemon_types.type LIKE ?
    GROUP BY pokemon_info.id
  `;

  db.all(query, [`%${search}%`, search, `%${search}%`], (err, rows) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ error: 'Database query failed' });
    }

    console.log('Data fetched successfully:', rows);
    res.json(rows);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
