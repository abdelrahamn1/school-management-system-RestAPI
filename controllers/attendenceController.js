const Attendance = require("../models/attendenceModel");
const Student = require("../models/studentModel");
const Class = require("../models/classModel");
const Teacher = require("../models/teacherModel");
const AppError = require("../utils/AppErrorr.js");

// Helper function to validate IDs (Class, Student, Teacher)
const validateIDs = async (classID, subjectID, teacherID) => {
  const validClass = classID ? await Class.findById(classID) : null;
  const validStudent = subjectID ? await Student.findById(subjectID) : null;
  const validTeacher = teacherID ? await Teacher.findById(teacherID) : null;

  if (classID && !validClass)
    return new AppError("Class ID is not valid!", 400);
  if (subjectID && !validStudent)
    return new AppError("Student ID is not valid!", 400);
  if (teacherID && !validTeacher)
    return new AppError("Teacher ID is not valid!", 400);

  return null;
};

// Create Attendance
exports.createAttendance = async (req, res, next) => {
  try {
    const newAttendance = await Attendance.create(req.body);
    res.status(201).json({
      status: "success",
      data: newAttendance,
    });
  } catch (err) {
    next(err);
  }
};

// Get Attendance by ID
exports.getAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) return next(new AppError("No attendance found!", 404));
    res.status(200).json({
      status: "success",
      data: attendance,
    });
  } catch (err) {
    next(err);
  }
};

// Get All Attendances
exports.getAllAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find().select({ status: true });
    res.status(200).json({
      status: "success",
      result: attendance.length,
      data: attendance,
    });
  } catch (err) {
    next(err);
  }
};

// Update Attendance
exports.updateAttendance = async (req, res, next) => {
  try {
    const { classID, subjectID, teacherID } = req.body;

    // Validate IDs
    const validationError = await validateIDs(classID, subjectID, teacherID);
    if (validationError) return next(validationError);

    // Update Attendance
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { updatedAt: Date.now(), ...req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAttendance)
      return next(new AppError("No attendance found!", 404));

    res.status(200).json({
      status: "success",
      data: updatedAttendance,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Attendance
exports.deleteAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) return next(new AppError("No attendance found!", 404));

    await Attendance.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
