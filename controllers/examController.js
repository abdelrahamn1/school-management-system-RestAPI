const Exam = require("../models/exmasModel");
const AppError = require("../utils/AppErrorr");
exports.createExam = async (req, res, next) => {
  try {
    const { title, description, date, startTime, examDuration, questions } =
      req.body;

    if (!date || !startTime)
      return next(
        new AppError(
          "Date or startTime for exam is required! , format for date is :[YYYY-MM-DD]",
          400
        )
      );

    const startDate = new Date(`${date} ${startTime}`);
    const endDate = new Date(startDate.getTime() + examDuration * 60 * 1000);
    console.log("Start Date and Time:", startDate);
    console.log("End Date and Time:", endDate);

    // Save exam
    const exam = await Exam.create({
      title,
      description,
      dueDate: startDate,
      examDuration: endDate,
      questions,
    });

    res.status(201).json({
      status: "success",
      data: exam,
    });
  } catch (err) {
    next(err);
  }
};

exports.getExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return next(new AppError("No exam Founded!", 404));

    res.status(200).json({
      status: "success",
      data: exam,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return next(new AppError("No exam found!", 404));

    const { questions, date, startTime, examDuration, ...otherUpdates } =
      req.body;

    // Update questions
    let updatedQuestions;
    if (questions && Array.isArray(questions)) {
      updatedQuestions = await Exam.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { questions: { $each: questions } } },
        { new: true, runValidators: true }
      );
    }

    // Update time
    let updatedTime;
    if (date || startTime || examDuration) {
      if (!date || !startTime || !examDuration) {
        return next(
          new AppError(
            "Please provide [date], [startTime], and [examDuration] to update the exam time."
          )
        );
      }

      // Construct new start and end dates
      const startDate = new Date(`${date} ${startTime}`);
      if (startDate.getTime() <= Date.now()) {
        return next(
          new AppError("The start date must be in the future not in past")
        );
      }
      const endDate = new Date(startDate.getTime() + examDuration * 60 * 1000);

      updatedTime = await Exam.findByIdAndUpdate(
        req.params.id,
        { dueDate: startDate, examDuration: endDate },
        { new: true, runValidators: true }
      );
    }

    // Update other data
    let updatedData;
    if (Object.keys(otherUpdates).length > 0) {
      updatedData = await Exam.findByIdAndUpdate(req.params.id, otherUpdates, {
        new: true,
        runValidators: true,
      });
    }

    // Respond with updated exam details
    res.status(200).json({
      status: "success",
      data: { updatedQuestions, updatedTime, updatedData },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return next(new AppError("No exam found!", 404));

    await exam.deleteOne();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.submitExam = async (req, res, next) => {
  try {
    let exam = await Exam.findById(req.params.id);

    if (!exam) return next(new AppError("The Exam not found!", 404));

    if (exam.dueDate > Date.now())
      return next(new AppError("This exam is not Avalibale Now!", 400));

    const currentTime = new Date();
    let grade = 0;
    const endDate = new Date(exam.examDuration);

    // Check if exam time has expired
    if (currentTime >= endDate) {
      return res.status(400).json({
        status: "fail",
        message: "Exam time has expired.",
      });
    }
    if (req.body.answers) {
      const answers = req.body.answers;
      exam.questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          grade++;
        }
      });
    }

    const percentage = (grade / exam.questions.length) * 100;
    res.status(200).json({
      status: "success",
      message: `Your Grade is ${grade} / ${
        exam.questions.length
      } , Your Precentage is ${percentage.toFixed(2)} %`,
    });
  } catch (err) {
    next(err);
  }
};
