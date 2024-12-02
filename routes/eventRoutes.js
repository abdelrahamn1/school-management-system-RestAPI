const express = require("express");
const router = express.Router();
const eventController = require("../controllers//eventsController");
const authController = require("../controllers/authController");

// admin only routes
router.use(authController.protect);

//special routes

//user routes
router
  .route("/events")
  .get(authController.restrictTo("admin"), eventController.getAllEvents)
  .post(authController.restrictTo("admin"), eventController.createEvent);
router
  .route("/events/:id")
  .get(authController.restrictTo("admin"), eventController.getEvent)
  .patch(authController.restrictTo("admin"), eventController.updateEvent)
  .delete(authController.restrictTo("admin"), eventController.deleteEvent);

module.exports = router;
