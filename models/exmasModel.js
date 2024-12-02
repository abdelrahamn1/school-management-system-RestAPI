const mongoose = require("mongoose");

const examsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Exam must has title!"],
  },
  description: {
    type: String,
    required: [true, "Exam must has description"],
  },
  dueDate: {
    type: Date,
    required: [true, "Exam must has a date! "],
  },
  examDuration: {
    type: Number,
    require: [true, "Exam must has duration!"],
  },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
});

const Exam = mongoose.model("Exam", examsSchema);
module.exports = Exam;
