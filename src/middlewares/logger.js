export const logger = (req,res,next)=>{
    console.log(`${req.method} ${req.url} done at ${Date.now()}`)
    next();
}