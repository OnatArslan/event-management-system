const express = require("express");

const commentController = require(`../controllers/commentController`);

// Because of reviews must have event I will use nested routes
// mergeParams:true option for this
// all routes in this route like api/v1/events/:eventId/comments/:commentId format
const router = express.Router({ mergeParams: true });

// this route is for 127.0.0.1:3000/api/v1/events/:eventId/omments
router
  .route(`/`)
  .get(commentController.getAllComments)
  .post(commentController.createComment);

module.exports = router;
