import neo4j from 'neo4j-driver'
import { driver } from "../config/db.js"

export const checkFoodConnections = async (foodList) => {
    console.log(foodList)
    const removedFood = []
    const session = driver.session()
    try {
        await session.executeWrite(async tx => {
            for(const food of foodList) {
                console.log(food)
                const deletedFood = await tx.run(`
                    MATCH(o:Organism {name: $food})
                    WHERE NOT (o)--()
                    WITH o, o.name AS deletedName
                    DELETE o
                    RETURN deletedName
                `,
                {food}
                )
                if (deletedFood.records.length > 0) {
                    removedFood.push(deletedFood.records[0])
                }
            }
        })
    } finally {
        session.close()
        console.log(`${JSON.stringify(removedFood)} have been removed due to 0 links`)
    }
}