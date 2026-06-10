import express from "express"
import { removeConnection } from "../controllers/foodController.js";


export const foodRouter = express.Router()

foodRouter.post('/removeFood', removeConnection);