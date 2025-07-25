let activeTab = 'main';

async function openOverlay(pokémonName) {
    const pokémonOverlayWrapperRef = document.getElementById('pokémon_overlay_wrapper');
    const overlayRef = document.getElementById('overlay');
    overlayRef.classList.remove('d_none');
    pokémonOverlayWrapperRef.innerHTML = '';

    if (!allLoadedPokémonsObj[pokémonName].main || !allLoadedPokémonsObj[pokémonName].stats || !allLoadedPokémonsObj[pokémonName].evolutionChain) {
        const { overlayAttributesData, evolutionChainData } = await overlayLoadingProcess(pokémonName);
        collectPokémonAttributesForOverlay(overlayAttributesData, evolutionChainData);
    }

    pokémonOverlayWrapperRef.innerHTML = getHTMLDialogOverlay(pokémonName);
    openActiveTab();
};

function collectPokémonAttributesForOverlay(overlayAttributesData, evolutionChainData) {

    storeMainAttributesInObj(overlayAttributesData);
    storeStatsAttributesInObj(overlayAttributesData);
    extractEvolutionChain(overlayAttributesData, evolutionChainData);
}

function handleMainTabSwitch() {
    activeTab = 'main';
    const mainTabContentRef = document.getElementById('main_tab_content');
    const statsTabContentRef = document.getElementById('stats_tab_content');
    const evoTabContentRef = document.getElementById('evo_tab_content');
    displayMainTab(mainTabContentRef, statsTabContentRef, evoTabContentRef);
};

function displayMainTab(mainTabContentRef, statsTabContentRef, evoTabContentRef) {
    const mainTabBtnRef = document.getElementById('main_tab_btn');
    const statsTabBtnRef = document.getElementById('stats_tab_btn');
    const evoTabBtnRef = document.getElementById('evo_tab_btn');

    mainTabContentRef.classList.remove('d_none');
    statsTabContentRef.classList.add('d_none');
    evoTabContentRef.classList.add('d_none');
    mainTabBtnRef.classList.add('clicked_tab');
    statsTabBtnRef.classList.remove('clicked_tab');
    evoTabBtnRef.classList.remove('clicked_tab');
}

function handleStatsTabSwitch() {
    activeTab = 'stats';
    const mainTabContentRef = document.getElementById('main_tab_content');
    const statsTabContentRef = document.getElementById('stats_tab_content');
    const evoTabContentRef = document.getElementById('evo_tab_content');
    displayStatsTab(mainTabContentRef, statsTabContentRef, evoTabContentRef);
};

function displayStatsTab(mainTabContentRef, statsTabContentRef, evoTabContentRef) {
    const mainTabBtnRef = document.getElementById('main_tab_btn');
    const statsTabBtnRef = document.getElementById('stats_tab_btn');
    const evoTabBtnRef = document.getElementById('evo_tab_btn');

    mainTabContentRef.classList.add('d_none');
    statsTabContentRef.classList.remove('d_none');
    evoTabContentRef.classList.add('d_none');
    mainTabBtnRef.classList.remove('clicked_tab');
    statsTabBtnRef.classList.add('clicked_tab');
    evoTabBtnRef.classList.remove('clicked_tab');
}

function handleEvoTabSwitch() {
    activeTab = 'evo';
    const mainTabContentRef = document.getElementById('main_tab_content');
    const statsTabContentRef = document.getElementById('stats_tab_content');
    const evoTabContentRef = document.getElementById('evo_tab_content');
    displayEvoTab(mainTabContentRef, statsTabContentRef, evoTabContentRef);
};

function displayEvoTab(mainTabContentRef, statsTabContentRef, evoTabContentRef) {
    const mainTabBtnRef = document.getElementById('main_tab_btn');
    const statsTabBtnRef = document.getElementById('stats_tab_btn');
    const evoTabBtnRef = document.getElementById('evo_tab_btn');

    mainTabContentRef.classList.add('d_none');
    statsTabContentRef.classList.add('d_none');
    evoTabContentRef.classList.remove('d_none');
    mainTabBtnRef.classList.remove('clicked_tab');
    statsTabBtnRef.classList.remove('clicked_tab');
    evoTabBtnRef.classList.add('clicked_tab');
}

function openActiveTab() {
    if (activeTab === 'main') {
        handleMainTabSwitch();
    } else if (activeTab === 'stats') {
        handleStatsTabSwitch();
    } else if (activeTab === 'evo') {
        handleEvoTabSwitch();
    }
}

function preventClose(event) {
    event.stopPropagation();
}

