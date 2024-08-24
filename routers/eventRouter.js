const express = require("express");
// Import controllers
const eventController = require("../controllers/eventController");

// Import routers
const commentRouter = require(`./commentRouter`);
const reviewRouter = require(`./reviewRouter`);

// Import auth middlewares
const auth = require(`../middlewares/authMiddleware`);

const router = express.Router();

router.use(`/:eventId/comments`, commentRouter);
router.use(`/:eventId/reviews`, reviewRouter);

// These router do not have auth validation
router.route(`/`).get(eventController.getAllEvents);
router.route(`/:eventId`).get(eventController.getEvent);

// Protect these routes and restrict to 'admin' and 'organizer'
router.use(auth.protect, auth.restrict([`admin`, `organizer`]));
router.route(`/`).post(eventController.createEvent);
// FOR ADMINS OR ORGANIZER CRUD
router
  .route("/:eventId")
  .patch(eventController.updateEvent)
  .delete(eventController.deleteEvent);

// JOIN EVENT LIKE THAT
router.route(`/:eventId`);

module.exports = router;
