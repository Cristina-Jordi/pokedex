let currentLoadedPokemon = [];
let limitPokemon = 50;
let currentPokemon;  // Der jeweilige Pokemon, welcher von der URL geladen wird

async function getPokemonById(i){
    let url = `https://pokeapi.co/api/v2/pokemon/`;
    let pokemonURL = url + (i + 1);
    let response = await fetch(pokemonURL);
    return await response.json();  // Obige URL immer +1
}

async function init() {
    document.getElementById('poke-cards').style = 'display:none';
    for (let i = 0; i < limitPokemon; i++) {
        let newPokemon = await getPokemonById(i);
        currentLoadedPokemon.push(newPokemon);
        listPokemon(i);
    }
}

//Show all Pokoemons at a glance
function listPokemon(i) {
    let pokeName = currentLoadedPokemon[i]['name'];
    pokeName = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);  // Erster Buchstabe gross
    let pokeType = currentLoadedPokemon[i]['types'][0]['type']['name'];
    let pokeThumb = currentLoadedPokemon[i]['sprites']['other']['official-artwork']['front_default'];
    let pokeHeight = currentLoadedPokemon[i]['height'];
    let pokeWeight = currentLoadedPokemon[i]['weight'];
    let listPoke = document.getElementById('list-all-pokedex');
    listPoke.innerHTML += '';
    listPoke.innerHTML += listPokemonHTML(i, pokeType, pokeName, pokeThumb);
}

function listPokemonHTML(i, pokeType, pokeName, pokeThumb) {
    return `
        <div class="pokedex-all-container">
		    <div id="pokedex-all" class="pokedex-all ${pokeType}" onclick="showPokedex(${i})">
			    <div id="pokeName">${pokeName}</div>
			    <div id="pokeType" class="pokedex-all-border">${pokeType}</div>
			    <div><img class="thumb" id="pokeThumb${i}" src="${pokeThumb}"></div>
		    </div>
	    </div>
        `;
}

//  Show Pokedex-Card
function showPokedex(i) {
    document.getElementById('poke-cards').style = '';
    currentLoadedPokemon[i]['name'] = currentLoadedPokemon[i]['name'].charAt(0).toUpperCase() + currentLoadedPokemon[i]['name'].slice(1);
    typeColor = currentLoadedPokemon[i]['types'][0]['type']['name'];
    let pokeCards = document.getElementById('poke-cards');
    pokeCards.innerHTML = '';
    pokeCards.innerHTML = showPokedexHTML(i);
    currentLoadedPokemon;  //  ?? Braucht es diese Zeile??
    progressBar(i);
}

function showPokedexHTML(i) {
    return `<div id="pokedex-card">
        <div id="pokedex-card" class="pokedex-bg" onclick="closePokedex(${i})">
            <div class="pokedex-container-main ${typeColor}">
                <h1>${currentLoadedPokemon[i]['name']}</h1>
                <img class="pics" src="${currentLoadedPokemon[i]['sprites']['other']['official-artwork']['front_default']}">
                    <div class="pokedex-container-sub">
                        <div class="content-pokedex-card">
                            <div class="pokemon-details-container" id="pokemon-details">
                                <div class= "pokemon-details"><span><b>Type</b><span><br>${typeColor}</div>
                                <div class= "pokemon-details"><span><b>Height</b><span><br> ${currentLoadedPokemon[i]['height']} ft<br></div>
                                <div class= "pokemon-details"><span><b>Weight</b><span><br> ${currentLoadedPokemon[i]['weight']} lbs</div>
                            </div>
                            <div class="pokedex-content-container">
                                <div class="pokedex-details-container">
                                    <div class="progress-BaraValue-container">
                                        <div id="barName"></div>
                                        <div id="barValue"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </div>
    `;
}

function closePokedex(query) {
    document.getElementById('poke-cards').style = 'display:none';
    query = document.getElementById('searchPoke').value = '';
    document.getElementById('list-all-pokedex').innerHTML = '';
    currentLoadedPokemon = [];
    init(currentPokemon);
}

function openPokedex() {
    document.getElementById('poke-cards').style = '';
}

async function progressBar(i) {  // Pokemon Details with Names and Values
    let progressBarNames = ['HP', 'Attack', 'Defense', 'Special-Attack', 'Special-Defense', 'Speed'];

    for (let index = 0; index < 6; index++) {  // Iterates through the 6 values with index
        let progressBarName = progressBarNames[index];
        let progressNames = progressBarName;
        let progressBarValue = currentLoadedPokemon[i]['stats'][index]['base_stat'];
        let progressValue = progressBarValue;

        progressNames = document.getElementById(`barName`);
        progressNames.innerHTML += `<p>${progressBarName}</p>`;

        progressValue = document.getElementById(`barValue`);
        progressValue.innerHTML += progressValueHTML(index, progressBarValue);

        progressBarMove(index, progressBarValue);
    }
}

function progressValueHTML(index, progressBarValue) {
    return `
             <div class="progress-BaraValue-container">
             <!--<p>${progressBarValue}</p>-->
                 <div class="pokedex-content">
                     <div class="progress-bar" id="progressBar${index}">${progressBarValue}</div>
                 </div>
             </div>
         `;
}

function progressBarMove(index, progressBarValue) {
    let speed = 20;
    let limit = parseInt(document.getElementById(`progressBar${index}`).innerHTML, 10);
    // limit = progressBarValue;

    for (let m = 0; m <= limit; m++) {
        setTimeout(function () {
            document.getElementById(`progressBar${index}`).innerHTML = m;
            document.getElementById(`progressBar${index}`).style = `width:calc(${progressBarValue}%)`;
            progressBarValue = m;
        }, speed * m);
    }
}

// Pokémon Search
function searchPokemon() {  // Liest Wert aus dem Inputfeld raus
    let pokeFound = document.getElementById('list-all-pokedex');
    let query = document.getElementById('searchPoke').value;
    query = query.toLowerCase();
    document.getElementById('list-all-pokedex').innerHTML = '';
    identifyPokemon(query, pokeFound);
}

function identifyPokemon(query, pokeFound) {  // Iteriere durch alle Pokemons
    for (let i = 0; i < currentLoadedPokemon.length; i++) {
        let pokeName = currentLoadedPokemon[i]['name'];
        let pokeType = currentLoadedPokemon[i]['types'][0]['type']['name'];
        let pokeThumb = currentLoadedPokemon[i]['sprites']['other']['official-artwork']['front_default'];
        showPokemon(i, query, pokeFound, pokeType, pokeName, pokeThumb);
    }
}

function showPokemon(i, query, pokeFound, pokeType, pokeName, pokeThumb) {  // Abgleich ob eingegebener Wert enthalten
    if (pokeName.toLowerCase().includes(query) == true || pokeType.toLowerCase().includes(query) == true) {  // Wenn query in foundName enthalten, zeige Möglichkeiten an
        pokeFound.innerHTML += listPokemonHTML(i, pokeType, pokeName, pokeThumb);
    }
}