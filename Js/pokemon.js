import Type from './Type.js';

export default class Pokemon {
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