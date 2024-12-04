const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const attendenceController = require("../controllers/attendenceController");

router
  .route("/attendence")
  .get(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    attendenceController.getAllAttendance
  )
  .post(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    attendenceController.createAttendance
  );

router
  .route("/fee/:id")
  .all(authController.protect)
  .get(
    authController.restrictTo("admin", "teacher"),
    attendenceController.getAttendance
  )
  .patch(
    authController.restrictTo("admin", "teacher"),
    attendenceController.updateAttendance
  )
  .delete(
    authController.restrictTo("admin", "teacher"),
    attendenceController.deleteAttendance
  );

module.exports = router;
