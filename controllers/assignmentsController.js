const Assignment = require("../models/assignmentModel.js");
const Class = require("../models/classModel.js");
const Subject = require("../models/subjectModel.js");
const AppError = require("../utils/AppErrorr.js");
const applyQueryOptions = require("../utils/queryHelper");

// Helper function to validate Class and Subject IDs
const validateClassAndSubject = async (classID, subjectID) => {
  const validateClass = classID ? await Class.findById(classID) : null;
  const validateSubject = subjectID ? await Subject.findById(subjectID) : null;

  if (classID && !validateClass) {
    return new AppError("Class ID is not valid!", 400);
  }
  if (subjectID && !validateSubject) {
    return new AppError("Subject ID is not valid!", 400);
  }

  return null;
};

// Get a single assignment by ID
exports.getAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return next(new AppError("This assignment not found!", 404));
    }
    res.status(200).json({
      status: "success",
      data: assignment,
    });
  } catch (err) {
    next(err);
  }
};

// Get all assignments with query options
exports.getAllAssignments = async (req, res, next) => {
  try {
    const query = applyQueryOptions(req, Assignment);
    const assignments = await query;
    res.status(200).json({
      status: "success",
      results: assignments.length,
      data: assignments,
    });
  } catch (err) {
    next(err);
  }
};

// Create a new assignment
exports.createAssignment = async (req, res, next) => {
  try {
    const {
      class: classID,
      subject: subjectID,
      title,
      description,
      AssigneDate,
      dueDate,
    } = req.body;

    // Validate class and subject
    const validationError = await validateClassAndSubject(classID, subjectID);
    if (validationError) return next(validationError);

    // Create assignment
    const newAssignment = await Assignment.create({
      title,
      description,
      AssigneDate,
      dueDate,
      class: classID,
      subject: subjectID,
    });

    res.status(201).json({
      status: "success",
      data: newAssignment,
    });
  } catch (err) {
    next(err);
  }
};

// Update an existing assignment
exports.updateAssignment = async (req, res, next) => {
  try {
    const { classID, subjectID } = req.body;

    // Validate class and subject if provided
    const validationError = await validateClassAndSubject(classID, subjectID);
    if (validationError) return next(validationError);

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { updatedAt: Date.now(), ...req.body },
      { new: true, runValidators: true }
    );

    if (!updatedAssignment) {
      return next(new AppError("No assignment found!", 404));
    }

    // Collect updated fields to inform the user
    const updateFields = Object.keys(req.body);

    res.status(200).json({
      status: "success",
      message:
        updateFields.length > 0
          ? `[${updateFields.join(" ")}] updated successfully!`
          : "Assignment updated!",
      data: updatedAssignment,
    });
  } catch (err) {
    next(err);
  }
};

// Delete an assignment
exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return next(new AppError("No assignment found!", 404));
    }

    await assignment.remove();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
