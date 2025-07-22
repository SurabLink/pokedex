
function processSearchPokémon() {
    const searchInput = document.getElementById('search_input').value.toLowerCase().trim().replace(/\s+/g, '');
    const pokémonListRef = document.getElementById('pokémon_list');

    if (searchInput.length > 2) {
        pokémonListRef.innerHTML = '';
        resetSearch(searchInput, true);
        renderFilteredPokémonList(searchInput);
    }
}

function renderFilteredPokémonList(searchInput) {
    const pokémonListRef = document.getElementById('pokémon_list');
    let searchResultsCount = 0;
    allCurrentlyRenderedPokémonCards = '';

    for (let pokémonName in allLoadedPokémonsObj) {
        searchResultsCount = ifSearchInputIncludesThenRenderCard(searchInput, pokémonName, searchResultsCount);
    }
    pokémonListRef.innerHTML = allCurrentlyRenderedPokémonCards;
    if (searchResultsCount == 0) {
        document.getElementById('not_found_container').classList.remove('d_none');
    }
}

function ifSearchInputIncludesThenRenderCard(searchInput, pokémonName, searchResultsCount) {

    if (pokémonName.toLowerCase().includes(searchInput)) {
        const pokémonImage = allLoadedPokémonsObj[pokémonName].img;
        const pokémonTypes = allLoadedPokémonsObj[pokémonName].types;
        const pokémonId = allLoadedPokémonsObj[pokémonName].id;
        renderPokémonListviewCard(pokémonName, pokémonImage, pokémonTypes, pokémonId);
        searchResultsCount++;
    }
    return searchResultsCount
}

function resetSearch(searchInput, searching = false) {
    const notFoundContainerRef = document.getElementById('not_found_container');
    if (searchInput.length == 0) {
        notFoundContainerRef.classList.add('d_none');
        renderFilteredPokémonList(searchInput);
        replaceBackWithLoadMoreBtn();
    } else if (searchInput.length != 0 && searching == true) {
        notFoundContainerRef.classList.add('d_none');
    }
}

function replaceLoadMoreWithBackBtn() {
    const loadMoreBtnRef = document.getElementById('load_more_btn');
    const backBtnRef = document.getElementById('back_to_overview_btn');
    const searchInput = document.getElementById('search_input').value.toLowerCase().trim().replace(/\s+/g, '');

    if (searchInput.length > 2) {
        loadMoreBtnRef.classList.add('d_none');
        backBtnRef.classList.remove('d_none');
    }
}

function replaceBackWithLoadMoreBtn() {
    const loadMoreBtnRef = document.getElementById('load_more_btn');
    const backBtnRef = document.getElementById('back_to_overview_btn');

    loadMoreBtnRef.classList.remove('d_none');
    backBtnRef.classList.add('d_none');
}

function backToOverview() {
    const searchInputRef = document.getElementById('search_input');
    const clearedSearchInput = searchInputRef.value = '';

    resetSearch(clearedSearchInput);
    replaceBackWithLoadMoreBtn();
}

