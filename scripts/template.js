
function getHTMLListviewCard(pokémonName, pokémonImage, pokémonType) {
    let displayPokémonName = pokémonName.charAt(0).toUpperCase() + pokémonName.slice(1);
    
    return `
        <div class="listview_card ${pokémonType}">
            <h2 class="card_title">${displayPokémonName}</h2>
            <img src="${pokémonImage}" alt="${displayPokémonName}" class="listview_img">
            <span class="pokémon_type">${pokémonType}</span>
        </div>
    `;
};