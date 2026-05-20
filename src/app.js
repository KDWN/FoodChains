import cors from 'cors'
import express from 'express'
import neo4j from 'neo4j-driver'
import { startDriver } from './config/db.js'
import { logger } from './middlewares/logger.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()
const port = 3000

const driver = await startDriver()


app.use(cors({
    origin: ['http://localhost:5501', 'http://127.0.0.1:5501']
}))

app.use(express.json())

app.use(logger)

app.use(errorHandler)

app.listen(port, ()=> {
    console.log(`server is running on http://localhost:${port}`)
})