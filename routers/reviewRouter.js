const express = require('express');

const reviewController = require(`../controllers/reviewController`);

const authMiddleware = require(`../middlewares/authMiddleware`);
// Because of reviews must have event I will use nested routes
// mergeParams:true option for this
// all routes in this route like api/v1/events/:eventId/reviews/:reviewId format
const router = express.Router({ mergeParams: true });

// this route is for 127.0.0.1:3000/api/v1/events/:eventId/reviews
router.route(`/`).get(reviewController.getAllReviews);
router.route(`/:reviewId`).get(reviewController.getReview);

router.use(authMiddleware.protect, authMiddleware.restrict([`user`]));
// Protected routes
router.route(`/`).post(reviewController.createReview);

router
  .route(`/:reviewId`)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
