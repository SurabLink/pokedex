let offset = 0;
const limit = 20;



function init() {
    renderListviewCard();
};

async function renderListviewCard() {
    let pokemonListRef = document.getElementById('pokemon_list');

    // showLoading();
    pokemonListRef.innerHTML = '';
    let dataNameAndDetailUrl = await fetchPokemonNameandDetailUrl();
    let pokemonName = null;
    let pokemonImage = null;
    let pokemonType = null;


    for (let resultsIndex = 0; resultsIndex < dataNameAndDetailUrl.results.length; resultsIndex++) {
        let detailUrl = dataNameAndDetailUrl.results[resultsIndex].url;
        let dataDetails = await fetchPokemonDetails(detailUrl);
        pokemonName = dataNameAndDetailUrl.results[resultsIndex].name;
        pokemonImage = dataDetails.sprites.front_default;
        pokemonType = dataDetails.types[0].type.name;


        pokemonListRef.innerHTML += getHTMLListviewCard(pokemonName, pokemonImage, pokemonType);

    }

    // hideLoading();
}

async function fetchPokemonNameandDetailUrl() {
    let url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    let response = null;
    let dataNameAndDetailUrl = null;

    try {
        response = await fetch(url);
        dataNameAndDetailUrl = await response.json();
    } catch (error) {
        console.error('Fehler beim Laden der Pokémon-Liste:', error);
    }

    return dataNameAndDetailUrl;
}

async function fetchPokemonDetails(detailUrl) {
    let response = null;
    let dataDetails = null;

    try {
        response = await fetch(detailUrl);
        dataDetails = await response.json();
    } catch (error) {
        console.error('Fehler beim Laden der Pokémon-Details:', error);
    }

    return dataDetails;


}
