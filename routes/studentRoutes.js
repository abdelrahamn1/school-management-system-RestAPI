const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const studentController = require("../controllers/studentController");

router
  .route("/student/:id")
  .all(authController.protect)
  .get(
    authController.restrictTo("admin", "student"),
    studentController.getStudent
  )
  .patch(
    authController.restrictTo("admin", "student"),
    studentController.UpdateStudent
  )
  .delete(
    authController.restrictTo("student"),
    studentController.deleteStudent
  );

module.exports = router;
