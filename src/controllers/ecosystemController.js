import express from "express";

export const saveEcosystem = async (req, res) => {
    const { ecosystem } = req.body
    console.log(`${ecosystem} saved`)
    res.json(`Ecosystem saved: ${ecosystem}`)
}