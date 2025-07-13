let offset = 0;
const limit = 20;
let allLoadedPokémonsObj = {};
let allCurrentlyRenderedPokémonCards = '';

function init() {
    loadNextPokémonBatch();
};

async function loadNextPokémonBatch() {

    disableScroll();
    showLoading();
    let dataNameAndDetailUrl = await fetchPokémonNameandDetailUrl();
    await processPokémonBatch(dataNameAndDetailUrl);
    enableScroll();
    offset += limit;
}

function disableScroll() {
    document.body.classList.add('no_scroll');
}

function enableScroll() {
    document.body.classList.remove('no_scroll');
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
    let pokémonTypes = dataDetails.types.map(t => t.type.name);

    storePokémonAttributesInObj(pokémonName, pokémonImage, pokémonTypes);
}

function storePokémonAttributesInObj(pokémonName, pokémonImage, pokémonTypes) {

    allLoadedPokémonsObj[pokémonName] = {
        types: pokémonTypes,
        img: pokémonImage
    };

    renderPokémonListviewCard(pokémonName, pokémonImage, pokémonTypes);
}

function renderPokémonListviewCard(pokémonName, pokémonImage, pokémonTypes) {
    allCurrentlyRenderedPokémonCards += getHTMLListviewCard(pokémonName, pokémonImage, pokémonTypes);
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
            let pokémonTypes = allLoadedPokémonsObj[pokémonName].types;

            renderPokémonListviewCard(pokémonName, pokémonImage, pokémonTypes);
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


function openOverlay(pokémonName) {
    let overlayRef = document.getElementById('pokémon_overlay');
    let morePokemonDetails = await fetchMorePokemonDetails(pokémonName);
    collectPokémonAttributesForOverlay(morePokemonDetails);

    overlayRef.innerHTML = getHTMLDialogOverlay(pokémonName);
};

async function fetchMorePokemonDetails(pokémonName) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokémonName}`;
    let response = null;
    let dataDetails = null;

    try {
        response = await fetch(url);
        dataDetails = await response.json();
    } catch (error) {
        console.error('Fehler beim Laden der Pokémon-Details:', error);
    }

    return dataDetails;
}

// ich möchte in allLoadedPokémonsObj mehr informationen hinzufügen zu den bereits vorhandenen einträgen im object.
// in collectPokémonAttributesForOverlay überlege ich welche informationen ich hinzufügen möchte. Name, typ und bild habe ich bereits.
// ich möchte 3 reiter hinzufügen: main, stats und evolution.
// in main stehen die informationen: height, weight, base_experience und abilities.
// in stats stehen die informationen: hp, attack, defense, special-attack, special-defense und speed.
// in evolution möchte ich die evolution-kette hinzufügen, wenn vorhanden.


function collectPokémonAttributesForOverlay(morePokemonDetails) {

    storeMainAttributesInObj(morePokemonDetails);
    storeStatsAttributesInObj(morePokemonDetails);
    storeEvolutionAttributesInObj(morePokemonDetails);
}

function storeMainAttributesInObj(morePokemonDetails) {
    let height = morePokemonDetails.height;
    let weight = morePokemonDetails.weight;
    let baseExperience = morePokemonDetails.base_experience;
    let abilities = morePokemonDetails.abilities.map(a => a.ability.name);

    Object.assign(allLoadedPokémonsObj[morePokemonDetails.name], {
        Main: {
            height: height,
            weight: weight,
            baseExperience: baseExperience,
            abilities: abilities
        }

    });
}

function storeStatsAttributesInObj(morePokemonDetails) {
    let hp = morePokemonDetails.stats.find(s => s.stat.name === 'hp').base_stat;
    let attack = morePokemonDetails.stats.find(s => s.stat.name === 'attack').base_stat;
    let defense = morePokemonDetails.stats.find(s => s.stat.name === 'defense').base_stat;
    let specialAttack = morePokemonDetails.stats.find(s => s.stat.name === 'special-attack').base_stat;
    let specialDefense = morePokemonDetails.stats.find(s => s.stat.name === 'special-defense').base_stat;
    let speed = morePokemonDetails.stats.find(s => s.stat.name === 'speed').base_stat;

    Object.assign(allLoadedPokémonsObj[morePokemonDetails.name], {
        Stats: {
            hp: hp,
            attack: attack,
            defense: defense,
            specialAttack: specialAttack,
            specialDefense: specialDefense,
            speed: speed
        }
    });
}

function storeEvolutionAttributesInObj(morePokemonDetails) {

    let evolutionChain = morePokemonDetails.evolution_chain ? morePokemonDetails.evolution_chain.url : null;

    Object.assign(allLoadedPokémonsObj[morePokemonDetails.name], {
        Evolution: {
            evolutionChain: evolutionChain
        }
}
