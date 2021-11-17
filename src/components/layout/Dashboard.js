import React from "react";
import PokemonList from "../pokemon/PokemonList";

export default function Dashboard() {
  return (
    <div className="row">
      <div className="col">
        <PokemonList />
      </div>
    </div>
  );
}
