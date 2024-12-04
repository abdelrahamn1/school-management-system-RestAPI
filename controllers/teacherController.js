const Teacher = require("../models/teacherModel");
const Subject = require("../models/subjectModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppErrorr.js");

const applyQueryOptions = require("../utils/queryHelper");

exports.getAllTeachers = async (req, res, next) => {
  try {
    const query = applyQueryOptions(req, Teacher);
    const teachers = await query;
    res.status(200).json({
      status: "success",
      result: teachers.length,
      data: teachers,
    });
  } catch (err) {
    next(new AppError(`Error fetching teachers: ${err.message}`, 500));
  }
};

exports.createTeacher = async (req, res, next) => {
  try {
    // Admin creates a teacher with full details, others are limited
    if (req.user.role === "admin") {
      const newTeacher = await Teacher.create(req.body);
      return res.status(201).json({
        status: "success",
        data: newTeacher,
      });
    }

    // Non-admin user creates a teacher profile with limited fields
    const newTeacher = await Teacher.create({
      user: req.user._id,
      age: req.body.age,
      gender: req.body.gender,
      contactInfo: req.body.contactInfo,
    });

    res.status(201).json({
      status: "success",
      message: `Your account has been created. Please contact an admin and provide them with this ID: ${newTeacher._id} to assign classes to you.`,
    });
  } catch (err) {
    next(new AppError(`Error creating teacher: ${err.message}`, 500));
  }
};

exports.getTeacher = async (req, res, next) => {
  try {
    const teacherId = req.params.id;
    let teacher, subject, details;

    // Admin can access full data
    if (req.user.role === "admin") {
      teacher = await Teacher.findById(teacherId);
      if (!teacher)
        return next(
          new AppError(`No teacher found with ID: ${teacherId}`, 404)
        );

      details = await User.findById(req.user._id);
      subject = await Subject.findById(teacher.subject);
    } else {
      teacher = await Teacher.findById(teacherId).select(
        "-createdAt -updatedAt -__v"
      );
      if (!teacher)
        return next(
          new AppError(`No teacher found with ID: ${teacherId}`, 404)
        );

      details = await User.findById(req.user._id).select(
        "-createdAt -updatedAt"
      );
      subject = await Subject.findById(teacher.subject).select(
        "name code description"
      );
    }

    res.status(200).json({
      status: "success",
      data: { teacher, details, subject },
    });
  } catch (err) {
    next(new AppError(`Error fetching teacher: ${err.message}`, 500));
  }
};

exports.updateTeacher = async (req, res, next) => {
  try {
    const teacherId = req.params.id;
    const updateData = req.body;

    // Admin can update teacher details, including subject
    if (req.user.role === "admin") {
      if (updateData.subject) {
        const validSubject = await Subject.findById(updateData.subject);
        if (!validSubject)
          return next(new AppError("Invalid subject ID!", 400));
      }

      await Teacher.findByIdAndUpdate(
        teacherId,
        { updatedAt: Date.now(), ...updateData },
        {
          new: true,
          runValidators: true,
        }
      );
    } else {
      // Non-admin users cannot modify sensitive fields like subject or classes
      if (updateData.password)
        return next(new AppError("Please use the forgot password route!", 400));
      if (updateData.subject || updateData.classes) {
        return next(
          new AppError(
            "You don't have permission to perform this operation!",
            401
          )
        );
      }

      await Teacher.findByIdAndUpdate(
        teacherId,
        {
          age: updateData.age,
          gender: updateData.gender,
          contactInfo: updateData.contactInfo,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await User.findByIdAndUpdate(
        req.user._id,
        { name: updateData.name, email: updateData.email },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    let updatedFields = Object.keys(updateData).join(", ");
    if (updatedFields.length === 0) updatedFields = "data";

    res.status(200).json({
      status: "success",
      message: `${updatedFields} were updated successfully.`,
    });
  } catch (err) {
    next(new AppError(`Error updating teacher: ${err.message}`, 500));
  }
};

exports.deleteTeacher = async (req, res, next) => {
  try {
    const teacherId = req.params.id;

    // Admin can delete any teacher
    if (req.user.role === "admin") {
      await Teacher.findByIdAndDelete(teacherId);
      res.status(204).json({
        status: "success",
        message: `Teacher with ID: ${teacherId} successfully deleted.`,
        data: null,
      });
    } else {
      // Non-admin users cannot delete teachers
      res.status(401).json({
        status: "fail",
        message: "Please contact an admin to delete your account.",
      });
    }
  } catch (err) {
    next(new AppError(`Error deleting teacher: ${err.message}`, 500));
  }
};
