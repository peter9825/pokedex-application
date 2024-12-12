import './App.css';
// Import React hooks: useState (to manage state) and useEffect (to run code at specific times)
import { useState, useEffect } from 'react';
// Import the Pokemon component, which will display individual Pokemon details
import Pokemon from './components/Pokemon.js';

const App = () => {
  // URL for the local server that provides Pokemon data
  const API = 'http://localhost:3001/pokemon';
  // stores all Pokemon data (empty list initially)
  const [allPokemon, setAllPokemon] = useState([]);
  // stores the filtered list of Pokemon
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  // stores the user's search input (empty string initially)
  const [searchTerm, setSearchTerm] = useState('');
  // stores any errors 
  const [error, setError] = useState(null);

  // Function to fetch Pokemon data from the local server
  const fetchLocalPokemon = async (search = '') => {
    try {
      /* Fetch data from the local Express server.
         Pass the current search term to filter results. */
      const res = await fetch(`${API}?search=${search}`);
      const data = await res.json();

      // Save the fetched data to the `allPokemon` and `filteredPokemon` state
      setAllPokemon(data);
      setFilteredPokemon(data);
    } catch (err) {
      // If there's an error during fetching, update the error state
      console.error('Error fetching data from server:', err.message);
      setError('Failed to fetch Pokemon data from the database.');
    }
  };

  // useEffect to automatically load Pokemon data when the component first loads
  useEffect(() => {
    fetchLocalPokemon(); // Fetch all Pokemon data initially (empty search)
  }, []); // Empty dependency array means this runs only once when the component loads

  // Function to handle changes in the search input field
  const handleSearchChange = (e) => {
    // get the current value of the input field, converted to lowercase (in case user types in caps)
    const search = e.target.value.toLowerCase();
    setSearchTerm(search); // update the searchTerm state with the new input value

    // Fetch updated Pokemon data from the server based on the current search term
    fetchLocalPokemon(search);
  };

  return (
    <div>
      {/* Form with an input field for searching */}
      <form>
        <input
          type="text" // text input field
          value={searchTerm} // Bind the input field to the searchTerm state
          onChange={handleSearchChange} // Call handleSearchChange when the input changes
          placeholder="Search by ID, name, or type" // Placeholder text for the input field
        />
      </form>

      {/* If there's an error, show the error message */}
      {error && <div>{error}</div>}

      {/* Display the filtered list of Pokemon */}
      <div>
        {filteredPokemon.length > 0 ? ( // Check if there are any Pokemon in the filtered list
          filteredPokemon.map((pokemon) => ( // Map over each Pokemon and render a Pokemon component
            <Pokemon key={pokemon.id} pokemon={pokemon} /> // Pass each Pokemon's data as props to Pokemon
          ))
        ) : (
          <div>Who's that Pokemon?!</div> // Show this message if no Pokemon match the search
        )}
      </div>
    </div>
  );
};

export default App;
