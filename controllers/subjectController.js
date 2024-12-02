const Fee = require("../models/feeModel");
const Subject = require("../models/subjectModel");
const AppError = require("../utils/AppErrorr");

exports.createSubject = async (req, res, next) => {
  try {
    const newSubject = await Subject.create(req.body);
    res.status(201).json({
      status: "success",
      data: newSubject,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return next(new AppError("No subject Founded!", 404));
    res.status(200).json({
      status: "success",
      data: subject,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllSubject = async (req, res, next) => {
  try {
    const subject = await Subject.find();
    res.status(200).json({
      status: "success",
      result: subject.length,
      data: subject,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateSubject = async (req, res, next) => {
  try {
    const updateSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updateSubject) return next(new AppError("No Subject Founded!", 404));
    res.status(200).json({
      status: "success",
      data: updatefee,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return next(new AppError("No subject Founded!", 404));
    } else {
      await Subject.findByIdAndDelete(req.params.id);
      res.status(201).json({
        status: "success",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};
