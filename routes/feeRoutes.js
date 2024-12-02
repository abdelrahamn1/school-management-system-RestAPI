const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const feeController = require("../controllers/feeController");

router
  .route("/fee")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    feeController.getFees
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    feeController.createFee
  );

router
  .route("/fee/:id")
  .all(authController.protect)
  .get(authController.restrictTo("admin"), feeController.getFee)
  .patch(authController.restrictTo("admin"), feeController.updateFee)
  .delete(authController.restrictTo("admin"), feeController.deleteFee);

module.exports = router;
