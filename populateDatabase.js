const sqlite3 = require('sqlite3').verbose();
// importing the fetch API to make HTTP requests
const fetch = require('node-fetch');
// importing node path module to create reliable file paths
const path = require('path');

// database connection: connects to the 'pokemon.db' SQLite db
// If it doesn't exist, it will be created in the same directory as the script (project root)
const db = new sqlite3.Database(path.join(__dirname, 'pokemon.db'), (err) => {
  if (err) console.error('Error connecting to database:', err.message);
  else console.log('Connected to the database.');
});

// create the main table and associated tables, using serialize method to run mutliple SQL queries in sequence
db.serialize(() => {
  // drop tables if they already exist to make sure tables are always fresh or if tables need to be added to db
  db.run(`DROP TABLE IF EXISTS pokemon_abilities`);
  db.run(`DROP TABLE IF EXISTS pokemon_types`);
  db.run(`DROP TABLE IF EXISTS pokemon_info`);

  // create pokemon_info table to store basic Pokemon info (id, name, sprite)
  db.run(`
    CREATE TABLE IF NOT EXISTS pokemon_info (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      sprite TEXT
    )
  `);
 
  // create pokemon_types table to store Pokemon types, links to pokemon_info table with id
  db.run(`
    CREATE TABLE IF NOT EXISTS pokemon_types (
      id INTEGER,
      type TEXT,
      FOREIGN KEY (id) REFERENCES pokemon_info(id)
    )
  `);

  // create the pokemon_abilities table to store Pokemon abilities, also links to pokemon_info table with id
  db.run(`
    CREATE TABLE IF NOT EXISTS pokemon_abilities (
      id INTEGER,
      ability TEXT,
      FOREIGN KEY (id) REFERENCES pokemon_info(id)
    )
  `);
});


// Creates 3 query templates that will be ultiized later by .run()
async function populateDatabase() {
  const insertPokemon = db.prepare(`
    INSERT OR REPLACE INTO pokemon_info (id, name, sprite) VALUES (?, ?, ?)
  `);
  const insertType = db.prepare(`
    INSERT INTO pokemon_types (id, type) VALUES (?, ?)
  `);
  const insertAbility = db.prepare(`
    INSERT INTO pokemon_abilities (id, ability) VALUES (?, ?)
  `);

  try {
    // loop through Pokemon IDs from 1 to 151 (first generation Pokemon)
    for (let id = 1; id <= 151; id++) {
       // fetch Pokemon data from the pokeapi for each Pokemon by its id
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokemon = await response.json();

      /*Insert fetched data into following tables*/

      // this information will be used to fill the values for db.prepare statments
      // insert basic info (id, name, sprite) into pokemon_info table
      insertPokemon.run(
        pokemon.id,
        pokemon.name,
        pokemon.sprites?.front_default,
        (err) => {
          if (err) console.error(`Error inserting Pokémon ${pokemon.name}:`, err.message);
        }
      );

      // insert Pokemon's types into pokemon_types table
      pokemon.types.forEach((t) => {
        insertType.run(pokemon.id, t.type.name, (err) => {
          if (err) console.error(`Error inserting type for ${pokemon.name}:`, err.message);
        });
      });

      // Insert Pokemon's abilities into the pokemon_abilities table
      pokemon.abilities.forEach((a) => {
        insertAbility.run(pokemon.id, a.ability.name, (err) => {
          if (err) console.error(`Error inserting ability for ${pokemon.name}:`, err.message);
        });
      });
    }
    console.log('Database population complete.');
  } catch (err) {
    console.error('Error populating database:', err.message);
  } finally {
    // finalize prepared statements to release resources and close database
    insertPokemon.finalize();
    insertType.finalize();
    insertAbility.finalize();
    db.close();
  }
}

populateDatabase();
