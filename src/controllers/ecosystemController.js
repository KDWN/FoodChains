import neo4j from 'neo4j-driver'

export const saveEcosystem = async (req, res) => {
    const { ecosystem } = req.body
    for (let index = 0; index < ecosystem.length; index++) {
        const organismName = ecosystem[index];
        const foodList = ecosystem[organismName];

    }
    console.log(`${JSON.stringify(ecosystem)} saved`)
    res.json(`Ecosystem saved: ${JSON.stringify(ecosystem)}`)
}