const Pokemon = ({ pokemon }) => {
  const { id, name, sprites, types } = pokemon;

  return (
    <div>
      <h3>{name}</h3>
      {/* Display pokemon sprite or fallback image */}
      <img
        src={sprites?.front_default || 'https://via.placeholder.com/150'}
        alt={name}
      />
      <p className="h6">ID: {id}</p>
      <p className="h6">
        Types: {types.map((typeObj) => typeObj.type.name).join(', ')}
      </p>
    </div>
  );
};

export default Pokemon;
