const Class = require("../models/classModel");
const Teacher = require("../models/teacherModel");
const Student = require("../models/studentModel");
const AppError = require("../utils/AppErrorr.js");

const applyQueryOptions = require("../utils/queryHelper");

// Utility function to validate teacher and student IDs
const validateIds = async (ids, model, entityType) => {
  const validEntities = await model.find({ _id: { $in: ids } });
  const validEntityIDs = validEntities.map((entity) => entity._id.toString());

  const invalidIds = ids.filter((id) => !validEntityIDs.includes(id));

  if (invalidIds.length > 0) {
    throw new AppError(
      `${entityType} IDs not found: ${invalidIds.join(", ")}`,
      400
    );
  }

  return validEntityIDs;
};

exports.getAllClasses = async (req, res, next) => {
  try {
    const query = applyQueryOptions(req, Class);
    const classes = await query;
    res.status(200).json({
      status: "success",
      result: classes.length,
      data: classes,
    });
  } catch (err) {
    next(err);
  }
};

exports.createClass = async (req, res, next) => {
  try {
    const { name, teachers, students, superVisor } = req.body;

    // Check body not empty
    if (!name || !teachers || !students || !superVisor) {
      return next(
        new AppError(
          "Name, teachers, students, and supervisor are required!",
          400
        )
      );
    }

    // Validate teacher and student IDs
    const validTeachers = await validateIds(teachers, Teacher, "Teacher");
    const validStudents = await validateIds(students, Student, "Student");

    // Validate supervisor
    const supervisor = await Teacher.findById(superVisor);
    if (!supervisor)
      return next(new AppError("Supervisor ID is not valid!", 400));
    if (!validTeachers.includes(supervisor._id.toString())) {
      return next(
        new AppError(
          "Supervisor must be one of the teachers of the class!",
          400
        )
      );
    }

    // Create the class
    const newClass = await Class.create({
      name,
      teachers: validTeachers,
      students: validStudents,
      superVisor: superVisor,
    });

    res.status(201).json({
      status: "success",
      data: newClass,
      message: "Class created successfully with valid teacher and student IDs.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getClass = async (req, res, next) => {
  try {
    const classId = await Class.findById(req.params.id);
    if (!classId)
      return next(new AppError("No class found with this ID!", 404));

    res.status(200).json({
      status: "success",
      data: classId,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateClass = async (req, res, next) => {
  try {
    const { newTeachers, newStudents } = req.body;

    // Validate that at least new teachers or new students are provided
    if (!newTeachers && !newStudents) {
      return next(
        new AppError("Either newTeachers or newStudents must be provided!", 400)
      );
    }

    // Validate teacher and student IDs
    if (newTeachers) {
      const validTeachers = await validateIds(newTeachers, Teacher, "Teacher");
      req.body.newTeachers = validTeachers;
    }

    if (newStudents) {
      const validStudents = await validateIds(newStudents, Student, "Student");
      req.body.newStudents = validStudents;
    }

    // Update the class
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          teachers: req.body.newTeachers,
          students: req.body.newStudents,
        },
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return next(new AppError("Class not found!", 404));
    }

    res.status(200).json({
      status: "success",
      data: updatedClass,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteIDFromClass = async (req, res, next) => {
  try {
    const { teacherId, studentId } = req.body;

    // Validate that at least one of the teacherId or studentId is provided
    if (!teacherId && !studentId) {
      return next(
        new AppError("Either teacherId or studentId must be provided!", 400)
      );
    }

    // Validate teacherId if provided
    if (teacherId) {
      const validTeacher = await Teacher.findById(teacherId);
      if (!validTeacher) {
        return next(new AppError("Invalid teacherId provided!", 400));
      }
    }

    // Validate studentId if provided
    if (studentId) {
      const validStudent = await Student.findById(studentId);
      if (!validStudent) {
        return next(new AppError("Invalid studentId provided!", 400));
      }
    }

    // Build the update object dynamically
    const updateFields = {};
    if (teacherId) updateFields.teachers = teacherId;
    if (studentId) updateFields.students = studentId;

    // Update the class document to remove the teacher or student
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { $pull: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return next(new AppError("Class not found!", 404));
    }

    res.status(200).json({
      status: "success",
      data: updatedClass,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteClass = async (req, res, next) => {
  try {
    const deletedClass = await Class.findById(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({
        status: "fail",
        message: `Class with ID ${req.params.id} not found.`,
      });
    }
    await Class.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
