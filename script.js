const pokemonName = 'PIKACHU';
const pokemonImage = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png';
const pokemonType = 'Electric';
const limit = 20;

let offset = 0;



function init() {
    let pokemonListRef = document.getElementById('pokemon_list');
    pokemonListRef.innerHTML += getHTMLListviewCard();
};

async function fetchPokemonList() {
    let url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    let response = null;
    let data = null;

    try {
        response = await fetch(url);
        data = await response.json();
        console.log(data.results); // enthält name + detail-url pro Pokémon
    } catch (error) {
        console.error('Fehler beim Laden der Pokémon-Liste:', error);
    }
}
