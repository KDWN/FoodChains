import express from "express"
import { saveEcosystem } from "../controllers/ecosystemController.js"

export const ecosystemRouter = express.Router()

ecosystemRouter.post('/saveEcosystem', saveEcosystem);