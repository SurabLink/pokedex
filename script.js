const pokemonName = 'PIKACHU';
const pokemonImage = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png';
const pokemonType = 'Electric';


function init() {
    let pokemonListRef = document.getElementById('pokemon_list');
    pokemonListRef.innerHTML += getHTMLListviewCard();
};
