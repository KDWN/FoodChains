import { deleteConnection } from "../models/foodModel.js";

export const removeConnection = async (req, res) => {
    const {organismId, thisId} = req.body

    await deleteConnection(organismId, thisId);
    
    console.log(`${JSON.stringify(organismId)} -> ${JSON.stringify(thisId)} detached`);
    res.json(JSON.stringify(thisId));
}