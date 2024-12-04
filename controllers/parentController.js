const Parent = require("../models/parentModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppErrorr.js");

exports.getParent = async (req, res, next) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) return next(new AppError("No parent found with this ID", 404));

    // Retrieve user details
    const details = await User.findById(req.user._id);

    res.status(200).json({
      status: "success",
      data: { parent, details },
    });
  } catch (err) {
    next(new AppError(`Error fetching parent details: ${err.message}`, 500));
  }
};

exports.createParent = async (req, res, next) => {
  try {
    let newParent;
    if (req.user.role === "admin") {
      newParent = await Parent.create(req.body);
      res.status(201).json({
        status: "success",
        data: newParent,
      });
    } else {
      newParent = await Parent.create({
        user: req.user._id,
        childrens: req.body.childrens,
        contactInfo: req.body.contactInfo,
      });
      res.status(201).json({
        status: "success",
        message: `Your account has been created successfully! Please contact the admins with this ID ${newParent._id} to complete your account setup.`,
      });
    }
  } catch (err) {
    next(new AppError(`Error creating parent: ${err.message}`, 500));
  }
};

exports.updateParent = async (req, res, next) => {
  try {
    if (req.body.password) {
      return next(
        new AppError(
          "Please use the forgot password route for password updates.",
          400
        )
      );
    }

    const updatedParent = await Parent.findByIdAndUpdate(
      req.params.id,
      {
        childrens: req.body.childrens,
        address: req.body.address,
        contactInfo: req.body.contactInfo,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );
    if (!updatedParent) {
      return next(new AppError("No parent found with this ID", 404));
    }

    // Update the associated User details
    await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        email: req.body.email,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    const updatedFields = Object.keys(req.body).join(", ");
    if (updatedFields.length === 0) updatedFields = "data"; // If no fields were provided

    res.status(200).json({
      status: "success",
      message: `${updatedFields} were updated successfully!`,
    });
  } catch (err) {
    next(new AppError(`Error updating parent: ${err.message}`, 500));
  }
};

exports.deleteParent = async (req, res, next) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) {
      return next(new AppError("No parent found with this ID", 404));
    }

    if (req.user.role === "admin") {
      await Parent.findByIdAndDelete(req.params.id);
      res.status(204).json({
        status: "success",
        data: null,
      });
    } else {
      res.status(401).json({
        status: "fail",
        message: "Please contact an admin to delete your account.",
      });
    }
  } catch (err) {
    next(new AppError(`Error deleting parent: ${err.message}`, 500));
  }
};
