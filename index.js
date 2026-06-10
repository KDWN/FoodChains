const validCharacters = /[a-z][A-Z]/g;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ecosystem = new Map()

class Organism {
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


function addConsumable(button, uuid) {
    const tempFood = document.getElementById("tempFood").content;
    const cloneFood = document.importNode(tempFood, true);
    const thisOrganism = button.parentNode.children[0];
    thisOrganism.appendChild(cloneFood);
    const newFood = thisOrganism.lastElementChild;
    newFood.children[0].addEventListener("change", validateConsumable);
    newFood.lastElementChild.addEventListener("click", removeConsumable);
    if(isOverflowing(thisOrganism) === true) {
        thisOrganism.style.paddingRight = "1rem";
    }
    if ( uuidRegex.test(uuid) ){
        newFood.dataset.id = uuid;
    }
}

function validateConsumable() {
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
    const organism = ecosystem.values().find(
    o => o.name.toLowerCase() === this.value.toLowerCase()
    );
    this.value = organism.name
    this.dataset.id = organism.id;
    const thisOrganism = this.closest(".organBox")
    const consumerId = thisOrganism.dataset.id
    ecosystem.get(consumerId).addFood(organism.id)
}

function addOrganism(uuid) {
    console.log("addOrganism pressed")
    let organismId

    if ( uuidRegex.test(uuid) ){
        organismId = uuid;
    } else {
        organismId = crypto.randomUUID();
        const unknownOrganism = new Organism(organismId);
        ecosystem.set(organismId, unknownOrganism);
    }

    const tempGasm = document.querySelector("#tempGasm").content;
    const cloneGasm = document.importNode(tempGasm, true);
    const thisEcosystem = document.querySelector("#ecosystem");
    thisEcosystem.appendChild(cloneGasm);
    const newOrganism = thisEcosystem.lastElementChild;

    newOrganism.dataset.id = organismId;

    newOrganism.children[0].children[0].lastElementChild.addEventListener("click", removeOrganism);
    newOrganism.children[0].children[0].children[0].addEventListener("change", (event) => {updateDropdown(organismId, event.currentTarget, event.currentTarget.value)})
    newOrganism.lastElementChild.addEventListener("click", (event) => {addConsumable(event.currentTarget, undefined)});

    const organismSelector = document.createElement("option");
    organismSelector.dataset.id = organismId;
    const consumableList = thisEcosystem.querySelector("#consumableList");
    consumableList.appendChild(organismSelector);
}

function updateDropdown(uuid, nameInput, organismName) {
    const consumableList = document.querySelector("#consumableList");
    const consumableOption = consumableList.querySelector(`[data-id="${uuid}"]`);
    if ( organismName === null ) {
        consumableOption.remove();
        document.querySelectorAll(`input[data-id="${uuid}"]`).forEach((timeEaten) => {
            timeEaten.parentNode.remove();
        })
        return
    }
    const existingOrganisms = []
    for ( const organism of ecosystem.values()) {
        existingOrganisms.push(organism['name']);
    }
    if (existingOrganisms.includes(organismName)){
        nameInput.value = '';
        return
    }
    ecosystem.get(uuid).rename(organismName)
    consumableOption.value = organismName;
    document.querySelectorAll(`input[data-id="${uuid}"]`).forEach((timeEaten) => {
        timeEaten.value = organismName;
    });
}

function isOverflowing(element) {
    return element.scrollHeight > element.clientHeight;
}

function removeConsumable() {
    const thisFood = this.parentNode;
    const thisInput = thisFood.children[0]
    const thisId = thisInput.dataset.id
    const thisOrganism = this.closest(".organBox")
    const organismId = thisOrganism.dataset.id
    ecosystem.get(organismId).removeFood(thisId)
    thisFood.remove();
    fetch('http://localhost:3000/food/removeFood', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({organismId, thisId})
    })
    .then(response => {
        if(!response.ok){
            throw new Error(`Server error: ${response.status} , ${response.statusText}`)
        }
        return response.json();
    })
    .then(response => response)
    .then(data => {
        console.log('Server response:', data)
    })
    .catch(err => {
        console.error(err);
    });
}

