const Exam = require("../models/exmasModel");
const AppError = require("../utils/AppErrorr.js");

exports.createExam = async (req, res, next) => {
  try {
    const { title, description, date, startTime, examDuration, questions } =
      req.body;

    if (!date || !startTime)
      return next(
        new AppError(
          "Date and startTime for the exam are required! Format for date: [YYYY-MM-DD]",
          400
        )
      );

    const startDate = new Date(`${date} ${startTime}`);
    const currentDate = new Date();

    // Ensure exam start date is in the future
    if (startDate <= currentDate) {
      return next(new AppError("The start date must be in the future!", 400));
    }

    const endDate = new Date(startDate.getTime() + examDuration * 60 * 1000);

    // Save the exam
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
    if (!exam) return next(new AppError("No exam found with this ID!", 404));

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
    if (!exam) return next(new AppError("No exam found with this ID!", 404));

    const { questions, date, startTime, examDuration, ...otherUpdates } =
      req.body;

    // Update questions if provided
    let updatedQuestions = null;
    if (questions && Array.isArray(questions)) {
      updatedQuestions = await Exam.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { questions: { $each: questions } } },
        { new: true, runValidators: true }
      );
    }

    // Update time if provided
    let updatedTime = null;
    if (date || startTime || examDuration) {
      if (!date || !startTime || !examDuration) {
        return next(
          new AppError(
            "Please provide [date], [startTime], and [examDuration] to update the exam time.",
            400
          )
        );
      }

      // Construct new start and end dates
      const startDate = new Date(`${date} ${startTime}`);
      const currentDate = new Date();

      if (startDate <= currentDate) {
        return next(new AppError("The start date must be in the future!", 400));
      }

      const endDate = new Date(startDate.getTime() + examDuration * 60 * 1000);
      updatedTime = await Exam.findByIdAndUpdate(
        req.params.id,
        { dueDate: startDate, examDuration: endDate },
        { new: true, runValidators: true }
      );
    }

    // Update other fields if provided
    let updatedData = null;
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
    if (!exam) return next(new AppError("No exam found with this ID!", 404));

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
    const exam = await Exam.findById(req.params.id);
    if (!exam) return next(new AppError("The Exam not found!", 404));

    const currentTime = new Date();
    const endDate = new Date(exam.examDuration);

    // Check if the exam is available
    if (exam.dueDate > currentTime) {
      return next(new AppError("This exam is not available yet!", 400));
    }

    // Check if the exam time has expired
    if (currentTime >= endDate) {
      return res.status(400).json({
        status: "fail",
        message: "Exam time has expired.",
      });
    }

    if (req.body.answers) {
      const answers = req.body.answers;
      let grade = 0;

      exam.questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          grade++;
        }
      });

      const percentage = (grade / exam.questions.length) * 100;
      res.status(200).json({
        status: "success",
        message: `Your Grade is ${grade} / ${
          exam.questions.length
        }, Your Percentage is ${percentage.toFixed(2)}%`,
      });
    } else {
      return next(
        new AppError("Answers are required to submit the exam!", 400)
      );
    }
  } catch (err) {
    next(err);
  }
};
