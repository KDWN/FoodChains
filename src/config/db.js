import 'dotenv/config'
import neo4j from 'neo4j-driver'

export const startDriver = async () => {
    const driver = neo4j.driver(
        process.env.NEO4J_URI,
        neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    )
    try {
        const serverInfo = await driver.getServerInfo();
        console.log('Database connected');
        console.log(serverInfo)
    } catch (err) {
        console.error(`There was an issue connecting to the database: ${err}`);
    }
    return driver;
}