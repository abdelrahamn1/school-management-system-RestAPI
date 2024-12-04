const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const classController = require("../controllers/classController");

router
  .route("/class")
  .all(authController.protect)
  .get(authController.restrictTo("admin"), classController.getAllClasses)
  .post(authController.restrictTo("admin"), classController.createClass);

router
  .route("/class/:id")
  .all(authController.protect)
  .get(authController.restrictTo("admin"), classController.getClass)
  .patch(authController.restrictTo("admin"), classController.updateClass)
  .delete(authController.restrictTo("admin"), classController.deleteClass);

router
  .route("/class/:id/remove-id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    classController.deleteIDFromClass
  );
module.exports = router;
