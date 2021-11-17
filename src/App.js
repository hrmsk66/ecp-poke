import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/layout/Dashboard";
import NavBar from "./components/layout/NavBar";
import Pokemon from "./components/pokemon/Pokemon";

function App() {
  return (
    <>
      <div className="App">
        <NavBar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pokemon/:pokemonIndex" element={<Pokemon />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
