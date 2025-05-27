
function getHTMLListviewCard() {
    return `
        <div class="listview_card">
            <h2 class="card_title">${pokemonName}</h2>
            <img src="${pokemonImage}" alt="${pokemonName}" class="pokemon_img">
            <span class="pokemon_type">${pokemonType}</span>
        </div>
    `;
};