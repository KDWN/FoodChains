import neo4j, { Relationship } from 'neo4j-driver'
import { driver } from "../config/db.js"

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

// Sends the information of the ecosystem map to the database
export const createEcosystem = async (ecosystem) => {
    const session = driver.session()
    try {
        await session.executeWrite(async tx => {
        for (const [organismId, organismInfo] of ecosystem) {
            const foodList = organismInfo["foodList"]
            const organismName = organismInfo["name"]
            if ( !organismName ) break
            await tx.run(`
                MERGE(o:Organism {id: $organismId})
                SET o.name = $organismName
                `,
                {organismId, organismName}
            )
            for (const food of foodList) {
                await tx.run(`
                    MATCH(o:Organism {id: $organismId})
                    MERGE(f:Organism {id: $food})
                    MERGE(o)-[:EATS]->(f)
                `,
                {organismId, food}
                )
                console.log(food)
            }
        }
        })
    } finally {
        session.close()
    }
}

// Converts the database information into a map
export const checkEcosystem = async () => {
    let result = []
    const session = driver.session()
    try {
        await session.executeRead(async tx => {
            result = await tx.run(`
                MATCH e=(o)-[r]->(f)
                RETURN e AS ecosystem
            `)
        })
    } finally {
        const ecosystem = new Map()
        for (const link of result.records) {
            const consumerId = link.get('ecosystem').start.properties.id;
            const consumerName = link.get('ecosystem').start.properties.name;
            const foodId = link.get('ecosystem').end.properties.id;
            const foodName = link.get('ecosystem').end.properties.name;
            if (!ecosystem.has(consumerId)) {
                const consumer = new Organism(consumerId, consumerName);
                ecosystem.set(consumerId, consumer);
            } else {
                ecosystem.get(consumerId).rename(consumerName);
            }
            if (!ecosystem.has(foodId)) {
                const food = new Organism(foodId, foodName);
                ecosystem.set(foodId, food);
            }
            if (foodId) {
                ecosystem.get(consumerId).addFood(foodId);
            }
        }
        session.close()
        console.log(ecosystem);
        return ecosystem
    }
}