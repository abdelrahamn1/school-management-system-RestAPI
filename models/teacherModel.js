const mongoose = require("mongoose");
const validator = require("validator");
const teacherSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
  age: {
    type: Number,
    required: [true, "Teacher's Age is required!"],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: [true, "Teacher gender is required!"],
  },
  contactInfo: {
    type: String,
    validate: [validator.isMobilePhone, "contact number must be real !"],
    required: [true, "Teacher's contact number are required!"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
