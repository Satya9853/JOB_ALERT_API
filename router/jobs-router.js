const express = require("express");
const router = express.Router();

const jobsController = require("../controller/jobs-controller");

router.route("/").post(jobsController.createJob).get(jobsController.getAllJob);

router.route("/:jobId").get(jobsController.getJob).delete(jobsController.deleteJob).patch(jobsController.updateJob);

module.exports=router;