import express from 'express'
import { app } from './app.js'
import { startDriver } from './config/db.js'

const PORT = process.env.PORT || 3000

const startServer = async () => {
    await startDriver()

    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    })
}

startServer()