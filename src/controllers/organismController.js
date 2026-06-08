import { checkFoodConnections } from "../models/foodModel.js"
import { deleteOrganism } from "../models/organismModel.js"

export const removeOrganism = async (req, res) => {
    await deleteOrganism(req.body["organismName"])
    console.log(`${JSON.stringify(req.body)} deleted`)
    res.json(`Organism deleted: ${JSON.stringify(req.body)}`)
    checkFoodConnections(req.body["foodList"])
}