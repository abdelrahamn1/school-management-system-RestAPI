const User = require("../models/userModel");
const AppError = require("../utils/AppErrorr");

exports.getStaff = async (req, res, next) => {
  try {
    const staff = await User.findById(req.user._id);
    res.status(200).json({
      status: "succes",
      data: {
        staff,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateStaff = async (req, res, next) => {
  try {
    const allowedFields = ["name", "email"];
    const requestFields = Object.keys(req.body);

    const invalidFields = requestFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return next(
        new AppError(
          `You don't have permission to update ${invalidFields.join(
            ", "
          )}, please contact an admin`,
          401
        )
      );
    }
    if (req.body.password)
      return next(new AppError("Please use the forgetPassword route!!", 400));

    const staff = await User.findByIdAndUpdate(
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

    res.status(200).json({
      status: "succes",
      message: `Your ${[requestFields.join(", ")]} were  updated succesfully`,
      data: {
        staff,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).json({
      status: "succes",
      message: "Your account has been deleted successfully!",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
