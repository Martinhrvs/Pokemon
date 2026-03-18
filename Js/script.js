const genInput = document.querySelector("#genSelect");
const sortInput = document.querySelector("#sortCriteria");
const main = document.querySelector("main");
const typesContainer = document.querySelector("#types");

const TYPE_COLORS = {
    "Plante": "#4CAF50", "Feu": "#FF6B35", "Eau": "#2196F3",
    "Insecte": "#8BC34A", "Normal": "#9E9E9E", "Électrik": "#FFC107",
    "Poison": "#9C27B0", "Combat": "#F44336", "Sol": "#CD853F",
    "Roche": "#B8A832", "Spectre": "#3F51B5", "Acier": "#78909C",
    "Glace": "#81D4FA", "Dragon": "#4169E1", "Fée": "#F48FB1",
    "Ténèbres": "#37474F", "Psy": "#E91E63", "Vol": "#87CEEB",
};

let allPokemons = [];
let activeType = null;

function getColor(type) {
    return TYPE_COLORS[type] || "#ccc";
}

function renderPokemons(list) {
    main.innerHTML = "";

    const filteredList = activeType
        ? list.filter(p => p.types && p.types.some(t => t.name === activeType))
        : list;

    if (filteredList.length === 0) {
        main.innerHTML = `<p style="color:#fff;text-align:center;width:100%;margin-top:50px;">Aucun Pokémon ne correspond à ce type.</p>`;
        return;
    }

    filteredList.forEach(pokemon => {
        const types = pokemon.types ? pokemon.types.filter(t => t !== null) : [];
        const type1 = types[0]?.name || "Inconnu";
        const color1 = getColor(type1);
        let backgroundStyle = color1;

        if (types.length > 1) {
            const color2 = getColor(types[1]?.name || "Inconnu");
            backgroundStyle = `linear-gradient(135deg, ${color1} 50%, ${color2} 50%)`;
        }

        const article = document.createElement("article");
        article.style.background = backgroundStyle;
        article.style.border = `8px solid ${color1}`;

        article.innerHTML = `
        <figure>
            <picture>
                <img alt="${pokemon.name?.fr || "Pokémon"}" src="${pokemon.sprites?.regular || ""}" loading="lazy"/>
            </picture>
            <figcaption>
                <span class="types">${types.map(t => t.name).join(" / ")}</span>
                <h2 style="margin: 0 0 10px 0; font-size: 1.4em;">${pokemon.name?.fr || "Inconnu"}</h2>
                <ol>
                    <li>❤️ PV : <strong>${pokemon.stats?.hp || 0}</strong></li>
                    <li>⚔️ Attaque : <strong>${pokemon.stats?.atk || 0}</strong></li>
                    <li>🛡️ Défense : <strong>${pokemon.stats?.def || 0}</strong></li>
                    <li>⚡ Vitesse : <strong>${pokemon.stats?.vit || 0}</strong></li>
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
        if (p.types) p.types.forEach(t => typesPresents.add(t.name));
    });

    typesContainer.innerHTML = "";
    typesContainer.style.display = "flex";

    const allBtn = document.createElement("button");
    allBtn.textContent = "Tous les types";
    allBtn.className = `type-btn btn-all ${!activeType ? 'active' : ''}`;
    allBtn.onclick = () => {
        activeType = null;
        document.querySelectorAll(".type-btn").forEach(b => b.classList.remove("active"));
        allBtn.classList.add("active");
        renderPokemons(allPokemons);
    };
    typesContainer.appendChild(allBtn);

    [...typesPresents].sort().forEach(typeName => {
        const btn = document.createElement("button");
        btn.textContent = typeName;
        btn.className = "type-btn";
        const color = getColor(typeName);
        btn.style.backgroundColor = color;

        const darkText = ["Normal", "Électrik", "Insecte", "Glace", "Fée", "Vol"];
        btn.style.color = darkText.includes(typeName) ? "#333" : "#fff";

        btn.onclick = () => {
            activeType = typeName;
            document.querySelectorAll(".type-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderPokemons(allPokemons);
        };
        typesContainer.appendChild(btn);
    });
}

function sortPokemons(list, criteria) {
    return [...list].sort((a, b) => {
        if (criteria === "name") return a.name?.fr.localeCompare(b.name?.fr);
        if (criteria === "hp") return (b.stats?.hp || 0) - (a.stats?.hp || 0);
        if (criteria === "atk") return (b.stats?.atk || 0) - (a.stats?.atk || 0);
        if (criteria === "id") return a.id - b.id;
        if (criteria === "type") return (a.types?.[0]?.name || "").localeCompare(b.types?.[0]?.name || "");
        return 0;
    });
}

async function loadData(gen) {
    main.innerHTML = "<p style='color:#fff;text-align:center;width:100%'>Chargement du Pokédex...</p>";
    typesContainer.style.display = "none";

    try {
        const response = await fetch(`https://tyradex.app/api/v1/gen/${gen}`);
        const data = await response.json();

        allPokemons = data.filter(p => p.id !== 0);
        renderPokemons(sortPokemons(allPokemons, sortInput.value));
        buildTypeButtons(allPokemons);
    } catch (error) {
        main.innerHTML = `<p style="color:red; text-align:center; width:100%">Erreur de connexion à l'API.</p>`;
    }
}

genInput.onchange = (e) => loadData(e.target.value);
sortInput.onchange = (e) => {
    renderPokemons(sortPokemons(allPokemons, e.target.value));
};

loadData(1);