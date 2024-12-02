const mongoose = require("mongoose");

const AttendenceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: [true, "Student ID is required"],
  },

  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: [true, "Class is required"],
  },

  date: {
    type: Date,
    required: [true, "date required! "],
  },
  status: {
    type: Boolean,
    require: [true, "Please Provide the status ?"],
  },
  teacher: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher ID is required!"],
    },
  ],
});

const Attendence = mongoose.model("Exam", AttendenceSchema);
module.exports = Attendence;
