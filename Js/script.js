import Pokemon from './Pokemon.js';
import Type from './Type.js';

const genInput = document.querySelector("#genSelect");
const sortInput = document.querySelector("#sortCriteria");
const main = document.querySelector("main");
const typesContainer = document.querySelector("#types");

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
        if (criteria === "type") {
            const typeA = a.arrTypes[0]?.name || "";
            const typeB = b.arrTypes[0]?.name || "";
            return typeA.localeCompare(typeB);
        }
        return 0;
    });
}

genInput.onchange = (e) => loadData(e.target.value);
sortInput.onchange = (e) => {
    sortPokemons(e.target.value);
    renderPokemons(allPokemonsObjects);
};

loadData(1);