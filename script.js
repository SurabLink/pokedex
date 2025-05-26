function init() {
    let pokemonListRef = document.getElementById('pokemon_list');
    pokemonListRef.innerHTML += getHTMLListviewItem();
};

function getHTMLListviewItem() {
    return `
        <div class="listview-item">
            <h2 class="card_title">${pokemonName}</h2>
            <img src="${pokemonImage}" alt="${pokemonName}" class="pokemon_img">
            <span class="pokemon_type">${pokemonType}</span>
        </div>
    `;
};