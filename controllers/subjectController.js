const Fee = require("../models/feeModel");
const Subject = require("../models/subjectModel");
const AppError = require("../utils/AppErrorr.js");

const applyQueryOptions = require("../utils/queryHelper");

exports.getAllSubjects = async (req, res, next) => {
  try {
    const query = applyQueryOptions(req, Subject);
    const subjects = await query;

    res.status(200).json({
      status: "success",
      result: subjects.length,
      data: subjects,
    });
  } catch (err) {
    next(new AppError(`Error fetching subjects: ${err.message}`, 500));
  }
};

exports.createSubject = async (req, res, next) => {
  try {
    const newSubject = await Subject.create(req.body);
    res.status(201).json({
      status: "success",
      data: newSubject,
    });
  } catch (err) {
    next(new AppError(`Error creating subject: ${err.message}`, 500));
  }
};

exports.getSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject)
      return next(new AppError("No subject found with this ID", 404));

    res.status(200).json({
      status: "success",
      data: subject,
    });
  } catch (err) {
    next(new AppError(`Error fetching subject: ${err.message}`, 500));
  }
};

exports.updateSubject = async (req, res, next) => {
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      { $set: { updatedAt: Date.now() }, ...req.body },
      { new: true, runValidators: true }
    );

    if (!updatedSubject) {
      return next(new AppError("No subject found with this ID to update", 404));
    }

    const updatedFields = Object.keys(req.body).join(", ");
    if (updatedFields.length === 0) {
      return next(new AppError("No valid fields provided to update", 400));
    }

    res.status(200).json({
      status: "success",
      message: `${updatedFields} were updated successfully.`,
    });
  } catch (err) {
    next(new AppError(`Error updating subject: ${err.message}`, 500));
  }
};

exports.deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return next(new AppError("No subject found with this ID", 404));
    }

    await Subject.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      message: "Subject deleted successfully.",
      data: null,
    });
  } catch (err) {
    next(new AppError(`Error deleting subject: ${err.message}`, 500));
  }
};
