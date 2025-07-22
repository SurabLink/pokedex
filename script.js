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
    const dataNameAndDetailUrl = await fetchPokémonNameandDetailUrl();
    await processPokémonBatch(dataNameAndDetailUrl);
    enableScroll();
    offset += limit;
}

async function processPokémonBatch(dataNameAndDetailUrl) {
    const pokémonListRef = document.getElementById('pokémon_list');

    allCurrentlyRenderedPokémonCards = '';
    await processPokémonEach(dataNameAndDetailUrl)
    setTimeout(() => { pokémonListRef.innerHTML += allCurrentlyRenderedPokémonCards }, 500);
}

async function processPokémonEach(dataNameAndDetailUrl) {
    const currentLoadedCountSpanRef = document.getElementById('current_loaded_count');
    let currentLoadedCount = 0;

    for (let resultsIndex = 0; resultsIndex < dataNameAndDetailUrl.results.length; resultsIndex++) {
        const detailUrl = dataNameAndDetailUrl.results[resultsIndex].url;
        const dataDetails = await fetchPokémonDetails(detailUrl);
        collectPokémonAttributes(dataNameAndDetailUrl, dataDetails, resultsIndex);
        currentLoadedCount++;
        currentLoadedCountSpanRef.innerHTML = currentLoadedCount;
    }
    setTimeout(() => { hideLoadingListviewCards() }, 500);
}

function collectPokémonAttributes(dataNameAndDetailUrl, dataDetails, resultsIndex) {
    const pokémonName = dataNameAndDetailUrl.results[resultsIndex].name;
    const pokémonImage = dataDetails.sprites.other['official-artwork'].front_default;
    const pokémonTypes = dataDetails.types.map(t => t.type.name);
    const pokémonId = dataDetails.id;
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