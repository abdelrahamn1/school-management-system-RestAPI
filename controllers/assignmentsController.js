const Assignment = require("../models/assignmentModel.js");
const AppError = require("../utils/AppErrorr.js");

exports.showAssignmentsClass = async (req, res, next) => {
  try {
    const classID = req.params.id;
    if (!classID) return next(new AppError("Class ID is required!", 400));

    const assignmnets = await Assignment.findOne({ class: classID });
    if (!assignmnets) return next(new AppError("This Class not Founded!", 404));

    if (assignmnets.length < 0)
      res.status(200).send("no assignments to this class!");

    res.status(200).json({
      status: "success",
      data: assignmnets,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllAssignments = async (req, res, next) => {
  try {
    const assignmnets = await Assignment.find();
    if (!assignmnets) return next(new AppError("no assignmnets founded!", 404));

    res.status(200).json({
      status: "success",
      results: assignmnets.length,
      data: assignmnets,
    });
  } catch (err) {
    next(err);
  }
};

exports.createAssignment = async (req, res, next) => {
  try {
    const newAssignment = await Assignment.create({
      title: req.body.title,
      description: req.body.description,
      AssigneDate: req.body.AssigneDate,
      dueDate: req.body.dueDate,
      class: req.body.class,
      subject: req.body.subject,
    });

    res.status(201).json({
      status: "success",
      data: newAssignment,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAssignment = async (req, res, next) => {
  try {
    const assignmentUpdated = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!assignmentUpdated)
      return next(new AppError("no Assignment founded!", 404));

    const updateFields = Object.keys(req.body);

    res.status(200).json({
      status: "success",
      message:
        updateFields.length > 0
          ? `[${updateFields.join(" ")}] updated successfuly!`
          : "updated..!",
      data: assignmentUpdated,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteAssignmet = async (req, res, next) => {
  try {
    if (!(await Assignment.findByIdAndDelete(req.params.id)))
      return next(new AppError("No Assignment founded !", 404));
    else {
      await Assignment.findByIdAndDelete(req.params.id);
      res.status(204).json({
        status: "success",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};
