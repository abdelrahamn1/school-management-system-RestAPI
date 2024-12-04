const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const teacherController = require("../controllers/teacherController");

router
  .route("/teacher")
  .all(authController.protect)
  .get(authController.restrictTo("admin"), teacherController.getAllTeachers)
  .post(
    authController.restrictTo("admin", "teacher"),
    teacherController.createTeacher
  );

router
  .route("/teacher/:id")
  .all(authController.protect)
  .get(
    authController.restrictTo("admin", "teacher"),
    teacherController.getTeacher
  )
  .patch(
    authController.restrictTo("admin", "teacher"),
    teacherController.updateTeacher
  )

  .delete(
    authController.restrictTo("admin", "teacher"),
    teacherController.deleteTeacher
  );

module.exports = router;
