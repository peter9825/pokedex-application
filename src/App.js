
// Import React hooks: useState (to manage state) and useEffect (to run code at specific times)
import { useState, useEffect } from 'react';
// Import the Pokemon component, which will display individual Pokemon details
import Pokemon from './components/Pokemon.js';
import pokemonLogo from './assets/pokemon_logo.png';
import unknownPokemon from './assets/unkown_pokemon.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  // URL for the API that provides pokemon data (limits to the first 151 pokemon)
  const API = 'https://pokeapi.co/api/v2/pokemon?limit=151';
  // stores all Pokemon data (empty list initially)
  const [allPokemon, setAllPokemon] = useState([]);
  // stores the filtered list of Pokemon
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  // stores the user's search input (empty string initially)
  const [searchTerm, setSearchTerm] = useState('');

  // stores any errors 
  const [error, setError] = useState(null);

  // useEffect to automatically load Pokemon from API without user needing to search
  useEffect(() => {
    // fetch Pokemon data from the API
    const fetchAllPokemon = async () => {
      try {
        // fetch the list of the first 151 Pokémon
        const fetchData = await fetch(API);

        // convert response into JSON so we can manipulate the data
        const json = await fetchData.json();

        /*  maps over the list of basic Pokemon data, fetches detailed information for each Pokemon, 
        and returns an array of promises that resolve to the detailed data for all the Pokemon. */
        const detailedPokemonPromises = json.results.map(async (poke) => {
          const res = await fetch(poke.url); // Fetch detailed data for each Pokemon
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
        setError('Failed to fetch Pokémon data from the API.');
      }
    };

    // call the fetch function
    fetchAllPokemon();
  }, []); // Empty dependency array runs only once when the component loads

  // function to handle changes in the search input field
  const handleSearchChange = (e) => {
    // get the current value of the input field, converted to lowercase (in case user types in caps)
    const search = e.target.value.toLowerCase();
    setSearchTerm(search); // update the searchTerm state with the new input value

    // filter the list of Pokemon based on the search term
    const filtered = allPokemon.filter((pokemon) => {
      // if the search term matches the pokemon's ID
      const idMatch = pokemon.id.toString().includes(search);

      // if the search term matches the Pokemon's name
      const nameMatch = pokemon.name.toLowerCase().includes(search);

      // if the search term matches any of the Pokemon's types
      const typeMatch = pokemon.types.some((typeObj) =>
        typeObj.type.name.toLowerCase().includes(search)
      );

      // return true if the search term matches ID, name, or type
      return idMatch || nameMatch || typeMatch;
    });

    // update the filteredPokemon state with the filtered list
    setFilteredPokemon(filtered);
  };

  return (
    <>
      {/* Pokemon logo */}
      <div className="logo-container">
        <img src={pokemonLogo} alt="Pokemon Logo" className="pokemon-logo" />
        <h1 className="slogan">Gotta Store 'Em All!</h1>
      </div>
  
      {/* Main content */}
      <div>
        {/* Form with an input field for searching */}
        <form className="d-flex justify-content-center my-3">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by ID, name, or type"
            className="form-control w-50"
          />
        </form>
  
        {/* If there's an error, show the error message */}
        {error && <div>{error}</div>}
  
        {/* Display the filtered list of Pokemon */}
        <div className="pokemon-container">
          {filteredPokemon.length > 0 ? (
            filteredPokemon.map((pokemon) => (
              <Pokemon key={pokemon.id} pokemon={pokemon} />
            ))
          ) : (
               // show the unknown Pokemon image if no results match
            <div className="text-center">
              <img
                src={unknownPokemon}
                alt="Unknown Pokémon"
                style={{ width: '200px', margin: '20px' }}
              />
              <p className='h6'>Who's that Pokemon?!</p>
              <p className='h6'>Pokemon not found in Database</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
  
  };
  
  export default App;