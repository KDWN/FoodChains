import { ecosystem, validCharacters, uuidRegex, Organism } from "./global.js";
let foodChains = [];

const maxChainLength = 5;

// sections off the 
function organiseOrganism() {
    const producers = [];
    const consumers = new Map();
    for (const [organismId, organismInfo] of ecosystem) {
        if(!organismInfo["name"]){
            continue
        }
        if (!organismInfo["foodList"][0]){
            producers.push(organismInfo["name"]);
            continue
        }
        const foodNames = []
        for (const food of organismInfo["foodList"]){
            foodNames.push(ecosystem.get(food)["name"])
        }
        consumers.set(organismInfo["name"], foodNames);
    }
    return [producers, consumers]
}

function findFoodChains() {
    const [producers, consumers] = organiseOrganism()

    foodChains = []

    for (const producer of producers) {
        createChain(consumers, producer, [producer], 0);
    }

    console.log(foodChains)
}

function createChain(consumers, currentOrganism, chain, links) {
    const nextConsumers = findConsumers(currentOrganism, consumers);

    // adds the food chain to the list if it has reached the top due to maxLength or apex predator
    if (links >= maxChainLength -1 || nextConsumers.length === 0) {
        foodChains.push([...chain]);
        return;
    }

    // everything that eats this organism has the same checks to find what eats them
    for (const consumer of nextConsumers) {
        if (consumer == currentOrganism) {
            foodChains.push([...chain, "Cannibalism"])
            continue
        }
        if (chain.includes(consumer)) {
            foodChains.push([...chain, "Reciprocal predation loop"])
            continue
        }
        createChain(
            consumers,
            consumer,
            [...chain, consumer],
            links + 1
        );
    }
}

function findConsumers(food, consumers) {
    const canEat = []
    for (const [consumerName, foodList] of consumers) {
        if (foodList.includes(food)){
            canEat.push(consumerName)
        }
    }
    return canEat
}

function displayFoodChains() {
    findFoodChains()
    const foodChainContainer = document.querySelector("#foodChainContainer");
    const foodChainDisplay = foodChainContainer.children[0];
    foodChainDisplay.replaceChildren();
    for (const thisChain of foodChains) {
        const newFoodChain = document.createElement("p")
        for ( let position = 0; position < thisChain.length; position++ ) {
            newFoodChain.append(thisChain[position]);
            if (thisChain[position + 1] === "Cannibalism" || thisChain[position + 1] === "Reciprocal predation loop") {
                newFoodChain.append(' ⟳ ');
                continue
            }
            if (thisChain[position + 1]) {
                newFoodChain.append(' → ');
            }
        }
        foodChainDisplay.appendChild(newFoodChain);
    }
    foodChainContainer.style.visibility = "visible";
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#displayFoodChains").addEventListener("click", displayFoodChains)
});