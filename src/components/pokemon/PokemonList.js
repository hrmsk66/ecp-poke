import React, { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";

export default function PokemonList() {
  const [pokemons, setPokemons] = useState(window && window.preloadedData.pokemons.results);
  const [url, setUrl] = useState(window && window.preloadedData.pokemons.next);

  const getPokemons = async () => {
    const res = await fetch(url);
    const data = await res.json();

    setPokemons((current) => [...current, ...data.results]);
    setUrl(data.next);
  };

  useEffect(() => {
    if (window && !window.preloadedData) {
      console.log("No preloaded data found. Loading from server");
      getPokemons();
    }
  }, []);

  return (
    <>
      {pokemons.length !== 0 ? (
        <div>
          <div className="row">
            {pokemons.map((pokemon) => (
              <PokemonCard key={pokemon.name} name={pokemon.name} url={pokemon.url} />
            ))}
          </div>
          <div className="d-grid gap-2 col-6 mx-auto">
            <button type="button" className="btn btn-outline-danger" onClick={() => getPokemons()}>
              Load more
            </button>
          </div>
        </div>
      ) : (
        <h1>Loading pokemon</h1>
      )}
    </>
  );
}
