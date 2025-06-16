let offset = 0;
const limit = 20;
let allLoadedPokemons = {};



function init() {
    renderListviewCard();
};

async function renderListviewCard() {
    let pokemonListRef = document.getElementById('pokemon_list');

    // showLoading();
    // pokemonListRef.innerHTML = '';
    let dataNameAndDetailUrl = await fetchPokemonNameandDetailUrl();

    await forLoopRenderListviewCard(pokemonListRef, dataNameAndDetailUrl);


    offset += limit;

    // hideLoading();
}

async function forLoopRenderListviewCard(pokemonListRef, dataNameAndDetailUrl) {

    for (let resultsIndex = 0; resultsIndex < dataNameAndDetailUrl.results.length; resultsIndex++) {
        let detailUrl = dataNameAndDetailUrl.results[resultsIndex].url;
        let dataDetails = await fetchPokemonDetails(detailUrl);
        let pokemonName = dataNameAndDetailUrl.results[resultsIndex].name;
        let pokemonImage = dataDetails.sprites.other['official-artwork'].front_default;
        let pokemonType = dataDetails.types[0].type.name;

        pokemonListRef.innerHTML += getHTMLListviewCard(pokemonName, pokemonImage, pokemonType);
        storeDataInObj(pokemonName, pokemonImage, pokemonType)
    }
}


function storeDataInObj(pokemonName, pokemonImage, pokemonType) {

    allLoadedPokemons[pokemonName] = {
        type: pokemonType,
        img: pokemonImage
    };

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

