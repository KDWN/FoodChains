import { checkEcosystem, createEcosystem } from '../models/ecosystemModel.js'
import { mapReplacer } from '../middlewares/mapConverter.js';

export const saveEcosystem = async (req, res) => {
    const ecosystem = req.body;

    createEcosystem(ecosystem);

    console.log(`${JSON.stringify(ecosystem, mapReplacer)} saved`);
    res.json(JSON.stringify(ecosystem, mapReplacer));
}

export const callEcosystem = async (req, res) => {
    const ecosystem = await checkEcosystem();
    res.json(JSON.stringify(ecosystem, mapReplacer));
}