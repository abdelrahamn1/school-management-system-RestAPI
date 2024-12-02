const Class = require("../models/classModel");
const Teacher = require("../models/teacherModel");
const Student = require("../models/studentModel");
const AppError = require("../utils/AppErrorr");

exports.createClass = async (req, res, next) => {
  try {
    // check body not empty
    if (
      !req.body.name ||
      !req.body.teachers ||
      !req.body.students ||
      req.body.superVisor
    )
      return next(
        new AppError("name and teachersIDs and StudentsIDs is required!", 500)
      );

    // check for ids
    const validTeachers = await Teacher.find({ _id: req.body.teachers });
    const vaildStudents = await Student.find({ _id: req.body.students });

    const vaildteacherIDs = validTeachers.map((teacher) =>
      teacher._id.toString()
    );
    const vaildStudentsIDs = vaildStudents.map((student) =>
      student._id.toString()
    );

    const InavaildTeacher = req.body.teachers.filter(
      (id) => !vaildteacherIDs.includes(id)
    );
    const InavaildStudent = req.body.students.filter(
      (id) => !vaildStudentsIDs.includes(id)
    );

    const missingIDs = [InavaildStudent, InavaildTeacher];

    // create Class
    const newClass = await Class.create({
      name: req.body.name,
      teachers: vaildteacherIDs,
      students: vaildStudentsIDs,
      superVisor: req.body.superVisor,
    });

    res.status(201).json({
      status: "success",
      data: newClass,
      message:
        missingIDs.length > 0
          ? `There are invalid IDs: ${missingIDs.join(
              " "
            )}. They were removed automatically.`
          : "All IDs are valid.",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateClass = async (req, res, next) => {
  try {
    //check body
    if (!req.body.newTeachers && !req.body.newStudents)
      next(
        new AppError("newTeachers IDs or newStudents IDs is requirted!", 500)
      );

    //check for ids
    const vaildTeachers = await Teacher.find({ _id: req.body.newTeachers });
    const vaildStudents = await Student.find({ _id: req.body.newStudents });

    //extract ids
    const teachersIDs = vaildTeachers.map((teacher) => teacher._id.toString());
    const studentsIDs = vaildStudents.map((student) => student._id.toString());

    // add ids to class
    const updateCalss = {};
    if (teachersIDs) {
      const existingClasses = await Class.find({
        teachers: { $in: teachersIDs },
      });
      if (existingClasses.length > 0) {
        const existingTeacherIDs = existingClasses
          .flatMap((classDoc) => classDoc.teachers)
          .filter((id) => teachersIDs.includes(id.toString()));
        if (existingTeacherIDs.length > 0) {
          return next(
            new AppError(
              `The following IDs already exist: ${existingTeacherIDs.join(
                ", "
              )}`,
              50
            )
          );
        }
      }
      updateCalss.teachers = teachersIDs;
    }

    if (studentsIDs) {
      // Query classes to check if any of the student IDs already exist
      const existingClasses = await Class.find({
        students: { $in: studentsIDs },
      });

      if (existingClasses.length > 0) {
        // Collect all existing student IDs
        const existingStudentIDs = existingClasses
          .flatMap((classDoc) => classDoc.students)
          .filter((id) => studentsIDs.includes(id.toString()));

        if (existingStudentIDs.length > 0) {
          console.log(`Existing IDs: ${existingStudentIDs}`);
          return next(
            new AppError(
              `The following IDs already exist: ${existingStudentIDs.join(
                ", "
              )}`,
              500
            )
          );
        }
      }
      updateCalss.students = studentsIDs;
    }

    const newClassUpdated = await Class.findByIdAndUpdate(
      req.params.id,
      { $addToSet: updateCalss },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: "sucess",
      data: newClassUpdated,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteIDFromClass = async (req, res, next) => {
  try {
    // Validate body input
    if (!req.body.teacherId && !req.body.studentId) {
      return next(new AppError("teacherId or studentId is required!", 400));
    }

    const { teacherId, studentId } = req.body;

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
    if (teacherId) {
      updateFields.teachers = teacherId; // Add teacherId to be removed
    }
    if (studentId) {
      updateFields.students = studentId; // Add studentId to be removed
    }

    // Update the class document
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { $pull: updateFields }, // Use $pull to remove IDs
      { new: true, runValidators: true }
    );

    // Handle case where the class is not found
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
    if (req.body.answer !== "yes") {
      return res.status(400).json({
        status: "fail",
        message: `You did not confirm the deletion of class ${req.params.id}`,
      });
    } else {
      await Class.findByIdAndDelete(req.params.id);
      res.status(204).json({
        status: "success",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};
