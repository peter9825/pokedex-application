// express framework for building the server
const express = require('express');
// library to interact with SQLite database
const sqlite3 = require('sqlite3').verbose();
// middleware to enable cross-origin resource Sharing
const cors = require('cors');
const path = require('path');

// initialize express application
const app = express();
app.use(cors());

//  connect to the SQLite database 'pokemon.db' (located in project root)
const db = new sqlite3.Database(path.join(__dirname, 'pokemon.db'), (err) => {
  if (err) console.error('Error connecting to database:', err.message);
  else console.log('Connected to the database.');
});

// run query to query pokemon data from database
app.get('/pokemon', (req, res) => {
  const query = `
    SELECT pokemon_info.id, 
           pokemon_info.name, 
           pokemon_info.sprite,
           GROUP_CONCAT(DISTINCT pokemon_types.type) AS types,
           GROUP_CONCAT(DISTINCT pokemon_abilities.ability) AS abilities
    FROM pokemon_info
    LEFT JOIN pokemon_types ON pokemon_info.id = pokemon_types.id
    LEFT JOIN pokemon_abilities ON pokemon_info.id = pokemon_abilities.id
    GROUP BY pokemon_info.id
  `;

  //sanatize db response (make sure all fields are returned as same type (String))
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database query error:', err.message);
      res.status(500).json({ error: 'Database query failed' });
    } else {
      const sanitizedRows = rows.map((row) => ({
        id: row.id,
        name: row.name || '',
        sprite: row.sprite || '',
        types: row.types || '',
        abilities: row.abilities || '',
      }));

      //send sanatized rows back as JSON response
      res.json(sanitizedRows);
    }
  });
});


// start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
