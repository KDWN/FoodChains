import cors from 'cors'
import express from 'express'
import { logger } from './middlewares/logger.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { ecosystemRouter } from './routes/ecosystemRoutes.js'
import { organismRouter } from './routes/organismRoutes.js'
import { foodRouter } from './routes/foodRoutes.js'
import { driver, startDriver, cleanup} from './config/db.js'
import { mapReviver } from './middlewares/mapConverter.js'

export const app = express()

app.use(cors({
    origin: ['http://localhost:5501', 'http://127.0.0.1:5501']
}))

app.use(express.json({ reviver: mapReviver }))

app.use(logger)

app.use('/ecosystems', ecosystemRouter)

app.use('/organisms', organismRouter)

app.use('/food', foodRouter)

app.use(errorHandler)

process.on('SIGINT', () =>{
    cleanup(driver)
});
process.on('SIGTERM', () =>{
    cleanup(driver)
});