const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const parentController = require("../controllers/parentController");

router
  .route("/parent")
  .post(
    authController.protect,
    authController.restrictTo("admin", "parent"),
    parentController.createParent
  );

router
  .route("/student/:id")
  .all(authController.protect)
  .get(
    authController.restrictTo("admin", "student"),
    parentController.getParent
  )
  .patch(
    authController.restrictTo("admin", "student"),
    parentController.updateParent
  )
  .delete(authController.restrictTo("student"), parentController.deleteParent);

module.exports = router;
