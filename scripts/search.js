
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
        ifSearchInputIncludesThenRenderCard(searchInput, pokémonName, searchResultsCount);
    }
    pokémonListRef.innerHTML = allCurrentlyRenderedPokémonCards;

    if (searchResultsCount == 0) {
        document.getElementById('not_found_container').classList.remove('d_none');
    }
}

function ifSearchInputIncludesThenRenderCard(searchInput, pokémonName, searchResultsCount) {
    if (pokémonName.toLowerCase().includes(searchInput)) {
        let pokémonImage = allLoadedPokémonsObj[pokémonName].img;
        let pokémonTypes = allLoadedPokémonsObj[pokémonName].types;
        let pokémonId = allLoadedPokémonsObj[pokémonName].id;
        renderPokémonListviewCard(pokémonName, pokémonImage, pokémonTypes, pokémonId);
        searchResultsCount++;
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