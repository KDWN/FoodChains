import express from "express"
import { removeOrganism } from "../controllers/organismController.js";

export const organismRouter = express.Router()

organismRouter.post('/removeOrganism', removeOrganism);