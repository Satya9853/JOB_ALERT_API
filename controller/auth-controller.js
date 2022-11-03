const UserModel = require("../models/User");
const {StatusCodes} = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

exports.register = async(req, res, next)=>{

    const user = await UserModel.create({...req.body});

    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({user:{name:user.name}, token});
}



exports.login = async(req, res, next)=>{
    
    const {email, password} = req.body;

    if(!email || !password){
        throw new BadRequestError("Please Provide email and password");
    }

    const user = await UserModel.findOne({email});

    // check if user exist in database
    if(!user){
        throw new UnauthenticatedError("Invalid Credentials");
    }

    //check is password is matching
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Invalid Credentials");
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.name}, token})


}
