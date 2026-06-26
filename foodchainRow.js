import { ecosystem, validCharacters, uuidRegex, Organism } from "./global.js";
let foodChains = [];
let maxChainLength = 5
let minChainLength = 0
let requiredProducer = undefined
let requiredApex = undefined
let mustContain = undefined

function setParameters() {
    maxChainLength = document.querySelector("#maxLength").value || 5;
    minChainLength = document.querySelector("#minLength").value || 0;
    requiredProducer = document.querySelector("#producer").value || undefined;
    requiredApex = document.querySelector("#apex").value || undefined;
    mustContain = document.querySelector("#contains").value || undefined;
    return [maxChainLength, minChainLength, requiredProducer, requiredApex, mustContain]
}

// Checks if the organism input into in the organism based filters is in the ecosystem
function validateOrganismFilter() {
    const existingOrganisms = []
    for ( const organism of ecosystem.values()) {
        if( organism['name'] ) {
            existingOrganisms.push(organism['name'].toLowerCase());
        }
    }
    if (!this.value) {
        return;
    }
    if (!existingOrganisms.includes(this.value.toLowerCase())) {
        this.value = '';
        return;
    }
    
    // Checks if the organism exists but with different casing
    const organism = ecosystem.values().find(
        o => o.name.toLowerCase() === this.value.toLowerCase()
    );
    // Makes the casing correct
    this.value = organism.name;
}

// sections off the organisms into producers and consumers for simpler calculations (only producers can start a foodchain (producers all produce energy without eating another create))
function organiseOrganism() {
    const producers = requiredProducer ?? [];
    console.log(typeof producers)
    const consumers = new Map();
    for (const [organismId, organismInfo] of ecosystem) {
        if(!organismInfo["name"]){
            continue
        }
        if (!organismInfo["foodList"][0]){
            if (typeof producers === "object") {
                producers.push(organismInfo["name"]);
                continue
            }
        }
        const foodNames = []
        for (const food of organismInfo["foodList"]){
            foodNames.push(ecosystem.get(food)["name"])
        }
        consumers.set(organismInfo["name"], foodNames);
    }
    return [producers, consumers]
}

// Top level controls for the generation of food chains
function findFoodChains() {
    const [producers, consumers] = organiseOrganism();
    console.log(producers)

    foodChains = [];

    if (typeof producers === "string") {
        createChain(consumers, producers, [producers], 0);
        return;
    }
    for (const producer of producers) {
        createChain(consumers, producer, [producer], 0);
    }

    console.log(foodChains);
}

// Main controls for the generation of food chains
function createChain(consumers, currentOrganism, chain, links) {
    const nextConsumers = findConsumers(currentOrganism, consumers);
    // adds the food chain to the list if it has reached the top due to maxLength or apex predator
    if (links >= maxChainLength -1 || nextConsumers.length === 0) {
        if(mustContain !== undefined && !chain.includes(mustContain)) {
            return;
        }
        if(!(chain[chain.length-1] === requiredApex) && requiredApex) {
            return;
        }
        if(chain.length < minChainLength) {
            return;
        }
        foodChains.push([...chain]);
        return;
    }

    // everything that eats this organism has the same checks to find what eats them
    for (const consumer of nextConsumers) {
        if (consumer == currentOrganism) {
            if(!(chain[chain.length-1] === requiredApex) && requiredApex) {
                continue
            }
            if(mustContain !== undefined && !chain.includes(mustContain)) {
                continue;
            }
            if(chain.length < minChainLength - 1) {
                return;
            }
            foodChains.push([...chain, "Cannibalism"]);
            continue
        }
        if (chain.includes(consumer)) {
            if(!(chain[chain.length-1] === requiredApex) && requiredApex) {
                continue
            }
            if(mustContain !== undefined && !chain.includes(mustContain)) {
                continue;
            }
            if(chain.length < minChainLength - 1) {
                return;
            }
            foodChains.push([...chain, "Reciprocal predation loop"]);
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
    const canEat = [];
    for (const [consumerName, foodList] of consumers) {
        if (foodList.includes(food)){
            canEat.push(consumerName);
        }
    }
    return canEat;
}

// Converts the food chains to html
function displayFoodChains() {
    setParameters()
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

// Sets up the ability for users to interact with the page
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".organismFilter").forEach(filter => {
        filter.addEventListener("change", validateOrganismFilter);
    });
    document.querySelector("#maxLength").addEventListener("change", function() {
        if ( this.value < 2 ){
            this.value = '';
        }
    });
    document.querySelector("#minLength").addEventListener("change", function() {
        if ( this.value < 0 ){
            this.value = '';
        }
    });
    document.querySelector("#filters").addEventListener("submit", (e) => {
        e.preventDefault();
        displayFoodChains();
    });
});