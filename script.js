let offset = 0;
const limit = 20;
let allLoadedPokémonsObj = {};
let allCurrentlyRenderedPokémonCards = '';

function init() {
    loadNextPokémonBatch();
};

async function loadNextPokémonBatch() {

    showLoading();
    let dataNameAndDetailUrl = await fetchPokémonNameandDetailUrl();
    await processPokémonBatch(dataNameAndDetailUrl);
    offset += limit;
}

function showLoading() {
    let currentLoadedCountSpanRef = document.getElementById('current_loaded_count');
    let totalLoadingCountSpanRef = document.getElementById('total_loading_count');
    let loadMoreRef = document.getElementById('load_more');
    let loadContainerRef = document.getElementById('load_container');

    currentLoadedCountSpanRef.innerHTML = 0;
    totalLoadingCountSpanRef.innerHTML = limit;
    loadMoreRef.disabled = true;
    loadMoreRef.classList.add('d_none');
    loadContainerRef.classList.remove('d_none');
}

function hideLoading() {
    let loadMoreRef = document.getElementById('load_more');
    let loadContainerRef = document.getElementById('load_container');

    loadMoreRef.disabled = false;
    loadMoreRef.classList.remove('d_none');
    loadContainerRef.classList.add('d_none');
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
    let pokémonListRef = document.getElementById('pokémon_list');

    allCurrentlyRenderedPokémonCards = '';
    await processPokémonEach(dataNameAndDetailUrl)

    setTimeout(() => {
        pokémonListRef.innerHTML += allCurrentlyRenderedPokémonCards;
    }, 500);

}

async function processPokémonEach(dataNameAndDetailUrl) {
    let currentLoadedCountSpanRef = document.getElementById('current_loaded_count');
    let currentLoadedCount = 0;

    for (let resultsIndex = 0; resultsIndex < dataNameAndDetailUrl.results.length; resultsIndex++) {
        let detailUrl = dataNameAndDetailUrl.results[resultsIndex].url;
        let dataDetails = await fetchPokémonDetails(detailUrl);
        collectPokémonAttributes(dataNameAndDetailUrl, dataDetails, resultsIndex);
        currentLoadedCount++;
        currentLoadedCountSpanRef.innerHTML = currentLoadedCount;
    }
    setTimeout(() => {
        hideLoading();
    }, 500);
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

    allLoadedPokémonsObj[pokémonName] = {
        type: pokémonType,
        img: pokémonImage
    };

    renderPokémonListviewCard(pokémonName, pokémonImage, pokémonType);

}

function renderPokémonListviewCard(pokémonName, pokémonImage, pokémonType) {
    allCurrentlyRenderedPokémonCards += getHTMLListviewCard(pokémonName, pokémonImage, pokémonType);
}

function processSearchPokémon() {
    let searchInput = document.getElementById('search_input').value.toLowerCase().trim().replace(/\s+/g, '');
    let pokémonListRef = document.getElementById('pokémon_list');

    if (searchInput.length > 2) {
        pokémonListRef.innerHTML = '';
        resetSearch(searchInput, true);
        renderFilteredPokémonList(searchInput);
    }
}



function renderFilteredPokémonList(searchInput) {
    let pokémonListRef = document.getElementById('pokémon_list');
    let searchResultsCount = 0;
    allCurrentlyRenderedPokémonCards = '';



    for (let pokémonName in allLoadedPokémonsObj) {

        if (pokémonName.toLowerCase().includes(searchInput)) {
            let pokémonImage = allLoadedPokémonsObj[pokémonName].img;
            let pokémonType = allLoadedPokémonsObj[pokémonName].type;

            renderPokémonListviewCard(pokémonName, pokémonImage, pokémonType);
            searchResultsCount++;
        }
    }
    pokémonListRef.innerHTML = allCurrentlyRenderedPokémonCards;

    if (searchResultsCount == 0) {
        document.getElementById('not_found_container').classList.remove('d_none');
    }
}

function resetSearch(searchInput, searching = false) {
    let notFoundContainerRef = document.getElementById('not_found_container');
    if (searchInput.length == 0) {
        notFoundContainerRef.classList.add('d_none');
        renderFilteredPokémonList(searchInput);
    } else if (searchInput.length != 0 && searching == true) {
        notFoundContainerRef.classList.add('d_none');
    }
}





