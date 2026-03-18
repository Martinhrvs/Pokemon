export default class Type {
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