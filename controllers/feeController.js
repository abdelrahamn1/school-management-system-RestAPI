const Fee = require("../models/feeModel");
const Student = require("../models/studentModel");
const AppError = require("../utils/AppErrorr");

exports.createFee = async (req, res, next) => {
  try {
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
    if (!fee) return next(new AppError("No Fee Founded!", 404));
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
    const fee = await Fee.find();
    res.status(200).json({
      status: "success",
      result: fee.length,
      data: fee,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateFee = async (req, res, next) => {
  try {
    const updatefee = await Fee.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body, updatedAt: Date.now() } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatefee) return next(new AppError("No Fee Founded!", 404));
    res.status(200).json({
      status: "success",
      data: updatefee,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteFee = async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return next(new AppError("No Fee Founded!", 404));
    } else {
      await Fee.findByIdAndDelete(req.params.id);
      res.status(201).json({
        status: "success",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};
