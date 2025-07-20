const limit = 20;
let offset = 0;
let allLoadedPokémonsObj = {};
let allCurrentlyRenderedPokémonCards = '';

function init() {
    loadNextPokémonBatch();
};

async function loadNextPokémonBatch() {
    disableScroll();
    showLoadingListviewCards();
    let dataNameAndDetailUrl = await fetchPokémonNameandDetailUrl();
    await processPokémonBatch(dataNameAndDetailUrl);
    enableScroll();
    offset += limit;
}

async function processPokémonBatch(dataNameAndDetailUrl) {
    let pokémonListRef = document.getElementById('pokémon_list');

    allCurrentlyRenderedPokémonCards = '';
    await processPokémonEach(dataNameAndDetailUrl)
    setTimeout(() => { pokémonListRef.innerHTML += allCurrentlyRenderedPokémonCards }, 500);
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
    setTimeout(() => { hideLoadingListviewCards() }, 500);
}
// 

function collectPokémonAttributes(dataNameAndDetailUrl, dataDetails, resultsIndex) {
    let pokémonName = dataNameAndDetailUrl.results[resultsIndex].name;
    let pokémonImage = dataDetails.sprites.other['official-artwork'].front_default;
    let pokémonTypes = dataDetails.types.map(t => t.type.name);
    let pokémonId = dataDetails.id;
    storePokémonAttributesInObj(pokémonName, pokémonImage, pokémonTypes, pokémonId);
}

function storePokémonAttributesInObj(pokémonName, pokémonImage, pokémonTypes, pokémonId) {

    allLoadedPokémonsObj[pokémonName] = {
        types: pokémonTypes,
        img: pokémonImage,
        id: pokémonId
    };

    renderPokémonListviewCard(pokémonName, pokémonImage, pokémonTypes, pokémonId);
}

function renderPokémonListviewCard(pokémonName, pokémonImage, pokémonTypes, pokémonId) {
    allCurrentlyRenderedPokémonCards += getHTMLListviewCard(pokémonName, pokémonImage, pokémonTypes, pokémonId);
}