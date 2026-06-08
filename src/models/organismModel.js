import neo4j from 'neo4j-driver'
import { driver } from "../config/db.js"

export const deleteOrganism = async (organism) => {
    console.log(organism)
    const session = driver.session()
    try {
        await session.executeWrite(async tx => {
            await tx.run(`
                MATCH(o:Organism {name: $organism})
                DETACH DELETE o
            `,
            {organism}
            )
        })
    } finally {
        session.close()
    }
}