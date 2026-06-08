import neo4j, { Relationship } from 'neo4j-driver'
import { driver } from "../config/db.js"

export const createEcosystem = async (ecosystem) => {
    const session = driver.session()
    try {
        await session.executeWrite(async tx => {
        for (const [organism, foodList] of Object.entries(ecosystem)) {
            for (const food of foodList) {
                await tx.run(`
                    MERGE(o:Organism {name: $organism})
                    MERGE(f:Organism {name: $food})
                    MERGE(o)-[:EATS]->(f)
                `,
                {organism, food}
                )
            }
        }
        })
    } finally {
        session.close()
    }
}

export const checkEcosystem = async () => {
    let result = []
    const session = driver.session()
    try {
        await session.executeWrite(async tx => {
            result = await tx.run(`
                MATCH e=(o)-[r]->(f)
                RETURN e AS ecosystem
            `)
        })
    } finally {
        const ecosystem = {}
        for (const link of result.records) {
            const consumer = link.get('ecosystem').start.properties.name;
            const food = link.get('ecosystem').end.properties.name;
            if (!ecosystem.hasOwnProperty(consumer)) {
                ecosystem[consumer]=[];
            }
            if (food != undefined) {
                ecosystem[consumer].push(food);
            }
        }
        session.close()
        console.log(ecosystem);
        return ecosystem
    }
}