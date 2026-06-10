import neo4j from 'neo4j-driver'
import { driver } from "../config/db.js"

export const deleteOrganism = async (organismId) => {
    const session = driver.session()
    try {
        await session.executeWrite(async tx => {
            await tx.run(`
                MATCH(o:Organism {id: $organismId})
                DETACH DELETE o
            `,
            {organismId}
            )
        })
    } finally {
        session.close()
    }
}