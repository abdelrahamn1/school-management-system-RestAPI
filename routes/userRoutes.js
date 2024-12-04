const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const authController = require("../controllers/authController");

// Authentication routes
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

// passwoerd routes
router.route("/forgetpassword").post(authController.forgetPassword);
router.route("/resetpassword/:token").post(authController.resetPassword);

// admin only routes
router.use(authController.protect);

//special routes
router
  .route("/users/reports")
  .get(authController.restrictTo("admin"), userController.getSomeReports);
//user routes
router
  .route("/users")
  .get(authController.restrictTo("admin"), userController.getAllUsers)
  .post(authController.restrictTo("admin"), userController.createUser);
router
  .route("/users/:id")
  .get(authController.restrictTo("admin"), userController.getUser)
  .patch(authController.restrictTo("admin"), userController.updateUser)
  .delete(authController.restrictTo("admin"), userController.deleteUser);

module.exports = router;
