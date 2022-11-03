const JobModel = require("../models/Job");
const {StatusCodes} = require("http-status-codes");
const {BadRequestError, NotFoundError} = require("../errors/index");


exports.getAllJob = async(req, res, next)=>{
    const jobs = await JobModel.find({createdBy:req.user._id}).sort('createdAt');
    res.status(StatusCodes.OK).json({count:jobs.length, jobs});
}

exports.getJob = async(req, res, next)=>{
    const {user:{_id:userId},params:{jobId}} = req;
    
    const job = await JobModel.findOne({
        _id:jobId,
        createdBy:userId
    });

    if(!job){
        throw new NotFoundError(`No Job with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json({job});


}

exports.createJob = async(req, res, next)=>{
    req.body.createdBy = req.user._id;
    const job = await JobModel.create(req.body);
    res.status(StatusCodes.CREATED).json({job});
}

exports.updateJob = async(req, res, next)=>{
    const {body:{company, position},user:{_id:userId},params:{jobId}} = req;

    if(company === "" || position === ""){
        throw new BadRequestError("Company or Position Fields cannot be empty");
    }

    const job = await JobModel.findByIdAndUpdate({_id:jobId, createdBy:userId}, req.body, {new:true, runValidators:true});

    if(!job){
        throw new NotFoundError(`No Job with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json(job);
}

exports.deleteJob = async(req, res, next)=>{
    const {user:{_id:userId},params:{jobId}} = req;

    const job = await JobModel.findOneAndRemove({_id:jobId, createdBy:userId});

    if(!job){
        throw new NotFoundError(`No Job with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json(job);
}


