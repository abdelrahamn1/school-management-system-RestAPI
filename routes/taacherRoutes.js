const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const teacherController = require("../controllers/teacherController");

router
  .route("/teacher/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    teacherController.getTeacher
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    teacherController.updateTeacher
  )

  .delete(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    teacherController.deleteTeacher
  );

module.exports = router;
