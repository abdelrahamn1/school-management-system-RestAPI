const mongoose = require("mongoose");
const validator = require("validator");
const parentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User Id is required"],
  },
  childrens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student Id is required"],
    },
  ],
  contactInfo: [
    {
      phone: {
        type: String,
        validate: [
          validator.isMobilePhone,
          "Phone Number must be real and valid!",
        ],
        required: [true, "Parent Phone is required!"],
      },
      addrss: {
        type: String,
        required: [true, "Parent Address is required!"],
      },
    },
  ],
});

const Parent = mongoose.model("Parent", parentSchema);
module.exports = Parent;
