const mongoose = require("mongoose");
const User = require("../models/userModel");
const AppError = require("../utils/AppErrorr.js");
const applyQueryOptions = require("../utils/queryHelper.js");
// Helper function to check if the user exists by ID
const doesUserExist = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  const user = await User.findById(id);
  return user ? true : false;
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const query = applyQueryOptions(req, User);
    const users = await query;

    res.status(200).json({
      status: "success",
      result: users.length,
      data: users,
    });
  } catch (err) {
    next(new AppError(`Error fetching users: ${err.message}`, 500));
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (err) {
    next(new AppError(`Error creating user: ${err.message}`, 500));
  }
};

// In the getUser function
exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const userExists = await doesUserExist(userId);
    if (!userExists) {
      return next(new AppError(`No user found with ID: ${userId}`, 404));
    }

    const user = await User.findById(userId);
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(new AppError(`Error fetching user: ${err.message}`, 500));
  }
};

// In the updateUser function
exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const userExists = await doesUserExist(userId);
    if (!userExists) {
      return next(new AppError(`No user found with ID: ${userId}`, 404));
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { updatedAt: Date.now() }, ...req.body },
      { new: true, runValidators: true }
    );

    let updatesFields = Object.keys(req.body).join(" ");
    if (updatesFields.length === 0) updatesFields = "No fields"; // if no fields were provided

    res.status(200).json({
      status: "success",
      message: `User ${updatesFields} were updated successfully!`,
      data: user,
    });
  } catch (err) {
    next(new AppError(`Error updating user: ${err.message}`, 500));
  }
};

// In the deleteUser function
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const userExists = await doesUserExist(userId);
    if (!userExists) {
      return next(new AppError(`No user found with ID: ${userId}`, 404));
    }

    await User.findByIdAndDelete(userId);
    res.status(204).json({
      status: "success",
      message: `User with ID: ${userId} successfully deleted.`,
      data: null,
    });
  } catch (err) {
    next(new AppError(`Error deleting user: ${err.message}`, 500));
  }
};

exports.getSomeReports = async (req, res, next) => {
  try {
    const aggregationPipeline = [
      {
        $match: { active: true },
      },
      {
        $facet: {
          teachers: [{ $match: { role: "teacher" } }, { $count: "count" }],
          students: [{ $match: { role: "student" } }, { $count: "count" }],
          parents: [{ $match: { role: "parent" } }, { $count: "count" }],
          totalUsers: [{ $count: "count" }],
        },
      },
    ];

    const report = await User.aggregate(aggregationPipeline);

    const result = report[0] || {};
    res.status(200).json({
      status: "success",
      data: {
        users: result.totalUsers?.[0]?.count || 0,
        totalStudents: result.students?.[0]?.count || 0,
        totalTeachers: result.teachers?.[0]?.count || 0,
        totalParents: result.parents?.[0]?.count || 0,
      },
    });
  } catch (err) {
    next(new AppError(`Error fetching reports: ${err.message}`, 500));
  }
};
