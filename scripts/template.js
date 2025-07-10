
function getHTMLListviewCard(pokémonName, pokémonImage, pokémonTypes) {
    let displayPokémonName = pokémonName.charAt(0).toUpperCase() + pokémonName.slice(1);
    let typeLabels = pokémonTypes.map(type =>
        `<span class="pokémon_type ${type}_label">${type.charAt(0).toUpperCase() + type.slice(1)}</span>`
    ).join('');


    return `
        <div class="listview_card ${pokémonTypes[0]}">
            <h2 class="card_title">${displayPokémonName}</h2>
            <img src="${pokémonImage}" alt="${displayPokémonName}" class="listview_img">
            <div class="type_container">
                ${typeLabels}
            </div>

            </div>
    `;
};