function removeOrganism() {
    const thisOrganism = this.closest(".organBox");
    const organismId = thisOrganism.dataset.id;
    const jsOrganism = ecosystem.get(organismId);
    const foodList = jsOrganism["foodList"];
    const nameinput = this.parentNode.children[0];
    updateDropdown(organismId, nameinput, null)
    ecosystem.delete(organismId);
    thisOrganism.remove();
    fetch('http://localhost:3000/organisms/removeOrganism', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ organismId, foodList })
    })
    .then(response => {
        if(!response.ok){
            throw new Error(`Server error: ${response.status} , ${response.statusText}`)
        }
        return response.json();
    })
    .then(response => response)
    .then(data => {
        console.log('Server response:', data)
    })
    .catch(err => {
        console.error(err);
    });
}

function saveEcosystem() {
    console.log(ecosystem)
    fetch('http://localhost:3000/ecosystems/saveEcosystem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ecosystem, replacer)
    })
    .then(response => {
        if(!response.ok){
            throw new Error(`Server error: ${response.status} , ${response.statusText}`)
        }
        return response.json();
    })
    .then(response => response)
    .then(data => {
        console.log('Server response:', JSON.parse(data, reviver))
    })
    .catch(err => {
        console.error(err);
    });
}

function checkDB() {
    return fetch('http://localhost:3000/ecosystems/callEcosystem', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if(!response.ok){
            throw new Error(`Server error: ${response.status} , ${response.statusText}`)
        }
        return response.json()
    })
    .then(response => response)
    .then(data => {
        if (JSON.parse(data, reviver).size < 1) {
            return false
        }
        displayEcosystem(JSON.parse(data, reviver));
        return true
    })
    .catch(err => {
        console.error(err);
    });
}

async function displayEcosystem(data){
    for ( const [organismId, organismInfo] of data ) {
        ecosystem.set(organismId, new Organism(organismId, organismInfo['name'], organismInfo['foodList']))
    }
    console.log(ecosystem);
    for (const [organismId, organismInfo] of ecosystem) {
        console.log('orgId', organismId)
        const organismName = organismInfo['name'];
        const foodList = organismInfo['foodList'];
        await createOrganism(organismId, organismName, foodList);
    }
}

async function createOrganism(organismId, organismName, foodList) {
    await addOrganism(organismId)
    const thisEcosystem = document.querySelector("#ecosystem");
    const newOrganism = thisEcosystem.lastElementChild;
    const nameBox = newOrganism.children[0].children[0].children[0];
    const button = newOrganism.children[1];
    newOrganism.dataset.id = organismId;
    nameBox.value = organismName;
    for ( const foodId of foodList ) {
        await addConsumable(button)
        const foodName = ecosystem.get(foodId)['name'];
        const foodBox = newOrganism.children[0].lastElementChild.children[0];
        foodBox.dataset.id = foodId;
        foodBox.value = foodName;
    }

    const organismSelector = document.createElement("option");
    organismSelector.dataset.id = organismId;
    organismSelector.value = organismName;
    const consumableList = thisEcosystem.querySelector("#consumableList");
    consumableList.appendChild(organismSelector);


    console.log(organismId);
    console.log(foodList);
}

function replacer(key, value) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      map: Object.fromEntries(value),
    };
  } else {
    return value;
  }
}

function reviver(key, value) {
  if (value && typeof value === 'object' && value.dataType === 'Map') {
    return new Map(Object.entries(value.map));
  }
  return value;
}

document.addEventListener("DOMContentLoaded", async () => {
    console.log("page loaded");
    document.querySelector("#test").addEventListener("click", () => {
        const testInput = JSON.stringify(ecosystem, replacer)
        const testOutput = JSON.parse(testInput, reviver)
        console.log(testOutput);
        console.log(Object.fromEntries(ecosystem));
        console.log(Object.fromEntries(ecosystem) === Object.fromEntries(testOutput))
    });
    document.querySelector("#ecosystem").addEventListener("submit", (e) => {
        e.preventDefault()
        saveEcosystem()
    })
    document.querySelector("#addOrganism").addEventListener("click", addOrganism);
    if (! await checkDB()) {
        addOrganism()
        return
    }
});

