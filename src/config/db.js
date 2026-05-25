import 'dotenv/config'
import neo4j from 'neo4j-driver'


export const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(
        process.env.NEO4J_USER, 
        process.env.NEO4J_PASSWORD
    )
)

export const startDriver = async () => {
    try {
        const serverInfo = await driver.getServerInfo();
        console.log('Database connected');
        console.log(serverInfo)
        return driver
    } catch (err) {
        console.error(`There was an issue connecting to the database: ${err}`);
        await driver.close()
        process.exit(1)
    }
}

export const cleanup = async (driver) => {
    console.log('Closing Driver')
    await driver.close()
    console.log('Driver closed')
    process.exit(0);
}

export const startSession = async () => {
    const session = await driver.session({ database: NEO4J_DB })
    return session
}

export const closeSession = async (session) => {
    await session.close()
    console.log('Session closed')
}