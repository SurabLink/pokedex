
function getHTMLListviewCard(pokemonName, pokemonImage, pokemonType) {
    return `
        <div class="listview_card ${pokemonType}">
            <h2 class="card_title">${pokemonName}</h2>
            <img src="${pokemonImage}" alt="${pokemonName}" class="listview_img">
            <span class="pokemon_type">${pokemonType}</span>
        </div>
    `;
};