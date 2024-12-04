const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const assignmentsController = require("../controllers/assignmentsController");

router
  .route("/assignments-panal")
  .get(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    assignmentsController.getAllAssignments
  )
  .post(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    assignmentsController.createAssignment
  );

router
  .route("/assignments-panal/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    assignmentsController.getAssignment
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    assignmentsController.deleteAssignment
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    assignmentsController.updateAssignment
  );

module.exports = router;
