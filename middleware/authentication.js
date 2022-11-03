const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const {UnauthenticatedError} = require("../errors");

const auth = async (req, res, next)=>{
    // check headers
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer")){
        throw new UnauthenticatedError("Authentication invalid");
    }

    const token = authHeader.split(" ")[1];
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        //attch the user to the job routes
        req.user = await UserModel.findById(payload.userId).select("-password");
        next();

    }catch(error){
        throw new UnauthenticatedError("AUthentication invalid");
    }
}

module.exports=auth;