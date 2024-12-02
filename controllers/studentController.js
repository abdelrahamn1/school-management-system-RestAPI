const Student = require("../models/studentModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppErrorr");

exports.getStudent = async (req, res, next) => {
  try {
    const student = await User.findById(req.user._id).select("-_id -createdAt");
    const studentDetails = await Student.findById(req.params.id).select(
      "-__v -_id -createdAt -updatedAt"
    );
    if (!studentDetails) return next(new AppError("no Student founded!"));

    res.status(200).json({
      status: "success",
      data: { student, studentDetails },
    });
  } catch (err) {
    next(err);
  }
};

exports.UpdateStudent = async (req, res, next) => {
  try {
    if (req.body.password)
      return next(new AppError("please use forgot password URL!"));
    await Student.findByIdAndUpdate(
      req.params.id,
      {
        dof: req.body.dof,
        gender: req.body.gender,
        age: req.body.age,
        contactInfo: req.body.contactInfo,
        updatedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        email: req.body.email,
        updatedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    const student = await Student.findById(req.params.id).select(
      "-_id -createdAt -updatedAt -__v"
    );
    const studentUser = await User.findById(student.user).select(
      "-_id -createdAt -updatedAt"
    );

    const UpdateFields = Object.keys(req.body).join(" ");
    if (UpdateFields.length === 0) UpdateFields = "data";
    res.status(200).json({
      status: "success",
      message: `Your [${UpdateFields}] were updated successfuly!`,
      date: { student, studentUser },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteStudent = (req, res, next) => {
  try {
    res.status(200).json({
      message: "Please contact an admin to delete your account!",
    });
  } catch (err) {
    next(err);
  }
};
