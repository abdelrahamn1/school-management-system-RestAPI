const SubmissionAssignment = require("../models/submissionAssignmentModel");
const AppError = require("../utils/AppErrorr.js");

// Create a new assignment submission
exports.submitAssignment = async (req, res, next) => {
  try {
    const newSubmission = await SubmissionAssignment.create(req.body);
    res.status(201).json({
      status: "success",
      data: newSubmission,
    });
  } catch (err) {
    next(new AppError(`Error submitting assignment: ${err.message}`, 500));
  }
};

// Remove an existing assignment submission
exports.removeSubmissionAssignment = async (req, res, next) => {
  try {
    const submission = await SubmissionAssignment.findById(req.params.id);
    if (!submission) {
      return next(
        new AppError("No submitted assignment found with this ID", 404)
      );
    }

    await SubmissionAssignment.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      message: "Assignment submission deleted successfully",
      data: null,
    });
  } catch (err) {
    next(
      new AppError(`Error removing assignment submission: ${err.message}`, 500)
    );
  }
};
