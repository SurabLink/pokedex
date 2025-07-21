
async function fetchPokémonNameandDetailUrl() {
    let url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    let response = null;
    let dataNameAndDetailUrl = null;

    try {
        response = await fetch(url);
        dataNameAndDetailUrl = await response.json();
    } catch (error) {
        console.error('Error loading Pokémon list:', error);
    }

    return dataNameAndDetailUrl;
}

async function fetchPokémonDetails(detailUrl) {
    let response = null;
    let dataDetails = null;

    try {
        response = await fetch(detailUrl);
        dataDetails = await response.json();
    } catch (error) {
        console.error('Error loading Pokémon details:', error);
    }

    return dataDetails;
}

async function fetchOverlayAttributesData(pokémonName) {
    let attributesUrl = `https://pokeapi.co/api/v2/pokemon/${pokémonName}`;
    let response = null;
    let overlayAttributesData = null;

    try {
        response = await fetch(attributesUrl);
        overlayAttributesData = await response.json();
    } catch (error) {
        console.error('Error loading Pokémon details:', error);
    }
    return overlayAttributesData;
}

async function fetchEvolutionChainData(overlayAttributesData) {
    let speciesUrl = overlayAttributesData.species.url;
    let evolutionChainData = null;

    try {
        let response = await fetch(speciesUrl);
        let speciesData = await response.json();
        evolutionChainData = await fetchIfEvolutionChainExists(speciesData, response, evolutionChainData);

    } catch (error) {
        console.error('Error loading the evolution chain:', error);
    }
    return evolutionChainData;
}

async function fetchIfEvolutionChainExists(speciesData, response, evolutionChainData) {
    if (speciesData.evolution_chain) {
        response = await fetch(speciesData.evolution_chain.url);
        evolutionChainData = await response.json();
    } else {
        evolutionChainData = null;
    }
    return evolutionChainData;
}
