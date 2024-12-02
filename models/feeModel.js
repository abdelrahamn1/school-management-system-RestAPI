const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: [true, "Students is required"],
  },

  feeAmount: {
    type: String,
    required: [true, "Fee Amount required!"],
  },
  dueDate: {
    type: Date,
    required: [true, "due date required!"],
  },
  paidStatus: {
    type: Boolean,
    require: [true, "paid Status duration!"],
  },
  paymentMode: {
    type: Boolean,
    enum: ["cash", "card", "bank transfer", "other"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
});

const Fee = mongoose.model("Fee", feeSchema);
module.exports = Fee;