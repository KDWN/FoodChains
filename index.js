const validCharacters = /[a-z][A-Z]/g;

function addConsumable() {
    const tempFood = document.getElementById("tempFood").content;
    const cloneFood = document.importNode(tempFood, true);
    let thisOrganism = this.parentNode.children[0];
    thisOrganism.appendChild(cloneFood);
    let newFood = thisOrganism.lastElementChild;
    newFood.lastElementChild.addEventListener("click", removeConsumable);
    if(isOverflowing(thisOrganism) === true) {
        thisOrganism.style.paddingRight = "1rem";
    }
}

function addOrganism() {
    console.log("addOrganism pressed")
    const tempGasm = document.getElementById("tempGasm").content;
    const cloneGasm = document.importNode(tempGasm, true);
    let thisEcosystem = this.parentNode.children[2];
    thisEcosystem.appendChild(cloneGasm);
    let newOrganism = thisEcosystem.lastElementChild;
    newOrganism.children[0].children[0].lastElementChild.addEventListener("click", removeOrganism);
    newOrganism.children[0].children[1].lastElementChild.addEventListener("click", removeConsumable);
    newOrganism.lastElementChild.addEventListener("click", addConsumable)
}

function isOverflowing(element) {
    return element.scrollHeight > element.clientHeight;
}

function removeConsumable() {
    console.log('e')
    let thisFood = this.parentNode;
    thisFood.remove();
}

function removeOrganism() {
    let thisOrganism = this.closest(".organBox");
    thisOrganism.remove();
}

function saveEcosystem() {
    const container = document.querySelector('#ecosystem');
    const ecosystem = {};
    container.querySelectorAll('.organism').forEach((organism) => {
        const organismName = organism.querySelector('.name').value;
        ecosystem[organismName] = [];
        organism.querySelectorAll('.foodItem').forEach((foodItem) => {
            const foodName = foodItem.querySelector('.foodName').value;
            ecosystem[organismName].push(foodName);
        })
    })
    console.log(ecosystem)
    fetch('http://localhost:3000/saveEcosystem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ecosystem })
    })
    .then(response => {
        if(!response.ok){
            throw new Error(`Server error: ${response.status} , ${response.statusText}`)
        }
        return response.json();
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data)
    })
    .catch(err => {
        console.error(err);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("page loaded");
    document.querySelectorAll(".addFood").forEach(foodAdder => {
        foodAdder.addEventListener("click", addConsumable);
    });
    document.querySelector("#addOrganism").addEventListener("click", addOrganism);
    document.querySelectorAll(".removeFood").forEach(foodRemover => {
        foodRemover.addEventListener("click", removeConsumable);
    });
    document.querySelectorAll(".removeOrganism").forEach(OrganismRemover => {
        OrganismRemover.addEventListener("click", removeOrganism);
    });
    document.querySelector("#ecosystem").addEventListener("submit", (e) => {
        e.preventDefault()
        saveEcosystem()
    })
});
