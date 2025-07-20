function showLoadingListviewCards() {
    let currentLoadedCountSpanRef = document.getElementById('current_loaded_count');
    let totalLoadingCountSpanRef = document.getElementById('total_loading_count');
    let loadMoreBtnRef = document.getElementById('load_more_btn');
    let loadContainerRef = document.getElementById('load_container_listview_cards');

    currentLoadedCountSpanRef.innerHTML = 0;
    totalLoadingCountSpanRef.innerHTML = limit;
    loadMoreBtnRef.disabled = true;
    loadMoreBtnRef.classList.add('d_none');
    loadContainerRef.classList.remove('d_none');
}

function hideLoadingListviewCards() {
    let loadMoreBtnRef = document.getElementById('load_more_btn');
    let loadContainerRef = document.getElementById('load_container_listview_cards');

    loadMoreBtnRef.disabled = false;
    loadMoreBtnRef.classList.remove('d_none');
    loadContainerRef.classList.add('d_none');
}

function showLoadingOverlay() {
    let loadContainerRef = document.getElementById('load_container_overlay');
    loadContainerRef.classList.remove('d_none');
}

function hideLoadingOverlay() {
    let loadContainerRef = document.getElementById('load_container_overlay');
    loadContainerRef.classList.add('d_none');
}


async function overlayLoadingProcess(pokémonName) {
    showLoadingOverlay();
    let overlayAttributesData = await fetchOverlayAttributesData(pokémonName);
    let evolutionChainData = await fetchEvolutionChainData(overlayAttributesData);
    hideLoadingOverlay();
    return { overlayAttributesData, evolutionChainData };
}