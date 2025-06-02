let pokemonName = null;
let pokemonImage = null;
let pokemonType = null;

let offset = 0;
const limit = 20;



function init() {
    renderListviewCard();
};

async function renderListviewCard() {
    let pokemonListRef = document.getElementById('pokemon_list');

    showLoading();
    pokemonListRef.innerHTML = '';
    let listNameAndUrl = await fetchPokemonNameandDetailUrl();

    for (let index = 0; index < array.length; index++) {
        const element = array[index];

        pokemonListRef.innerHTML += getHTMLListviewCard();

    }

    hideLoading();
}

async function fetchPokemonNameandDetailUrl() {
    let url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    let response = null;
    let dataNameAndDetailUrl = null;

    try {
        response = await fetch(url);
        dataNameAndDetailUrl = await response.json();
        dataNameAndDetailUrl = dataNameAndDetailUrl.results; // enthält name + detail-url pro Pokémon results ist ein feldname im JSON-Objekt
    } catch (error) {
        console.error('Fehler beim Laden der Pokémon-Liste:', error);
    }

    await fetchPokemonDetails();


    return dataNameAndDetailUrl;
}

async function fetchPokemonDetails() {
