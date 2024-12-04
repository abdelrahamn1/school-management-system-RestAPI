const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const studentController = require("../controllers/studentController");

router
  .route("/student")
  .all(authController.protect)
  .get(authController.restrictTo("admin"), studentController.getAllStudents)
  .post(authController.restrictTo("admin"), studentController.createStudent);

router
  .route("/student/:id")
  .all(authController.protect)
  .get(
    authController.restrictTo("admin", "student"),
    studentController.getStudent
  )
  .patch(
    authController.restrictTo("admin", "student"),
    studentController.updateStudent
  )
  .delete(
    authController.restrictTo("student"),
    studentController.deleteStudent
  );

module.exports = router;
