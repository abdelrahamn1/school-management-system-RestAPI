const submitAssignmnet = require("../models/submissionAssignmentModel");
const AppError = require("../utils/AppErrorr");

exports.sumbitAssignment = async (req, res, next) => {
  try {
    const newsubmitAssignmnet = await submitAssignmnet.create(req.body);
    res.status(201).json({
      status: "success",
      data: newsubmitAssignmnet,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeSumbitAssignment = async (req, res, next) => {
  try {
    const removesubmitAssignmnet = await submitAssignmnet.findById(
      req.params.id
    );
    if (!removesubmitAssignmnet) {
      return next(new AppError("No submited Assignmnet Founded!", 404));
    } else {
      await submitAssignmnet.findByIdAndDelete(req.params.id);
      res.status(201).json({
        status: "success",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};
