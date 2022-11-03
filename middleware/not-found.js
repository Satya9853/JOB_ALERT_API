const notFoundMiddleware = (req, res, next)=>{
    res.status(404).send("Route does not Exist");
}

module.exports=notFoundMiddleware