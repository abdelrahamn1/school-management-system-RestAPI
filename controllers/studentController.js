const Student = require("../models/studentModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppErrorr.js");

const applyQueryOptions = require("../utils/queryHelper");

exports.getAllStudents = async (req, res, next) => {
  try {
    const query = applyQueryOptions(req, Student);
    const students = await query;
    res.status(200).json({
      status: "success",
      result: students.length,
      data: students,
    });
  } catch (err) {
    next(new AppError(`Error fetching students: ${err.message}`, 500));
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    // Assuming `req.body` has all the necessary student data
    const newStudent = await Student.create(req.body);
    res.status(201).json({
      status: "success",
      data: newStudent,
    });
  } catch (err) {
    next(new AppError(`Error creating student: ${err.message}`, 500));
  }
};

exports.getStudent = async (req, res, next) => {
  try {
    let studentDetails;
    let student;

    studentDetails = await Student.findById(req.params.id);
    if (!studentDetails)
      return next(new AppError("No student found with this ID", 404));

    if (req.user.role === "admin") {
      student = await User.findById(req.user._id);
    } else {
      student = await User.findById(req.user._id).select("-_id -createdAt");
    }

    res.status(200).json({
      status: "success",
      data: { student, studentDetails },
    });
  } catch (err) {
    next(new AppError(`Error fetching student: ${err.message}`, 500));
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    let updatedFields = Object.keys(req.body).join(", ");

    if (req.user.role === "admin") {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { updatedAt: Date.now(), ...req.body },
        { new: true, runValidators: true }
      );

      if (!student)
        return next(new AppError("No student found with this ID", 404));

      await User.findByIdAndUpdate(req.params.id, {
        updatedAt: Date.now(),
        ...req.body,
      });
    } else {
      if (req.body.password)
        return next(new AppError("Please use the forgot password route", 400));

      const student = await Student.findByIdAndUpdate(
        req.params.id,
        {
          dof: req.body.dof,
          gender: req.body.gender,
          age: req.body.age,
          contactInfo: req.body.contactInfo,
          updatedAt: Date.now(),
        },
        { new: true, runValidators: true }
      );
      if (!student)
        return next(new AppError("No student found with this ID", 404));

      await User.findByIdAndUpdate(
        req.user._id,
        {
          name: req.body.name,
          email: req.body.email,
          updatedAt: Date.now(),
        },
        { new: true, runValidators: true }
      );
    }

    // Check if any fields were updated
    if (updatedFields.length === 0) updatedFields = "data";

    res.status(200).json({
      status: "success",
      message: `[${updatedFields}] were updated successfully!`,
    });
  } catch (err) {
    next(new AppError(`Error updating student: ${err.message}`, 500));
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      const student = await Student.findById(req.params.id);
      if (!student)
        return next(new AppError("No student found with this ID", 404));

      // Delete associated user
      await User.findByIdAndDelete(student.user);
      await Student.findByIdAndDelete(req.params.id);
      res.status(204).json({
        status: "success",
        message: "Student and associated account deleted successfully",
        data: null,
      });
    } else {
      res.status(401).json({
        status: "fail",
        message: "Please contact an admin to delete your account.",
      });
    }
  } catch (err) {
    next(new AppError(`Error deleting student: ${err.message}`, 500));
  }
};
