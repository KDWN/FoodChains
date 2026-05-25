import neo4j from 'neo4j-driver'
import { driver } from "../config/db"

export const sendEcosystem = async () => {
    const session = await startSession()

    closeSession(session)
}