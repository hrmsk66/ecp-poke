import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

const TYPE_COLORS = {
  bug: "B1C12E",
  dark: "4F3A2D",
  dragon: "755EDF",
  electric: "FCBC17",
  fairy: "F4B1F4",
  fighting: "823551D",
  fire: "E73B0C",
  flying: "A3B3F7",
  ghost: "6060B2",
  grass: "74C236",
  ground: "D3B357",
  ice: "A3E7FD",
  normal: "C8C4BC",
  poison: "934594",
  psychic: "ED4882",
  rock: "B9A156",
  steel: "B5B5C3",
  water: "3295F6",
};

export default function Pokemon() {
  let { pokemonIndex } = useParams();

  const pokemonUrl = `https://poke.edgecompute.app/api/v2/pokemon/${pokemonIndex}/`;
  const pokemonSpeciesUrl = `https://poke.edgecompute.app/api/v2/pokemon-species/${pokemonIndex}/`;
  const imageUrl = `https://poke.edgecompute.app/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonIndex}.png`;

  const [pokemon, setPokemon] = useState();

  const getPokemon = async () => {
    const r1 = await fetch(pokemonUrl);
    const pokemonRes = await r1.json();

    let { hp, attack, defense, speed, specialAttack, specialDefense } = "";
    pokemonRes.stats.map((stat) => {
      switch (stat.stat.name) {
        case "hp":
          hp = stat["base_stat"];
          break;
        case "attack":
          attack = stat["base_stat"];
          break;
        case "defense":
          defense = stat["base_stat"];
          break;
        case "speed":
          speed = stat["base_stat"];
          break;
        case "special-attack":
          specialAttack = stat["base_stat"];
          break;
        case "special-defense":
          specialDefense = stat["base_stat"];
          break;
        default:
      }
    });
    const name = pokemonRes.name;
    const height = Math.round(pokemonRes.height * 0.1 * 100) / 100;
    const weight = Math.round(pokemonRes.weight * 0.1 * 100) / 100;
    const types = pokemonRes.types.map((type) => type.type.name);
    const themeColor = `${TYPE_COLORS[types[types.length - 1]]}`;
    const abilities = pokemonRes.abilities
      .map((ability) => {
        return ability.ability.name
          .toLowerCase()
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(" ");
      })
      .join(", ");
    const evs = pokemonRes.stats
      .filter((stat) => stat.effort > 0)
      .map((stat) => {
        return `${stat.effort} ${stat.stat.name}`
          .toLowerCase()
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(" ");
      })
      .join(", ");

    const r2 = await fetch(pokemonSpeciesUrl);
    const speciesRes = await r2.json();

    let description = "";
    speciesRes.flavor_text_entries.some((flavor) => {
      if (flavor.language.name === "en") {
        description = flavor.flavor_text;
        return;
      }
    });
    const femaleRate = speciesRes["gender_rate"];
    const genderRatioFemale = 12.5 * femaleRate;
    const genderRatioMale = 12.5 * (8 - femaleRate);

    const catchRate = Math.round((100 / 255) * speciesRes["capture_rate"]);
    const eggGroups = speciesRes["egg_groups"]
      .map((group) => {
        return group.name
          .toLowerCase()
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(" ");
      })
      .join(", ");
    const hatchSteps = 255 * (speciesRes["hatch_counter"] + 1);
    setPokemon({
      imageUrl,
      pokemonIndex,
      name,
      types,
      stats: {
        hp,
        attack,
        defense,
        speed,
        specialAttack,
        specialDefense,
      },
      themeColor,
      height,
      weight,
      abilities,
      evs,
      description,
      genderRatioFemale,
      genderRatioMale,
      catchRate,
      eggGroups,
      hatchSteps,
      loading: true,
    });
  };

  useEffect(() => {
    getPokemon();
  }, []);

  return (
    <>
      {pokemon ? (
        <div className="col">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-5">
                  <h5>{pokemon.pokemonIndex}</h5>
                </div>
                <div className="col-7">
                  <div className="float-end">
                    {pokemon.types.map((type) => (
                      <span
                        key={type}
                        className="badge badge-pill mr-1"
                        style={{
                          backgroundColor: `#${TYPE_COLORS[type]}`,
                          color: "white",
                        }}
                      >
                        {type
                          .toLowerCase()
                          .split(" ")
                          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                          .join(" ")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className=" col-md-3 ">
                  <img
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    className="card-img-top rounded mx-auto mt-2"
                    onLoad={() => setPokemon({ ...pokemon, loading: false })}
                  />
                </div>
                <div className="col-md-9">
                  <h4 className="mx-auto">
                    {pokemon.name
                      .toLowerCase()
                      .split(" ")
                      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                      .join(" ")}
                  </h4>
                  <div className="row align-items-center">
                    <div className={`col-12 col-md-${pokemon.statTitleWidth}`}>HP</div>
                    <div className={`col-12 col-md-${pokemon.statBarWidth}`}>
                      <div className="progress">
                        <div
                          className="progress-bar "
                          role="progressbar"
                          style={{
                            width: `${pokemon.stats.hp}%`,
                            backgroundColor: `#${pokemon.themeColor}`,
                          }}
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <small>{pokemon.stats.hp}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center">
                    <div className={`col-12 col-md-${pokemon.statTitleWidth}`}>Attack</div>
                    <div className={`col-12 col-md-${pokemon.statBarWidth}`}>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${pokemon.stats.attack}%`,
                            backgroundColor: `#${pokemon.themeColor}`,
                          }}
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <small>{pokemon.stats.attack}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center">
                    <div className={`col-12 col-md-${pokemon.statTitleWidth}`}>Defense</div>
                    <div className={`col-12 col-md-${pokemon.statBarWidth}`}>
                      <div className="progress">
                        <div
                          className="progress-bar "
                          role="progressbar"
                          style={{
                            width: `${pokemon.stats.defense}%`,
                            backgroundColor: `#${pokemon.themeColor}`,
                          }}
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <small>{pokemon.stats.defense}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center">
                    <div className={`col-12 col-md-${pokemon.statTitleWidth}`}>Speed</div>
                    <div className={`col-12 col-md-${pokemon.statBarWidth}`}>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${pokemon.stats.speed}%`,
                            backgroundColor: `#${pokemon.themeColor}`,
                          }}
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <small>{pokemon.stats.speed}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center">
                    <div className={`col-12 col-md-${pokemon.statTitleWidth}`}>Sp Atk</div>
                    <div className={`col-12 col-md-${pokemon.statBarWidth}`}>
                      <div className="progress">
                        <div
                          className="progress-bar "
                          role="progressbar"
                          style={{
                            width: `${pokemon.stats.specialAttack}%`,
                            backgroundColor: `#${pokemon.themeColor}`,
                          }}
                          aria-valuenow={pokemon.stats.specialAttack}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <small>{pokemon.stats.specialAttack}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center">
                    <div className={`col-12 col-md-${pokemon.statTitleWidth}`}>Sp Def</div>
                    <div className={`col-12 col-md-${pokemon.statBarWidth}`}>
                      <div className="progress">
                        <div
                          className="progress-bar "
                          role="progressbar"
                          style={{
                            width: `${pokemon.stats.specialDefense}%`,
                            backgroundColor: `#${pokemon.themeColor}`,
                          }}
                          aria-valuenow={pokemon.stats.specialDefense}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <small>{pokemon.stats.specialDefense}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-1">
                <div className="col">
                  <p className="">{pokemon.description}</p>
                </div>
              </div>
            </div>
            <hr />
            <div className="card-body">
              <h5 className="card-title text-center">Profile</h5>
              <div className="row">
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-6">
                      <h6 className="float-end">Height:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-start">{pokemon.height} m</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-end">Weight:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-start">{pokemon.weight} kg</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-end">Catch Rate:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-start">{pokemon.catchRate}%</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-end">Gender Ratio:</h6>
                    </div>
                    <div className="col-6">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${pokemon.genderRatioFemale}%`,
                            backgroundColor: "#c2185b",
                          }}
                          aria-valuenow="15"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <small>{pokemon.genderRatioFemale}</small>
                        </div>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${pokemon.genderRatioMale}%`,
                            backgroundColor: "#1976d2",
                          }}
                          aria-valuenow="30"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <small>{pokemon.genderRatioMale}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-6">
                      <h6 className="float-end">Egg Groups:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-start">{pokemon.eggGroups} </h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-end">Hatch Steps:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-start">{pokemon.hatchSteps}</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-end">Abilities:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-start">{pokemon.abilities}</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-end">EVs:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-start">{pokemon.evs}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer text-muted">
              Data From{" "}
              <a href="https://pokeapi.co/" target="_blank" className="card-link" rel="noreferrer">
                PokeAPI.co
              </a>
            </div>
          </div>
        </div>
      ) : (
        <h3>Loading</h3>
      )}
    </>
  );
}
