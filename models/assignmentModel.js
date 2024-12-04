const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Assignment title is required!"],
    unique: [true, "Assignment title must be unique!"],
  },
  description: {
    type: String,
    required: [true, "Assignment description is required!"],
  },
  AssigneDate: {
    type: Date,
    default: Date.now(),
  },
  dueDate: {
    type: Date,
    required: [
      true,
      "Delivary Date is required! , format must be [year-mont-day] ",
    ],
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: [true, "Class is required!"],
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: [true, "Class is required!"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;
