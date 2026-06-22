export const validCharacters = /[a-z]/gi;

export const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const ecosystem = new Map();

export class Organism {
    constructor(id, name, foodList) {
        this.id = id;
        this.name = name;
        if (foodList) {
            this.foodList = foodList;
        } else {
            this.foodList = [];
        }
    }

    addFood(foodId) {
        this.foodList.push(foodId);
    }

    removeFood(foodId) {
        this.foodList = this.foodList.filter(id => id !== foodId);
    }

    rename(newName) {
        this.name = newName;
    }
}
