const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const subjectController = require("../controllers/subjectController");

router
  .route("/subject")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    subjectController.getAllSubject
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    subjectController.createSubject
  );

router
  .route("/subject/:id")
  .all(authController.protect)
  .get(authController.restrictTo("admin"), subjectController.getSubject)
  .patch(authController.restrictTo("admin"), subjectController.updateSubject)
  .delete(authController.restrictTo("admin"), subjectController.deleteSubject);

module.exports = router;
