import './App.css';
// Import React hooks: useState (to manage state) and useEffect (to run code at specific times)
import { useState, useEffect } from 'react';
// Import the Pokemon component, which will display individual Pokémon details
import Pokemon from './components/Pokemon.js';

const App = () => {
  // URL for the API that provides pokemon data (limits to the first 151 pokemon)
  const API = 'https://pokeapi.co/api/v2/pokemon?limit=151';
  // stores all Pokémon data (empty list initially)
  const [allPokemon, setAllPokemon] = useState([]);
  // stores the filtered list of pokemon
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  // stores the user's search input (empty string initially)
  const [searchTerm, setSearchTerm] = useState('');

  // stores any errors 
  const [error, setError] = useState(null);

  // useEffect to automatically load Pokemon from API without user needing to search
  useEffect(() => {
    // fetch Pokémon data from the API
    const fetchAllPokemon = async () => {
      try {
        
        const fetchData = await fetch(API);

        // convert response into JSON so we can manipulate the data
        const json = await fetchData.json();

       /* json.results contains basic pokemon info with URLs for details.
          map over each item to fetch detailed data from poke.url.
          return the detailed data in JSON format. */
          const detailedPokemonPromises = json.results.map(async (poke) => {
          const res = await fetch(poke.url); // Fetch detailed data for each Pokémon
          return res.json(); // Convert detailed data into JSON format
        });

        // wait for all detailed pokemon data to be fetched
        const detailedPokemon = await Promise.all(detailedPokemonPromises);

        // save the detailed pokemon data to the `allPokemon` and `filteredPokemon` state
        setAllPokemon(detailedPokemon);
        setFilteredPokemon(detailedPokemon);
      } catch (err) {
        // If there's an error during fetching, show a message in the error state
        console.error(err);
        setError('Failed to fetch Pokemon data.');
      }
    };

    // call the fetch function
    fetchAllPokemon();
  }, []); // Empty dependency array means this runs only once when the component loads

  // function to handle changes in the search input field
  const handleSearchChange = (e) => {
    // get the current value of the input field, converted to lowercase(in case user types in caps)
    const search = e.target.value.toLowerCase();
    setSearchTerm(search); // update the searchTerm state with the new input value

    // filter the list of pokemon based on the search term
    const filtered = allPokemon.filter((pokemon) => {
      
      //if the search term matches the pokemon's ID
      const idMatch = pokemon.id.toString().includes(search);

      //if the search term matches the pokemon's name
      const nameMatch = pokemon.name.toLowerCase().includes(search);

      // if the search term matches any of the pokemon's types
      const typeMatch = pokemon.types.some((typeObj) =>
        typeObj.type.name.toLowerCase().includes(search)
      );

      // if the search term matches any of the pokemons stats
      const statMatch = pokemon.stats.some((statObj) =>
        statObj.stat.name.toLowerCase().includes(search)
      );

      // return true if the search term matches ID, name, type, or stats
      return idMatch || nameMatch || typeMatch || statMatch;
    });

    // update the filteredPokemon state with the filtered list
    setFilteredPokemon(filtered);
  };

  return (
    <div>
      {/* Form with an input field for searching */}
      <form>
        <input
          type="text" // text input field
          value={searchTerm} // Bind the input field to the searchTerm state
          onChange={handleSearchChange} // Call handleSearchChange when the input changes
          placeholder="Search by ID, name, type, or stat" // Placeholder text for the input field
        />
      </form>

      {/* If there's an error, show the error message */}
      {error && <div>{error}</div>}

      {/* Display the filtered list of Pokemon */}
      <div>
        {filteredPokemon.length > 0 ? ( // Check if there are any Pokemon in the filtered list
          filteredPokemon.map((pokemon) => ( // Map over each Pokemon and render a Pokemon component
            <Pokemon key={pokemon.id} pokemon={pokemon} /> // Pass each pokemon's data as props to Pokemon
          ))
        ) : (
          <div>Who's that pokemon?!</div> // Show this message if no pokemon match the search
        )}
      </div>
    </div>
  );
};

export default App;
