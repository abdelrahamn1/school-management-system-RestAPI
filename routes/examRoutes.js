const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const examController = require("../controllers/examController");

router
  .route("/exam-panal")
  .post(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    examController.createExam
  );

router
  .route("/exam-panal/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    examController.getExam
  )
  .post(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    examController.submitExam
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    examController.updateExam
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    examController.deleteExam
  );

module.exports = router;