function slider(direction, pokémonId) {
    let pokémonNamesArr = Object.keys(allLoadedPokémonsObj)
    let newPokémonName = null;

    if (direction === 'next') {
        newPokémonName = pokémonNamesArr[(pokémonId) % pokémonNamesArr.length];
    } else if (direction === 'prev') {
        newPokémonName = pokémonNamesArr[(pokémonId - 2 + pokémonNamesArr.length) % pokémonNamesArr.length];
    }
    openOverlay(newPokémonName);
}

function closeOverlay() {
    const overlayRef = document.getElementById('overlay');
    overlayRef.classList.add('d_none');
    enableScroll();
}

function disableScroll() {
    document.body.classList.add('no_scroll');
}

function enableScroll() {
    document.body.classList.remove('no_scroll');
}

function storeMainAttributesInObj(overlayAttributesData) {
    const height = overlayAttributesData.height;
    const weight = overlayAttributesData.weight;
    const baseExperience = overlayAttributesData.base_experience;
    const abilities = overlayAttributesData.abilities.map(a => a.ability.name);

    Object.assign(allLoadedPokémonsObj[overlayAttributesData.name], {
        main: getMainDataObj(height, weight, baseExperience, abilities)
    });
}

function getMainDataObj(height, weight, baseExperience, abilities) {
    return {
        height: height,
        weight: weight,
        baseExperience: baseExperience,
        abilities: abilities
    };
};

function storeStatsAttributesInObj(overlayAttributesData) {
    const hp = overlayAttributesData.stats.find(s => s.stat.name === 'hp').base_stat;
    const attack = overlayAttributesData.stats.find(s => s.stat.name === 'attack').base_stat;
    const defense = overlayAttributesData.stats.find(s => s.stat.name === 'defense').base_stat;
    const specialAttack = overlayAttributesData.stats.find(s => s.stat.name === 'special-attack').base_stat;
    const specialDefense = overlayAttributesData.stats.find(s => s.stat.name === 'special-defense').base_stat;
    const speed = overlayAttributesData.stats.find(s => s.stat.name === 'speed').base_stat;

    Object.assign(allLoadedPokémonsObj[overlayAttributesData.name], {
        stats: getStatsDataObj(hp, attack, defense, specialAttack, specialDefense, speed)
    });
}

function getStatsDataObj(hp, attack, defense, specialAttack, specialDefense, speed) {
    return {
        hp: hp,
        attack: attack,
        defense: defense,
        specialAttack: specialAttack,
        specialDefense: specialDefense,
        speed: speed
    };
};

function extractEvolutionChain(overlayAttributesData, evolutionChainData) {
    let evoNamesArr = [];
    let pokémonIdsArr = [];
    let evoImgUrlsArr = [];
    const currentEvoObj = evolutionChainData && evolutionChainData.chain ? evolutionChainData.chain : null;
    evoNamesArr.push(currentEvoObj.species.name);
    pokémonIdsArr.push(currentEvoObj.species.url ? currentEvoObj.species.url.match(/\/pokemon-species\/(\d+)\//)[1] : null);

    pushEvoNamesandIdsArr(evoNamesArr, pokémonIdsArr, currentEvoObj);
    pushEvoImgUrls(pokémonIdsArr, evoImgUrlsArr);
    storeEvolutionChainInObj(overlayAttributesData, evoNamesArr, evoImgUrlsArr);
}

function pushEvoNamesandIdsArr(evoNamesArr, pokémonIdsArr, currentEvoObj) {
    if (currentEvoObj.evolves_to && currentEvoObj.evolves_to.length > 0) {
        currentEvoObj.evolves_to.forEach(evo => {
            evoNamesArr.push(evo.species.name);
            pokémonIdsArr.push(evo.species.url.match(/\/pokemon-species\/(\d+)\//)[1]);
            if (evo.evolves_to && evo.evolves_to.length > 0) {
                evo.evolves_to.forEach(finalEvo => {
                    evoNamesArr.push(finalEvo.species.name);
                    pokémonIdsArr.push(finalEvo.species.url.match(/\/pokemon-species\/(\d+)\//)[1]);
                });
            };
        });
    };
};

function pushEvoImgUrls(pokémonIdsArr, evoImgUrlsArr) {

    for (let i = 0; i < pokémonIdsArr.length; i++) {
        const currentEvoImgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokémonIdsArr[i]}.png`;
        evoImgUrlsArr.push(currentEvoImgUrl);
    }
}

function storeEvolutionChainInObj(overlayAttributesData, evoNamesArr, evoImgUrlsArr) {

    Object.assign(allLoadedPokémonsObj[overlayAttributesData.name], {
        evolutionChain: {
            evoNames: evoNamesArr,
            evoImgUrls: evoImgUrlsArr
        }
    });
}