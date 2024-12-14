// Script to populate the SQLite database with Pokémon data
console.log('Script started...');

// Import required modules
const sqlite3 = require('sqlite3').verbose(); // SQLite for database operations
const fetch = require('node-fetch'); // Fetch API to get data from the Pokémon API
const path = require('path'); // To resolve file paths

// Database file path
const DB_FILE = path.resolve(__dirname, 'pokemon.db');
console.log(`Database file path: ${DB_FILE}`);

// Initialize the SQLite database
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Function to create tables in the database
const createTables = () => {
  db.serialize(() => {
    // Table 1: pokemon_info (id, name)
    db.run(`
      CREATE TABLE IF NOT EXISTS pokemon_info (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      )
    `, (err) => {
      if (err) console.error('Error creating pokemon_info table:', err.message);
    });

    // Table 2: pokemon_types (id, type)
    db.run(`
      CREATE TABLE IF NOT EXISTS pokemon_types (
        id INTEGER,
        type TEXT NOT NULL,
        FOREIGN KEY (id) REFERENCES pokemon_info (id)
      )
    `, (err) => {
      if (err) console.error('Error creating pokemon_types table:', err.message);
    });

    // Table 3: pokemon_abilities (id, ability)
    db.run(`
      CREATE TABLE IF NOT EXISTS pokemon_abilities (
        id INTEGER,
        ability TEXT NOT NULL,
        FOREIGN KEY (id) REFERENCES pokemon_info (id)
      )
    `, (err) => {
      if (err) console.error('Error creating pokemon_abilities table:', err.message);
    });

    console.log('Tables created successfully.');
  });
};

// Function to fetch Pokémon data from the API and insert it into the database
const fetchAndInsertData = async () => {
  // API URL to fetch the first 151 Pokémon
  const API = 'https://pokeapi.co/api/v2/pokemon?limit=151';

  try {
    console.log('Fetching Pokémon data from the API...');
    const res = await fetch(API);

    // Check if the API request was successful
    if (!res.ok) throw new Error(`Failed to fetch data: ${res.statusText}`);

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid API response.');
    }

    /* Fetch detailed Pokémon data for each Pokémon in the list.
       This includes the Pokémon's ID, name, types, and abilities. */
    const detailedPokemonPromises = data.results.map(async (poke) => {
      const detailedRes = await fetch(poke.url);
      return detailedRes.json();
    });

    const detailedPokemon = await Promise.all(detailedPokemonPromises);

    // Start a transaction to improve performance and data integrity
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      // Prepare SQL statements for inserting data into the tables
      const insertInfo = db.prepare(`INSERT OR IGNORE INTO pokemon_info (id, name) VALUES (?, ?)`);
      const insertType = db.prepare(`INSERT INTO pokemon_types (id, type) VALUES (?, ?)`);
      const insertAbility = db.prepare(`INSERT INTO pokemon_abilities (id, ability) VALUES (?, ?)`);

      /* Iterate through each Pokémon and insert its data into the database tables.
         Types and abilities are extracted safely to avoid undefined values. */
      detailedPokemon.forEach((pokemon) => {
        // Insert Pokémon info (ID and name)
        insertInfo.run(pokemon.id, pokemon.name, (err) => {
          if (err) console.error(`Error inserting into pokemon_info: ${err.message}`);
        });

        // Insert each Pokémon type
        pokemon.types.forEach((typeObj) => {
          const typeName = typeObj.type?.name; // Safely access the "name" property
          if (typeName) {
            insertType.run(pokemon.id, typeName, (err) => {
              if (err) console.error(`Error inserting into pokemon_types: ${err.message}`);
            });
          }
        });

        // Insert each Pokémon ability
        pokemon.abilities.forEach((abilityObj) => {
          const abilityName = abilityObj.ability?.name; // Safely access the "name" property
          if (abilityName) {
            insertAbility.run(pokemon.id, abilityName, (err) => {
              if (err) console.error(`Error inserting into pokemon_abilities: ${err.message}`);
            });
          }
        });
      });

      // Finalize the prepared statements and commit the transaction
      insertInfo.finalize();
      insertType.finalize();
      insertAbility.finalize();

      db.run("COMMIT", (err) => {
        if (err) console.error('Error during COMMIT:', err.message);
        else console.log('Transaction committed successfully.');
        db.close(() => console.log('Database connection closed.'));
      });
    });
  } catch (err) {
    console.error('Error fetching Pokémon data:', err.message);
  }
};

// Run the functions: Create tables and populate data
createTables(); // Create database tables if they don't already exist
fetchAndInsertData(); // Fetch and insert Pokémon data
