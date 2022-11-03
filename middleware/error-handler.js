const {StatusCodes} = require("http-status-codes")

const errorHandlerMiddleware = (error, req, res, next)=>{

    let customError = {
        // set default
        statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || "Something went Wrong try again later",
    }

    if(error.code && error.code === 11000){
        customError.message = `Duplicate value entered for ${Object.keys(error.keyValue)} field, please choose another value`;
        customError.statusCode = 400;
    }

    if(error.name === "ValidationError"){
        customError.message = Object.values(error.errors).map((item)=>item.message).join(",");
        customError.statusCode = 400;
    }

    if(error.name === "CastError"){
        customError.message = `No item found with id: ${error.value}`;
        customError.statusCode = 404;
    }

        return res.status(customError.statusCode).json({message:customError.message});
        // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});

}

module.exports=errorHandlerMiddleware;