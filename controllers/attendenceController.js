const Attendence = require("../models/attendenceModel");
const Student = require("../models/studentModel");
const Class = require("../models/classModel");
const Teacher = require("../models/teacherModel");
const AppError = require("../utils/AppErrorr");

exports.createAttendence = async (req, res, next) => {
  try {
    const newAttendence = await Attendence.create(req.body);
    res.status(201).json({
      status: "success",
      data: newAttendence,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAttendence = async (req, res, next) => {
  try {
    const attendence = await Attendence.findById(req.params.id);
    if (!attendence) return next(new AppError("No attendence Founded!", 404));
    res.status(200).json({
      status: "success",
      data: attendence,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllAttendence = async (req, res, next) => {
  try {
    const attendence = await Attendence.find().select({ status: true });
    res.status(200).json({
      status: "success",
      result: attendence.length,
      data: attendence,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAttendence = async (req, res, next) => {
  try {
    const updateAttendence = await Attendence.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updateAttendence)
      return next(new AppError("No Attendence Founded!", 404));
    res.status(200).json({
      status: "success",
      data: updateAttendence,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteAttendence = async (req, res, next) => {
  try {
    const attendence = await Attendence.findById(req.params.id);
    if (!attendence) {
      return next(new AppError("No Attendence Founded!", 404));
    } else {
      await Attendence.findByIdAndDelete(req.params.id);
      res.status(201).json({
        status: "success",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};
