import { checkFoodConnections } from "../models/foodModel.js"
import { deleteOrganism } from "../models/organismModel.js"

export const removeOrganism = async (req, res) => {
    const {organismId, foodList} = req.body

    await deleteOrganism(organismId);

    console.log(`${JSON.stringify(organismId)} deleted`);
    res.json(JSON.stringify(organismId));
    
    checkFoodConnections(foodList);
}