const Teacher = require("../models/teacherModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppErrorr");

exports.getTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher)
      return next(new AppError("There is no result for this id!", 404));

    const details = await User.findById(req.user._id);
    res.status(200).json({
      status: "success",
      data: { teacher, details },
    });
  } catch (err) {
    next(err);
  }
};


exports.updateTeacher = async (req, res, next) => {
  try {
    if (req.body.password)
      return next(new AppError("Please use the forgetPassword route!!", 400));

    const teacherData = await Teacher.findByIdAndUpdate(
      req.params.id,
      {
        age: req.body.age,
        gender: req.body.gender,
        contactInfo: req.body.contactInfo,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    const teacherUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    let requestFields = Object.keys(req.body).join(",");
    if (requestFields.length === 0) requestFields = "data";
    res.status(200).json({
      status: "succes",
      message: `Your ${[requestFields]} were  updated succesfully`,
      data: {
        teacherData,
        teacherUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTeacher = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
