const express = require("express");

const eventController = require("../controllers/eventController");

const router = express.Router();

router
  .route(`/`)
  .get(eventController.getAllEvents)
  .post(eventController.createEvent);

module.exports = router;
