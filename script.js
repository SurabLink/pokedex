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


async function openOverlay(pokémonName) {
    let overlayRef = document.getElementById('pokémon_overlay');
    let overlayAttributesData = await fetchOverlayAttributesData(pokémonName);
    let evolutionChainData = await fetchEvolutionChainData(overlayAttributesData);
    collectPokémonAttributesForOverlay(overlayAttributesData, evolutionChainData);
    overlayRef.innerHTML = getHTMLDialogOverlay(pokémonName);
};



async function fetchOverlayAttributesData(pokémonName) {
    let attributesUrl = `https://pokeapi.co/api/v2/pokemon/${pokémonName}`;
    let response = null;
    let overlayAttributesData = null;

    try {
        response = await fetch(attributesUrl);
        overlayAttributesData = await response.json();
    } catch (error) {
        console.error('Fehler beim Laden der Pokémon-Details:', error);
    }

    return overlayAttributesData;
}

async function fetchEvolutionChainData(overlayAttributesData) {
    let speciesUrl = overlayAttributesData.species.url;
    let response = null;
    let speciesData = null;
    let evolutionChainData = null;

    try {
        response = await fetch(speciesUrl);
        speciesData = await response.json();
        if (speciesData.evolution_chain) {
            response = await fetch(speciesData.evolution_chain.url);
            evolutionChainData = await response.json();
        } else {
            evolutionChainData = null;
        }
    } catch (error) {
        console.error('Fehler beim Laden der Evolutionskette:', error);
    }
    return evolutionChainData;
}



function collectPokémonAttributesForOverlay(overlayAttributesData, evolutionChainData) {

    storeMainAttributesInObj(overlayAttributesData);
    storeStatsAttributesInObj(overlayAttributesData);
    extractEvolutionChain(overlayAttributesData, evolutionChainData);
}

function storeMainAttributesInObj(overlayAttributesData) {
    let height = overlayAttributesData.height;
    let weight = overlayAttributesData.weight;
    let baseExperience = overlayAttributesData.base_experience;
    let abilities = overlayAttributesData.abilities.map(a => a.ability.name);

    Object.assign(allLoadedPokémonsObj[overlayAttributesData.name], {
        main: {
            height: height,
            weight: weight,
            baseExperience: baseExperience,
            abilities: abilities
        }

    });
}

function storeStatsAttributesInObj(overlayAttributesData) {
    let hp = overlayAttributesData.stats.find(s => s.stat.name === 'hp').base_stat;
    let attack = overlayAttributesData.stats.find(s => s.stat.name === 'attack').base_stat;
    let defense = overlayAttributesData.stats.find(s => s.stat.name === 'defense').base_stat;
    let specialAttack = overlayAttributesData.stats.find(s => s.stat.name === 'special-attack').base_stat;
    let specialDefense = overlayAttributesData.stats.find(s => s.stat.name === 'special-defense').base_stat;
    let speed = overlayAttributesData.stats.find(s => s.stat.name === 'speed').base_stat;

    Object.assign(allLoadedPokémonsObj[overlayAttributesData.name], {
        stats: {
            hp: hp,
            attack: attack,
            defense: defense,
            specialAttack: specialAttack,
            specialDefense: specialDefense,
            speed: speed
        }
    });
}

function extractEvolutionChain(overlayAttributesData, evolutionChainData) {
    let evoNamesArr = [];
    let pokémonIdsArr = [];
    let evoImgUrlsArr = [];
    let currentEvoObj = evolutionChainData && evolutionChainData.chain ? evolutionChainData.chain : null;
    // let pokémonId = overlayAttributesData.id;
    evoNamesArr.push(currentEvoObj.species.name);
    pokémonIdsArr.push(currentEvoObj.species.url ? currentEvoObj.species.url.match(/\/pokemon-species\/(\d+)\//)[1] : null);

    pushEvoNamesandIdsArr(evoNamesArr, pokémonIdsArr, currentEvoObj);
    pushEvoImgUrls(pokémonIdsArr, evoImgUrlsArr);
    storeEvolutionChainInObj(overlayAttributesData, evoNamesArr, evoImgUrlsArr);

}

function pushEvoNamesandIdsArr(evoNamesArr, pokémonIdsArr, currentEvoObj) {

    if (currentEvoObj.evolves_to && currentEvoObj.evolves_to.length > 0) {
        currentEvoObj.evolves_to.forEach(evo => {
            evoNamesArr.push(evo.species.name);
            pokémonIdsArr.push(evo.species.url.match(/\/pokemon-species\/(\d+)\//)[1]);

            if (evo.evolves_to && evo.evolves_to.length > 0) {
                evo.evolves_to.forEach(finalEvo => {
                    evoNamesArr.push(finalEvo.species.name);
                    pokémonIdsArr.push(finalEvo.species.url.match(/\/pokemon-species\/(\d+)\//)[1]);
                });
            };
        });
    };
};

function pushEvoImgUrls(pokémonIdsArr, evoImgUrlsArr) {

    for (let i = 0; i < pokémonIdsArr.length; i++) {
        let currentEvoImgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokémonIdsArr[i]}.png`;
        evoImgUrlsArr.push(currentEvoImgUrl);
    }
}

function storeEvolutionChainInObj(overlayAttributesData, evoNamesArr, evoImgUrlsArr) {

    Object.assign(allLoadedPokémonsObj[overlayAttributesData.name], {
        evolutionChain: {
            evoNames: evoNamesArr,
            evoImgUrls: evoImgUrlsArr
        }
    });
}

function openMainTab() {
    let mainTabContentRef = document.getElementById('main_tab_content');
    let statsTabContentRef = document.getElementById('stats_tab_content');
    let evoTabContentRef = document.getElementById('evo_tab_content');

    mainTabContentRef.classList.remove('d_none');
    statsTabContentRef.classList.add('d_none');
    evoTabContentRef.classList.add('d_none');
};

function openStatsTab() {
    let mainTabContentRef = document.getElementById('main_tab_content');
    let statsTabContentRef = document.getElementById('stats_tab_content');
    let evoTabContentRef = document.getElementById('evo_tab_content');

    mainTabContentRef.classList.add('d_none');
    statsTabContentRef.classList.remove('d_none');
    evoTabContentRef.classList.add('d_none');
};

function openEvoTab() {
    let mainTabContentRef = document.getElementById('main_tab_content');
    let statsTabContentRef = document.getElementById('stats_tab_content');
    let evoTabContentRef = document.getElementById('evo_tab_content');

    mainTabContentRef.classList.add('d_none');
    statsTabContentRef.classList.add('d_none');
    evoTabContentRef.classList.remove('d_none');
};