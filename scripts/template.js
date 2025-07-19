function getHTMLListviewCard(pokémonName, pokémonImage, pokémonTypes) {

  return `
        <div onclick="openOverlay('${pokémonName}'); disableScroll()" class="listview_card ${pokémonTypes[0]}">
          <h2 class="card_title">${pokémonName.charAt(0).toUpperCase() + pokémonName.slice(1)}</h2>
          <img src="${pokémonImage}" alt="${pokémonName.charAt(0).toUpperCase() + pokémonName.slice(1)}" class="listview_img">
          <div class="type_container">
            <span class="pokémon_type ${pokémonTypes[0]}_label">${pokémonTypes[0].charAt(0).toUpperCase() + pokémonTypes[0].slice(1)}</span>
            ${pokémonTypes.length > 1 ? `<span class="pokémon_type ${pokémonTypes[1]}_label">${pokémonTypes[1].charAt(0).toUpperCase() + pokémonTypes[1].slice(1)}</span>` : ''}
          </div>

        </div>
        `;
}



function getHTMLDialogOverlay(pokémonName) {

  return `
    <div class="overlay_content ${allLoadedPokémonsObj[pokémonName].types[0]} dialog transparent" id="overlay_content" onclick="preventClose(event)">
      <div onclick="closeOverlay()" class="close_button no_transparent"></div>
      <div class="overlay_title no_transparent"><h2>${pokémonName.charAt(0).toUpperCase() + pokémonName.slice(1)}</h2></div>
      <img src="${allLoadedPokémonsObj[pokémonName].img}" alt="${pokémonName.charAt(0).toUpperCase() + pokémonName.slice(1)}" class="listview_img no_transparent">
      <div class="type_container no_transparent">
        <span class="pokémon_type ${allLoadedPokémonsObj[pokémonName].types[0]}_label">
        ${allLoadedPokémonsObj[pokémonName].types[0].charAt(0).toUpperCase() + allLoadedPokémonsObj[pokémonName].types[0].slice(1)}</span>
        ${allLoadedPokémonsObj[pokémonName].types.length > 1 ? `<span class="pokémon_type ${allLoadedPokémonsObj[pokémonName].types[1]}_label">
        ${allLoadedPokémonsObj[pokémonName].types[1].charAt(0).toUpperCase() + allLoadedPokémonsObj[pokémonName].types[1].slice(1)}</span>` : ''}
      </div>
      <div class="overlay_tabs no_transparent">
        <button class="main_tab_btn" onclick="openMainTab('${pokémonName}')">Main</button>
        <button class="stats_tab_btn" onclick="openStatsTab('${pokémonName}')">Stats</button>
        <button class="evo_tab_btn" onclick="openEvoTab('${pokémonName}')">Evolution</button>
      </div>

      <div class="tab_content">
        <div class="main_tab_content" id="main_tab_content">
          <table class="no_transparent">
            <tr>
              <th>Height</th>
              <td>${allLoadedPokémonsObj[pokémonName].main.height} dm</td>
            <tr>
            <tr>
              <th>Weight</th>
              <td>${allLoadedPokémonsObj[pokémonName].main.weight} hg</td>
            <tr>
            <tr>
              <th>Base experience</th>
              <td>${allLoadedPokémonsObj[pokémonName].main.baseExperience} XP</td>
            <tr>
            <tr>
              <th>Abilities</th>
              <td>${allLoadedPokémonsObj[pokémonName].main.abilities.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')}</td>
            <tr>
          </table>
        </div>

        <div class="stats_tab_content d_none" id="stats_tab_content">
          <table class="no_transparent">
            <tr>
              <th>HP</th>
              <td>${allLoadedPokémonsObj[pokémonName].stats.hp}</td>
            </tr>
            <tr>
              <th>Attack</th>
              <td>${allLoadedPokémonsObj[pokémonName].stats.attack}</td>
            </tr>
            <tr>
              <th>Defense</th>
              <td>${allLoadedPokémonsObj[pokémonName].stats.defense}</td>
            </tr>
            <tr>
              <th>Special Attack</th>
              <td>${allLoadedPokémonsObj[pokémonName].stats.specialAttack}</td>
            </tr>
            <tr>
              <th>Special Defense</th>
              <td>${allLoadedPokémonsObj[pokémonName].stats.specialDefense}</td>
            </tr>
            <tr>
              <th>Speed</th>
              <td>${allLoadedPokémonsObj[pokémonName].stats.speed}</td>
            </tr>
          </table>
        
        </div>

      <div class="evo_tab_content d_none" id="evo_tab_content">
        ${allLoadedPokémonsObj[pokémonName].evolutionChain.evoNames.map((evoName, i) => `
            <figure class="evo_figure">
              <img class="no_transparent" src="${allLoadedPokémonsObj[pokémonName].evolutionChain.evoImgUrls[i]}" alt="${evoName.charAt(0).toUpperCase() + evoName.slice(1)}">
              <figcaption class="no_transparent">${evoName.charAt(0).toUpperCase() + evoName.slice(1)}</figcaption>
            </figure>
            `).join('')}

      </div>

    <div onclick="slider('prev', '${pokémonName}', '${allLoadedPokémonsObj[pokémonName].id}')" class="arrow arrow_left no_transparent"></div>
    <div onclick="slider('next', '${pokémonName}', '${allLoadedPokémonsObj[pokémonName].id}')" class="arrow arrow_right no_transparent"></div>

    
    </div> 
    `

}

