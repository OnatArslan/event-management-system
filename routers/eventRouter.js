const express = require("express");

const eventController = require("../controllers/eventController");

const commentRouter = require(`./commentRouter`);
const reviewRouter = require(`./reviewRouter`);

const router = express.Router();

router.use(`/:eventId/comments`, commentRouter);
router.use(`/:eventId/reviews`, reviewRouter);

router
  .route(`/`)
  .get(eventController.getAllEvents)
  .post(eventController.createEvent);

router
  .route("/:eventId")
  .get(eventController.getEvent)
  .patch(eventController.updateEvent)
  .delete(eventController.deleteEvent);

module.exports = router;
