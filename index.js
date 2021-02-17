const axios = require("axios");
const fs = require("fs");
const http = require("http");

async function pokemonesGet() {
  const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=150");
  return data.results;
}
async function getFullData(name, sprites) {
  const results = await pokemonesGet();

  let pokemonesPromesas = [];

  results.forEach((p) => {
    let name = p.name;
    pokemonesPromesas.push(
      axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    );
  });

  const datos_AllPokemones = await Promise.all(pokemonesPromesas);
  let imagenPokemon = [];
  datos_AllPokemones.forEach((p) => {
    imagenPokemon.push({
      nombre: p.data.name,
      img: p.data.sprites.front_default,
    });
  });
  return imagenPokemon;
}

http
  .createServer(async (req, res) => {
    if (req.url == "/galeria") {
      res.writeHead(200, { "Content-Type": "text/html" });
      const html = fs.readFileSync("index.html", "utf8")
      res.end(html);
    }

    if (req.url == "/pokemones") {
      const datos_AllPokemones = await getFullData();
      res.end(JSON.stringify(datos_AllPokemones));
    }
  })
  .listen(3000, () => console.log("Server ON!"));
