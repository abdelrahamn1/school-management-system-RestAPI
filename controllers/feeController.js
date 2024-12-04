const Fee = require("../models/feeModel");
const Student = require("../models/studentModel");
const AppError = require("../utils/AppErrorr.js");

const applyQueryOptions = require("../utils/queryHelper");

exports.createFee = async (req, res, next) => {
  try {
    // Validate Student ID before creating the Fee
    const validateStudent = await Student.findById(req.body.student);
    if (!validateStudent)
      return next(new AppError("Student not found with this ID!", 404));

    const newFee = await Fee.create(req.body);
    res.status(201).json({
      status: "success",
      data: newFee,
    });
  } catch (err) {
    next(err);
  }
};

exports.getFee = async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return next(new AppError("No fee found with this ID", 404));

    res.status(200).json({
      status: "success",
      data: fee,
    });
  } catch (err) {
    next(err);
  }
};

exports.getFees = async (req, res, next) => {
  try {
    const query = applyQueryOptions(req, Fee);
    const fees = await query;

    res.status(200).json({
      status: "success",
      result: fees.length,
      data: fees,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateFee = async (req, res, next) => {
  try {
    if (req.body.student) {
      // Validate Student ID before updating the Fee
      const validateStudent = await Student.findById(req.body.student);
      if (!validateStudent)
        return next(new AppError("Student not found with this ID!", 404));
    }

    const updatedFee = await Fee.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedFee)
      return next(new AppError("No fee found with this ID", 404));

    res.status(200).json({
      status: "success",
      data: updatedFee,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteFee = async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return next(new AppError("No fee found with this ID", 404));
    }

    await Fee.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
