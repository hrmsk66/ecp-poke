import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { ServerStyleSheet } from "styled-components";
import App from "./App";

const decoder = new TextDecoder();
const js = decoder.decode(fastly.includeBytes("build/main.js"));
const css = decoder.decode(fastly.includeBytes("src/index.css"));
const favicon = fastly.includeBytes("src/favicon.png");

global.window = {};

async function handleRequest(event) {
  let req = event.request;
  let url = new URL(req.url);

  const server = fastly.env.get("FASTLY_HOSTNAME");
  console.log(`Server: ${server}, Requested Path: ${url.pathname}`);
  if (server !== "localhost" && url.pathname === "/") {
    const geo = event.client.geo;
    console.log(`City: ${geo.city}, Country: ${geo.country_name}, AS: ${geo.as_name}`);
  }

  let cacheOverride = new CacheOverride("override", { ttl: 2592000 });

  if (url.pathname === "/favicon.ico") {
    const headers = new Headers({ "content-type": "image/jpg" });

    return new Response(favicon, {
      status: 200,
      headers,
    });
  }

  if (
    url.pathname.startsWith("/api/v2/pokemon") ||
    url.pathname.startsWith("/api/v2/pokemon-species")
  ) {
    return fetch(req.url, {
      backend: "origin_0",
      cacheOverride,
    });
  }

  if (url.pathname.startsWith("/PokeAPI/sprites/master/sprites/pokemon/other")) {
    return fetch(req.url, {
      backend: "origin_1",
      cacheOverride,
    });
  }

  if (url.pathname === "/" || url.pathname.startsWith("/pokemon")) {
    const pokemonRes = await fetch("https://pokeapi.co/api/v2/pokemon?limit=12", {
      backend: "origin_0",
    });
    const pokemons = await pokemonRes.json();

    // const imageRes = await Promise.all(
    //   [1, 2, 3, 4].map((n) =>
    //     fetch(
    //       `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${n}.svg`,
    //       { backend: "origin_1" }
    //     )
    //   )
    // );

    // const images = await Promise.all(imageRes.map((r) => r.text()));

    const sheet = new ServerStyleSheet();
    const app = ReactDOMServer.renderToString(
      sheet.collectStyles(
        <StaticRouter location={req.url}>
          <App />
        </StaticRouter>
      )
    );

    const body = `
<!DOCTYPE html>
<html>
    <head><title>Pokédex@Edge</title></head>
    <style>${css}</style>
    <body>
        <div class="App">
        <header class="App-header">
            ${sheet.getStyleTags()}
            <div id="root">${app}</div>
        </header>
        </div>
        <script>window.preloadedData = ${JSON.stringify({ pokemons })}</script>
        <script>${js}</script>
    </body>
</html>`;

    return new Response(body, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  // Catch all other requests and return a 404.
  return new Response("The page you requested could not be found", {
    status: 404,
  });
}

addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));
