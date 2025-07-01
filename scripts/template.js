
function getHTMLListviewCard(pokémonName, pokémonImage, pokémonType) {
    return `
        <div class="listview_card ${pokémonType}">
            <h2 class="card_title">${pokémonName}</h2>
            <img src="${pokémonImage}" alt="${pokémonName}" class="listview_img">
            <span class="pokémon_type">${pokémonType}</span>
        </div>
    `;
};