let myInput = document.querySelector("select");
let main = document.querySelector("main");

function getColor(type) {
    switch (type) {
        case "Plante":
            return "green";
        case "Feu":
            return "orange";
        case "Eau":
            return "blue";
        case "Insecte":
            return "lightgreen";
        case "Normal":
            return "lightgray";
        case "Électrik":
            return "yellow";
        case "Poison":
            return "purple";
        case "Combat":
            return "red";
        case "Sol":
            return "burlywood";
        case "Roche":
            return "darkkhaki";
        case "Spectre":
            return "indigo";
        case "Acier":
            return "silver";
        case "Glace":
            return "lightblue";
        case "Dragon":
            return "royalblue";
        case "Fée":
            return "pink";
        case "Ténèbres":
            return "darkslategray";
        case "Psy":
            return "hotpink";
        case "Vol":
            return "skyblue";
        default:
            return "white";
    }
}

async function loadData(value) {
    main.innerHTML = "<p>Chargement...</p>";

    try {
        const response = await fetch(`https://tyradex.app/api/v1/gen/${value}`);
        if (!response.ok) throw new Error("Erreur réseau");

        const data = await response.json();

        main.innerHTML = "";

        data.forEach(pokemon => {
            // Correction : certains Pokémon ont un type null dans l'API Tyradex
            const types = pokemon.types.filter(t => t !== null);

            if (types.length === 0) return; // Ignorer les Pokémon sans type valide

            let article = document.createElement("article");

            let type1 = types[0].name;
            let color1 = getColor(type1);
            let backgroundStyle = color1;

            if (types.length > 1) {
                let type2 = types[1].name;
                let color2 = getColor(type2);
                backgroundStyle = `linear-gradient(to right, ${color1} 50%, ${color2} 50%)`;
            }

            article.style.background = backgroundStyle;
            article.style.border = `10px solid ${color1}`;

            article.innerHTML = `
            <figure>
                <picture>
                    <img alt="Image de ${pokemon.name.fr}" src="${pokemon.sprites.regular}"/>
                </picture>
                <figcaption>
                    <span class="types">${types.map(t => t.name).join(" / ")}</span>
                    <h2>${pokemon.name.fr}</h2>
                    <ol>
                        <li>Points de vie : ${pokemon.stats.hp}</li>
                        <li>Attaque : ${pokemon.stats.atk}</li>
                        <li>Défense : ${pokemon.stats.def}</li>
                        <li>Attaque spéciale : ${pokemon.stats.spe_atk}</li>
                        <li>Vitesse : ${pokemon.stats.vit}</li>
                    </ol>
                </figcaption>
            </figure>
            `;
            main.appendChild(article);
        });
    } catch (error) {
        main.innerHTML = `<p style="color:red">Erreur : ${error.message}</p>`;
    }
}

myInput.addEventListener("change", (event) => {
    if (event.target.value) loadData(event.target.value);
});