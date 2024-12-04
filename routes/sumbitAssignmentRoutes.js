const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const assignmentsController = require("../controllers/assignmentsController");

router
  .route("/sumbit-assignment")
  .post(
    authController.protect,
    authController.restrictTo("admin", "student", "teacher"),
    assignmentsController.createAssignment
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "student", "teacher"),
    assignmentsController.deleteAssignment
  );

module.exports = router;
