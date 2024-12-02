const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const attendenceController = require("../controllers/attendenceController");

router
  .route("/attendence")
  .get(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    attendenceController.getAllAttendence
  )
  .post(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    attendenceController.createAttendence
  );

router
  .route("/fee/:id")
  .all(authController.protect)
  .get(
    authController.restrictTo("admin", "teacher"),
    attendenceController.getAttendence
  )
  .patch(
    authController.restrictTo("admin", "teacher"),
    attendenceController.updateAttendence
  )
  .delete(
    authController.restrictTo("admin", "teacher"),
    attendenceController.deleteAttendence
  );

module.exports = router;
