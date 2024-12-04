const mongoose = require("mongoose");

const submitAssignmnetSchema = new mongoose.Schema({
  students: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: [true, "Student ID is required"],
  },

  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: [true, "Assignment ID is required"],
  },

  sumbittedAt: {
    type: Date,
  },
  file: String,
  grade: Number,
  feedBack: String,
  status: {
    type: String,
    enum: ["not submitted", "submitted", "graded"],
    default: "not submitted",
  },
  teacher: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher ID is required!"],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

const submitAssignmnet = mongoose.model(
  "submitAssignmnet",
  submitAssignmnetSchema
);
module.exports = submitAssignmnet;
