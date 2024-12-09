import React from 'react';

function Pokemon({ pokemon }) {
  const id = pokemon.id;
  const name = pokemon.name;
  const image = pokemon.sprites.front_default;
  const types = pokemon.types.map((typeObj) => typeObj.type.name).join(', ');

  return (
    <div>
      <div>ID: {id}</div>
      <div>Name: {name}</div>
      <img src={image} alt={`${name} sprite`} />
      <div>Types: {types}</div>
    </div>
  );
}

export default Pokemon;