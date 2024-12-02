const Student = require("../models/studentModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppErrorr");

exports.getAllUsers = async (req, res, next) => {
  try {
    //1) FILTER
    const queryObj = { ...req.query };
    const exludedQueries = ["page", "sort", " limit", "fields"];
    exludedQueries.forEach((el) => delete queryObj[el]);
    queryObj.active = true;
    let query = User.find(queryObj);

    //2)Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("createdAt");
    }
    //3)Limitng
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //4)pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const users = await query;
    res.status(200).json({
      status: "succes",
      result: users.length,
      user: users,
    });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(200).json({
      status: "succes",
      user: newUser,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("No user Found!", 404));
    response = user;

    res.status(200).json({
      status: "succes",
      user: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { updatedAt: Date.now() }, ...req.body },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) return next(new AppError("No user Found!", 404));
    const updatesFields = Object.keys(req.body).join(" ");
    if (updatesFields.length === 0) updatesFields = "fields";
    res.status(200).json({
      status: "succes",
      message: `User ${updatesFields} updated successfully!`,
      user: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("No user Founded!", 404));

    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSomeReports = async (req, res, next) => {
  try {
    const teachers = await User.find({ role: "teacher", active: true });
    const students = await User.find({ role: "student", active: true });
    const parents = await User.find({ role: "parent", active: true });
    const totalUsers = await User.find({ active: true });

    res.status(200).json({
      status: "success",
      data: {
        users: totalUsers.length,
        totalStudents: students.length > 0 ? students.length : 0,
        totalTeachers: teachers.length > 0 ? teachers.length : 0,
        totalParents: parents.length > 0 ? parents.length : 0,
      },
    });
  } catch (err) {
    next(err);
  }
};

// student handelers

exports.AdminCreateStudent = async (req, res, next) => {
  try {
    const parentID = await User.findById(req.body.parent);
    if (!parentID) return next(new AppError("ParentID must be valid!", 400));

    const student = await Student.create(req.body);
    res.status(201).json({
      status: "succes",
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

exports.AdminupdateStudent = async (req, res, next) => {
  try {
    const studentID = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    const student = await User.findByIdAndUpdate(studentID.user, req.body, {
      new: true,
      runValidators: true,
    });
    if (!studentID) return next(new AppError("No student Found!", 404));

    const updatesFields = Object.keys(req.body).join(" ");
    res.status(200).json({
      status: "success",
      message: `[${updatesFields} are updated successfuly!]`,
      data: { student, studentID },
    });
  } catch (err) {
    next(err);
  }
};

exports.AdminGetStudent = async (req, res, next) => {
  try {
    const studentID = await Student.findById(req.params.studentid);
    const student = await User.findById(studentID.user);
    if (!studentID) return next(new AppError("No student Found!", 404));

    res.status(200).json({
      status: "success",
      data: { student, studentID },
    });
  } catch (err) {
    next(err);
  }
};

exports.AdminGetAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find();
    res.status(200).json({
      status: "success",
      result: students.length,
      data: students,
    });
  } catch (err) {
    next(err);
  }
};

// teacher handell
exports.AdminCreateTeacher = async (req, res, next) => {
  try {
    const newTeacher = await Teacher.create(req.body);
    res.status(201).json({
      status: "success",
      data: newTeacher,
    });
  } catch (err) {
    next(err);
  }
};
