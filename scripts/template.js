
function getHTMLListviewCard(pokémonName, pokémonImage, pokémonTypes) {
    let displayPokémonName = pokémonName.charAt(0).toUpperCase() + pokémonName.slice(1);
    let typeLabels = pokémonTypes.map(type =>
        `<span class="pokémon_type ${type}_label">${type.charAt(0).toUpperCase() + type.slice(1)}</span>`
    ).join('');


    return `
        <div onclick="openOverlay(${pokémonName})" class="listview_card ${pokémonTypes[0]}">
            <h2 class="card_title">${displayPokémonName}</h2>
            <img src="${pokémonImage}" alt="${displayPokémonName}" class="listview_img">
            <div class="type_container">
                ${typeLabels}
            </div>

            </div>
        `;
    }

// function getHTMLDialogOverlay(pokémonName) {
//     let pokémon = allLoadedPokémonsObj[i];
//     let pokémonName = pokémon.name.charAt(0).toUpperCase() + pokémon.name.slice(1);
//     let pokémonImage = pokémon.img;
//     let pokémonTypes = pokémon.types.map(type => `<span class="pokémon_type ${type}_label">${type.charAt(0).toUpperCase() + type.slice(1)}</span>`).join('');
//     let pokémonDescription = pokémon.description;

//     return `
//         <div class="overlay_content">
//             <h2>${pokémonName}</h2>
//             <img src="${pokémonImage}" alt="${pokémonName}">
//             <div class="types">${pokémonTypes}</div>
//             <p>${pokémonDescription}</p>
//         </div>
//     `;