const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide a name Of Class!"],
    unique: true,
  },
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher ID is required!"],
    },
  ],
  superVisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: [true, "super visor Teacher ID is required!"],
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Students is required"],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,

});

classSchema.path("teachers").validate({
  validator: function (value) {
    return value && value.length > 0;
  },
  message: "At least one teacher is required!",
});

classSchema.path("students").validate({
  validator: function (value) {
    return value && value.length > 0;
  },
  message: "At least one student is required!",
});

const Class = mongoose.model("Class", classSchema);
module.exports = Class;
