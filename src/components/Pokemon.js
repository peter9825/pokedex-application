const Pokemon = ({ pokemon }) => {
  const { id, name, sprites, types, abilities } = pokemon;

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
      <h2 style={{ textTransform: 'capitalize' }}>{name}</h2>
      <p>ID: {id}</p>
      
      {/* Display the Pokémon sprite */}
      <img
        src={sprites?.front_default || 'https://via.placeholder.com/150'}
        alt={name}
        style={{ width: '150px', height: '150px', margin: '10px 0' }}
      />
      
      {/* Display Pokémon types */}
      <p>
        <strong>Types:</strong>{' '}
        {types.map((typeObj) => typeObj.type.name).join(', ')}
      </p>

      {/* Display Pokémon abilities */}
      <p>
        <strong>Abilities:</strong>{' '}
        {abilities.map((abilityObj) => abilityObj.ability.name).join(', ')}
      </p>
    </div>
  );
};

export default Pokemon;
