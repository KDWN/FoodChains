import express from "express";
import { saveEcosystem } from "../controllers/ecosystemController";

export const router = express.Router()

router.post('/saveEcosystem', saveEcosystem);