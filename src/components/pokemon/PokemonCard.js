import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Sprite = styled.img`
  width: 5em;
  height: 5em;
`;

const Card = styled.div`
  opacity: 0.95;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
  -moz-user-select: none;
  -website-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -o-user-select: none;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;

export default function PokemonCard({ name, url }) {
  const uppercasedName = name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(" ");

  const pokemonIndex = url.split("/")[6];
  const imageUrl = `https://poke.edgecompute.app/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonIndex}.svg`;

  return (
    <div className="col-md-3 col-sm-6 mb-5">
      <StyledLink to={`pokemon/${pokemonIndex}`}>
        <Card className="card">
          <h5 className="card-header">{pokemonIndex}</h5>
          <Sprite className="card-img-top rounded mx-auto mt-2" src={imageUrl} alt={name} />
          <div className="card-body mx-auto">
            <h6 className="card-title">{uppercasedName}</h6>
          </div>
        </Card>
      </StyledLink>
    </div>
  );
}
