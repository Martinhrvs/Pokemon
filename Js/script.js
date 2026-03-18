let myInput = document.querySelector("select");
let main = document.querySelector("main");
let typesContainer = document.querySelector("#types");

const TYPE_COLORS = {
    "Plante": "#4CAF50",
    "Feu": "#FF6B35",
    "Eau": "#2196F3",
    "Insecte": "#8BC34A",
    "Normal": "#9E9E9E",
    "Électrik": "#FFC107",
    "Poison": "#9C27B0",
    "Combat": "#F44336",
    "Sol": "#CD853F",
    "Roche": "#B8A832",
    "Spectre": "#3F51B5",
    "Acier": "#78909C",
    "Glace": "#81D4FA",
    "Dragon": "#4169E1",
    "Fée": "#F48FB1",
    "Ténèbres": "#37474F",
    "Psy": "#E91E63",
    "Vol": "#87CEEB",
};

let allPokemons = [];
let activeType = null;

function getColor(type) {
    return TYPE_COLORS[type] || "#fff";
}

function renderPokemons(list) {
    main.innerHTML = "";
    if (list.length === 0) {
        main.innerHTML = `<p style="color:#fff;text-align:center;width:100%">Aucun Pokémon trouvé pour ce type.</p>`;
        return;
    }
    list.forEach(pokemon => {
        const types = pokemon.types.filter(t => t !== null);
        if (types.length === 0) return;

        let article = document.createElement("article");

        let type1 = types[0].name;
        let color1 = getColor(type1);
        let backgroundStyle = color1;

        if (types.length > 1) {
            let color2 = getColor(types[1].name);
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
}

function buildTypeButtons(pokemons) {
    const typesPresents = new Set();
    pokemons.forEach(p => {
        p.types.filter(t => t !== null).forEach(t => typesPresents.add(t.name));
    });

    typesContainer.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.textContent = "Tous";
    allBtn.classList.add("type-btn", "btn-all", "active");
    allBtn.addEventListener("click", () => {
        activeType = null;
        document.querySelectorAll(".type-btn").forEach(b => b.classList.remove("active"));
        allBtn.classList.add("active");
        renderPokemons(allPokemons);
    });
    typesContainer.appendChild(allBtn);

    [...typesPresents].sort().forEach(typeName => {
        const btn = document.createElement("button");
        btn.textContent = typeName;
        btn.classList.add("type-btn");
        const color = getColor(typeName);
        btn.style.backgroundColor = color;
        btn.style.borderColor = color;
        const lightTypes = ["Normal", "Électrik", "Insecte", "Glace", "Fée", "Vol"];
        btn.style.color = lightTypes.includes(typeName) ? "#333" : "#fff";

        btn.addEventListener("click", () => {
            document.querySelectorAll(".type-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeType = typeName;
            const filtered = allPokemons.filter(p =>
                p.types.filter(t => t !== null).some(t => t.name === typeName)
            );
            renderPokemons(filtered);
        });
        typesContainer.appendChild(btn);
    });

    typesContainer.style.display = "flex";
}

async function loadData(value) {
    main.innerHTML = "<p style='color:#fff;text-align:center;width:100%'>Chargement...</p>";
    typesContainer.innerHTML = "";
    typesContainer.style.display = "none";
    activeType = null;

    try {
        let data = [];

        if (value === "") {
            // Charger toutes les générations en parallèle
            const promises = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(gen =>
                fetch(`https://tyradex.app/api/v1/gen/${gen}`).then(r => r.json())
            );
            const results = await Promise.all(promises);
            data = results.flat();
        } else {
            const response = await fetch(`https://tyradex.app/api/v1/gen/${value}`);
            if (!response.ok) throw new Error("Erreur réseau");
            data = await response.json();
        }

        allPokemons = data;
        buildTypeButtons(allPokemons);
        renderPokemons(allPokemons);
    } catch (error) {
        main.innerHTML = `<p style="color:red">Erreur : ${error.message}</p>`;
    }
}

myInput.addEventListener("change", (event) => {
    loadData(event.target.value);
});