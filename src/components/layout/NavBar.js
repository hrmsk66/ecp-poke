import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Logo from "../../Edge_Cloud_Fastly.svg";

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

export default function NavBar({ logo }) {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <div className="container">
        <StyledLink to={"/"} className="navbar-brand">
          <img src={Logo} alt="" width="100" height="45" />
        </StyledLink>
      </div>
    </nav>
  );
}
