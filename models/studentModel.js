const mongoose = require("mongoose");
const validator = require("validator");

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User Id is required"],
  },
  dof: {
    type: Date,
    required: [true, "Date of birth is required! , format must be YYYY-MM-DD"],
  },
  age: {
    type: Number,
    required: [true, "please provide Your age!"],
    validate: {
      validator: function (value) {
        return value <= 22;
      },
      message: "Age must be lower than 22",
    },
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: [true, "Student gender is required!"],
  },
  contactInfo: [
    {
      phone: {
        type: String,
        validate: [
          validator.isMobilePhone,
          "Phone Number must be real and valid!",
        ],
        required: [true, "Student Phone is required!"],
      },
      address: {
        type: String,
        required: [true, "Student Address is required!"],
      },
    },
  ],
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
    required: [true, "Parent Id is required"],
  },
  academicRecord: [
    {
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
      grade: String,
    },
  ],
  attendence: [
    {
      date: Date,
      status: Boolean,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
