import React, { useState, useEffect } from 'react';
import Pokemon from './components/Pokemon.js';
import pokemonLogo from './assets/pokemon_logo.png';
import unknownPokemon from './assets/unkown_pokemon.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {

  /*Using the following States*/ 

  // hold the search term input by the user
  const [searchTerm, setSearchTerm] = useState('');
  // hold the full list of Pokemon fetched from the server
  const [pokemonList, setPokemonList] = useState([]); 
  // hold the filtered list of Pokemon based on the search
  const [filteredPokemon, setFilteredPokemon] = useState([]); 
  // hold error message if fetch fails
  const [error, setError] = useState(null); 

  // useEffect hook to fetch all Pokemon data when the app loads  
  useEffect(() => {
    // function to fetch all Pokemon data from the backend server
    const fetchAllPokemon = async () => {
      try {
        /*fetch data from backend, parse json response,*/
        const response = await fetch('http://localhost:3001/pokemon');
        const data = await response.json();
        // store full list of pokemon
        setPokemonList(data);
        // set filtered pokemon to full list (initially)
        setFilteredPokemon(data); 
      } catch (err) {
        console.error('Error fetching Pokemon data:', err);
        setError('Failed to load Pokemon data. Please try again later.');
      }
    };

    //call function to fetch all Pokemon data
    fetchAllPokemon();
  }, []);

  // handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // filter the pokemon list based on search term
    const filtered = pokemonList.filter((pokemon) => {
      const name = pokemon.name?.toLowerCase() || '';
      const id = pokemon.id?.toString() || '';
      const types = pokemon.types?.toLowerCase() || '';
      const abilities = pokemon.abilities?.toLowerCase() || '';

      // check if the search term matches any of the Pokemon's properties
      return (
        name.includes(value) ||
        id.includes(value) ||
        types.includes(value) ||
        abilities.includes(value)
      );
    });

    // update filtered Pokemon list state with the search results
    setFilteredPokemon(filtered);
  };
                          /*UI*/
  return (
      <>
        <div className="logo-container text-center">
          <img src={pokemonLogo} alt="Pokemon Logo" className="pokemon-logo mb-2" />
          <h1 className="slogan mb-4">Gotta Store 'Em All!</h1>
          <form className="d-flex justify-content-center my-3">
            <div className="input-group w-50">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-control"
                placeholder="Search by ID, name, type, or ability"
              />
              <button  style={{ backgroundColor:'#FFFFFF', borderStyle: 'none'}} className="btn btn-primary" type="button" disabled>
                🔍
              </button>
            </div>
          </form>
        </div>
  
        <div>
          {error && <div>{error}</div>}
          <div className="pokemon-container">
            {filteredPokemon.length > 0 ? (
              // If there are filtered Pokemon, map through them and display each of them using the Pokemon component
              filteredPokemon.map((pokemon) => (
                <Pokemon key={pokemon.id} pokemon={pokemon} /> // pass Pokemon data as props to the Pokemon component
              ))
            ) : (
              <div className="text-center">
                <img
                  src={unknownPokemon}
                  alt="Unknown Pokémon"
                  style={{ width: '200px', margin: '20px' }}
                />
                <p className="h6">Who's that Pokemon?!</p>
                <p className="h6">Pokemon not found in Database</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };
  
  

export default App;
