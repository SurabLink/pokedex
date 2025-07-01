let offset = 0;
const limit = 20;
let allLoadedPokémons = {};

function init() {
    loadNextPokémonBatch();
};

async function loadNextPokémonBatch() {

    // showLoading();
    let dataNameAndDetailUrl = await fetchPokémonNameandDetailUrl();

    await processPokémonBatch(dataNameAndDetailUrl);

    offset += limit;

    // hideLoading();
}

async function fetchPokémonNameandDetailUrl() {
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

async function processPokémonBatch(dataNameAndDetailUrl) {
    let currentLoadedCountSpanRef = document.getElementById('current_loaded_count')
    let totalLoadingCountSpanRef = document.getElementById('total_loading_count');
    let currentLoadedCount = 0;
    currentLoadedCountSpanRef.innerHTML = "";
    totalLoadingCountSpanRef.innerHTML = "";
    totalLoadingCountSpanRef.innerHTML = limit;

    for (let resultsIndex = 0; resultsIndex < dataNameAndDetailUrl.results.length; resultsIndex++) {
        let detailUrl = dataNameAndDetailUrl.results[resultsIndex].url;
        let dataDetails = await fetchPokémonDetails(detailUrl);
        collectPokémonAttributes(dataNameAndDetailUrl, dataDetails, resultsIndex);
        currentLoadedCount++;
        currentLoadedCountSpanRef.innerHTML = currentLoadedCount;
    }
}

async function fetchPokémonDetails(detailUrl) {
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

function collectPokémonAttributes(dataNameAndDetailUrl, dataDetails, resultsIndex) {
    let pokémonName = dataNameAndDetailUrl.results[resultsIndex].name;
    let pokémonImage = dataDetails.sprites.other['official-artwork'].front_default;
    let pokémonType = dataDetails.types[0].type.name;

    storePokémonAttributesInObj(pokémonName, pokémonImage, pokémonType);
}

function storePokémonAttributesInObj(pokémonName, pokémonImage, pokémonType) {

    allLoadedPokémons[pokémonName] = {
        type: pokémonType,
        img: pokémonImage
    };

    renderPokémonListviewCard(pokémonName, pokémonImage, pokémonType);

}

function renderPokémonListviewCard(pokémonName, pokémonImage, pokémonType) {
    let pokémonListRef = document.getElementById('pokémon_list');
    pokémonListRef.innerHTML += getHTMLListviewCard(pokémonName, pokémonImage, pokémonType);
}

function processSearchPokémon() {
    let searchInput = document.getElementById('search_input').value.toLowerCase().trim();
    let pokémonListRef = document.getElementById('pokémon_list');

    if (searchInput.length > 2) {
        pokémonListRef.innerHTML = '';
        renderFilteredPokémonList(searchInput);
    }
}



function renderFilteredPokémonList(searchInput) {
    let searchResultsCount = 0;

    for (let pokémonName in allLoadedPokémons) {

        if (pokémonName.toLowerCase().includes(searchInput)) {
            let pokémonImage = allLoadedPokémons[pokémonName].img;
            let pokémonType = allLoadedPokémons[pokémonName].type;

            renderPokémonListviewCard(pokémonName, pokémonImage, pokémonType);
            searchResultsCount++;
        }
    }

    if (searchResultsCount == 0) {
        document.getElementById('not_found_container').classList.remove('d_none');
    }
}

function resetSearchIfEmpty(searchInput) {
    let notFoundContainerRef = document.getElementById('not_found_container');
    if (searchInput.trim().length === 0) {
        notFoundContainerRef.classList.add('d_none');
        renderFilteredPokémonList(searchInput);
    }
}





