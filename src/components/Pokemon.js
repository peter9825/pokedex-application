import React from 'react';

// Pokemon component, receives 'pokemon' prop
const Pokemon = ({ pokemon }) => {
  // destructure prop to extract individual properties
  const { id, name, sprite, types, abilities } = pokemon;

  return (
    // return Pokemon "card" of each Pokemon with it's information (additional styling handled in App.css)
    <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
      <h2 style={{ textTransform: 'capitalize' }}>{name}</h2>
      <p><strong>ID: </strong>{id} </p>

      {/* display the Pokemon sprite */}
      <img
        src={sprite || 'https://via.placeholder.com/150'}
        alt={name}
        style={{ width: '150px', height: '150px', margin: '10px 0' }}
      />

      {/* display Pokemon types */}
      <p>
        <strong>Types:</strong> {types?.split(',').join(', ')}
      </p>

      {/* display Pokemon abilities */}
      <p>
        <strong>Abilities:</strong> {abilities?.split(',').join(', ')}
      </p>
    </div>
  );
};

export default Pokemon;
