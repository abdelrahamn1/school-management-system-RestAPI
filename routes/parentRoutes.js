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
  .route("/parent/:id")
  .all(authController.protect)
  .get(authController.restrictTo("admin", "parent"), parentController.getParent)
  .patch(
    authController.restrictTo("admin", "parent"),
    parentController.updateParent
  )
  .delete(
    authController.restrictTo("admin", "parent"),
    parentController.deleteParent
  );

module.exports = router;
