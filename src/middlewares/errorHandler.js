import express from "express"

export const errorHandler = (req,res,next)=> {
    const pageName = req.path
    res.status(404).send(`Page ${pageName} could not be found`)
}