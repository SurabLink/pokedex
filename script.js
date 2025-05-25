function init() {
    let pokemonListRef = document.getElementById('pokemon_list');
    pokemonListRef.innerHTML += getHTMLCard();
};

function getHTMLCard() {
    return `
        <div class="card">
            <h2 class="card-title">Pikachu</h2>
        </div>
    `;
}