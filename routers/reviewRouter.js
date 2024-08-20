const express = require("express");

const reviewController = require(`../controllers/reviewController`);
// Because of reviews must have event I will use nested routes
// mergeParams:true option for this
// all routes in this route like api/v1/events/:eventId/reviews/:reviewId format
const router = express.Router({ mergeParams: true });

// this route is for 127.0.0.1:3000/api/v1/events/:eventId/reviews
router
  .route(`/`)
  .get(reviewController.getAllReviews)
  .post(reviewController.createReview);

module.exports = router;
