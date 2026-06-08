import { checkEcosystem, createEcosystem } from '../models/ecosystemModel.js'

export const saveEcosystem = async (req, res) => {
    const { ecosystem } = req.body
    createEcosystem(ecosystem)
    console.log(`${JSON.stringify(ecosystem)} saved`)
    res.json(`Ecosystem saved: ${JSON.stringify(ecosystem)}`)
}

export const callEcosystem = async (req, res) => {
    const ecosystem = await checkEcosystem()
    res.json(ecosystem)
}