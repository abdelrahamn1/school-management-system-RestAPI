const Parent = require("../models/parentModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppErrorr");

exports.getParent = async (req, res, next) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent)
      return next(new AppError("There is no result for this id!", 404));

    const details = await User.findById(req.user._id);
    res.status(200).json({
      status: "success",
      data: { parent, details },
    });
  } catch (err) {
    next(err);
  }
};

exports.createParent = async (req, res, next) => {
  try {
    const newParent = await Parent.create({
      user: req.user._id,
      childrens: req.body.childrens,
      contactInfo: req.body.contactInfo,
    });
    res.status(201).json({
      status: "success",
      data: newParent,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateParent = async (req, res, next) => {
  try {
    if (req.body.password)
      return next(new AppError("Please use the forgetPassword route!!", 400));

    const ParentData = await Parent.findByIdAndUpdate(
      req.params.id,
      {
        childrens: req.body.childrens,
        contactInfo: req.body.contactIn,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    const ParentUser = await User.findByIdAndUpdate(
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
        ParentData,
        ParentUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteParent = async (req, res, next) => {
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
