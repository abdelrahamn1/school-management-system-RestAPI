const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const classController = require("../controllers/classController");

router
  .route("/class")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    classController.createClass
  );

router
  .route("/class/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    classController.updateClass
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    classController.deleteClass
  );

router
  .route("/class/:id/remove-id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    classController.deleteIDFromClass
  );
module.exports = router;
