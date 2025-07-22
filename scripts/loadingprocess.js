function showLoadingListviewCards() {
    const currentLoadedCountSpanRef = document.getElementById('current_loaded_count');
    const totalLoadingCountSpanRef = document.getElementById('total_loading_count');
    const loadMoreBtnRef = document.getElementById('load_more_btn');
    const loadContainerRef = document.getElementById('load_container_listview_cards');

    currentLoadedCountSpanRef.innerHTML = 0;
    totalLoadingCountSpanRef.innerHTML = limit;
    loadMoreBtnRef.disabled = true;
    loadMoreBtnRef.classList.add('d_none');
    loadContainerRef.classList.remove('d_none');
}

function hideLoadingListviewCards() {
    const loadMoreBtnRef = document.getElementById('load_more_btn');
    const loadContainerRef = document.getElementById('load_container_listview_cards');

    loadMoreBtnRef.disabled = false;
    loadMoreBtnRef.classList.remove('d_none');
    loadContainerRef.classList.add('d_none');
}

function showLoadingOverlay() {
    const loadContainerRef = document.getElementById('load_container_overlay');
    loadContainerRef.classList.remove('d_none');
}

function hideLoadingOverlay() {
    const loadContainerRef = document.getElementById('load_container_overlay');
    loadContainerRef.classList.add('d_none');
}


async function overlayLoadingProcess(pokémonName) {
    showLoadingOverlay();
    const overlayAttributesData = await fetchOverlayAttributesData(pokémonName);
    const evolutionChainData = await fetchEvolutionChainData(overlayAttributesData);
    hideLoadingOverlay();
    return { overlayAttributesData, evolutionChainData };
}