const genInput = document.querySelector("#genSelect");
const sortInput = document.querySelector("#sortCriteria");
const main = document.querySelector("main");
const typesContainer = document.querySelector("#types");

class Type {
    constructor(name, image) {
        this.name = name;
        this.image = image;
        this.color = this.getColorHexa();
    }

    getColorHexa() {
        const TYPE_COLORS = {
            "Plante": "#4CAF50", "Feu": "#FF6B35", "Eau": "#2196F3",
            "Insecte": "#8BC34A", "Normal": "#9E9E9E", "Électrik": "#FFC107",
            "Poison": "#9C27B0", "Combat": "#F44336", "Sol": "#CD853F",
            "Roche": "#B8A832", "Spectre": "#3F51B5", "Acier": "#78909C",
            "Glace": "#81D4FA", "Dragon": "#4169E1", "Fée": "#F48FB1",
            "Ténèbres": "#37474F", "Psy": "#E91E63", "Vol": "#87CEEB",
        };
        return TYPE_COLORS[this.name] || "#ccc";
    }
}

class Pokemon {
    constructor(data) {
        this.id = data.id || 0;
        this.image = data.sprites?.regular || "";
        this.name = data.name?.fr || "Inconnu";
        this.apiTypes = data.types || [];
        this.hp = data.stats?.hp || 0;
        this.attack = data.stats?.atk || 0;
        this.defense = data.stats?.def || 0;
        this.special_attack = data.stats?.spe_atk || 0;
        this.speed = data.stats?.vit || 0;

        this.arrTypes = this.apiTypes.map(t => new Type(t.name, t.image));
    }

    displayCard() {
        const article = document.createElement("article");
        const color1 = this.arrTypes[0]?.color || "#ccc";
        let backgroundStyle = color1;

        if (this.arrTypes.length > 1) {
            const color2 = this.arrTypes[1]?.color || "#ccc";
            backgroundStyle = `linear-gradient(135deg, ${color1} 50%, ${color2} 50%)`;
        }

        article.style.background = backgroundStyle;
        article.style.border = `10px solid ${color1}`;

        article.innerHTML = `
        <figure>
            <picture>
                <img alt="${this.name}" src="${this.image}" loading="lazy"/>
            </picture>
            <figcaption>
                <span class="types">${this.arrTypes.map(t => t.name).join(" / ")}</span>
                <h2>${this.name}</h2>
                <ol>
                    <li>Points de vie : ${this.hp}</li>
                    <li>Attaque : ${this.attack}</li>
                    <li>Défense : ${this.defense}</li>
                    <li>Attaque Spé : ${this.special_attack}</li>
                    <li>Vitesse : ${this.speed}</li>
                </ol>
            </figcaption>
        </figure>
        `;
        return article;
    }
}

let allPokemonsObjects = [];
let activeType = null;

function renderPokemons(list) {
    main.innerHTML = "";
    const filteredList = activeType
        ? list.filter(p => p.arrTypes.some(t => t.name === activeType))
        : list;

    if (filteredList.length === 0) {
        main.innerHTML = `<p style="color:#fff;text-align:center;width:100%;margin-top:50px;">Aucun Pokémon ne correspond à ce type.</p>`;
        return;
    }

    filteredList.forEach(pObj => {
        main.appendChild(pObj.displayCard());
    });
}

function buildTypeButtons(pokemons) {
    const typesPresents = new Set();
    pokemons.forEach(p => p.arrTypes.forEach(t => typesPresents.add(t.name)));

    typesContainer.innerHTML = "";
    typesContainer.style.display = "flex";

    const allBtn = document.createElement("button");
    allBtn.textContent = "Tous";
    allBtn.className = `type-btn btn-all ${!activeType ? 'active' : ''}`;
    allBtn.onclick = () => {
        activeType = null;
        document.querySelectorAll(".type-btn").forEach(b => b.classList.remove("active"));
        allBtn.classList.add("active");
        renderPokemons(allPokemonsObjects);
    };
    typesContainer.appendChild(allBtn);

    [...typesPresents].sort().forEach(typeName => {
        const btn = document.createElement("button");
        btn.textContent = typeName;
        btn.className = "type-btn";
        const tempType = new Type(typeName);
        btn.style.backgroundColor = tempType.color;

        const darkText = ["Normal", "Électrik", "Insecte", "Glace", "Fée", "Vol"];
        btn.style.color = darkText.includes(typeName) ? "#333" : "#fff";

        btn.onclick = () => {
            activeType = typeName;
            document.querySelectorAll(".type-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderPokemons(allPokemonsObjects);
        };
        typesContainer.appendChild(btn);
    });
}

async function loadData(gen) {
    main.innerHTML = "<h2>Chargement...</h2>";
    const url = gen == 0 ? "https://tyradex.app/api/v1/pokemon" : `https://tyradex.app/api/v1/gen/${gen}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erreur lors du chargement des données.");
        const data = await response.json();

        allPokemonsObjects = data
            .filter(p => p.id !== 0)
            .map(p => new Pokemon(p));

        sortPokemons(sortInput.value);
        buildTypeButtons(allPokemonsObjects);
        renderPokemons(allPokemonsObjects);
    } catch (e) {
        main.innerHTML = `<h2 style="color:red;">Erreur API : ${e.message}</h2>`;
    }
}

function sortPokemons(criteria) {
    allPokemonsObjects.sort((a, b) => {
        if (criteria === "name") return a.name.localeCompare(b.name);
        if (criteria === "hp") return b.hp - a.hp;
        if (criteria === "atk") return b.attack - a.attack;
        return 0;
    });
}

genInput.onchange = (e) => loadData(e.target.value);
sortInput.onchange = (e) => {
    sortPokemons(e.target.value);
    renderPokemons(allPokemonsObjects);
};

loadData(1);