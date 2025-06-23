let offset = 0;
const limit = 20;
let allLoadedPokemons = {};

function init() {
    loadNextPokemonBatch();
};

async function loadNextPokemonBatch() {

    // showLoading();
    let dataNameAndDetailUrl = await fetchPokemonNameandDetailUrl();

    await processPokemonBatch(dataNameAndDetailUrl);

    offset += limit;

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

async function processPokemonBatch(dataNameAndDetailUrl) {

    for (let resultsIndex = 0; resultsIndex < dataNameAndDetailUrl.results.length; resultsIndex++) {
        let detailUrl = dataNameAndDetailUrl.results[resultsIndex].url;
        let dataDetails = await fetchPokemonDetails(detailUrl);

        collectPokemonAttributes(dataNameAndDetailUrl, dataDetails, resultsIndex);
    }
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

function collectPokemonAttributes(dataNameAndDetailUrl, dataDetails, resultsIndex) {
    let pokemonName = dataNameAndDetailUrl.results[resultsIndex].name;
    let pokemonImage = dataDetails.sprites.other['official-artwork'].front_default;
    let pokemonType = dataDetails.types[0].type.name;

    storePokemonAttributesInObj(pokemonName, pokemonImage, pokemonType);
}


function storePokemonAttributesInObj(pokemonName, pokemonImage, pokemonType) {

    allLoadedPokemons[pokemonName] = {
        type: pokemonType,
        img: pokemonImage
    };

    renderPokemonListviewCard(pokemonName, pokemonImage, pokemonType);

}

function renderPokemonListviewCard(pokemonName, pokemonImage, pokemonType) {
    let pokemonListRef = document.getElementById('pokemon_list');
    // pokemonListRef.innerHTML = '';

    pokemonListRef.innerHTML += getHTMLListviewCard(pokemonName, pokemonImage, pokemonType);
}

function renderFilteredPokemonList() {
    let searchInput = document.getElementById('search_input').value.toLowerCase().trim();
    let pokemonListRef = document.getElementById('pokemon_list');
    pokemonListRef.innerHTML = '';

    for (let pokemonName in allLoadedPokemons) {
        if (pokemonName.toLowerCase().includes(searchInput)) {
            let pokemonImage = allLoadedPokemons[pokemonName].img;
            let pokemonType = allLoadedPokemons[pokemonName].type;

            renderPokemonListviewCard(pokemonName, pokemonImage, pokemonType);
        }
    }
}

function resetSearchIfEmpty(searchInput) {

    if (searchInput.trim().length === 0) {
        renderFilteredPokemonList();
    }

}

 



