const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");

// Authentication routes
router.route("/register").post(authController.rigster);
router.route("/login").post(authController.login);

// passwoerd routes
router.route("/forgetpassword").post(authController.forgetPaasword);
router.route("/resetpassword/:token").post(authController.resetPassword);

//handel teachers
router
  .route("/admin/teachers")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    adminController.AdminCreateTeacher
  );

//handel students
router
  .route("/admin/students")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    adminController.AdminGetAllStudents
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    adminController.AdminCreateStudent
  );

router
  .route("/admin/student/:studentid")
  .all(authController.protect)
  .get(authController.restrictTo("admin"), adminController.AdminGetStudent)
  .patch(
    authController.restrictTo("admin"),
    adminController.AdminupdateStudent
  );

// admin only routes
router.use(authController.protect);

//special routes
router
  .route("/admin/reports")
  .get(authController.restrictTo("admin"), adminController.getSomeReports);

//user routes
router
  .route("/admin")
  .get(authController.restrictTo("admin"), adminController.getAllUsers)
  .post(authController.restrictTo("admin"), adminController.createUser);
router
  .route("/admin/:id")
  .get(authController.restrictTo("admin"), adminController.getUser)
  .patch(authController.restrictTo("admin"), adminController.updateUser)
  .delete(authController.restrictTo("admin"), adminController.deleteUser);

module.exports = router;
